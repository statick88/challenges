---
title: "Docker Challenge Reto 3: Delete Docker Container"
category: docker
difficulty: 2
tags:
  - docker
  - contenedores
  - limpieza
  - mantenimiento
date: 30-01-2026
status: completado
---

# 🐳 Docker Challenge Reto 3: Delete Docker Container

---

## 🎓 Del Instructor

Como **Platform Engineer**, la limpieza es tan importante como el despliegue. En mi experiencia manejando clusters de producción, el 40% de los problemas de recursos vienen de contenedores "zombie" - pruebas olvidadas, jobs fallidos, pods huérfanos. Una plataforma saludable requiere higiene constante.

> 🎯 **Mentalidad DevOps**: "Cada recurso tiene un costo: disco, CPU, memoria, y atención cognitiva. Si no lo necesitas, elimínalo."

---

## 🎭 Escenario Empresarial

**Contexto**: El equipo de desarrollo dejó corriendo el contenedor `kke-container` en stapp03 hace 3 semanas. Es un busybox con `tail -f /dev/null` - literalmente no hace nada, solo consume recursos. El CTO quiere un reporte de por qué el servidor está al 60% de capacidad.

**Tu misión**: Identificar y eliminar todos los contenedores "zombie" de prueba, documentando el proceso para futura automatización.

**Consideraciones de producción**:

- **Compliance**: ¿El contenedor tiene datos sensibles que deben archivarse?
- **Auditoría**: ¿Quién lo creó y cuándo? (Hint: `docker inspect`)
- **Automatización**: ¿Cómo evitamos que esto vuelva a pasar?

**Infraestructura**:

- **Servidor**: stapp03.stratos.xfusioncorp.com
- **IP**: 172.16.238.12
- **Usuario**: banner
- **Contenedor objetivo**: `kke-container` (busybox:latest)
- **Acceso**: Via jump_host (thor@jump_host.stratos.xfusioncorp.com)

---

## 🧠 Arquitectura: Ciclo de Vida y Gestión de Recursos

### Estados de un Contenedor

```
                    docker run
                         │
                         ▼
    ┌──────────────────────────────────────┐
    │           CREATED                    │
    │    (filesystem preparado)            │
    └──────────────┬───────────────────────┘
                   │ docker start
                   ▼
    ┌──────────────────────────────────────┐
    │           RUNNING ◄────────────┐     │
    │    (proceso principal activo)   │     │
    │                                 │     │
    │  docker stop ───────────────┘     │
    └──────────────┬───────────────────────┘
                   │ proceso termina/stop
                   ▼
    ┌──────────────────────────────────────┐
    │           EXITED                     │
    │    (filesystem persiste)             │
    │                                      │
    │  docker rm ◄────────────────────┐    │
    └──────────────┬──────────────────┘────┘
                   │ docker rm -f (force)
                   ▼
              ELIMINADO
         (solo imagen permanece)
```

### Anatomía de un Contenedor "Zombie"

```
Sistema de Archivos del Host (/var/lib/docker)
├── containers/
│   └── <container-id>/
│       ├── config.v2.json          # Metadata (nombres, labels, env vars)
│       ├── hostconfig.json         # Config de runtime (restart policy, resources)
│       ├── checkpoints/            # Estados guardados (raro en prod)
│       └── <container-id>-json.log # Logs del contenedor (¡pueden crecer!)
├── overlay2/
│   └── <layer-id>/                 # Capas de filesystem del contenedor
└── volumes/
    └── ...                         # Datos persistentes (NO se eliminan con rm)
```

**Impacto de recursos**:

- **Disco**: Config JSON (~2KB) + logs (pueden ser GB si no hay rotación)
- **CPU/Memoria**: 0 si está parado, pero el scheduler de Docker sigue track de él
- **Red**: Interfaces de red virtuales liberadas, pero reglas iptables pueden quedar

---

## 🛠️ Implementación Profesional

### Fase 1: Reconocimiento y Clasificación

Antes de eliminar nada, investigamos qué tenemos:

```bash
# Acceso via jump host con registro de auditoría
ssh thor@jump_host.stratos.xfusioncorp.com
# Contraseña: mjolnir123

ssh banner@stapp03.stratos.xfusioncorp.com
# Contraseña: BigGr33n

sudo su -

# Inventario completo - TODOS los contenedores, no solo los corriendo
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.RunningFor}}"
```

