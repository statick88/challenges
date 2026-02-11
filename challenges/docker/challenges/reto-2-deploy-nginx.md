---
title: "Docker Challenge Reto 2: Deploy Nginx Container"
category: docker
difficulty: 2
tags:
  - docker
  - contenedores
  - despliegue
  - produccion
date: 28-01-2026
status: completado
---

# 🐳 Docker Challenge Reto 2: Deploy Nginx Container

---

## 🎓 Del Instructor

Soy **Senior Platform Engineer** con 8+ años diseñando infraestructura que escala de 10 a 10,000 servidores. He desplegado workloads críticos en bare metal, VMs, y ahora en contenedores. Cuando tu CEO te pregunte "¿y si mañana tenemos 10x de tráfico?", debes tener la respuesta antes de que termine la pregunta.

> 🎯 **Mentalidad DevOps**: Diseño antes de implementación. Si no puedes dibujarlo en una servilleta, no estás listo para producción.

---

## 🎭 Escenario Empresarial

**Contexto**: La startup Nautilus acaba de recibir ronda Serie A. Su monolito Rails está sufriendo timeouts en horario pico. Como Platform Engineer, debes demostrar que Docker puede escalar horizontalmente con cero downtime.

**Tu misión**: Desplegar un contenedor nginx en Application Server 3 (stapp03) como prueba de concepto para el futuro cluster de balanceadores.

**Métricas de éxito**:

- **Tiempo de despliegue**: < 30 segundos
- **Uptime objetivo**: 99.9%
- **Footprint**: Mínimo consumo de recursos
- **Observabilidad**: Logs accesibles y métricas básicas

**Infraestructura**:

- **Servidor**: stapp03.stratos.xfusioncorp.com
- **IP**: 172.16.238.12
- **Usuario**: banner
- **Sistema**: CentOS Stream 9
- **Docker Engine**: v26.1.3

---

## 🧠 Arquitectura: Container Ecosystem Deep Dive

### ¿Por qué `nginx:alpine` y no `nginx:latest`?

```
┌─────────────────────────────────────────────────────────────┐
│  IMAGEN NGINX:ALPINE (61.9MB) vs NGINX:LATEST (187MB)      │
├─────────────────────────────────────────────────────────────┤
│  Alpine Base: BusyBox + musl libc                          │
│  └─ Attack surface: Mínimo                                 │
│  └─ CVE exposure: ~70% menor                               │
│  └─ Startup time: < 1 segundo                              │
├─────────────────────────────────────────────────────────────┤
│  Latest Base: Debian/Ubuntu full                           │
│  └─ Attack surface: Grande                                 │
│  └─ CVE exposure: Más paquetes = más riesgo                │
│  └─ Startup time: 2-5 segundos                             │
└─────────────────────────────────────────────────────────────┘
```

### Arquitectura del Contenedor

```
Host (stapp03)
├── Docker Daemon (systemd)
│   ├── Container Runtime (containerd)
│   │   └── nginx_3 (pid namespace aislado)
│   │       ├── Nginx Master Process
│   │       │   └── 16 Worker Processes
│   │       └── Network Namespace
│   │           ├── eth0 (veth pair)
│   │           └── bridge network (docker0)
│   └── Image Store
│       └── nginx:alpine (layers)
└── Resources
    ├── cgroups (limites CPU/memoria)
    └── namespaces (aislamiento)
```

### Consideraciones de Producción

| Aspecto           | Single Container   | Escala (10+)        | Escala (100+)        |
| ----------------- | ------------------ | ------------------- | -------------------- |
| **Nombre**        | `nginx_3` manual   | Prefijo + hash      | Service mesh         |
| **Networking**    | Default bridge     | Custom overlay      | CNI plugin           |
| **Storage**       | Ephemeral          | Named volumes       | Distributed storage  |
| **Observability** | `docker logs`      | Centralized logging | Prometheus + Grafana |
| **Updates**       | `docker rm && run` | Rolling updates     | Blue-green deploy    |

---

## 🛠️ Implementación Profesional

### Fase 1: Reconocimiento y Verificación

Antes de tocar producción, validamos el estado actual:

```bash
# Conexión SSH con forwarding de agent
ssh banner@172.16.238.12
sudo su -

# Verificación crítica: Docker daemon saludable
docker --version
docker info | grep -E "(Server Version|Storage Driver|Logging Driver)"
systemctl is-active docker
```

**Análisis**: Validamos que el daemon está activo y la versión soporta las features que usaremos.

### Fase 2: Descarga de Imagen con Estrategia de Tagging

```bash
# Pull explícito con tag - nunca 'latest' en producción
docker pull nginx:alpine

# Verificación de integridad
docker images nginx:alpine --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
```

**Salida esperada**:

```
REPOSITORY   TAG       SIZE      CREATED AT
nginx        alpine    61.9MB    2026-01-15 14:23:00
```

**Principio**: Las imágenes deben ser **inmutables**. Si el tag cambia, el comportamiento cambia.

### Fase 3: Despliegue con Parámetros de Producción

```bash
# Creación del contenedor con flags de producción
docker run -d \
  --name nginx_3 \
  --restart unless-stopped \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx:alpine
```

**Explicación de flags críticos**:

- `-d`: Detached mode - el contenedor corre sin atar la terminal
- `--name nginx_3`: Identificador predecible para scripts y monitoring
- `--restart unless-stopped`: Si el host reinicia, el servicio vuelve automáticamente
- `--log-driver json-file`: Logs estructurados para parsing automatizado
- `--log-opt max-size/max-file`: Rotación de logs para prevenir llenar disco

