---
title: "Linux Fundamentals - Network Configuration"
category: htb
difficulty: easy
tags: [linux, networking, ip, ifconfig, dns, firewall]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 24
---

# Linux Fundamentals - Network Configuration

## Objetivo

Dominar la configuración de red en Linux: interfaces, DNS, routing, y herramientas de troubleshooting.

---

## Network Interfaces

### ifconfig (deprecado)

```bash
# Ver interfaces
ifconfig

# Activar interfaz
sudo ifconfig eth0 up

# Asignar IP
sudo ifconfig eth0 192.168.1.2

# Asignar netmask
sudo ifconfig eth0 netmask 255.255.255.0

# Gateway
sudo route add default gw 192.168.1.1 eth0
```

### ip (moderno)

```bash
# Ver interfaces
ip addr
ip a

# Ver links
ip link

# Activar interfaz
sudo ip link set eth0 up

# Asignar IP
sudo ip addr add 192.168.1.2/24 dev eth0

# Eliminar IP
sudo ip addr del 192.168.1.2/24 dev eth0

# Ver rutas
ip route

# Añadir ruta
sudo ip route add default via 192.168.1.1
```

---

## DNS Configuration

### /etc/resolv.conf

```bash
sudo vim /etc/resolv.conf
```

```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

### /etc/network/interfaces (persistente)

```bash
sudo vim /etc/network/interfaces
```

```
auto eth0
iface eth0 inet static
  address 192.168.1.2
  netmask 255.255.255.0
  gateway 192.168.1.1
  dns-nameservers 8.8.8.8 8.8.4.4
```

```bash
sudo systemctl restart networking
```

---

## Network Access Control (NAC)

### Tipos de Control de Acceso

| Tipo | Descripción |
|------|-------------|
| DAC | Discretionary - dueño controla permisos |
| MAC | Mandatory - OS controla permisos |
| RBAC | Role-Based - permisos por roles |

### Herramientas de Seguridad

- **SELinux**: Mandatory Access Control en kernel
- **AppArmor**: MAC basado en perfiles
- **TCP Wrappers**: Control por IP

---

## Troubleshooting

### ping

```bash
# Probar conectividad
ping 8.8.8.8

# Contar paquetes
ping -c 4 8.8.8.8
```

### traceroute

```bash
# Trazar ruta
traceroute www.inlanefreight.com
```

### netstat

```bash
# Ver conexiones activas
netstat -a

# Solo TCP
netstat -at

# Solo UDP
netstat -au

# Con PID
netstat -tulpn
```

### ss (moderno)

```bash
# Ver sockets
ss -a

# TCP listening
ss -tlnp

# Con proceso
ss -tulpn
```

---

## Network Hardening

### SELinux

```bash
# Ver estado
sestatus

# Modo permisivo
sudo setenforce 0

# Modo enforcing
sudo setenforce 1
```

### AppArmor

```bash
# Ver estado
aa-status

# Modo complain
sudo aa-complain /etc/apparmor.d/profile

# Modo enforce
sudo aa-enforce /etc/apparmor.d/profile
```

### TCP Wrappers

```bash
# /etc/hosts.allow
sshd : 10.129.14.0/24

# /etc/hosts.deny
ALL : .inlanefreight.com
```

---

## Comandos de Red Esenciales

| Comando | Uso |
|---------|-----|
| `ip a` | Ver interfaces |
| `ip r` | Ver rutas |
| `ping` | Test conectividad |
| `traceroute` | Ruta de paquetes |
| `ss -tlnp` | Puertos abiertos |
| `dig` | Consultas DNS |
| `nslookup` | Resolver DNS |
| `host` | Info DNS |

---

## Lecciones Aprendidas

1. **ip > ifconfig**: Comando moderno con más features
2. **DNS persistente**: Usar /etc/network/interfaces
3. **ss > netstat**: Reemplazo moderno
4. **NAC**: Múltiples capas de control de acceso
5. **Troubleshooting**: ping → traceroute → netstat/ss

---

## Referencias

- [ip(8) - Linux manual](https://man7.org/linux/man-pages/man8/ip.8.html)
- [ss(8) - Linux manual](https://man7.org/linux/man-pages/man8/ss.8.html)
- [SELinux Wiki](https://selinuxproject.org/)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 24 - Network Configuration
- Tipo: Teoría
