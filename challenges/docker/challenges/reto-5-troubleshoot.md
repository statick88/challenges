---
title: "Docker Challenge Reto 5: Troubleshoot Docker Container Issue"
category: docker
difficulty: 4
tags:
  - docker
  - contenedores
  - troubleshooting
  - debugging
  - produccion
date: 30-01-2026
status: completado
---

# 🐳 Docker Challenge Reto 5: Troubleshoot Docker Container Issue

---

## 🎓 Del Instructor

En mis años como **Platform Engineer**, he aprendido que los contenedores fallan en producción por razones que nunca imaginas en desarrollo: OOM killers silenciosos, race conditions en startup, volúmenes que no montan, DNS que no resuelve. Debugging es 50% técnica, 50% metodología.

> 🎯 **Mentalidad DevOps**: "No arregles el síntoma. Entiende la causa raíz. Si no puedes explicar por qué falló, no has terminado de debuggear."

---

## 🎭 Escenario Empresarial

**Contexto**: Es 3 AM. El pagerduty explota. El servicio de autenticación está retornando 502 Bad Gateway. El contenedor muestra "Up" en el dashboard, pero las métricas de latencia están por las nubes. El último deploy fue hace 6 horas y "funcionaba perfecto".

**Tu misión**: Diagnosticar y resolver el problema bajo presión, con SLAs de 99.9% uptime en juego.

**Datos del incidente**:

- **Hora del reporte**: 03:15 AM
- **Impacto**: 15,000 usuarios sin login
- **Último cambio**: Configuración de nginx actualizada ayer
- **Síntomas**: Contenedor running, pero health checks fallando

**Infraestructura**:

- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Stack**: nginx + backend API en contenedores separados

---

## 🧠 Arquitectura: El Ecosistema de Debugging

### El Stack de Observabilidad

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA DE APLICACIÓN                                         │
│  ├── Health checks (/health, /ready)                        │
│  ├── Application logs (structured JSON)                     │
│  └── Business metrics (prometheus)                          │
├─────────────────────────────────────────────────────────────┤
│  CAPA DE CONTENEDOR                                         │
│  ├── docker logs (stdout/stderr)                            │
│  ├── docker stats (CPU, mem, IO, network)                   │
│  ├── docker inspect (config, state, network)                │
│  └── docker top (procesos internos)                         │
├─────────────────────────────────────────────────────────────┤
│  CAPA DE HOST                                               │
│  ├── systemctl status docker                                │
│  ├── journalctl -u docker                                   │
│  ├── dmesg (OOM killer, kernel issues)                      │
│  └── netstat/ss (conexiones de red)                         │
├─────────────────────────────────────────────────────────────┤
│  CAPA DE INFRAESTRUCTURA                                    │
│  ├── Docker daemon logs                                     │
│  ├── Resource limits (cgroups)                              │
│  └── Network connectivity (DNS, firewalls)                  │
└─────────────────────────────────────────────────────────────┘
```

### Taxonomía de Fallos Docker

| Categoría               | Síntomas                    | Herramientas                             | Frecuencia |
| ----------------------- | --------------------------- | ---------------------------------------- | ---------- |
| **Startup Fail**        | Exited immediatamente       | `docker logs`, `docker inspect`          | 40%        |
| **Runtime Crash**       | Exited después de X tiempo  | `docker logs --tail`, `docker events`    | 25%        |
| **Resource Exhaustion** | OOM, CPU throttling         | `docker stats`, `dmesg`                  | 20%        |
| **Network Issues**      | Timeout, refused connection | `docker network inspect`, `ping`, `curl` | 10%        |
| **Storage Issues**      | I/O errors, full disk       | `docker system df`, `df -h`              | 5%         |

---

## 🛠️ Implementación Profesional

### Fase 1: Triage Inicial (30 segundos)

```bash
# Acceso al servidor
ssh tony@172.16.238.10
sudo su -

# 1. Estado general - ¿Qué está corriendo?
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 2. Todos los contenedores - ¿Alguno falló recientemente?
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}" | head -20

# 3. Uso de recursos - ¿Hay algo consumiendo todo?
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
```

**Qué buscar**:

- Contenedores en "Restarting" o "Exited"
- CPU/memoria anormalmente altos
- Contenedores que acaban de morir (Created X seconds ago)

### Fase 2: Análisis de Logs (El 80% de los problemas están aquí)

```bash
# Logs en tiempo real (follow mode)
docker logs -f nombre_contenedor

# Últimas 100 líneas (crítico si hay mucho tráfico)
docker logs --tail 100 nombre_contenedor

# Logs con timestamps (para correlacionar con incidentes)
docker logs --timestamps nombre_contenedor | tail -50

# Logs de múltiples contenedores (útil para microservicios)
docker logs container1 container2 2>&1 | grep ERROR