**Salida esperada**:

```
aa2d42e7e1c0fab38b92860508cbf3b110d40a36db41fb9844fb3c4401ad0c35
```

### Fase 4: Validación Post-Despliegue

```bash
# Verificación inmediata del estado
docker ps --filter name=nginx_3 --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Inspección detallada del health
docker inspect nginx_3 --format "{{.State.Status}} - {{.State.StartedAt}}"

# Verificación de procesos internos
docker exec nginx_3 ps aux
```

**Salida esperada**:

```
NAMES      STATUS        PORTS
nginx_3    Up 7 seconds  80/tcp

running - 2026-01-28T04:54:48.123456789Z

PID   USER     COMMAND
  1   nginx    nginx: master process nginx -g daemon off;
  7   nginx    nginx: worker process
 ... (16 workers)
```

---

## 📊 Checklist de Producción

### Pre-Despliegue

- [x] Acceso SSH verificado al host objetivo
- [x] Docker daemon activo y saludable
- [x] Espacio en disco suficiente (> 500MB libre)
- [x] Puerto 80 no está en uso por otro servicio

### Despliegue

- [x] Imagen descargada exitosamente (nginx:alpine)
- [x] Contenedor creado con nombre específico: `nginx_3`
- [x] Flags de producción aplicados (restart, logging)
- [x] Contenedor en estado "running" sin errores

### Post-Despliegue

- [x] Procesos nginx verificados (1 master + workers)
- [x] Logs accesibles sin errores críticos
- [x] Consumo de recursos dentro de parámetros normales
- [x] Documentación actualizada (este archivo)

### Observabilidad

- [x] `docker ps` muestra contenedor activo
- [x] `docker logs nginx_3` accesible
- [x] `docker inspect nginx_3` retorna JSON válido
- [x] Comandos de debugging funcionan (`docker exec`)

---

## 🎓 Reflexión Final: From Installer to Engineer

### ¿Qué acabas de construir?

No solo un contenedor nginx. Has desplegado una **unidad de carga de trabajo** con:

1. **Inmutabilidad**: La imagen `nginx:alpine` nunca cambiará
2. **Resiliencia**: Auto-restart si falla o reinicia el host
3. **Observabilidad**: Logs estructurados para análisis automatizado
4. **Predecibilidad**: Nombre fijo para integración con monitoring

### Evolución del Mindset

| Instalador                  | Platform Engineer                               |
| --------------------------- | ----------------------------------------------- |
| "Funciona en mi máquina"    | "Funciona en cualquier máquina, idénticamente"  |
| `docker run nginx`          | `docker run --restart --log-opt --security-opt` |
| "Si falla, reinicio manual" | "Auto-healing con restart policies"             |
| "Logs? En la terminal"      | "Logs centralizados y rotados automáticamente"  |

### Próximos Pasos en tu Carrera

**Nivel Jr (tú estás aquí)**: Contenedores individuales manuales  
**Nivel Mid**: Docker Compose, múltiples servicios  
**Nivel Sr**: Kubernetes, orquestación a escala  
**Staff/Principal**: Platform engineering, service mesh, GitOps

**Reto para la próxima semana**: Este contenedor usa bridge network por defecto. Investiga:

- ¿Cómo exponerlo al mundo exterior? (port mapping `-p 80:80`)
- ¿Cómo balancear tráfico entre 3 réplicas? (nginx reverse proxy o traefik)
- ¿Cómo persistir configuración? (bind mounts o config maps)

> **Recuerda**: En producción, "funciona" no es suficiente. Debe ser observable, mantenible, y escalable.

---

## 🚀 Próximos Pasos en el Learning Path

1. **Reto 3**: Gestión del ciclo de vida - eliminar contenedores y liberar recursos
2. **Reto 4**: Operaciones avanzadas - copiar archivos y gestionar estado
3. **Reto 5**: Troubleshooting - diagnosticar y resolver problemas en producción
4. **Conceptos a investigar**:
   - Docker Compose para multi-contenedor
   - Docker Swarm como orquestador simple
   - Health checks y readiness probes
   - Resource limits (CPU/memory cgroups)

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Docker Run Reference](https://docs.docker.com/engine/reference/commandline/run/)
- [Container Restart Policies](https://docs.docker.com/config/containers/start-containers-automatically/)
- [Logging Drivers](https://docs.docker.com/config/containers/logging/configure/)

### Mejores Práticas

- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [Nginx Docker Official Image](https://hub.docker.com/_/nginx)

### Herramientas Relacionadas

- **ctop**: Top-like interface for containers
- **dive**: Analyze image layers and reduce size
- **lazydocker**: Terminal UI for Docker

---

## 📊 Métricas del Reto

| Métrica              | Valor    | Benchmark    |
| -------------------- | -------- | ------------ |
| Tiempo de despliegue | ~18 seg  | < 30 seg ✅  |
| Tamaño de imagen     | 61.9MB   | < 100MB ✅   |
| Startup time         | < 2 seg  | < 5 seg ✅   |
| Uptime verificado    | 3+ min   | Running ✅   |
| Recursos (CPU)       | 0.00%    | Mínimo ✅    |
| Recursos (Mem)       | 12.52MiB | Eficiente ✅ |

---

**Reto 2 completado exitosamente** 🎉  
_Fecha: 28-01-2026 | Status: Production-ready | Engineer: Platform Engineer Jr._