**Salida esperada**:

```
NAMES           IMAGE       STATUS                  CREATED
kke-container   busybox     Up About a minute       3 weeks ago
```

**Análisis crítico**:

- **Status "Up"**: El contenedor está corriendo - no podemos eliminarlo directamente
- **Created "3 weeks ago"**: Contenedor abandonado, candidato claro para limpieza
- **Image "busybox"**: Imagen mínima, típica de contenedores de debug

### Fase 2: Investigación Forense (Antes de Eliminar)

```bash
# ¿Quién creó esto? ¿Cuándo? ¿Por qué?
docker inspect kke-container --format "
Nombre: {{.Name}}
Creado: {{.Created}}
Imagen: {{.Config.Image}}
Comando: {{.Config.Cmd}}
Estado: {{.State.Status}}
PID: {{.State.Pid}}
Restart Count: {{.RestartCount}}
"
```

**Salida esperada**:

```
Nombre: /kke-container
Creado: 2026-01-09T14:23:00.000000000Z
Imagen: busybox
Comando: [tail -f /dev/null]
Estado: running
PID: 1234
Restart Count: 0
```

**Veredicto**: Contenedor de debug con `tail -f /dev/null` - estrategia común para "mantener vivo" un contenedor. Sin servicio real. Seguro para eliminar.

### Fase 3: Eliminación con Seguridad

**Opción A: Graceful (Recomendada)** - Da tiempo al proceso para limpiar:

```bash
# Paso 1: Señal SIGTERM (graceful shutdown)
docker stop kke-container
# Espera 10 segundos (timeout por defecto), luego SIGKILL si no responde

# Paso 2: Eliminación segura del filesystem
docker rm kke-container
```

**Opción B: Force (Emergencias)** - Inmediato, riesgo de corrupción de datos:

```bash
# SIGKILL inmediato + eliminación en un comando
# ⚠️ Solo usar si el contenedor está stuck o no tiene datos importantes
docker rm -f kke-container
```

**Ejecución paso a paso**:

```bash
# Intentamos Opción A (mejor práctica)
docker stop kke-container
```

**Salida**:

```
kke-container
```

```bash
# Verificamos que está detenido
docker ps -a | grep kke-container
```

**Salida**:

```
c7f1445197d7   busybox   "tail -f /dev/null"   3 weeks ago   Exited (137) 2 seconds ago   kke-container
```

```bash
# Ahora sí, eliminación segura
docker rm kke-container
```

**Salida**:

```
kke-container
```

### Fase 4: Verificación y Limpieza Post-Eliminación

```bash
# Confirmación de eliminación
docker ps -a | grep kke-container
# Sin resultados = éxito

# Reporte de recursos liberados
docker system df
```

**Salida esperada**:

```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          1         0         4.425MB   4.425MB (100%)
Containers      0         0         0B        0B
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B
```

**Análisis**: 0 contenedores = sistema limpio. La imagen busybox aún existe (reclaimable) pero no ocupa espacio activo.

### Fase 5: Limpieza Opcional (Avanzado)

```bash
# Si queremos liberar TODO el espacio no usado:
docker system prune -f
# Elimina: contenedores detenidos, redes no usadas, imágenes dangling, cache de build

# Para limpiar específicamente imágenes no referenciadas:
docker image prune -a -f
```

---

## 📊 Checklist de Producción

### Pre-Eliminación (Investigación)

- [x] Contenedor identificado en inventario completo (`docker ps -a`)
- [x] Metadata revisada (`docker inspect`) - ¿es seguro eliminar?
- [x] Estado verificado: "Up" (requiere stop primero) o "Exited" (listo para rm)
- [x] **NO** tiene volúmenes montados con datos importantes
- [x] **NO** es parte de un servicio crítico (verificar con equipo)

### Eliminación

- [x] Contenedor detenido gracefulmente (`docker stop`)
- [x] Eliminación ejecutada (`docker rm`)
- [x] Sin errores de "container is running"

### Post-Eliminación

- [x] Contenedor **NO** aparece en `docker ps -a`
- [x] Búsqueda específica retorna vacío (`docker ps -a | grep nombre`)
- [x] Recursos liberados verificados (`docker system df`)
- [x] Logs del sistema revisados por errores (`journalctl -u docker`)

### Documentación

- [x] Razón de eliminación documentada
- [x] Fecha y responsable registrados
- [x] Proceso automatizable identificado

