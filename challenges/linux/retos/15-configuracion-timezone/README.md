---
title: "Reto 15: Timezone Alignment - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - cron
  - text-processing
date: 2025-01-25
status: blocked
---

# Reto 15: Timezone Alignment - xFusionCorp Industries

## Objetivo del Reto

Configurar zona horaria consistente en todos los servidores:

**Configure consistent timezone across all servers.**

## Infraestructura Objetivo

| Servidor | IP | Usuario | Contraseña | Zona Horaria Destino |
|----------|----|--------|-------------|-------------------|
| stapp01 | 172.16.238.10 | tony | Ir0nM@n | America/New_York |
| stapp02 | 172.16.238.11 | steve | Am3ric@ | America/New_York |
| stapp03 | 172.16.238.12 | banner | BigGr33n | America/New_York |

## Requisitos Técnicos

- **Timezone objetivo**: America/New_York (UTC-5)
- **Método**: timedatectl o link simbólico
- **Servicios**: Configurar NTP para sincronización
- **Verificación**: date y timedatectl status
- **Persistencia**: Cambio permanente después de reboot

## Estrategia de Implementación

### Comandos Requeridos

```bash
# Para cada servidor (ejemplo en stapp01):
ssh tony@172.16.238.10
sudo su -

# 1. Verificación actual
timedatectl status
date
ls -la /etc/localtime

# 2. Listar timezones disponibles
timedatectl list-timezones | grep America

# 3. Configurar timezone con timedatectl
timedatectl set-timezone America/New_York

# 4. Método alternativo (si timedatectl no disponible)
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# 5. Configurar NTP para sincronización
systemctl enable ntpd
systemctl start ntpd

# 6. Verificación final
timedatectl status
date  # Debe mostrar hora de Nueva York

# 7. Verificación de sincronización NTP
ntpq -p

# Repetir para stapp02 y stapp03
```

## Resultados Esperados

- Todos los servidores con timezone America/New_York
- Sincronización NTP activa y funcionando
- Hora consistente entre todos los servidores
- Cambios persistentes después de reboot

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*