---
title: "Linux Fundamentals - Linux Distributions vs Solaris"
category: htb
difficulty: easy
tags: [linux, solaris, unix, comparison]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 29
---

# Linux Fundamentals - Linux Distributions vs Solaris

## Objetivo

Entender las diferencias entre distribuciones Linux y Solaris.

---

## ¿Qué es Solaris?

Solaris es un sistema operativo Unix propietario desarrollado por Sun Microsystems (ahora Oracle):
- **Propósito**: Entornos empresariales críticos
- **Características**: Robustez, escalabilidad, alta disponibilidad
- **Uso**: Banca, finanzas, gobierno, data centers

---

## Diferencias Clave

| Aspecto | Linux | Solaris |
|---------|-------|---------|
| Licencia | Open Source | Propietario |
| Filesystem | ext4, xfs, btrfs | ZFS |
| Service Manager | systemd | SMF |
| Package Manager | apt, yum, dnf | IPS (pkg) |
| Source Code | Público | Cerrado |

---

## Comparación de Comandos

### Información del Sistema

```bash
# Linux
uname -a

# Solaris
showrev -a
```

### Instalación de Paquetes

```bash
# Linux (Ubuntu)
sudo apt-get install apache2

# Solaris
pkgadd -d SUNWapchr
```

### Permisos SUID

```bash
# Linux
find / -perm 4000

# Solaris
find / -perm -4000
```

### NFS

```bash
# Solaris - Compartir
share -F nfs -o rw /export/home

# Linux - Montar NFS
mount -t nfs server:/share /mnt

# Solaris - Montar NFS
mount -F nfs server:/share /mnt
```

### Archivos Abiertos

```bash
# Linux
lsof -c apache2

# Solaris
pfiles `pgrep httpd`
```

### Trace de System Calls

```bash
# Linux
strace -p `pgrep apache2`

# Solaris
truss ls
```

---

## Estructura de Directorios Solaris

| Directorio | Propósito |
|------------|-----------|
| / | Root |
| /bin | Binarios esenciales |
| /boot | Archivos de boot |
| /dev | Archivos de dispositivo |
| /etc | Configuración |
| /home | Directorios usuarios |
| /kernel | Módulos kernel |
| /lib | Bibliotecas |
| /opt | Software opcional |
| /proc | Info del kernel |
| /sbin | Binarios admin |
| /usr | Datos read-only |
| /var | Datos variables |

---

## Características Únicas de Solaris

### ZFS

- Filesystem avanzado
- Snapshots nativos
- Compresión integrada
- Alto rendimiento

### SMF (Service Management Facility)

```bash
# Ver servicios
svcs -a

# Habilitar servicio
svcadm enable servicio

# Deshabilitar
svcadm disable servicio
```

### RBAC

Role-Based Access Control nativo:
- Permisos granulares
- Sin necesidad de sudo tradicional
- Disponible desde Solaris 8

---

## Casos de Uso en Pentesting

### Identificar Solaris

```bash
# Detectar desde nmap
nmap -O target

# Banner grabbing
nc target 22
```

### Explotación

Solaris puede tener:
- Vulnerabilidades específicas
- Versiones de software antiguas
- Configuraciones por defecto diferentes

---

## Lecciones Aprendidas

1. **Solaris**: Unix propietario para empresas
2. **ZFS**: Filesystem avanzado exclusivo
3. **Comandos**: Sintaxis diferente pero similar
4. **RBAC**: Control de acceso nativo
5. **Pentesting**: Identificar OS para exploits correctos

---

## Referencias

- [Oracle Solaris](https://www.oracle.com/solaris/)
- [OpenSolaris](https://www.openindiana.org/)
- [ZFS on Linux](https://zfsonlinux.org/)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 29 - Solaris
- Tipo: Teoría
