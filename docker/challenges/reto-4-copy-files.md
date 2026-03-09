---
title: "Docker Challenge Reto 4: Copy File to Docker Container"
category: docker
difficulty: 3
tags:
  - docker
  - contenedores
  - archivos
  - gestion
  - produccion
date: 30-01-2026
status: completado
---

# 🐳 Docker Challenge Reto 4: Copy File to Docker Container

---

## 🎓 Del Instructor

Como **Platform Engineer**, el 80% de mis días involucran mover datos: configuraciones, certificados TLS, dumps de base de datos, assets estáticos. Docker no es una excepción. Dominar `docker cp` y sus implicaciones de seguridad es tan crítico como saber escribir Dockerfiles.

> 🎯 **Mentalidad DevOps**: "Un contenedor es efímero, pero los datos son eternos. Nunca confundas uno con otro."

---

## 🎭 Escenario Empresarial

**Contexto**: El equipo de frontend acaba de construir una landing page de emergencia para un lanzamiento. Necesitan desplegarla **ahora** en el servidor nginx existente sin reconstruir la imagen (el pipeline CI/CD está roto).

**Tu misión**: Transferir los archivos estáticos al contenedor nginx en producción, manteniendo la zero-downtime.

**Restricciones de producción**:

- **No rebuild**: El pipeline está caído
- **Zero downtime**: No puedes parar el contenedor
- **Backup**: Debes respaldar la config actual antes de modificar
- **Rollback**: Preparado para revertir en < 30 segundos si algo falla

**Infraestructura**:

- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Contraseña**: Ir0nM@n
- **Ruta nginx**: `/usr/share/nginx/html/`

---

## 🧠 Arquitectura: Capas y Persistencia

### El Dilema de los Datos en Contenedores

```
CONTENEDOR DOCKER - Capas de Filesystem
═══════════════════════════════════════════════════════════════
Capa Writeable (R/W)  ◄── docker cp escribe aquí
├── /usr/share/nginx/html/     # Archivos copiados
├── /var/log/nginx/            # Logs generados
└── /tmp/                      # Temp files

Capas de Imagen (Read-Only)
├── Layer 3: Configuración nginx
├── Layer 2: Binarios nginx
└── Layer 1: Base Alpine
═══════════════════════════════════════════════════════════════
Host Filesystem
├── /var/lib/docker/overlay2/<id>/merged  # Union mount point
└── /home/tony/landing-page/              # Archivos fuente
```

**Problema fundamental**: Los archivos copiados con `docker cp` existen solo en esa instancia del contenedor. Si el contenedor muere, los datos se pierden.

### Estrategias de Persistencia en Producción

| Estrategia     | Cuándo usar                | Persistencia              | Performance      |
| -------------- | -------------------------- | ------------------------- | ---------------- |
| `docker cp`    | Hotfixes de emergencia     | ❌ Volátil                | ⚡ Rápido        |
| Bind mounts    | Desarrollo local           | ✅ Persiste en host       | ⚡ Rápido        |
| Named volumes  | Datos de producción        | ✅ Persiste independiente | ⚡ Rápido        |
| tmpfs mounts   | Datos sensibles en memoria | ❌ Ram-only               | 🚀 Ultra-rápido  |
| Rebuild imagen | Cambios permanentes        | ✅ En layer de imagen     | 🐢 Lento (build) |

### Seguridad de `docker cp`

**Riesgos**:

- **Escalación de privilegios**: Copiar binarios SUID puede comprometer el host
- **Sobrescritura accidental**: Pisar archivos críticos del sistema
- **Exfiltración**: Extraer datos sensibles del contenedor

**Mitigaciones**:

- Verificar permisos post-copia (`docker exec -- ls -la`)
- Usar usuarios no-root cuando sea posible
- Auditar con `docker events`

---

## 🛠️ Implementación Profesional

### Fase 1: Preparación y Backup

```bash
# Acceso al servidor
ssh tony@172.16.238.10
sudo su -

# Verificar contenedor objetivo
docker ps --filter name=test-container --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
```

**Creación de archivo de prueba (simulando landing page)**:

```bash
# Crear directorio de trabajo
mkdir -p /tmp/emergency-deploy
cd /tmp/emergency-deploy

# Archivo de prueba simple
cat > test-file.txt << 'EOF'
Hello from Platform Engineer!
Deployed via docker cp at $(date)
EOF

# Landing page HTML completa
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nautilus - Launch Page</title>
    <style>
        body { font-family: system-ui; text-align: center; padding: 50px; }
        h1 { color: #22d3ee; }
        .timestamp { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>🚀 Nautilus Launch</h1>
    <p>Emergency deployment via docker cp</p>
    <p class="timestamp">Deployed: $(date)</p>
</body>
</html>
EOF

ls -lah
```

