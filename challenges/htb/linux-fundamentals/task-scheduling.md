---
title: "Linux Fundamentals - Task Scheduling"
category: htb
difficulty: easy
tags: [linux, systemd, cron, task-scheduling, timers, dbus]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 18
---

# Linux Fundamentals - Task Scheduling

## Objetivo

Aprender a programar tareas automatizadas en Linux usando systemd timers, cron y entender los tipos de servicios systemd incluyendo los servicios DBus.

---

## Conexión al Target

```bash
ssh htb-student@10.129.2.219
# Password: HTB_@cademy_stdnt!
```

---

## Preguntas y Soluciones

### Question 1: Tipo de Servicio dconf

**Pregunta:** What is the Type of the service of the "dconf.service"?

**Investigación:**
```bash
# El servicio no existe como servicio systemd tradicional
systemctl status dconf.service
# Unit dconf.service could not be found.

# Buscar como servicio DBus
dpkg -L dconf-service | grep service
# /usr/share/dbus-1/services/ca.desrt.dconf.service

# Ver configuración DBus
cat /usr/share/dbus-1/services/ca.desrt.dconf.service
```

**Output:**
```
[D-BUS Service]
Name=ca.desrt.dconf
Exec=/usr/lib/dconf/dconf-service
```

**Respuesta:** `dbus`

**Explicación:**
- dconf es un servicio DBus activado por demanda
- Los servicios DBus se activan automáticamente cuando una aplicación los solicita
- No se gestionan con `systemctl` directamente
- El tipo implícito en systemd para servicios DBus es `dbus`

---

## Conceptos Clave

### Systemd Timers

Los timers de systemd permiten ejecutar tareas en momentos específicos:

```ini
# /etc/systemd/system/mytimer.timer
[Unit]
Description=My Timer

[Timer]
OnBootSec=3min           # 3 minutos después del boot
OnUnitActiveSec=1hour    # Cada hora

[Install]
WantedBy=timers.target
```

```ini
# /etc/systemd/system/mytimer.service
[Unit]
Description=My Service

[Service]
ExecStart=/full/path/to/script.sh

[Install]
WantedBy=multi-user.target
```

### Cron

Formato de crontab:
```
min hora dia-mes mes dia-semana comando
```

```bash
# Ejemplos de crontab
0 */6 * * * /path/to/update.sh      # Cada 6 horas
0 0 1 * * /path/to/monthly.sh       # Primer día del mes
0 0 * * 0 /path/to/weekly.sh        # Domingos a medianoche
0 0 * * 7 /path/to/weekly.sh        # Domingos (alternativo)
```

### Tipos de Servicios Systemd

| Tipo | Descripción |
|------|-------------|
| `simple` | Proceso principal en foreground (default) |
| `forking` | Proceso hace fork y padre termina |
| `oneshot` | Proceso corto que termina |
| `dbus` | Servicio activado por DBus |
| `notify` | Servicio notifica cuando está listo |
| `idle` | Espera a que otros servicios terminen |

### Servicios DBus

Los servicios DBus:
- Se activan bajo demanda
- No aparecen en `systemctl list-units`
- Se definen en `/usr/share/dbus-1/services/`
- El tipo systemd asociado es `dbus`

---

## Ejemplos Prácticos

### Crear Timer Systemd
```bash
# Crear timer
sudo vim /etc/systemd/system/backup.timer

# Crear servicio asociado
sudo vim /etc/systemd/system/backup.service

# Recargar systemd
sudo systemctl daemon-reload

# Activar timer
sudo systemctl enable --now backup.timer

# Ver timers activos
systemctl list-timers
```

### Gestionar Cron
```bash
# Editar crontab
crontab -e

# Ver crontab actual
crontab -l

# Crontab de root
sudo crontab -l

# Ver logs de cron
grep CRON /var/log/syslog
```

---

## Systemd vs Cron

| Aspecto | Systemd | Cron |
|---------|---------|------|
| Configuración | Archivos .timer y .service | Archivo crontab |
| Logs | journalctl | /var/log/syslog |
| Dependencias | Soporta dependencias | No soporta |
| Aleatorio | RandomizedDelaySec | No tiene |
| Persistencia | Persistent= | @reboot |
| Complejidad | Mayor | Menor |

---

## Lecciones Aprendidas

1. **Servicios DBus:** Se activan por demanda, no se gestionan con systemctl
2. **Tipo dbus:** Es el tipo systemd para servicios activados por DBus
3. **Systemd timers:** Más potentes que cron para tareas complejas
4. **Cron:** Más simple para tareas básicas
5. **dconf:** Es un servicio de configuración GNOME activado por DBus

---

## Referencias

- [systemd.timer(5) - Linux manual](https://man7.org/linux/man-pages/man5/systemd.timer.5.html)
- [systemd.service(5) - Linux manual](https://man7.org/linux/man-pages/man5/systemd.service.5.html)
- [crontab(5) - Linux manual](https://man7.org/linux/man-pages/man5/crontab.5.html)
- [dbus-daemon(1) - Linux manual](https://man7.org/linux/man-pages/man1/dbus-daemon.1.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 18 - Task Scheduling
- Respuestas correctas: 1/1
