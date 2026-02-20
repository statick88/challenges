---
title: "Linux Fundamentals - Working with Files and Directories"
category: htb
difficulty: easy
tags: [linux, files, directories, touch, mkdir, mv, cp, ls]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 8
---

# Linux Fundamentals - Working with Files and Directories

## Objetivo

Aprender a crear, mover, copiar y manipular archivos y directorios en Linux. También aprender a identificar archivos por fecha de modificación y obtener información de inodos.

---

## Conexión al Target

```bash
ssh htb-student@10.129.2.219
# Password: HTB_@cademy_stdnt!
```

---

## Preguntas y Soluciones

### Question 1: Last Modified File

**Pregunta:** What is the name of the last modified file in the "/var/backups" directory?

**Solución:**
```bash
ls -lt /var/backups
```

**Output:**
```
total 2160
-rw-r--r-- 1 root root    41872 Nov 12  2020 apt.extended_states.0
-rw-r--r-- 1 root root     4437 Nov 12  2020 apt.extended_states.1.gz
-rw-r--r-- 1 root root   742750 Nov 11  2020 dpkg.status.0
...
```

**Respuesta:** `apt.extended_states.0`

**Explicación:**
- `ls -l` muestra formato largo
- `-t` ordena por tiempo de modificación (más reciente primero)
- El primer archivo listado es el último modificado

---

### Question 2: Inode of shadow.bak

**Pregunta:** What is the inode number of the "shadow.bak" file in the "/var/backups" directory?

**Solución:**
```bash
ls -li /var/backups/shadow.bak
```

**Output:**
```
265293 -rw------- 1 root shadow 1362 Sep 23  2020 /var/backups/shadow.bak
```

**Respuesta:** `265293`

**Explicación:**
- `-i` muestra el inode number como primer campo
- El inode `265293` identifica únicamente este archivo en el filesystem

---

## Conceptos Clave

### Comandos de Gestión de Archivos

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `touch` | Crear archivo vacío | `touch archivo.txt` |
| `mkdir` | Crear directorio | `mkdir documentos` |
| `mkdir -p` | Crear ruta completa | `mkdir -p a/b/c` |
| `mv` | Mover/renombrar | `mv old.txt new.txt` |
| `cp` | Copiar archivo | `cp file.txt backup/` |
| `cp -r` | Copiar directorio | `cp -r dir1 dir2` |
| `rm` | Eliminar archivo | `rm archivo.txt` |
| `rm -r` | Eliminar directorio | `rm -r directorio` |
| `rmdir` | Eliminar dir vacío | `rmdir vacio` |
| `tree` | Ver estructura | `tree .` |

### Opciones de ls para Ordenación

| Opción | Descripción |
|--------|-------------|
| `-t` | Ordenar por tiempo (más reciente primero) |
| `-r` | Orden inverso |
| `-lt` | Listar por tiempo de modificación |
| `-ltr` | Listar por tiempo (más antiguo primero) |
| `-lS` | Listar por tamaño |
| `-lX` | Listar por extensión |

### Directorio /var/backups

El directorio `/var/backups` contiene backups de configuraciones del sistema:
- `shadow.bak` - Backup de contraseñas hasheadas
- `passwd.bak` - Backup de usuarios
- `group.bak` - Backup de grupos
- `apt.extended_states.*` - Estados de paquetes APT
- `dpkg.status.*` - Estados de paquetes dpkg

**⚠️ Nota de seguridad:** Estos archivos son críticos en auditorías y pueden contener información sensible para ataques de cracking de contraseñas.

---

## Ejemplos Prácticos

### Crear Archivos y Directorios
```bash
# Crear archivo vacío
touch info.txt

# Crear directorio
mkdir Storage

# Crear estructura anidada
mkdir -p Storage/local/user/documents
```

### Mover y Renombrar
```bash
# Renombrar archivo
mv info.txt information.txt

# Mover archivo a directorio
mv information.txt Storage/

# Mover múltiples archivos
mv file1.txt file2.txt Storage/
```

### Copiar
```bash
# Copiar archivo
cp original.txt copia.txt

# Copiar a directorio
cp archivo.txt directorio/

# Copiar directorio recursivamente
cp -r origen/ destino/
```

### Eliminar
```bash
# Eliminar archivo
rm archivo.txt

# Eliminar directorio vacío
rmdir directorio_vacio

# Eliminar directorio con contenido
rm -r directorio/

# Eliminar sin confirmación
rm -rf directorio/
```

---

## Lecciones Aprendidas

1. **Ordenación por tiempo:** `ls -lt` es esencial para encontrar archivos recientes
2. **Inodos:** Identifican únicamente archivos en el filesystem
3. **mkdir -p:** Crea directorios padres automáticamente
4. **Backups sensibles:** `/var/backups` puede contener información crítica
5. **rm -rf:** Usar con precaución, elimina sin confirmación

---

## Referencias

- [touch(1) - Linux manual](https://man7.org/linux/man-pages/man1/touch.1.html)
- [mkdir(1) - Linux manual](https://man7.org/linux/man-pages/man1/mkdir.1.html)
- [mv(1) - Linux manual](https://man7.org/linux/man-pages/man1/mv.1.html)
- [cp(1) - Linux manual](https://man7.org/linux/man-pages/man1/cp.1.html)
- [rm(1) - Linux manual](https://man7.org/linux/man-pages/man1/rm.1.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 8 - Working with Files and Directories
- Respuestas correctas: 2/2
