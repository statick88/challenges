---
title: "Reto 02: Gestión de Grupos nautilus_noc - xFusionCorp Industries"
category: linux
difficulty: medium
tags:
  - linux
  - user-management
  - group-management
  - security
  - xfusioncorp
date: 2025-01-25
status: completed
---

# Reto 02: Gestión de Grupos nautilus_noc - xFusionCorp Industries

## Objetivo del Reto

Implementar control de acceso basado en grupos en todos los servidores App del Stratos Datacenter:

- **a.** Crear grupo `nautilus_noc` en todos los servidores App
- **b.** Agregar usuario `rajesh` al grupo `nautilus_noc` en todos los servidores
- **c.** Si el usuario `rajesh` no existe, crearlo

## Infraestructura Objetivo

| Servidor | IP | Usuario | Contraseña | Propósito |
|----------|----|--------|-------------|-----------|
| stapp01 | 172.16.238.10 | tony/Ir0nM@n | Nautilus App 1 |
| stapp02 | 172.16.238.11 | steve/Am3ric@ | Nautilus App 2 |
| stapp03 | 172.16.238.12 | banner/BigGr33n | Nautilus App 3 |

## Estrategia de Implementación

### Secuencia de Ejecución
1. **stapp01** → **stapp02** → **stapp03**

### Comandos por Servidor

```bash
# 1. Verificación inicial
getent group nautilus_noc
id rajesh

# 2. Creación de grupo (si no existe)
groupadd nautilus_noc

# 3. Creación de usuario (si no existe)
useradd -m -s /bin/bash rajesh
passwd rajesh

# 4. Asignación al grupo
usermod -aG nautilus_noc rajesh

# 5. Verificación final
id rajesh
getent group nautilus_noc
```

## Resultados Esperados

- Grupo `nautilus_noc` con GID consistente en todos los servidores
- Usuario `rajesh` con UID consistente y pertenencia al grupo `nautilus_noc`
- Verificación exitosa en los 3 servidores App

## Estado del Reto

✅ **COMPLETADO** - Implementación exitosa en todos los servidores App del Stratos Datacenter

*Fecha de ejecución: 2025-01-25*

---

## Archivos de Documentación Relacionados

- [[stapp01-implementacion]] - Detalles de implementación en stapp01
- [[stapp02-implementacion]] - Detalles de implementación en stapp02 (pendiente)
- [[stapp03-implementacion]] - Detalles de implementación en stapp03 (pendiente)
- [[resumen-ejecucion]] - Resumen comparativo de los 3 servidores (pendiente)