# Buscar patrones específicos
docker logs nombre_contenedor 2>&1 | grep -i "error\|exception\|fatal\|panic"
```

**Análisis de log patterns**:

| Pattern              | Significado                | Acción                           |
| -------------------- | -------------------------- | -------------------------------- |
| `connection refused` | Dependencia no lista       | Verificar orden de startup       |
| `OOMKilled`          | Out of memory              | Aumentar memoria o optimizar app |
| `exit code 137`      | SIGKILL (probable OOM)     | `dmesg` para confirmar           |
| `permission denied`  | Problemas de filesystem    | Revisar usuarios y permisos      |
| `no such file`       | Falta archivo o directorio | Validar paths en Dockerfile      |

### Fase 3: Inspección Profunda (Forense)

```bash
# Información completa en JSON
docker inspect nombre_contenedor

# Campos específicos útiles:

# Estado y errores
docker inspect nombre_contenedor --format "
Estado: {{.State.Status}}
Error: {{.State.Error}}
ExitCode: {{.State.ExitCode}}
Started: {{.State.StartedAt}}
Finished: {{.State.FinishedAt}}
OOMKilled: {{.State.OOMKilled}}
"

# Configuración de red
docker inspect nombre_contenedor --format "{{json .NetworkSettings}}" | jq

# Volúmenes montados
docker inspect nombre_contenedor --format "{{json .Mounts}}" | jq

# Variables de entorno (⚠️ puede contener secrets)
docker inspect nombre_contenedor --format "{{json .Config.Env}}" | jq

# Resource limits
docker inspect nombre_contenedor --format "
CPU Limit: {{.HostConfig.CpuQuota}}/{{.HostConfig.CpuPeriod}}
Memory Limit: {{.HostConfig.Memory}}
Memory Swap: {{.HostConfig.MemorySwap}}
"
```

### Fase 4: Debugging Interactivo (Invasivo, pero poderoso)

```bash
# Shell interactivo dentro del contenedor
docker exec -it nombre_contenedor /bin/sh
# o si tiene bash:
docker exec -it nombre_contenedor /bin/bash

# Una vez dentro, herramientas de diagnóstico:
ps aux                    # Procesos en ejecución
netstat -tlnp            # Puertos abiertos
cat /proc/1/status       # Info del proceso init
env | sort               # Variables de entorno
df -h                    # Espacio en disco
free -m                  # Memoria disponible
```

**Instalar herramientas de debug** (si no están disponibles):

```bash
# Para Alpine
docker exec -it nombre_contenedor sh -c "apk add --no-cache curl net-tools procps"

# Para Debian/Ubuntu
docker exec -it nombre_contenedor sh -c "apt-get update && apt-get install -y curl net-tools procps"
```

### Fase 5: Diagnóstico de Red

```bash
# Listar redes
docker network ls

# Inspeccionar red específica
docker network inspect bridge

# Probar conectividad entre contenedores
docker exec -it container1 ping container2

# Probar resolución DNS
docker exec -it container1 nslookup google.com

# Probar endpoints externos
docker exec -it container1 curl -v http://backend-api:8080/health

# Verificar puertos expuestos
docker port nombre_contenedor
```

### Fase 6: Análisis de Eventos del Sistema

```bash
# Eventos Docker en tiempo real
docker events --since 1h

# Eventos filtrados
docker events --filter event=die --filter event=oom

# Historial del sistema (OOM kills)
dmesg | grep -i "killed process\|oom\|out of memory"

# Logs del daemon Docker
journalctl -u docker --since "1 hour ago"
```

### Fase 7: Recuperación y Mitigación

#### Escenario A: Configuración inválida

```bash
# Editar archivo de configuración en caliente
docker cp ./nginx-fixed.conf container:/etc/nginx/nginx.conf

# Recargar nginx sin reiniciar contenedor
docker exec container nginx -s reload
```

#### Escenario B: Recursos agotados

```bash
# Verificar OOM kills
dmesg | grep "Out of memory"

# Reiniciar con más memoria
docker update --memory 1g --memory-swap 1g container

# O recrear con nuevos límites:
docker stop container
docker rm container
docker run -d --memory 1g --name container imagen
```

#### Escenario C: Imagen corrupta / bug en código

```bash
# Crear snapshot antes de cambios (backup forense)
docker commit container_debug nombre_contenedor:debug-$(date +%s)

# Rollback a versión anterior
docker stop container
docker rm container
docker run -d --name container imagen:version-anterior
```

---

## 📊 Checklist de Producción

### Diagnóstico Completo

- [x] Estado de todos los contenedores verificado (`docker ps -a`)
- [x] Uso de recursos analizado (`docker stats`)
- [x] Logs revisados sin errores críticos sin explicación
- [x] Inspección de contenedor problemático completada
- [x] Eventos del sistema Docker revisados

### Debugging Profundo

- [x] Shell interactivo probado en contenedor
- [x] Conectividad de red verificada
- [x] Resolución DNS funcional confirmada
- [x] Procesos internos examinados

### Resolución

- [x] Causa raíz identificada y documentada
- [x] Fix aplicado y verificado
- [x] Rollback plan disponible si el fix falla
- [x] Monitoreo continuo establecido

### Post-Mortem

- [x] Timeline del incidente documentado
- [x] Lecciones aprendidas registradas
- [x] Acciones preventivas identificadas
- [x] Runbook actualizado si aplica

---

## 🎓 Reflexión Final: From Installer to Engineer

### La Metodología SRE de Debugging

```
1. OBSERVAR → 2. ORIENTARSE → 3. DECIDIR → 4. ACTUAR
     ↑___________________________________________↓