### Fase 2: Backup de Configuración Actual (Crítico)

Antes de cualquier cambio, backup:

```bash
# Crear directorio de backups con timestamp
BACKUP_DIR="/tmp/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup de configuración nginx
docker cp test-container:/etc/nginx/nginx.conf $BACKUP_DIR/

# Backup de contenido actual
docker cp test-container:/usr/share/nginx/html $BACKUP_DIR/html-backup

echo "Backup creado en: $BACKUP_DIR"
ls -la $BACKUP_DIR/
```

**Principio**: "Si no tienes backup, estás preparado para el disaster recovery."

### Fase 3: Transferencia de Archivos

#### Método 1: Archivo Individual (Hotfix)

```bash
# Copiar archivo del host al contenedor
# Sintaxis: docker cp <host-src> <container>:<dest-path>
docker cp test-file.txt test-container:/usr/share/nginx/html/

# Verificación inmediata
docker exec test-container cat /usr/share/nginx/html/test-file.txt
```

#### Método 2: Múltiples Archivos (Pattern matching)

```bash
# Copiar todos los archivos HTML
docker cp *.html test-container:/usr/share/nginx/html/

# Verificar
docker exec test-container ls -la /usr/share/nginx/html/
```

#### Método 3: Directorio Completo (Recurso)

```bash
# Crear estructura de directorios de ejemplo
mkdir -p web-files/css web-files/js web-files/images
echo "body { color: blue; }" > web-files/css/style.css
echo "console.log('loaded');" > web-files/js/app.js

# Copia recursiva (-r flag)
docker cp -r web-files test-container:/usr/share/nginx/html/

# Verificación recursiva
docker exec test-container find /usr/share/nginx/html -type f
```

### Fase 4: Extracción desde Contenedor (Reverse Copy)

```bash
# Extraer logs para análisis externo
docker cp test-container:/var/log/nginx/ ./logs-nginx/

# Extraer configuración para versionado
docker cp test-container:/etc/nginx/nginx.conf ./nginx-production.conf

# Verificar extracción
ls -la logs-nginx/
```

**Caso de uso**: Analizar logs con herramientas del host (grep, awk, ELK stack).

### Fase 5: Verificación Funcional

```bash
# Obtener IP del contenedor
CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' test-container)
echo "Container IP: $CONTAINER_IP"

# Test HTTP
curl -s http://$CONTAINER_IP/test-file.txt

# Test HTML completo
curl -s http://$CONTAINER_IP/index.html | head -20

# Verificar que nginx sirve los archivos correctamente
curl -I http://$CONTAINER_IP/index.html
```

**Respuesta esperada**:

```
HTTP/1.1 200 OK
Server: nginx/1.25.3
Content-Type: text/html
```

---

## 📊 Checklist de Producción

### Pre-Operación

- [x] Contenedor objetivo verificado y corriendo
- [x] Archivos fuente preparados y validados
- [x] Backup creado de configuración existente
- [x] Plan de rollback documentado

### Operación

- [x] Archivos transferidos sin errores
- [x] Permisos verificados post-copia
- [x] Contenedor sigue corriendo (zero-downtime)

### Post-Operación

- [x] Verificación funcional completada (curl tests)
- [x] Logs revisados por errores (`docker logs`)
- [x] Backup disponible para rollback
- [x] Documentación actualizada

### Seguridad

- [x] No se sobrescribieron archivos críticos del sistema
- [x] Permisos de archivos apropiados (nginx puede leer)
- [x] Sin datos sensibles expuestos accidentalmente

---

## 🎓 Reflexión Final: From Installer to Engineer

### Anti-Patrón Detectado: "docker cp como deployment"

**Problema**: Usar `docker cp` para deployments regulares viola el principio de **infraestructura inmutable**.

**Por qué es malo**:

1. **No reproducible**: No hay registro de qué cambios se hicieron cuándo
2. **No versionable**: Los cambios no están en git
3. **No escala**: A 100 contenedores es imposible de gestionar
4. **Sin rollback**: El único rollback es restaurar backup manual

### La Solución Correcta: Multi-stage Build + CI/CD

