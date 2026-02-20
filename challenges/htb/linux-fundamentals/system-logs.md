---
title: "Linux Fundamentals - System Logs and Monitoring"
category: htb
difficulty: easy
tags: [linux, logs, syslog, monitoring, forensics]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 28
---

# Linux Fundamentals - System Logs and Monitoring

## Objetivo

Dominar el análisis de logs del sistema: tipos, ubicaciones, y herramientas de monitoreo.

---

## Tipos de Logs

### Kernel Logs

```bash
# Ubicación
/var/log/kern.log

# Ver
cat /var/log/kern.log
dmesg
```

Información sobre:
- Drivers de hardware
- Llamadas al sistema
- Eventos del kernel

### System Logs

```bash
# Ubicación
/var/log/syslog

# Ver en tiempo real
tail -f /var/log/syslog
```

Contiene:
- Inicio/detención de servicios
- Eventos del sistema
- Mensajes generales

### Authentication Logs

```bash
# Ubicación
/var/log/auth.log

# Ver intentos fallidos
grep "Failed password" /var/log/auth.log
```

Registra:
- Intentos de login
- Uso de sudo
- Conexiones SSH

### Application Logs

| Servicio | Log |
|----------|-----|
| Apache | `/var/log/apache2/access.log`, `/var/log/apache2/error.log` |
| Nginx | `/var/log/nginx/access.log` |
| MySQL | `/var/log/mysql/error.log` |
| SSH | `/var/log/auth.log` |
| Systemd | `/var/log/journal/` |

### Security Logs

```bash
# fail2ban
/var/log/fail2ban.log

# UFW
/var/log/ufw.log
```

---

## Herramientas de Análisis

### tail / head

```bash
# Últimas líneas
tail -n 50 /var/log/syslog

# Tiempo real
tail -f /var/log/auth.log

# Primeras líneas
head -n 20 /var/log/kern.log
```

### grep

```bash
# Buscar errores
grep -i error /var/log/syslog

# Intentos SSH fallidos
grep "Failed password" /var/log/auth.log

# Contar coincidencias
grep -c "Accepted password" /var/log/auth.log

# Con contexto
grep -C 3 "error" /var/log/syslog
```

### journalctl (systemd)

```bash
# Todos los logs
journalctl

# Por servicio
journalctl -u sshd

# Por prioridad
journalctl -p err

# Tiempo real
journalctl -f

# Desde boot
journalctl -b

# Por tiempo
journalctl --since "2023-02-28 15:00:00"
journalctl --until "2023-02-28 16:00:00"
```

### logrotate

```bash
# Configuración
/etc/logrotate.conf
/etc/logrotate.d/

# Estado
cat /var/lib/logrotate/status

# Forzar rotación
sudo logrotate -f /etc/logrotate.conf
```

---

## Ejemplos de Logs

### syslog

```
Feb 28 2023 15:00:01 server CRON[2715]: (root) CMD (/usr/local/bin/backup.sh)
Feb 28 2023 15:04:22 server sshd[3010]: Failed password for htb-student from 10.14.15.2 port 50223 ssh2
Feb 28 2023 15:06:43 server apache2[2904]: 127.0.0.1 - - "GET /index.html HTTP/1.1" 200 13484
Feb 28 2023 15:07:19 server sshd[3010]: Accepted password for htb-student from 10.14.15.2 port 50223 ssh2
```

### auth.log

```
Feb 28 2023 18:15:01 sshd[5678]: Accepted publickey for admin from 10.14.15.2 port 43210 ssh2
Feb 28 2023 18:15:03 sudo:   admin : TTY=pts/1 ; PWD=/home/admin ; USER=root ; COMMAND=/bin/bash
Feb 28 2023 18:15:12 kernel: [  778.941871] firewall: unexpected traffic allowed on port 22
```

---

## Casos de Uso en Pentesting

### Detectar Actividad Sospechosa

```bash
# Intentos de login fallidos
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr

# Conexiones SSH exitosas
grep "Accepted password" /var/log/auth.log

# Comandos sudo ejecutados
grep "COMMAND" /var/log/auth.log
```

### Acceso a Archivos Sensibles

```bash
# Buscar acceso a archivos específicos
grep "api-keys" /var/log/syslog
```

### Limpiar Huellas

Los attackers pueden:
- Eliminar logs: `rm /var/log/auth.log`
- Limpiar entradas: `sed -i '/IP/d' /var/log/auth.log`
- Detener logging: `systemctl stop rsyslog`

---

## Monitoreo en Tiempo Real

```bash
# Múltiples logs
tail -f /var/log/{syslog,auth.log,kern.log}

# Filtrar en tiempo real
tail -f /var/log/syslog | grep --line-buffered "error"
```

---

## Lecciones Aprendidas

1. **auth.log**: Crítico para detectar intrusiones
2. **journalctl**: Herramienta moderna de systemd
3. **grep/awk**: Análisis potente de logs
4. **Persistencia**: logrotate para rotación automática
5. **Forensics**: Los logs cuentan la historia del sistema

---

## Referencias

- [syslog(3)](https://man7.org/linux/man-pages/man3/syslog.3.html)
- [journalctl(1)](https://man7.org/linux/man-pages/man1/journalctl.1.html)
- [logrotate(8)](https://man7.org/linux/man-pages/man8/logrotate.8.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 28 - System Logs and Monitoring
- Tipo: Teoría