```

**Observe**: Recolectar datos sin hacer cambios  
**Orient**: Entender el contexto y posibles causas  
**Decide**: Elegir la hipótesis más probable  
**Act**: Aplicar fix con plan de rollback

### Errores Comunes de Debugging

| Error                    | Por qué es malo                             | Solución                             |
| ------------------------ | ------------------------------------------- | ------------------------------------ |
| Reiniciar sin investigar | Pierdes evidencia del problema              | Inspeccionar primero, actuar después |
| Hacer múltiples cambios  | No sabes qué funcionó                       | Un cambio a la vez, con validación   |
| Ignorar logs             | Los logs tienen la respuesta 80% del tiempo | Leer logs antes de googlear          |
| No documentar            | Repites el mismo debugging en 3 meses       | Documentar causa raíz y fix          |

### Evolución del Mindset

| Instalador              | Platform Engineer                                                        |
| ----------------------- | ------------------------------------------------------------------------ |
| "Reinicié y funcionó"   | "Identifiqué race condition en startup, implementé health check retry"   |
| "No sé por qué falló"   | "OOM kill debido a memory leak en worker, escalé ticket a desarrollo"    |
| "Borré y creé de nuevo" | "Snapshot creado para forense, rollback a versión estable, RCA en curso" |
| Debug por intuición     | Debug sistemático con runbooks y playbooks                               |

### El Runbook de Emergencia

Todo equipo debe tener:

```markdown
## Runbook: Container Health Check Failure

### Síntomas

- Contenedor muestra "Up" pero /health retorna 503
- Latencia P99 > 2000ms

### Checks (en orden)

1. `docker ps` - ¿Está running?
2. `docker logs --tail 50` - ¿Errores de aplicación?
3. `docker stats` - ¿Recursos agotados?
4. `docker exec` - ¿Procesos internos healthy?
5. `docker network inspect` - ¿Conectividad?

### Fixes Comunes

- Out of memory: Escalar a instancia mayor
- Database connection pool: Reiniciar contenedor
- Config desactualizada: `docker cp` nueva config + reload

### Escalación

- Si no se resuelve en 15 min, escalar a On-Call Engineer
```

> **Recuerda**: El mejor debugging es el que nunca tienes que hacer. Observabilidad proactiva > debugging reactivo.

---

## 🚀 Próximos Pasos en el Learning Path

1. **Observabilidad Avanzada**:
   - Prometheus + Grafana para métricas
   - ELK/Loki para logs centralizados
   - Jaeger/Zipkin para distributed tracing

2. **Herramientas de Diagnóstico**:
   - `ctop` - top para contenedores
   - `dive` - analizar capas de imagen
   - `sysdig` - inspección de sistema a nivel de kernel

3. **Conceptos Avanzados**:
   - eBPF para tracing de bajo nivel
   - Service mesh (Istio/Linkerd) para observabilidad de red
   - Chaos engineering (Gremlin/Chaos Monkey)

---

## 📚 Recursos y Referencias

### Comandos de Debugging

```bash
# One-liners útiles:

# Top de contenedores por uso de CPU
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}" | sort -k2 -h

# Contenedores que han reiniciado recientemente
docker ps -a --filter "exited=0" --format "table {{.Names}}\t{{.Status}}"

# Buscar en logs de todos los contenedores
docker ps -q | xargs -I {} docker logs {} 2>&1 | grep ERROR

# Recursos usados por imagen
docker system df -v
```

### Documentación

- [Docker Debugging Guide](https://docs.docker.com/config/daemon/)
- [Docker Troubleshooting](https://docs.docker.com/engine/reference/commandline/logs/)
- [Container Runtime Troubleshooting](https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/)

### Libros y Cursos

- "Site Reliability Engineering" - Google (SRE Book)
- "The Practice of System and Network Administration"
- "Systems Performance: Enterprise and the Cloud"

---

## 📊 Métricas del Reto

| Habilidad             | Dominio                      | Nivel    |
| --------------------- | ---------------------------- | -------- |
| Log analysis          | `docker logs` flags          | ⭐⭐⭐⭐ |
| Container inspection  | `docker inspect` templates   | ⭐⭐⭐⭐ |
| Interactive debugging | `docker exec` workflows      | ⭐⭐⭐   |
| Network diagnostics   | `docker network` + tools     | ⭐⭐⭐   |
| Resource analysis     | `docker stats` + kernel logs | ⭐⭐⭐   |
| Root cause analysis   | Metodología sistemática      | ⭐⭐⭐⭐ |

---

**Reto 5 completado exitosamente** 🎉  
_Fecha: 30-01-2026 | Status: Debugging mastery | Engineer: Platform Engineer Jr._

> _"The art of debugging is figuring out what you really told your computer to do rather than what you thought you told it to do."_ - Andrew Singer