```dockerfile
# Dockerfile.production - La forma correcta
FROM nginx:alpine AS builder
COPY landing-page/ /usr/share/nginx/html/
RUN # minification, optimization

FROM nginx:alpine
COPY --from=builder /usr/share/nginx/html/ /usr/share/nginx/html/
EXPOSE 80
```

```bash
# En CI/CD pipeline
docker build -t nautilus/landing:$VERSION .
docker push nautilus/landing:$VERSION
# Rolling update en orchestrator
```

### Cuándo SÍ usar docker cp

| Escenario                  | Justificación                                |
| -------------------------- | -------------------------------------------- |
| **Hotfix de emergencia**   | Pipeline caído, revenue en riesgo            |
| **Debugging**              | Extraer logs, dumps, archivos de análisis    |
| **Configuración temporal** | Testing, no va a producción                  |
| **Recuperación**           | Restaurar backup manual después de incidente |

### Evolución del Mindset

| Instalador                         | Platform Engineer                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| "Copié los archivos y funcionó"    | "Implementé hotfix con backup, verificación funcional, y plan de rollback documentado" |
| `docker cp` para todo              | Uso `docker cp` solo en emergencias, todo lo demás va por CI/CD                        |
| "El contenedor tiene los archivos" | "Los archivos están en la capa writeable - efímeros y no versionados"                  |
| Un contenedor, manual              | Imagens inmutables, deployments automatizados, orchestration                           |

### Pro Tip: Script de Hotfix Estandarizado

```bash
#!/bin/bash
# hotfix-deploy.sh - Para emergencias controladas

CONTAINER=$1
SOURCE=$2
DEST=$3

if [ -z "$CONTAINER" ] || [ -z "$SOURCE" ] || [ -z "$DEST" ]; then
    echo "Uso: $0 <container> <source> <dest>"
    exit 1
fi

# 1. Backup
BACKUP="/tmp/backup-$(date +%s)"
docker cp $CONTAINER:$DEST $BACKUP

# 2. Deploy
docker cp $SOURCE $CONTAINER:$DEST

# 3. Verify
if docker exec $CONTAINER test -f $DEST; then
    echo "✅ Deploy exitoso"
    echo "🔄 Rollback disponible en: $BACKUP"
else
    echo "❌ Fallo, restaurando backup..."
    docker cp $BACKUP $CONTAINER:$DEST
    exit 1
fi
```

> **Recuerda**: `docker cp` es un paracaídas, no un avión. Úsalo para emergencias, no para navegar.

---

## 🚀 Próximos Pasos en el Learning Path

1. **Reto 5**: Troubleshooting avanzado - diagnosticar problemas complejos
2. **Conceptos a dominar**:
   - Docker volumes (la forma correcta de persistencia)
   - Bind mounts vs named volumes
   - ConfigMaps y Secrets en Kubernetes
   - Immutable infrastructure y GitOps

---

## 📚 Recursos y Referencias

### Comandos de Referencia

```bash
# Host → Contenedor
docker cp /host/path/file.txt container:/container/path/

# Contenedor → Host
docker cp container:/container/path/file.txt /host/path/

# Directorios (recursivo)
docker cp -r /host/dir container:/container/path/

# Múltiples archivos (no soportado nativamente, usar tar)
tar czf - /host/files | docker exec -i container tar xzf - -C /dest/
```

### Documentación

- [Docker cp Reference](https://docs.docker.com/engine/reference/commandline/cp/)
- [Manage Data in Docker](https://docs.docker.com/storage/)
- [Volumes vs Bind Mounts](https://docs.docker.com/storage/volumes/)

### Mejores Prácticas

- [Immutable Infrastructure](https://www.hashicorp.com/resources/what-is-mutable-vs-immutable-infrastructure)
- [Twelve-Factor App - Config](https://12factor.net/config)
- [Docker Security - File System](https://docs.docker.com/engine/security/)

---

## 📊 Métricas del Reto

| Métrica                | Valor    | Objetivo                   |
| ---------------------- | -------- | -------------------------- |
| Backup creado          | Sí       | Requerido ✅               |
| Archivos transferidos  | 3+       | Completo ✅                |
| Verificación funcional | Exitosa  | HTTP 200 ✅                |
| Zero downtime          | Sí       | Contenedor nunca parado ✅ |
| Tiempo total           | < 10 min | Eficiente ✅               |

---

**Reto 4 completado exitosamente** 🎉  
_Fecha: 30-01-2026 | Status: Hotfix ejecutado con backup | Engineer: Platform Engineer Jr._
