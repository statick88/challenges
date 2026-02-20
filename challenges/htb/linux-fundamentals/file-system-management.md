---
title: "Linux Fundamentals - File System Management"
category: htb
difficulty: easy
tags: [linux, filesystem, partitions, lsblk, fdisk, disk-management]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 22
quarto: /learning-journey/security/linux-fundamentals/11-file-system-management.qmd
---

# Linux Fundamentals - File System Management

## Objetivo

Aprender a gestionar sistemas de archivos en Linux: entender particiones, dispositivos de bloque, y herramientas para administrar discos.

---

## Preguntas y Soluciones

### Question 1: Count Partitions

**Pregunta:** How many partitions exist in our Pwnbox? (Format: 0)

**Respuesta:** `3`

**Explicación:**
HTB cuenta el disco + sus particiones:
- `sda` - Disco principal (8GB)
- `sda1` - Partición root / (7GB)
- `sda2` - Partición swap (1GB)

```bash
lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0    8G  0 disk 
├─sda1   8:1    0    7G  0 part /
└─sda2   8:2    0    1G  0 part [SWAP]
```

---

## Conceptos Clave

### Dispositivos de Bloque

| Dispositivo | Descripción |
|-------------|-------------|
| `/dev/sda` | Primer disco SATA/SCSI |
| `/dev/sdb` | Segundo disco SATA/SCSI |
| `/dev/nvme0n1` | Primer disco NVMe |
| `/dev/loop0` | Dispositivo loop (imágenes) |

### Nomenclatura de Particiones

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| SATA/SCSI | `sdXN` | sda1, sdb2 |
| NVMe | `nvmeXnYpZ` | nvme0n1p1 |
| virtio | `vdXN` | vda1 |

---

## Herramientas de Gestión

### lsblk - Listar Dispositivos de Bloque

```bash
# Vista básica
lsblk

# Con filesystem info
lsblk -f

# Con tamaño en bytes
lsblk -b

# Output personalizado
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT

# Solo discos
lsblk -d

# JSON output
lsblk -J
```

### fdisk - Gestión de Particiones

```bash
# Listar particiones (requiere sudo)
sudo fdisk -l

# Partición específica
sudo fdisk -l /dev/sda

# Modo interactivo
sudo fdisk /dev/sda
```

### parted - Editor de Particiones

```bash
# Listar particiones
sudo parted -l

# Modo interactivo
sudo parted /dev/sda

# Crear partición GPT
sudo parted /dev/sda mklabel gpt
sudo parted /dev/sda mkpart primary ext4 0% 100%
```

### /proc/partitions

```bash
# Información del kernel sobre particiones
cat /proc/partitions

major minor  #blocks  name
   8        0    8388608 sda
   8        1    7339008 sda1
   8        2    1048576 sda2
```

---

## Tipos de Filesystem

| Filesystem | Uso | Comando |
|------------|-----|---------|
| ext4 | Linux estándar | `mkfs.ext4` |
| xfs | Alto rendimiento | `mkfs.xfs` |
| btrfs | Snapshots, compresión | `mkfs.btrfs` |
| ntfs | Windows | `mkfs.ntfs` |
| vfat | USB, compatibilidad | `mkfs.vfat` |

---

## Operaciones Comunes

### Montar Filesystems

```bash
# Montar partición
sudo mount /dev/sda1 /mnt

# Montar con tipo específico
sudo mount -t ext4 /dev/sda1 /mnt

# Montar imagen ISO
sudo mount -o loop imagen.iso /mnt/iso

# Ver montajes actuales
mount | grep sda

# Desmontar
sudo umount /mnt
```

### Ver Espacio en Disco

```bash
# Uso de disco
df -h

# Tamaño de directorio
du -sh /home

# Inodos
df -i
```

### Crear Filesystem

```bash
# Formatear partición
sudo mkfs.ext4 /dev/sda1

# Con label
sudo mkfs.ext4 -L "datos" /dev/sda1

# Verificar filesystem
sudo e2fsck /dev/sda1
```

---

## UUID y Labels

```bash
# Ver UUIDs
lsblk -f
ls -la /dev/disk/by-uuid/
ls -la /dev/disk/by-partuuid/

# Ver labels
e2label /dev/sda1

# Cambiar label
sudo e2label /dev/sda1 nuevo_nombre

# Montar por UUID
sudo mount UUID="xxx-xxx" /mnt
```

---

## /etc/fstab

```bash
# Configuración de montaje automático
cat /etc/fstab

# Formato
# <device>  <mount>  <type>  <options>  <dump>  <pass>
UUID=xxx-xxx  /mnt    ext4    defaults     0       2

# Montar todo desde fstab
sudo mount -a

# Verificar fstab
sudo findmnt --verify
```

---

## Casos de Uso en Pentesting

### Detectar Discos Ocultos

```bash
# Buscar dispositivos no montados
lsblk -f | grep -v "/"

# Verificar todos los discos
sudo fdisk -l 2>/dev/null | grep "Disk /dev"

# Buscar particiones sin formato
sudo blkid
```

### Montar Recursos Compartidos

```bash
# SMB/CIFS
sudo mount -t cifs //server/share /mnt -o user=username

# NFS
sudo mount -t nfs server:/share /mnt

# SSH (sshfs)
sshfs user@server:/path /mnt
```

---

## Lecciones Aprendidas

1. **lsblk:** Herramienta principal para ver dispositivos de bloque
2. **fdisk/parted:** Requieren sudo para gestión de particiones
3. **/proc/partitions:** Info del kernel sin necesidad de sudo
4. **UUID:** Forma confiable de montar particiones
5. **HTB cuenta disco + particiones:** Interpretación específica del módulo

---

## Referencias

- [lsblk(8) - Linux manual](https://man7.org/linux/man-pages/man8/lsblk.8.html)
- [fdisk(8) - Linux manual](https://man7.org/linux/man-pages/man8/fdisk.8.html)
- [fstab(5) - Linux manual](https://man7.org/linux/man-pages/man5/fstab.5.html)
- [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 22 - File System Management
- Respuestas correctas: 1/1
