---
title: "Reto 01: Creación de Usuario javed - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - security
  - permissions
date: 2025-01-25
status: completed
---

# Reto 01: Creación de Usuario javed - xFusionCorp Industries

## Objetivo del Reto

Crear un usuario personalizado según especificaciones de seguridad de xFusionCorp Industries:

**a.** Create a user named javed on App server 2 within Stratos Datacenter.
**b.** Assign a unique UID 1467 and designate home directory as /var/www/javed.

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|---------|--------|-------------|-----------|
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Am3ric@ | Nautilus App 2 |

## Requisitos Técnicos

- **Usuario**: javed
- **UID único**: 1467
- **Directorio home**: /var/www/javed
- **Servidor**: App Server 2 (stapp02)
- **Propósito**: Personalizado para aplicación web específica

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh steve@172.16.238.11
sudo su -

# 2. Verificación inicial
id javed
getent passwd javed

# 3. Creación del usuario con UID específico
useradd -u 1467 -d /var/www/javed -m javed

# 4. Establecer contraseña
passwd javed

# 5. Verificación final
id javed
ls -la /var/www/javed
```

## Resultados Esperados

- Usuario javed creado con UID 1467
- Directorio home personalizado en /var/www/javed
- Verificación funcional de acceso y permisos

## Estado del Reto

✅ **COMPLETADO** - Implementación exitosa con UID personalizado

*Fecha de ejecución: 2025-01-25*