---
title: "Linux Fundamentals - Linux Security"
category: htb
difficulty: easy
tags: [linux, security, hardening, tcp-wrappers, selinux]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 26
---

# Linux Fundamentals - Linux Security

## Objetivo

Conocer las medidas de seguridad fundamentales en Linux: hardening, control de acceso, y best practices.

---

## Best Practices de Seguridad

### Actualizaciones

```bash
# Actualizar sistema
sudo apt update && sudo apt dist-upgrade
```

### SSH Hardening

```bash
# Editar configuración
sudo vim /etc/ssh/sshd_config
```

```
# Deshabilitar login root
PermitRootLogin no

# Solo claves
PasswordAuthentication no

# Usuarios permitidos
AllowUsers usuario1 usuario2
```

### Control de Acceso

- **Principio de mínimo privilegio**
- Usar sudo específico, no sudo completo
- Configurar sudoers granularmente

### fail2ban

```bash
# Instalar
sudo apt install fail2ban

# Configurar
sudo vim /etc/fail2ban/jail.local
```

---

## TCP Wrappers

### Concepto

Control de acceso basado en IP para servicios de red.

### /etc/hosts.allow

```
# Permitir SSH desde red local
sshd : 10.129.14.0/24

# Permitir FTP desde host específico
ftpd : 10.129.14.10

# Permitir Telnet desde dominio
telnetd : .inlanefreight.local
```

### /etc/hosts.deny

```
# Denegar todo desde dominio
ALL : .inlanefreight.com

# Denegar SSH específico
sshd : 10.129.22.22

# Denegar FTP rango
ftpd : 10.129.22.0/24
```

### Orden de Reglas

1. Se procesa `/etc/hosts.allow` primero
2. Luego `/etc/hosts.deny`
3. Primera coincidencia gana

---

## Checklist de Seguridad

### Servicios

- [ ] Remover servicios innecesarios
- [ ] Deshabilitar autenticación sin cifrar
- [ ] Cerrar puertos no usados

### Usuarios

- [ ] Cuentas individuales
- [ ] Contraseñas fuertes
- [ ] Password aging
- [ ] Bloqueo tras fallos

### Sistema

- [ ] NTP habilitado
- [ ] Syslog funcionando
- [ ] SUID/SGID auditados
- [ ] Kernel actualizado

---

## Herramientas de Seguridad

| Herramienta | Uso |
|-------------|-----|
| chkrootkit | Detectar rootkits |
| rkhunter | Scanner de rootkits |
| Lynis | Auditoría de seguridad |
| Snort | IDS/IPS |
| fail2ban | Protección brute force |

---

## SELinux / AppArmor

### SELinux

```bash
# Estado
sestatus

# Modos
sudo setenforce 0  # Permissive
sudo setenforce 1  # Enforcing
```

### AppArmor

```bash
# Estado
aa-status

# Perfiles
ls /etc/apparmor.d/
```

---

## Lecciones Aprendidas

1. **Actualizaciones**: Primera línea de defensa
2. **SSH**: Deshabilitar root y passwords
3. **TCP Wrappers**: Control simple por IP
4. **Mínimo privilegio**: Solo acceso necesario
5. **Auditoría**: Revisar regularmente

---

## Referencias

- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
- [Lynis](https://cisofy.com/lynis/)
- [fail2ban](https://www.fail2ban.org/)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 26 - Linux Security
- Tipo: Teoría
