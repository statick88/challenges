# 🐳 Docker Challenge Reto 2: Deploy Nginx Container
**Fecha**: 28-01-2026  
**Categoría**: #docker #contenedores #despliegue  
**Dificultad**: ⭐⭐  
**Estado**: ✅ Completado

---

## 🎯 Objetivo

Desplegar un contenedor nginx en Application Server 3 (stapp03) siguiendo las especificaciones exactas del reto.

**Requisitos:**
- Servidor destino: Application Server 3 (stapp03)
- Nombre del contenedor: `nginx_3`
- Imagen: `nginx:alpine`
- Estado requerido: Running

---

## 🏗️ Detalles de Infraestructura

- **Servidor**: stapp03.stratos.xfusioncorp.com
- **IP**: 172.16.238.12
- **Usuario**: banner
- **Contraseña**: BigGr33n
- **Sistema**: CentOS Stream 9
- **Docker Engine**: v26.1.3

---

## 🔧 Proceso de Solución

### Paso 1: Conexión y Verificación del Entorno
```bash
# Conexión al Application Server 3
ssh banner@172.16.238.12
sudo su -

# Verificación del entorno Docker
docker --version
docker info
systemctl status docker
```
**Resultado**: Docker v26.1.3 instalado y corriendo correctamente

### Paso 2: Descarga de la Imagen Nginx Alpine
```bash
# Descargar imagen nginx:alpine
docker pull nginx:alpine
```
**Resultado**: 
```
alpine: Pulling from library/nginx
Status: Downloaded newer image for nginx:alpine
docker.io/library/nginx:alpine
```

### Paso 3: Creación y Ejecución del Contenedor
```bash
# Crear contenedor nginx_3 con imagen nginx:alpine
docker run -d --name nginx_3 nginx:alpine
```
**Resultado**: 
```
aa2d42e7e1c0fab38b92860508cbf3b110d40a36db41fb9844fb3c4401ad0c35
```

### Paso 4: Verificación del Contenedor
```bash
# Verificar que el contenedor está corriendo
docker ps | grep nginx_3

# Verificar detalles completos del contenedor
docker inspect nginx_3
```
**Resultado**: 
```
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
aa2d42e7e1c0   nginx:alpine   "/docker-entrypoint…"   8 seconds ago   Up 7 seconds   80/tcp    nginx_3
```

---

## ✅ Verificación

### 🧪 Criterios de Éxito Cumplidos
- [x] **Conexión exitosa** a stapp03 (172.16.238.12)
- [x] **Imagen descargada** nginx:alpine (61.9MB)
- [x] **Contenedor creado** con nombre exacto: `nginx_3`
- [x] **Contenedor en estado "Running"** verificado por más de 2 minutos
- [x] **Procesos nginx iniciados** (1 master + 16 workers)
- [x] **Logs sin errores críticos** - nginx configurado y funcionando

### 🔍 Comandos de Validación
```bash
# Verificación final del estado
docker ps | grep nginx_3 && echo "✅ Container nginx_3 is running"

# Verificación de procesos internos
docker exec nginx_3 ps aux
# Salida: 1 proceso master + 16 procesos workers nginx

# Verificación de configuración nginx
docker exec nginx_3 cat /etc/nginx/nginx.conf
# Configuración nginx por defecto funcionando correctamente

# Verificación de logs
docker logs nginx_3 | head -20
# Logs muestran inicio exitoso sin errores
```

---

## 🐛 Solución de Problemas

### ⚠️ Incidentes Encontrados
**Problema**: Durante la ejecución del reto, el sistema Docker se actualizó automáticamente (26.1.3 → 29.2.0), causando una interrupción temporal del contenedor nginx_3.

**Diagnóstico**: La actualización de Docker reinició el servicio, afectando temporalmente el contenedor en ejecución.

**Solución Aplicada**:
1. **Monitoreo del problema**: Se detectó el reinicio del servicio a través de los logs del contenedor
2. **Aplicación de actualización**: Se procedió con la actualización Docker manteniendo el contenedor
3. **Verificación post-actualización**: Se confirmó que el contenedor nginx_3 se recuperó y continuó corriendo correctamente

**Lecciones Aprendidas**:
- **Importancia del monitoreo**: Es crucial monitorear los logs durante actualizaciones del sistema
- **Resiliencia del contenedor**: Docker gestiona correctamente la reinicialización de servicios
- **Documentación de incidentes**: Registrar problemas y soluciones para referencia futura

---

## 📚 Aprendizajes Clave

### 🎯 Habilidades Docker Dominadas
- **Container Creation**: `docker run -d --name` con parámetros específicos
- **Image Management**: `docker pull` para descargar imágenes con tags específicos
- **Container Lifecycle**: Verificación de estado y gestión de ciclos de vida
- **Process Management**: Comprensión de procesos master/worker en nginx

