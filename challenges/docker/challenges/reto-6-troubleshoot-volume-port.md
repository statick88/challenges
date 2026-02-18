---
title: "Docker Challenge Reto 6: Troubleshoot Container Volume & Port Mapping"
category: docker
difficulty: 3
tags:
  - docker
  - contenedores
  - troubleshooting
  - volumes
  - bind-mounts
  - port-mapping
  - produccion
date: 18-02-2026
status: completado
---

# 🐳 Docker Challenge Reto 6: Troubleshoot Container Volume & Port Mapping

---

## 🎓 Del Instructor

En mis años como **Platform Engineer**, he aprendido que los problemas de contenedores suelen estar en tres lugares: **configuración de red**, **mapeo de volúmenes** y **límites de recursos**. Un contenedor puede estar "running" y aún así no servir tráfico porque olvidaste mapear el puerto. O puede servir una página vacía porque el bind mount no existe.

> 🎯 **Mentalidad DevOps**: "El contenedor está aislado. Si no lo conectas explícitamente al mundo exterior (puertos) y a los datos (volúmenes), existe en el vacío."

---

## 🎭 Escenario Empresarial

**Contexto**: El equipo de soporte reporta que el sitio web estático de la empresa no está accesible. El contenedor `nautilus` en App Server 1 muestra estado "Exited" y los usuarios reciben errores de conexión al intentar acceder al sitio.

**Tu misión**: Diagnosticar y resolver el problema del contenedor `nautilus` para que el sitio web estático sea accesible nuevamente.

**Métricas de éxito**:
- Volumen `/usr/local/apache2/htdocs` mapeado correctamente a `/var/www/html` del host
- Website accesible en puerto 8080 del host
- Comando `curl http://localhost:8080/` funcional

**Infraestructura**:

| Campo | Valor |
|-------|-------|
| **Servidor** | stapp01.stratos.xfusioncorp.com |
| **IP** | 172.16.238.10 |
| **Usuario** | tony |
| **Password** | Ir0nM@n |
| **Stack** | Apache HTTP Server (httpd) |

---

## 🧠 Arquitectura: Bind Mounts & Port Mapping

### El Problema del Aislamiento

```
┌─────────────────────────────────────────────────────────────┐
│  CONTENEDOR SIN CONFIGURACIÓN                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  httpd container                                    │    │
│  │  ├── /usr/local/apache2/htdocs/ (vacío)             │    │
│  │  ├── Port 80 (interno, no accesible desde host)      │    │
│  │  └── Estado: Exited (no está corriendo)              │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│              curl localhost:8080 → Connection refused        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CONTENEDOR CON CONFIGURACIÓN CORRECTA                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  httpd container                                    │    │
│  │  ├── /usr/local/apache2/htdocs/                     │    │
│  │  │   └── ← BIND MOUNT: /var/www/html/ (host)        │    │
│  │  ├── Port 80 (interno)                              │    │
│  │  │   └── ← PORT MAP: 8080:80 (host:container)       │    │
│  │  └── Estado: Up (corriendo)                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│              curl localhost:8080 → Welcome to xFusionCorp!  │
└─────────────────────────────────────────────────────────────┘
```

### Taxonomía de Configuración Docker

| Elemento | Sintaxis | Propósito |
|----------|----------|-----------|
| **Bind Mount** | `-v /host/path:/container/path` | Montar directorio del host en el contenedor |
| **Named Volume** | `-v volume_name:/container/path` | Persistencia de datos gestionada por Docker |
| **Port Mapping** | `-p host_port:container_port` | Exponer puerto del contenedor al host |
| **Read-only Mount** | `-v /host:/container:ro` | Montar sin permisos de escritura |

### Flujo de Datos

```
Usuario → curl localhost:8080
              ↓
    Host Port 8080 (stapp01)
              ↓
    Docker Port Mapping (-p 8080:80)
              ↓
    Container Port 80 (nautilus)
              ↓
    Apache httpd sirviendo /usr/local/apache2/htdocs/
              ↓
    Bind Mount (-v /var/www/html:/usr/local/apache2/htdocs)
              ↓
    Archivo index.html en el host
```

---

## 🛠️ Implementación Profesional

### Paso 1: Conexión SSH al Servidor

```bash
# Conexión desde jump_host
ssh tony@172.16.238.10
```

**Cuando aparezca el mensaje de fingerprint**:
```
The authenticity of host '172.16.238.10 (172.16.238.10)' can't be established.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```
- Escribir: `yes`

