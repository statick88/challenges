---
title: "Docker Certification: KodeKloud Engineer Challenges"
category: docker
difficulty: 5
tags:
  - docker
  - certification
  - kodekloud
  - contenedores
  - networking
  - volumes
date: 18-02-2026
status: completado
score: 100/100
certificate_url: https://engineer.kodekloud.com/certificate-verification/86476a89-ea7b-4e3a-a901-85cec28a00ca
certificate_id: 86476a89-ea7b-4e3a-a901-85cec28a00ca
---

# 🏆 Docker Certification: KodeKloud Engineer Challenges

---

## 🏆 Certificate Verification

![KodeKloud Docker Certificate](/certificates/kodekloud-docker-certificate.png)

| Campo | Valor |
|-------|-------|
| **Verification URL** | [Verificar Certificado](https://engineer.kodekloud.com/certificate-verification/86476a89-ea7b-4e3a-a901-85cec28a00ca) |
| **Certificate ID** | `86476a89-ea7b-4e3a-a901-85cec28a00ca` |

---

## 📊 Certification Summary

| Métrica | Valor |
|---------|-------|
| **Plataforma** | KodeKloud Engineer |
| **Total Retos** | 9 |
| **Retos Superados** | 9 ✅ |
| **Puntuación** | 100/100 |
| **Fecha de Completado** | 18-02-2026 |
| **Tiempo Total** | ~15 minutos |

---

## 🎓 Del Instructor

Esta certificación representa un hito importante en el camino de **Platform Engineer**. Has demostrado competencia en todas las áreas fundamentales de Docker: creación de contenedores, gestión de imágenes, operaciones de archivos, networking y troubleshooting.

> 🎯 **Mentalidad DevOps**: "Un ingeniero de Docker no solo sabe ejecutar comandos, entiende el ciclo de vida completo del contenedor y puede diagnosticar problemas en producción."

---

## 📋 Retos Completados

### Reto 1: Deploy Nginx Container (10 pts)

**Objetivo**: Crear contenedor `nginx_1` con imagen `nginx:alpine` en estado running.

```bash
docker run -d --name nginx_1 nginx:alpine
```

| Verificación | Resultado |
|--------------|-----------|
| Contenedor creado | ✅ |
| Imagen correcta | ✅ nginx:alpine |
| Estado running | ✅ |

---

### Reto 2: Create Debug Container with Custom CMD (10 pts)

**Objetivo**: Crear contenedor `debug_1` sobrescribiendo el CMD con `sleep 1000`.

```bash
docker run -d --name debug_1 ubuntu/apache2:latest sleep 1000
```

| Verificación | Resultado |
|--------------|-----------|
| Contenedor creado | ✅ |
| CMD sobrescrito | ✅ "sleep 1000" |
| Estado running | ✅ |

---

### Reto 3: Copy File Container → Host (10 pts)

**Objetivo**: Copiar `/tmp/test.txt.gpg` del contenedor `development_3` al host `/tmp/`.

```bash
docker cp development_3:/tmp/test.txt.gpg /tmp/
```

| Verificación | Resultado |
|--------------|-----------|
| Archivo copiado | ✅ |
| Ubicación correcta | ✅ /tmp/test.txt.gpg |
| Integridad (98 bytes) | ✅ |

---

### Reto 4: Copy File Host → Container (10 pts)

**Objetivo**: Copiar `/tmp/nautilus.txt.gpg` del host al contenedor `ubuntu_latest` en `/usr/src/`.

```bash
docker exec ubuntu_latest mkdir -p /usr/src/
docker cp /tmp/nautilus.txt.gpg ubuntu_latest:/usr/src/
```

| Verificación | Resultado |
|--------------|-----------|
| Directorio creado | ✅ /usr/src/ |
| Archivo copiado | ✅ |
| Integridad (105 bytes) | ✅ |

---

### Reto 5: Pull Docker Images (10 pts)

**Objetivo**: Descargar imágenes `redis:alpine` y `memcached:alpine`.

```bash
docker pull redis:alpine
docker pull memcached:alpine
```

| Verificación | Resultado |
|--------------|-----------|
| redis:alpine | ✅ 97.2MB |
| memcached:alpine | ✅ 13MB |

---

### Reto 6: Save Docker Image as Tar Archive (20 pts)

**Objetivo**: Guardar imagen `nginx:mainline-alpine-slim` como `/home/nginx.tar`.

```bash
docker save -o /home/nginx.tar nginx:mainline-alpine-slim
```

| Verificación | Resultado |
|--------------|-----------|
| Archivo creado | ✅ /home/nginx.tar |
| Tamaño correcto | ✅ 13.4MB |

---

### Reto 7: Delete Docker Network (10 pts)

**Objetivo**: Eliminar la red `php-network`.

```bash
docker network rm php-network
```

| Verificación | Resultado |
|--------------|-----------|
| Red eliminada | ✅ php-network |
| Verificación | ✅ No aparece en network ls |

---

### Reto 8: Create Custom Docker Network (10 pts)

**Objetivo**: Crear red `mysql-network` con subnet y gateway personalizados.

```bash
docker network create \
  --driver bridge \
  --subnet 182.18.0.0/24 \
  --gateway 182.18.0.1 \
  mysql-network
```

| Verificación | Resultado |
|--------------|-----------|
| Red creada | ✅ mysql-network |
| Driver bridge | ✅ |
| Subnet 182.18.0.0/24 | ✅ |
| Gateway 182.18.0.1 | ✅ |

---

### Reto 9: Troubleshoot Container Volume & Port (10 pts)

**Objetivo**: Diagnosticar y reparar contenedor `nautilus` con volumen y puerto correctos.

```bash
# Diagnóstico
docker ps -a --filter name=nautilus  # Exited, sin puertos

# Solución
docker stop nautilus
docker rm nautilus
docker run -d --name nautilus \
  -v /var/www/html:/usr/local/apache2/htdocs \
  -p 8080:80 \
  httpd:latest

# Verificación
curl http://localhost:8080/  # Welcome to KodeKloud!
```

| Verificación | Resultado |
|--------------|-----------|
| Volumen mapeado | ✅ /var/www/html -> /usr/local/apache2/htdocs |
| Puerto expuesto | ✅ 80/tcp -> 0.0.0.0:8080 |
| Acceso web | ✅ Welcome to KodeKloud! |

---

## 🧠 Arquitectura de Conocimiento

### Áreas de Competencia

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCKER COMPETENCY MATRIX                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CONTAINER OPERATIONS          IMAGE MANAGEMENT                  │
│  ├── docker run ✓              ├── docker pull ✓                 │
│  ├── docker stop ✓             ├── docker save ✓                 │
│  ├── docker rm ✓               └── docker images ✓               │
│  ├── docker ps ✓                                                │
│  ├── docker exec ✓             FILE OPERATIONS                   │
│  └── docker inspect ✓          ├── docker cp (→host) ✓           │
│                                 ├── docker cp (→container) ✓     │
│  NETWORKING                    └── mkdir in container ✓          │
│  ├── docker network ls ✓                                        │
│  ├── docker network rm ✓       TROUBLESHOOTING                   │
│  ├── docker network create ✓   ├── Diagnóstico de estado ✓       │
│  └── Custom subnet/gateway ✓   ├── Inspección de volúmenes ✓    │
│                                 ├── Inspección de puertos ✓      │
│  VOLUMES                       └── curl verification ✓           │
│  └── Bind mounts (-v) ✓                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Comandos Dominados

| Comando | Uso | Nivel |
|---------|-----|-------|
| `docker run` | Crear contenedores | 🟢 Avanzado |
| `docker run -d` | Detached mode | 🟢 Avanzado |
| `docker run --name` | Naming | 🟢 Avanzado |
| `docker run -v` | Bind mounts | 🟢 Avanzado |
| `docker run -p` | Port mapping | 🟢 Avanzado |
| `docker run [CMD]` | Sobrescribir CMD | 🟢 Avanzado |
| `docker ps` | Listar contenedores | 🟢 Avanzado |
| `docker ps -a` | Todos los contenedores | 🟢 Avanzado |
| `docker ps --filter` | Filtrar resultados | 🟢 Avanzado |
| `docker stop` | Detener contenedor | 🟢 Avanzado |
| `docker rm` | Eliminar contenedor | 🟢 Avanzado |
| `docker exec` | Ejecutar en contenedor | 🟢 Avanzado |
| `docker cp` | Copiar archivos | 🟢 Avanzado |
| `docker pull` | Descargar imágenes | 🟢 Avanzado |
| `docker save` | Guardar imagen como tar | 🟢 Avanzado |
| `docker images` | Listar imágenes | 🟢 Avanzado |
| `docker inspect` | Inspeccionar configuración | 🟢 Avanzado |
| `docker port` | Verificar puertos | 🟢 Avanzado |
| `docker network ls` | Listar redes | 🟢 Avanzado |
| `docker network rm` | Eliminar red | 🟢 Avanzado |
| `docker network create` | Crear red | 🟢 Avanzado |
| `docker network inspect` | Inspeccionar red | 🟢 Avanzado |

---

## 📊 Infraestructura Utilizada

### Servidores

| Server | IP | Hostname | Usuario | Rol |
|--------|----|----------|---------|-----|
| stapp01 | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony | App Server 1 |
| jump_host | Dynamic | jump_host.stratos.xfusioncorp.com | thor | Jump Server |

### Contenedores Creados

| Contenedor | Imagen | Propósito |
|------------|--------|-----------|
| `nginx_1` | nginx:alpine | Web server |
| `debug_1` | ubuntu/apache2:latest | Debug container |
| `development_3` | httpd:alpine | Development server |
| `ubuntu_latest` | ubuntu/apache2:latest | Test container |
| `nautilus` | httpd:latest | Static website |

### Redes Creadas

| Red | Driver | Subnet | Gateway |
|-----|--------|--------|---------|
| `mysql-network` | bridge | 182.18.0.0/24 | 182.18.0.1 |

### Imágenes Descargadas

| Imagen | Tamaño | Uso |
|--------|--------|-----|
| nginx:alpine | 62.1MB | Container nginx_1 |
| ubuntu/apache2:latest | ~150MB | Containers debug_1, ubuntu_latest |
| redis:alpine | 97.2MB | Preparación para uso futuro |
| memcached:alpine | 13MB | Preparación para uso futuro |
| nginx:mainline-alpine-slim | 12.7MB | Exportada como tar |
| httpd:latest | ~67MB | Container nautilus |

---

## 🎓 Lecciones Aprendidas

### Conceptos Clave

| Concepto | Descripción |
|----------|-------------|
| **Container Isolation** | Los contenedores están aislados por defecto; requieren configuración explícita para interactuar |
| **Bind Mounts** | Permiten compartir datos entre host y contenedor |
| **Port Mapping** | Exponen servicios del contenedor al host |
| **Custom CMD** | Se puede sobrescribir el CMD del Dockerfile al ejecutar `docker run` |
| **Docker Networks** | Redes personalizadas permiten segmentación y configuración de IP |

### Patrones de Troubleshooting

```
1. ESTADO → docker ps -a (¿Está running?)
2. LOGS → docker logs (¿Qué errores hay?)
3. INSPECCIÓN → docker inspect (¿Configuración correcta?)
4. CONECTIVIDAD → curl, ping, netstat (¿Es accesible?)
5. SOLUCIÓN → Recrear con configuración correcta
```

### Errores Comunes Evitados

| Error | Prevención |
|-------|------------|
| Olvidar `-d` | Contenedor bloquea la terminal |
| Olvidar `--name` | Nombres aleatorios difíciles de gestionar |
| Olvidar `-p` | Contenedor inaccesible desde el host |
| Olvidar `-v` | Contenedor sin datos/vacío |
| Puerto ocupado | Verificar con `netstat` antes de mapear |

---

## 🚀 Próximos Pasos

### Nivel Actual: Docker Fundamentals ✅

### Siguiente Nivel: Docker Advanced

1. **Dockerfile Creation**
   - Escribir Dockerfiles personalizados
   - Multi-stage builds
   - Optimización de capas

2. **Docker Compose**
   - Orquestación de múltiples contenedores
   - Variables de entorno
   - Volúmenes y redes en Compose

3. **Docker Swarm / Kubernetes**
   - Orquestación a escala
   - Service discovery
   - Load balancing

4. **Docker Security**
   - Container scanning
   - SELinux/AppArmor
   - Secrets management

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Docker Documentation](https://docs.docker.com/)
- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [Docker Network Documentation](https://docs.docker.com/network/)
- [Docker Storage Documentation](https://docs.docker.com/storage/)

### Plataforma de Certificación

- [KodeKloud Engineer](https://kodekloud-engineer.com/)
- [KodeKloud Docker Course](https://kodekloud.com/courses/docker/)

### Comandos de Referencia Rápida

```bash
# CONTAINER OPERATIONS
docker run -d --name <name> <image>           # Create container
docker run -d --name <name> -p <h:c> <image>  # With port mapping
docker run -d --name <name> -v <h:c> <image>  # With volume
docker ps -a                                  # List all containers
docker stop <container>                       # Stop container
docker rm <container>                         # Remove container
docker exec <container> <command>             # Execute command
docker logs <container>                       # View logs
docker inspect <container>                    # Full details

# FILE OPERATIONS
docker cp <container>:<path> <host_path>      # Container → Host
docker cp <host_path> <container>:<path>      # Host → Container

# IMAGE OPERATIONS
docker pull <image>                           # Download image
docker images                                 # List images
docker save -o <file.tar> <image>             # Save as tar
docker load -i <file.tar>                     # Load from tar

# NETWORK OPERATIONS
docker network ls                             # List networks
docker network create --driver bridge --subnet <subnet> --gateway <gateway> <name>
docker network rm <network>                   # Remove network
docker network inspect <network>              # Network details
```

---

## 🏆 Achievement Unlocked

### Docker Fundamentals Certified 🐳

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              🏆 DOCKER CERTIFICATION COMPLETE 🏆               ║
║                                                               ║
║                     KODEKLOUD ENGINEER                        ║
║                                                               ║
║                     Score: 100/100                            ║
║                     Retos: 9/9                                ║
║                     Date: 18-02-2026                          ║
║                                                               ║
║  Skills: Container Operations, Image Management,              ║
║          File Operations, Networking, Troubleshooting         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

**Certificación Docker completada exitosamente** 🎉  
_Fecha: 18-02-2026 | Score: 100/100 | Engineer: Platform Engineer Jr._

> _"Containers are not just technology - they are a mindset of immutability, isolation, and reproducibility."_
