---
title: "Linux Fundamentals - Navigation"
category: htb
difficulty: easy
tags: [linux, navigation, ls, cd, inode, hidden-files]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 7
quarto: /learning-journey/security/linux-fundamentals/02-navigation.qmd
---

# Linux Fundamentals - Navigation

## Objetivo

Aprender a navegar por el sistema de archivos Linux, listar contenidos de directorios, identificar archivos ocultos y entender los inodos.

---

## Conexión al Target

```bash
ssh htb-student@10.129.2.219
# Password: HTB_@cademy_stdnt!
```

---

## Preguntas y Soluciones

### Question 1: Hidden History File

**Pregunta:** What is the name of the hidden "history" file in the htb-user's home directory?

**Solución:**
```bash
ls -la ~ | grep history
```

**Output:**
```
-rw------- 1 htb-student htb-student    5 Sep 23  2020 .bash_history
```

**Respuesta:** `.bash_history`

**Explicación:**
- Los archivos ocultos en Linux comienzan con `.` (punto)
- `.bash_history` almacena el historial de comandos del usuario
- La opción `-a` de `ls` muestra archivos ocultos

---

### Question 2: Index Number of sudoers

**Pregunta:** What is the index number of the "sudoers" file in the "/etc" directory?

**Solución:**
```bash
ls -li /etc/sudoers
```

**Output:**
```
147627 -r--r----- 1 root root 755 Jan 18  2018 /etc/sudoers
```

**Respuesta:** `147627`

**Alternativa:**
```bash
stat /etc/sudoers
```

```
  File: /etc/sudoers
  Size: 755       	Blocks: 8          IO Block: 4096   regular file
Device: 801h/2049d	Inode: 147627      Links: 1
```

---

## Conceptos Clave

### Comandos de Navegación

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `pwd` | Print working directory | `pwd` |
| `ls` | List directory contents | `ls -la` |
| `cd` | Change directory | `cd /var/log` |
| `cd -` | Ir al directorio anterior | `cd -` |
| `cd ..` | Ir al directorio padre | `cd ..` |
| `clear` | Limpiar terminal | `clear` |

### Opciones de ls

| Opción | Descripción |
|--------|-------------|
| `-l` | Formato largo (permisos, owner, tamaño, fecha) |
| `-a` | Mostrar archivos ocultos (incluye `.` y `..`) |
| `-h` | Tamaños legibles (KB, MB, GB) |
| `-i` | Mostrar inode number |
| `-R` | Listar recursivamente |

### Inodos (Inodes)

Un **inode** es una estructura de datos que almacena metadatos de un archivo:
- Tipo de archivo
- Permisos
- Owner (UID) y Group (GID)
- Tamaño
- Timestamps (acceso, modificación, cambio)
- Punteros a bloques de datos
- Número de links

El inode se muestra con `ls -li` como el primer campo.

### Archivos Ocultos

Los archivos que comienzan con `.` son ocultos:
- `.bash_history` - Historial de comandos
- `.bashrc` - Configuración de bash
- `.profile` - Script de login
- `.ssh/` - Claves SSH y configuración

---

## Atajos de Teclado

| Atajo | Función |
|-------|---------|
| `Tab` | Auto-completar |
| `Tab Tab` | Mostrar opciones |
| `Ctrl + L` | Limpiar pantalla |
| `Ctrl + R` | Buscar en historial |
| `↑ / ↓` | Navegar historial |
| `Ctrl + C` | Cancelar comando |

---

## Lecciones Aprendidas

1. **Archivos ocultos:** Siempre usar `ls -la` para ver todo el contenido
2. **Inodos:** El inode es el identificador único de un archivo en el filesystem
3. **Navegación:** `cd -` permite alternar entre dos directorios rápidamente
4. **Autocompletar:** Tab es esencial para navegar eficientemente
5. **stat:** Proporciona información detallada de un archivo

---

## Referencias

- [ls(1) - Linux manual page](https://man7.org/linux/man-pages/man1/ls.1.html)
- [inode(7) - Linux manual page](https://man7.org/linux/man-pages/man7/inode.7.html)
- [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 7 - Navigation
- Respuestas correctas: 2/2
