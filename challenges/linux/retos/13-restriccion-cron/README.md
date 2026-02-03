---
title: "Reto 13: Restrict Cron Access - xFusionCorp Industries"
category: linux
difficulty: hard
tags:
  - linux
  - ssh
  - user-management
  - security
  - permissions
date: 2025-01-25
status: blocked
---

# Reto 13: Restrict Cron Access - xFusionCorp Industries

## Objetivo del Reto

Restringir acceso a cron para usuarios específicos según políticas de seguridad:

**Restrict cron access to specific users per security policy.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp03 | 172.16.238.12 | stapp03.stratos.xfusioncorp.com | banner | BigGr33n | Cron Security |

## Requisitos Técnicos

- **Archivo control**: /etc/cron.allow y /etc/cron.deny
- **Usuarios permitidos**: root, admin, backup_user
- **Usuarios denegados**: Todos los demás
- **Verificación**: Usuarios no permitidos no pueden crear cron jobs
- **Logging**: Monitorear intentos de acceso no autorizado

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh banner@172.16.238.12
sudo su -

# 2. Verificación actual
ls -la /etc/cron.allow
ls -la /etc/cron.deny

# 3. Crear archivo cron.allow
cat > /etc/cron.allow << 'EOF'
root
admin
backup_user
EOF

# 4. Crear/actualizar archivo cron.deny
cat > /etc/cron.deny << 'EOF'
# Denegar todos los demás usuarios
# Se pueden agregar usuarios específicos si es necesario
EOF

# 5. Establecer permisos seguros
chmod 644 /etc/cron.allow
chmod 644 /etc/cron.deny
chown root:root /etc/cron.allow /etc/cron.deny

# 6. Reiniciar servicio cron
systemctl restart crond

# 7. Verificación
# Como usuario permitido:
su - backup_user
crontab -l

# Como usuario no permitido:
su - regularuser
crontab -e  # Debe fallar con "You (regularuser) are not allowed to use this program"
```

## Resultados Esperados

- Solo usuarios especificados pueden usar cron
- Usuarios no autorizados bloqueados correctamente
- Servicios cron funcionando para usuarios permitidos
- Logs de acceso monitoreados

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*