**Password**: `Ir0nM@n`

> 💡 **Nota técnica**: La primera conexión SSH a un servidor genera este mensaje porque no hay registro previo de su clave pública. Escribir `yes` añade el servidor al archivo `~/.ssh/known_hosts`.

### Paso 2: Escalar Privilegios a Root

```bash
sudo su -
```

**Password**: `Ir0nM@n` (mismo que el usuario)

> 🎯 **Mentalidad DevOps**: Docker requiere privilegios de root o pertenencia al grupo `docker`. Para operaciones de troubleshooting, root es el camino más directo.

### Paso 3: Diagnóstico Inicial del Contenedor

```bash
# Verificar estado del contenedor
docker ps -a --filter name=nautilus
```

**Salida observada**:
```
CONTAINER ID   IMAGE     COMMAND              CREATED         STATUS                     PORTS     NAMES
9a482bcf77fb   httpd     "httpd-foreground"   4 minutes ago   Exited (0) 3 minutes ago             nautilus
```

**Análisis**:
- **STATUS**: `Exited (0)` → El contenedor no está corriendo
- **PORTS**: Vacío → No hay puertos mapeados
- **IMAGE**: `httpd` → Apache HTTP Server

### Paso 4: Inspección de Configuración

```bash
# Inspeccionar mapeo de volúmenes
docker inspect nautilus --format '{{json .Mounts}}'

# Inspeccionar mapeo de puertos
docker inspect nautilus --format '{{json .HostConfig.PortBindings}}'

# Verificar acceso web (fallará)
curl http://localhost:8080/
```

**Salida esperada del curl fallido**:
```
curl: (7) Failed to connect to localhost port 8080: Connection refused
```

**Diagnóstico confirmado**:
1. Contenedor detenido (`Exited`)
2. Sin puertos mapeados
3. Sin acceso web

### Paso 5: Eliminar Contenedor con Configuración Incorrecta

```bash
# Detener contenedor (si estuviera running)
docker stop nautilus

# Eliminar contenedor
docker rm nautilus
```

**Salida esperada**:
```
nautilus
nautilus
```

> 💡 **Principio**: Los contenedores son efímeros por diseño. Si la configuración es incorrecta, es más limpio eliminar y recrear que intentar parchear.

### Paso 6: Crear Contenedor con Configuración Correcta

```bash
docker run -d \
  --name nautilus \
  -v /var/www/html:/usr/local/apache2/htdocs \
  -p 8080:80 \
  httpd:latest
```

**Explicación detallada de flags**:

| Flag | Valor | Explicación |
|------|-------|-------------|
| `-d` | - | **Detached mode**: Ejecuta en segundo plano, libera la terminal |
| `--name` | `nautilus` | **Naming**: Identificador predecible para gestión |
| `-v` | `/var/www/html:/usr/local/apache2/htdocs` | **Bind Mount**: Directorio del host → directorio del contenedor |
| `-p` | `8080:80` | **Port Mapping**: Puerto 8080 del host → puerto 80 del contenedor |
| `httpd:latest` | - | **Imagen**: Apache HTTP Server versión latest |

**Salida esperada**:
```
92950a3b79f5539ffafc44694d24285e86358da12ec7f8ee97f62c26f00c26f7
```
(Hash del contenedor creado)

### Paso 7: Verificación de Volumen Mapeado

```bash
docker inspect nautilus --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{end}}'
```

**Salida esperada**:
```
/var/www/html -> /usr/local/apache2/htdocs
```

**Validación**:
- ✅ Source: `/var/www/html` (directorio del host)
- ✅ Destination: `/usr/local/apache2/htdocs` (directorio del contenedor Apache)

### Paso 8: Verificación de Puerto Expuesto

```bash
docker port nautilus
```

**Salida esperada**:
```
80/tcp -> 0.0.0.0:8080
```

**Validación**:
- ✅ Puerto interno: `80/tcp` (Apache escucha en 80)
- ✅ Puerto externo: `8080` (accesible desde el host)
- ✅ Bind address: `0.0.0.0` (todas las interfaces de red)

### Paso 9: Verificación de Acceso Web

```bash
curl http://localhost:8080/
```

**Salida esperada**:
```
Welcome to xFusionCorp Industries!
```

**Validación exitosa**:
- ✅ Website accesible
- ✅ Contenido servido correctamente
- ✅ Bind mount funcionando

---

## 📊 Checklist de Producción

### Diagnóstico

