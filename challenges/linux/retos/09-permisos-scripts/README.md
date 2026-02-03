---
title: "Reto 09: Script Execution Permissions - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - security
  - permissions
date: 2025-01-25
status: blocked
---

# Reto 09: Script Execution Permissions - xFusionCorp Industries

## Objetivo del Reto

Configurar permisos de ejecución para scripts del sistema:

**Configure proper execution permissions for system scripts.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp03 | 172.16.238.12 | stapp03.stratos.xfusioncorp.com | banner | BigGr33n | Script Management |

## Requisitos Técnicos

- **Scripts en**: /usr/local/scripts/
- **Permisos**: 755 (rwxr-xr-x)
- **Ownership**: root:staff
- **Scripts**: deploy.sh, monitor.sh, backup.sh
- **Ejecución**: Todos los usuarios pueden ejecutar
- **Modificación**: Solo root puede modificar

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh banner@172.16.238.12
sudo su -

# 2. Verificar estado actual
ls -la /usr/local/scripts/
getfacl /usr/local/scripts/*

# 3. Establecer ownership correcto
chown -R root:staff /usr/local/scripts/

# 4. Configurar permisos 755 para scripts
chmod 755 /usr/local/scripts/*.sh

# 5. Verificar permisos específicos
for script in /usr/local/scripts/*.sh; do
    echo "Permisos para $script:"
    ls -la $script
done

# 6. Probar ejecución como usuario regular
su - someuser
/usr/local/scripts/deploy.sh
/usr/local/scripts/monitor.sh
```

## Resultados Esperados

- Scripts con permisos 755 correctamente configurados
- Ownership root:staff establecido
- Ejecución funcional para todos los usuarios
- Seguridad mantenida (solo root puede modificar)

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*