---
title: "Linux Fundamentals - Remote Desktop Protocols"
category: htb
difficulty: easy
tags: [linux, vnc, x11, rdp, remote-desktop]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 25
---

# Linux Fundamentals - Remote Desktop Protocols

## Objetivo

Entender los protocolos de escritorio remoto en Linux: X11, VNC, y sus implicaciones de seguridad.

---

## X Window System (X11)

### Conceptos

- **XServer**: Componente del lado del usuario
- **X11**: Protocolo de red transparente
- **Puertos**: TCP 6000-6009 (display :0 = 6000)

### Características

- Renderizado en cliente local
- Ahorro de tráfico vs VNC/RDP
- **NO cifrado por defecto**

### X11 Forwarding

```bash
# Habilitar en servidor
cat /etc/ssh/sshd_config | grep X11Forwarding
# X11Forwarding yes

# Conectar con forwarding
ssh -X usuario@10.129.14.130 /usr/bin/firefox
```

### Seguridad X11

⚠️ **X11 NO es seguro por defecto**

Vulnerabilidades:
- Datos sin cifrar
- Lectura de ventanas remotas (xwd, xgrabsc)
- CVE-2017-2624, CVE-2017-2625, CVE-2017-2626

---

## XDMCP

### X Display Manager Control Protocol

- **Puerto**: UDP 177
- **Uso**: Gestionar sesiones X Window remotas
- **Seguridad**: ⚠️ Inseguro, vulnerable a MITM

---

## VNC (Virtual Network Computing)

### Conceptos

- Protocolo RFB (Remote Framebuffer)
- Puerto TCP 5900+ (display :1 = 5901)
- Multiplataforma

### Herramientas VNC

| Herramienta | Características |
|-------------|-----------------|
| TigerVNC | Open source, rápido |
| TightVNC | Ligero, compresión |
| RealVNC | Comercial, cifrado |
| UltraVNC | Windows, features |

### Instalación TigerVNC

```bash
# Instalar
sudo apt install xfce4 xfce4-goodies tigervnc-standalone-server -y

# Configurar password
vncpasswd
```

### Configuración

```bash
# Crear archivos
touch ~/.vnc/xstartup ~/.vnc/config

# xstartup
cat <<EOT >> ~/.vnc/xstartup
#!/bin/bash
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
/usr/bin/startxfce4
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
x-window-manager &
EOT

# config
cat <<EOT >> ~/.vnc/config
geometry=1920x1080
dpi=96
EOT

# Permisos
chmod +x ~/.vnc/xstartup
```

### Iniciar VNC

```bash
# Iniciar servidor
vncserver

# Listar sesiones
vncserver -list

# Salida:
# X DISPLAY #     RFB PORT #      PROCESS ID
# :1              5901            79746
```

### Conectar vía SSH Tunnel (seguro)

```bash
# Crear túnel SSH
ssh -L 5901:127.0.0.1:5901 -N -f -l htb-student 10.129.14.130

# Conectar
xtightvncviewer localhost:5901
```

---

## Comparación de Protocolos

| Protocolo | Puerto | Cifrado | Plataforma |
|-----------|--------|---------|------------|
| X11 | 6000+ | No (SSH) | Linux |
| VNC | 5900+ | Opcional | Multi |
| RDP | 3389 | Sí | Windows |
| XDMCP | UDP 177 | No | Linux |

---

## Casos de Uso en Pentesting

### Detectar VNC

```bash
# Escanear puertos VNC
nmap -p 5900-5910 target

# Nmap scripts
nmap --script vnc-info -p 5900 target
```

### Ataques X11

```bash
# Ver displays abiertos
nmap -p 6000-6010 target

# Si X11 sin auth
export DISPLAY=target:0
xwd -root -out screenshot.xwd
```

### Fuerza bruta VNC

```bash
# Con hydra
hydra -P passwords.txt vnc://target
```

---

## Lecciones Aprendidas

1. **X11**: Sin cifrado, usar SSH tunneling
2. **VNC**: Configurar cifrado o túnel SSH
3. **Puertos**: 6000+ (X11), 5900+ (VNC)
4. **Seguridad**: X11 expuesto = captura de pantalla
5. **Enumeración**: Buscar puertos VNC/X11 en targets

---

## Referencias

- [TigerVNC](https://github.com/TigerVNC/tigervnc)
- [X11 Security](https://www.x.org/wiki/Security/)
- [VNC Protocol](https://en.wikipedia.org/wiki/Virtual_Network_Computing)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 25 - Remote Desktop Protocols
- Tipo: Teoría