- [x] Conexión SSH establecida a stapp01
- [x] Privilegios root obtenidos
- [x] Estado del contenedor verificado (`Exited`)
- [x] Configuración de puertos inspeccionada (vacía)

### Resolución

- [x] Contenedor eliminado correctamente
- [x] Contenedor recreado con `-v` y `-p` correctos
- [x] Contenedor en estado `Up`

### Verificación

- [x] Volumen mapeado: `/var/www/html -> /usr/local/apache2/htdocs`
- [x] Puerto expuesto: `80/tcp -> 0.0.0.0:8080`
- [x] Curl exitoso: `Welcome to xFusionCorp Industries!`

---

## 🎓 Reflexión Final: From Installer to Engineer

### Lo Que Acabas de Aprender

**Problema raíz**: Un contenedor sin configuración de red y volúmenes está completamente aislado.

**Solución aplicada**:
1. **Bind Mount** (`-v`): Conectó los datos del host con el contenedor
2. **Port Mapping** (`-p`): Expuso el servicio al mundo exterior

### Conceptos Clave

| Concepto | Definición |
|----------|------------|
| **Bind Mount** | Mapeo directo de un directorio del host a un directorio del contenedor |
| **Port Mapping** | Traducción de puertos entre el host y el contenedor |
| **Container Isolation** | Los contenedores están aislados por defecto; requieren configuración explícita para interactuar |

### Errores Comunes

| Error | Consecuencia | Solución |
|-------|--------------|----------|
| Olvidar `-p` | Contenedor inaccesible desde el host | Agregar `-p host_port:container_port` |
| Olvidar `-v` | Contenedor sin datos/vacío | Agregar `-v /host/path:/container/path` |
| Puerto ocupado | Error "port already in use" | Verificar con `netstat -tulpn \| grep PORT` |
| Path incorrecto | "No such file or directory" | Verificar que el directorio del host existe |

### Evolución del Mindset

| Instalador | Platform Engineer |
|------------|-------------------|
| "El contenedor está corriendo pero no funciona" | "El contenedor necesita bind mount y port mapping para ser funcional" |
| "No sé por qué curl falla" | "Diagnóstico sistemático: verificar estado, puertos, volúmenes" |
| "Reinicio el contenedor y ya" | "Elimino y recreo con configuración correcta - IaC mindset" |

---

## 🚀 Próximos Pasos en el Learning Path

### Nivel Actual: Docker Container Operations ✅

1. **Reto 7+**: Dockerfile creation - construir imágenes personalizadas
2. **Reto 8+**: Docker Compose - orquestación de múltiples contenedores
3. **Reto 9+**: Docker Networks - redes personalizadas y comunicación entre contenedores

### Conceptos a Investigar

- **Named Volumes**: `docker volume create` vs bind mounts
- **Dockerfile**: `VOLUME` y `EXPOSE` instructions
- **Docker Compose**: Sintaxis `volumes:` y `ports:` en YAML
- **Reverse Proxy**: Nginx/Traefik para multiple containers en puerto 80

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Docker Bind Mounts](https://docs.docker.com/storage/bind-mounts/)
- [Docker Port Mapping](https://docs.docker.com/network/network-tutorial-published-ports/)
- [httpd Docker Image](https://hub.docker.com/_/httpd)

### Comandos de Referencia

```bash
# Inspeccionar volúmenes
docker inspect container --format '{{json .Mounts}}'

# Inspeccionar puertos
docker port container

# Ver puertos en uso en el host
netstat -tulpn | grep LISTEN

# Verificar contenido del bind mount
ls -la /var/www/html/

# Entrar al contenedor para debugging
docker exec -it nautilus /bin/bash
```

---

## 📊 Métricas del Reto

| Métrica | Valor | Benchmark |
|---------|-------|-----------|
| Tiempo de resolución | ~3 min | < 10 min ✅ |
| Comandos ejecutados | 8 | Mínimo necesario ✅ |
| Contenedores recreados | 1 | Eficiente ✅ |
| Verificaciones | 3 | Completo ✅ |

---

## 🏆 Logros Desbloqueados

- [x] Docker Bind Mounts mastery
- [x] Docker Port Mapping mastery
- [x] Container troubleshooting methodology
- [x] curl verification proficiency

---

**Reto 6 completado exitosamente** 🎉  
_Fecha: 18-02-2026 | Status: Volume & Port Configuration Mastered | Engineer: Platform Engineer Jr._

> _"A container without volume mounts is a container without memory. A container without port mapping is a container without voice."_