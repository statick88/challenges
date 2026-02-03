---
title: "Reto 17: Process Limit Adjustment - xFusionCorp Industries"
category: linux
difficulty: hard
tags:
  - linux
  - ssh
  - user-management
  - security
  - backup
date: 2025-01-25
status: blocked
---

# Reto 17: Process Limit Adjustment - xFusionCorp Industries

## Objetivo del Reto

Ajustar límites de procesos para usuarios y servicios del sistema:

**Adjust process limits for users and system services.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Am3ric@ | Limits Configuration |

## Requisitos Técnicos

- **Archivos**: /etc/security/limits.conf y /etc/security/limits.d/
- **Límites específicos**: 
  - usuario app_user: soft nproc 1024, hard nproc 2048
  - usuario web_user: soft nofile 4096, hard nofile 8192
  - *: soft nproc 1024 (default)
- **Aplicación**: Inmediata y persistente
- **Verificación**: ulimit -a como usuario específico

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh steve@172.16.238.11
sudo su -

# 2. Verificación de límites actuales
ulimit -a
cat /etc/security/limits.conf

# 3. Backup del archivo original
cp /etc/security/limits.conf /etc/security/limits.conf.backup

# 4. Configurar límites específicos en limits.conf
cat >> /etc/security/limits.conf << 'EOF'

# Application user limits
app_user soft nproc 1024
app_user hard nproc 2048

# Web user limits  
web_user soft nofile 4096
web_user hard nofile 8192

# Default limits for all users
* soft nproc 1024
* hard nproc 2048
EOF

# 5. Alternativa: Crear archivo específico
cat > /etc/security/limits.d/99-app-limits.conf << 'EOF'
app_user soft nproc 1024
app_user hard nproc 2048
web_user soft nofile 4096
web_user hard nofile 8192
EOF

# 6. Configurar límites para servicios systemd
mkdir -p /etc/systemd/system.conf.d
cat > /etc/systemd/system.conf.d/limits.conf << 'EOF'
[Manager]
DefaultLimitNOFILE=65536
DefaultLimitNPROC=32768
EOF

# 7. Reiniciar servicios si es necesario
systemctl daemon-reload

# 8. Verificación
su - app_user -c "ulimit -u"
su - web_user -c "ulimit -n"
```

## Resultados Esperados

- Límites configurados correctamente para usuarios específicos
- Aplicación inmediata de nuevos límites
- Persistencia después de reboot
- Verificación exitosa de límites por usuario

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*