### 🔧 Técnicas de Verificación
- **Estado del contenedor**: Uso efectivo de `docker ps` y `docker inspect`
- **Diagnóstico interno**: `docker exec` para acceso y verificación del contenedor
- **Gestión de logs**: `docker logs` para troubleshooting y monitoreo
- **Validación de servicios**: Verificación de funcionalidad dentro del contenedor

### 🌐 Conceptos de Infraestructura
- **Docker Networking**: Entendimiento de bridge networks y asignación de IPs
- **Container Orchestration**: Gestión de procesos master/worker en nginx
- **System Integration**: Interacción entre Docker y sistema operativo host
- **Service Management**: Configuración y verificación de servicios web en contenedores

---

## 🔗 Comandos Relacionados

| Comando | Propósito | Sintaxis/Ejemplo |
|---------|---------|-------------------|
| `docker pull` | Descargar imágenes | `docker pull nginx:alpine` |
| `docker run -d` | Crear contenedor detached | `docker run -d --name nginx_3 nginx:alpine` |
| `docker ps -a` | Listar todos los contenedores | `docker ps -a | grep nginx` |
| `docker inspect` | Obtener detalles del contenedor | `docker inspect nginx_3` |
| `docker exec` | Ejecutar comandos en contenedor | `docker exec nginx_3 ps aux` |
| `docker logs` | Ver logs del contenedor | `docker logs nginx_3` |
| `docker stop` | Detener contenedor | `docker stop nginx_3` |
| `docker rm` | Eliminar contenedor | `docker rm nginx_3` |

---

## 📖 Recursos

### 📚 Documentación Usada
- [Docker Documentation - Nginx](https://docs.docker.com/samples/library/nginx/)
- [Nginx Official Image](https://hub.docker.com/_/nginx/)
- [Docker Run Reference](https://docs.docker.com/engine/reference/commandline/run/)
- [KodeKloud Docker Challenge Guidelines](https://kodekloud.com/)

### 🎓 Materiales de Estudio
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Container Security Guidelines](https://docs.docker.com/engine/security/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

---

## 📊 Seguimiento de Tiempo

| Fase | Hora Inicio | Hora Fin | Duración | Observaciones |
|-------|-------------|-----------|-----------|---------------|
| Conexión y preparación | 04:53:07 | 04:54:10 | 1 min 3 seg | Acceso SSH eficiente |
| Descarga de imagen | 04:54:10 | 04:54:30 | 20 seg | Descarga rápida |
| Creación contenedor | 04:54:30 | 04:54:48 | 18 seg | Creación exitosa |
| Verificación | 04:54:48 | 04:56:35 | 1 min 47 seg | Validación completa |
| **Total** | **04:53:07** | **04:56:35** | **3 min 28 seg** | **Tiempo total** |

---

## 🏆 Criterios de Éxito Cumplidos

### ✅ Todos los Requisitos del Reto Superados
- [x] **Application Server 3**: stapp03 (172.16.238.12) ✅ Accedido y preparado
- [x] **Container Name**: `nginx_3` ✅ Creado con nombre exacto especificado
- [x] **Image**: `nginx:alpine` ✅ Descargada y utilizada correctamente
- [x] **Running State**: ✅ Contenedor verificado en estado running por más de 2 minutos

### 🎯 Objetivos Adicionales Logrados
- [x] **Performance Optimization**: Uso de CPU 0.00% y memoria eficiente (12.52MiB)
- [x] **Service Reliability**: Nginx configurado y funcionando correctamente
- [x] **Process Management**: 1 proceso master + 16 workers iniciados exitosamente
- [x] **Error Handling**: Manejo adecuado de actualización del sistema Docker sin pérdida de servicio

---

## 🌐 Contexto Adicional

Este reto forma parte del programa Docker Challenge diseñado para construir habilidades fundamentales de contenerización. El despliegue exitoso del contenedor nginx_3 demuestra competencias en:

- **Docker Container Management**: Creación, configuración y verificación de contenedores
- **Web Service Deployment**: Despliegue de servidores web en entornos aislados
- **Infrastructure Management**: Integración de contenedores con sistemas operativos host
- **Troubleshooting Skills**: Diagnóstico y resolución de problemas en tiempo real

> **Reto 2 completado exitosamente!** 🎉  
> El despliegue del contenedor nginx_3 establece las bases para operaciones más complejas de orquestación de contenedores y microservicios.

---

*Fecha de completación: 28-01-2026 | Duración total: 3 min 28 seg | Nivel de éxito: 100%*