---

## 🎓 Reflexión Final: From Installer to Engineer

### ¿Por qué no usar `docker rm -f` siempre?

| Aspecto                  | `docker stop + rm`                       | `docker rm -f`            |
| ------------------------ | ---------------------------------------- | ------------------------- |
| **Señal al proceso**     | SIGTERM (15) → 10s → SIGKILL (9)         | SIGKILL (9) inmediato     |
| **Limpieza**             | Permite cerrar conexiones, flush buffers | Terminación abrupta       |
| **Riesgo de corrupción** | Mínimo                                   | Alto si hay I/O activo    |
| **Tiempo**               | 10+ segundos                             | Inmediato                 |
| **Uso recomendado**      | Producción, datos importantes            | Debug, contenedores stuck |

### Anti-Patrón: El "Contenedor Zombie"

**Síntomas**:

- `docker ps -a` muestra cientos de contenedores "Exited"
- Disco se llena inexplicablemente
- `docker system df` muestra GB reclaimable

**Solución sistémica**: Script de limpieza automatizada

```bash
#!/bin/bash
# cleanup-zombies.sh - Ejecutar vía cron semanal

# Eliminar contenedores detenidos de más de 7 días
docker container prune -f --filter "until=168h"

# Eliminar imágenes no usadas
docker image prune -a -f

# Reporte
echo "$(date): Limpieza completada" >> /var/log/docker-cleanup.log
```

### Evolución del Mindset

| Instalador               | Platform Engineer                                                            |
| ------------------------ | ---------------------------------------------------------------------------- |
| "Eliminé el contenedor"  | "Ejecuté procedimiento de decommission con validación de recursos liberados" |
| `docker rm -f` para todo | Evalúo estado y elijo método apropiado                                       |
| Limpieza manual          | Automatización con guardrails y auditoría                                    |
| "Parece que funcionó"    | Métricas verificables post-operación                                         |

### Próximos Pasos

**Nivel Mid**: Docker Compose + `docker-compose down` (limpia todo el stack)  
**Nivel Sr**: Kubernetes + `kubectl delete` + finalizers + graceful termination  
**Staff**: Políticas de retención, cost attribution, garbage collection automático

> **Recuerda**: En infraestructura a escala, la limpieza no es opcional - es operación crítica.

---

## 🚀 Próximos Pasos en el Learning Path

1. **Reto 4**: Operaciones avanzadas - copiar archivos entre host y contenedores
2. **Reto 5**: Troubleshooting completo - diagnóstico de problemas reales
3. **Investigar**:
   - Docker garbage collection strategies
   - Resource quotas y limites preventivos
   - Container retention policies en CI/CD

---

## 📚 Recursos y Referencias

### Comandos de Limpieza

```bash
# Contenedores
docker container prune -f                    # Todos los stopped
docker rm $(docker ps -aq)                   # Fuerza bruta (¡cuidado!)
docker rm $(docker ps -q -f status=exited)   # Solo exited

# Imágenes
docker image prune -f                        # Dangling only
docker image prune -a -f                     # Todas las no usadas

# Sistema completo
docker system prune -f                       # Contenedores, redes, imágenes dangling
docker system prune -a -f --volumes          # TODO incluyendo volúmenes
```

### Documentación

- [Docker rm Reference](https://docs.docker.com/engine/reference/commandline/rm/)
- [Prune Unused Objects](https://docs.docker.com/config/pruning/)
- [Container Lifecycle](https://docs.docker.com/engine/reference/commandline/container/)

### Mejores Prácticas

- [CIS Docker Benchmark - Container Runtime](https://www.cisecurity.org/benchmark/docker)
- [Docker Security - Resource Management](https://docs.docker.com/engine/security/)

---

## 📊 Métricas del Reto

| Métrica            | Valor                | Objetivo          |
| ------------------ | -------------------- | ----------------- |
| Tiempo total       | ~5 min               | < 10 min ✅       |
| Método usado       | Graceful (stop + rm) | Mejor práctica ✅ |
| Recursos liberados | 100%                 | Completo ✅       |
| Errores            | 0                    | Limpio ✅         |
| Verificación       | Multi-step           | Riguroso ✅       |

---

**Reto 3 completado exitosamente** 🎉  
_Fecha: 30-01-2026 | Status: Limpieza ejecutada | Engineer: Platform Engineer Jr._
