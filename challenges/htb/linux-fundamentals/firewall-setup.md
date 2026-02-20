---
title: "Linux Fundamentals - Firewall Setup"
category: htb
difficulty: easy
tags: [linux, firewall, iptables, netfilter, ufw]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 27
---

# Linux Fundamentals - Firewall Setup

## Objetivo

Configurar firewalls en Linux: iptables, nftables, UFW, y firewalld.

---

## Netfilter Framework

Netfilter es el framework del kernel Linux que permite:
- Filtrado de paquetes
- NAT
- Manipulación de headers

---

## iptables

### Componentes

| Componente | Descripción |
|------------|-------------|
| Tables | Organizar reglas (filter, nat, mangle) |
| Chains | Grupos de reglas (INPUT, OUTPUT, FORWARD) |
| Rules | Criterios y acciones |
| Matches | Criterios de coincidencia |
| Targets | Acciones (ACCEPT, DROP, REJECT) |

### Tablas

| Tabla | Chains | Uso |
|-------|--------|-----|
| filter | INPUT, OUTPUT, FORWARD | Filtrado |
| nat | PREROUTING, POSTROUTING | NAT |
| mangle | PREROUTING, OUTPUT, INPUT, FORWARD, POSTROUTING | Modificar headers |

### Targets

| Target | Acción |
|--------|--------|
| ACCEPT | Permitir paquete |
| DROP | Descartar silenciosamente |
| REJECT | Descartar con error |
| LOG | Registrar en syslog |
| SNAT | Modificar IP origen |
| DNAT | Modificar IP destino |
| MASQUERADE | NAT dinámico |

### Comandos Básicos

```bash
# Listar reglas
sudo iptables -L

# Con números de línea
sudo iptables -L --line-numbers

# Ver todas las tablas
sudo iptables -L -t nat
sudo iptables -L -t mangle

# Añadir regla
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Eliminar regla
sudo iptables -D INPUT 1

# Flush (eliminar todas)
sudo iptables -F
```

### Reglas Comunes

```bash
# Permitir SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Permitir HTTP
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Permitir HTTPS
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Bloquear IP específica
sudo iptables -A INPUT -s 10.129.22.22 -j DROP

# Permitir loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Permitir conexiones establecidas
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Drop por defecto
sudo iptables -P INPUT DROP
```

### Matches

| Match | Uso |
|-------|-----|
| `-p` | Protocolo (tcp, udp, icmp) |
| `--dport` | Puerto destino |
| `--sport` | Puerto origen |
| `-s` | IP origen |
| `-d` | IP destino |
| `-m state` | Estado conexión |
| `-m multiport` | Múltiples puertos |
| `-m string` | Buscar string |

---

## UFW (Uncomplicated Firewall)

```bash
# Estado
sudo ufw status

# Habilitar
sudo ufw enable

# Permitir puerto
sudo ufw allow 22
sudo ufw allow 80/tcp

# Denegar
sudo ufw deny 23

# Por IP
sudo ufw allow from 10.129.14.0/24

# Eliminar regla
sudo ufw delete allow 22

# Reset
sudo ufw reset
```

---

## nftables (Modern)

```bash
# Listar tablas
sudo nft list tables

# Listar reglas
sudo nft list ruleset

# Añadir tabla
sudo nft add table inet filter

# Añadir chain
sudo nft add chain inet filter input { type filter hook input priority 0 \; }

# Añadir regla
sudo nft add rule inet filter input tcp dport 22 accept
```

---

## Persistencia

### iptables-persistent

```bash
# Instalar
sudo apt install iptables-persistent

# Guardar reglas
sudo netfilter-persistent save

# Restaurar
sudo netfilter-persistent reload
```

---

## Casos de Uso en Pentesting

### Enumerar Firewall

```bash
# Ver reglas
sudo iptables -L -n -v

# Ver políticas por defecto
sudo iptables -L | grep Policy
```

### Evitar Detección

```bash
# Regla para drop sin log
sudo iptables -A INPUT -s scanner_ip -j DROP
```

---

## Lecciones Aprendidas

1. **iptables**: Herramienta estándar de firewall
2. **UFW**: Interfaz simple sobre iptables
3. **nftables**: Reemplazo moderno
4. **Persistencia**: iptables-persistent para guardar reglas
5. **Orden**: Las reglas se procesan secuencialmente

---

## Referencias

- [iptables(8)](https://man7.org/linux/man-pages/man8/iptables.8.html)
- [nftables Wiki](https://wiki.nftables.org/)
- [UFW Documentation](https://help.ubuntu.com/community/UFW)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 27 - Firewall Setup
- Tipo: Teoría
