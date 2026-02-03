---
title: "Reto 07: Secure Root SSH Access - xFusionCorp Industries"
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

# Reto 07: Secure Root SSH Access - xFusionCorp Industries

## Objetivo del Reto

Configurar acceso SSH seguro para usuario root según políticas de seguridad:

**Configure secure SSH access for root user with key-based authentication.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp01 | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony | Ir0nM@n | SSH Configuration |

## Requisitos Técnicos

- **Autenticación**: Solo clave SSH (desactivar password)
- **Puerto**: Cambiar a puerto 2222
- **Acceso root**: Permitir solo con clave
- **Protocolo**: SSH-2 exclusivamente
- **Seguridad**: Desactivar login directo de usuarios sin clave

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh tony@172.16.238.10
sudo su -

# 2. Backup configuración SSH actual
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 3. Editar configuración SSH
vi /etc/ssh/sshd_config

# Configuraciones clave:
Port 2222
PermitRootLogin without-password
PasswordAuthentication no
PubkeyAuthentication yes
Protocol 2

# 4. Generar clave SSH (si no existe)
ssh-keygen -t rsa -b 4096 -C "root@stapp01"

# 5. Copiar clave pública
mkdir -p /root/.ssh
chmod 700 /root/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2E..." >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

# 6. Reiniciar servicio SSH
systemctl restart sshd

# 7. Verificación
ssh -p 2222 -i /path/to/key root@localhost
```

## Resultados Esperados

- SSH configurado en puerto 2222
- Acceso root solo con clave SSH
- Autenticación por contraseña desactivada
- Conexión verificada con clave

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*