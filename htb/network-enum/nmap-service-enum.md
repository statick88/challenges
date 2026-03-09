---
title: "HTB Academy - Service Enumeration with Nmap"
category: htb
difficulty: easy
tags: ["nmap", "enumeration", "htb-academy", "service-detection", "banner-grabbing"]
date: 2026-02-20
status: completed
platform: HTB
flag: "HTB{pr0F7pDv3r510nb4nn3r}"
---

# HTB Academy - Service Enumeration with Nmap

## 🎓 Del Instructor: El Arte del Banner Grabbing

En el mundo del Ethical Hacking, la información es poder. Un simple banner puede revelar la versión exacta de un servicio, el sistema operativo, e incluso **flags ocultas** en desafíos CTF.

> 🎯 **Mentalidad de Hacker**: "Nmap es tu navaja suiza, pero a veces necesitas herramientas más específicas. El banner grabbing manual revela lo que los escaneos automatizados pasan por alto."

---

## 🎭 El Escenario: Network Enumeration - Service Detection

**Plataforma**: Hack The Box Academy  
**Módulo**: Network Enumeration with Nmap  
**Sección**: Service Enumeration  
**Target**: 10.129.4.45 (ACADEMY-NMAP-DEFAULT)

### Objetivo

Enumerar todos los puertos y sus servicios. Uno de los servicios contiene el flag.

---

## 🧠 Fundamentos de Análisis: Service Version Detection

### ¿Por qué detectar versiones?

La detección de versiones es crítica para:
- **Vulnerability Assessment**: Identificar CVEs conocidos
- **Exploit Development**: Buscar exploits específicos
- **Source Code Analysis**: Analizar código de versiones específicas
- **OS Fingerprinting**: Determinar el sistema operativo

### Opciones de Nmap para Version Detection

| Opción | Descripción |
|--------|-------------|
| `-sV` | Service version detection |
| `-sV --version-intensity 0-9` | Nivel de intensidad |
| `-sV --version-light` | Modo ligero (intensity 2) |
| `-sV --version-all` | Modo completo (intensity 9) |

### El Problema del Banner Grabbing

Nmap a veces no muestra toda la información del banner. Ejemplo:

```
# Nmap muestra:
31337/tcp open  ftp  ProFTPD

# El banner real contiene:
220 HTB{pr0F7pDv3r510nb4nn3r}
```

---

## 🔍 Metodología de Investigación

### Paso 1: Escaneo Completo de Puertos

```bash
# Escaneo de todos los puertos con detección de versión
sudo nmap 10.129.4.45 -p- -sV
```

**Problema encontrado**: El escaneo completo tomó demasiado tiempo y eventualmente falló con "host timeout".

### Paso 2: Escaneo Dirigido a Puertos Conocidos

```bash
# Escanear solo los puertos detectados previamente
sudo nmap 10.129.4.45 -p 22,80,110,139,143,445,31337 -sV --host-timeout 300s
```

**Resultados:**

```
PORT      STATE SERVICE     VERSION
22/tcp    open  ssh         OpenSSH 7.6p1 Ubuntu 4ubuntu0.7
80/tcp    open  http        Apache httpd 2.4.29 ((Ubuntu))
110/tcp   open  pop3        Dovecot pop3d
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp   open  imap        Dovecot imapd (Ubuntu)
445/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
31337/tcp open  ftp         ProFTPD
```

### Paso 3: Banner Grabbing Manual

```bash
# Banner del FTP (puerto 31337)
nc -nv 10.129.4.45 31337
```

**Output:**
```
220 HTB{pr0F7pDv3r510nb4nn3r}
```

**¡Flag encontrada!**

---

## 🛠️ Arsenal de Herramientas

### Banner Grabbing

```bash
# Usando netcat
nc -nv <IP> <PORT>

# Usando telnet
telnet <IP> <PORT>

# Usando curl (para HTTP)
curl -I http://<IP>

# Usando nmap con packet trace
sudo nmap <IP> -p <PORT> -sV --packet-trace
```

### Verbosidad en Nmap

```bash
# Modo verboso
sudo nmap <IP> -p- -sV -v

# Ver puertos en tiempo real
sudo nmap <IP> -p- -sV -vv

# Stats cada 5 segundos
sudo nmap <IP> -p- -sV --stats-every=5s
```

---

## 📊 Análisis de Servicios Detectados

| Puerto | Servicio | Versión | Vector de Ataque Potencial |
|--------|----------|---------|---------------------------|
| 22 | SSH | OpenSSH 7.6p1 | Brute force, key theft |
| 80 | HTTP | Apache 2.4.29 | Web vulnerabilities |
| 110 | POP3 | Dovecot | Email enumeration |
| 139/445 | SMB | Samba 3.X-4.X | SMB exploits, share enumeration |
| 143 | IMAP | Dovecot | Email enumeration |
| 31337 | FTP | ProFTPD | **Flag en banner** |

---

## ✅ Checklist de Verificación

- [x] Escaneo completo de puertos ejecutado
- [x] Detección de versiones realizada
- [x] Banner grabbing manual ejecutado
- [x] Flag encontrada: HTB{pr0F7pDv3r510nb4nn3r}
- [x] Todos los servicios documentados

---

## 🎓 Lecciones Aprendidas

### Técnicas

1. **Nmap puede perder información** - Siempre verificar con banner grabbing manual
2. **Los banners pueden contener información sensible** - Flags, versiones exactas, configuraciones
3. **El puerto 31337 (Elite)** es común en CTFs para "puertos especiales"
4. **Host timeout** - Aumentar con `--host-timeout` para conexiones lentas

### Mentalidad

1. **Desconfía de los resultados automatizados** - Verifica manualmente
2. **Los puertos no estándar merecen atención especial**
3. **La paciencia en escaneos lentos paga con información completa**

---

## 🚀 Próximos Pasos

1. **Nmap NSE Scripts** - Scripts para enumeración avanzada
2. **SMB Enumeration** - Enumerar shares de Samba
3. **HTTP Enumeration** - Directorios y archivos ocultos
4. **SSH Hardening** - Cómo proteger estos servicios

---

## 📚 Recursos

- [Nmap Service Version Detection](https://nmap.org/book/vscan.html)
- [HTB Academy - Network Enumeration](https://academy.hackthebox.com/module/details/19)
- [Banner Grabbing Techniques](https://www.netcat](http://netcat.sourceforge.net/)

---

## ✅ Estado

**COMPLETADO** 🎉

- 📅 Fecha: 2026-02-20
- ⏱️ Tiempo: 15 minutos
- 🎯 Dificultad: Fácil
- 🚩 Flag: `HTB{pr0F7pDv3r510nb4nn3r}`
- 🎯 Puerto: 31337/tcp (ProFTPD)
