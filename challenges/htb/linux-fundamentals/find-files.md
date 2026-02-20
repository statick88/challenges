---
title: "Linux Fundamentals - Find Files and Directories"
category: htb
difficulty: easy
tags: [linux, find, locate, which, search, files]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 10
quarto: /learning-journey/security/linux-fundamentals/04-find-files.qmd
---

# Linux Fundamentals - Find Files and Directories

## Objetivo

Aprender a buscar archivos y directorios en Linux usando herramientas como `which`, `find` y `locate`. Dominar los filtros de búsqueda por nombre, tamaño, fecha y tipo.

---

## Conexión al Target

```bash
ssh htb-student@10.129.2.219
# Password: HTB_@cademy_stdnt!
```

---

## Preguntas y Soluciones

### Question 1: Config File con Filtros

**Pregunta:** What is the name of the config file that has been created after 2020-03-03 and is smaller than 28k but larger than 25k?

**Solución:**
```bash
find / -type f -name "*.conf" -newermt 2020-03-03 -size +25k -size -28k 2>/dev/null
```

**Output:**
```
/usr/share/drirc.d/00-mesa-defaults.conf
```

**Respuesta:** `00-mesa-defaults.conf`

**Explicación:**
- `-type f` - Buscar solo archivos (no directorios)
- `-name "*.conf"` - Archivos con extensión .conf
- `-newermt 2020-03-03` - Modificados después del 3 de marzo de 2020
- `-size +25k` - Mayores a 25KB
- `-size -28k` - Menores a 28KB
- `2>/dev/null` - Ocultar errores de permisos

---

### Question 2: Contar Archivos .bak

**Pregunta:** How many files exist on the system that have the ".bak" extension?

**Solución:**
```bash
find / -type f -name "*.bak" 2>/dev/null | wc -l
```

**Output:**
```
4
```

**Respuesta:** `4`

**Explicación:**
- `find / -type f -name "*.bak"` - Buscar todos los archivos .bak
- `wc -l` - Contar líneas (cada archivo = una línea)

---

### Question 3: Path del Binary xxd

**Pregunta:** Submit the full path of the "xxd" binary.

**Solución:**
```bash
which xxd
```

**Output:**
```
/usr/bin/xxd
```

**Respuesta:** `/usr/bin/xxd`

**Alternativa:**
```bash
locate xxd | grep bin
```

---

## Conceptos Clave

### Comandos de Búsqueda

| Comando | Descripción | Velocidad |
|---------|-------------|-----------|
| `which` | Ubicar binarios ejecutables | Muy rápido |
| `find` | Búsqueda avanzada con filtros | Lento (escanea FS) |
| `locate` | Búsqueda en base de datos | Muy rápido |
| `whereis` | Buscar binarios, fuentes y man | Rápido |
| `type` | Mostrar tipo de comando | Instantáneo |

### Opciones de find

| Opción | Descripción | Ejemplo |
|--------|-------------|---------|
| `-type f` | Solo archivos | `-type f` |
| `-type d` | Solo directorios | `-type d` |
| `-name` | Patrón de nombre | `-name "*.conf"` |
| `-iname` | Nombre sin case sensitive | `-iname "*.CONF"` |
| `-user` | Por propietario | `-user root` |
| `-group` | Por grupo | `-group admin` |
| `-perm` | Por permisos | `-perm 777` |
| `-size` | Por tamaño | `-size +10M` |
| `-mtime` | Días desde modificación | `-mtime -7` |
| `-newermt` | Fecha específica | `-newermt 2020-03-03` |
| `-exec` | Ejecutar comando | `-exec ls -l {} \;` |

### Operadores de Tamaño

| Sufijo | Significado |
|--------|-------------|
| `b` | Bloques de 512 bytes (default) |
| `c` | Bytes |
| `w` | Words de 2 bytes |
| `k` | Kilobytes (1024 bytes) |
| `M` | Megabytes (1048576 bytes) |
| `G` | Gigabytes |

### Operadores de Tiempo

| Opción | Descripción |
|--------|-------------|
| `-atime` | Tiempo de acceso |
| `-mtime` | Tiempo de modificación |
| `-ctime` | Tiempo de cambio |
| `-amin` | Minutos desde acceso |
| `-mmin` | Minutos desde modificación |
| `-newermt` | Más nuevo que fecha |

---

## Ejemplos Prácticos

### Búsqueda por Nombre
```bash
# Archivos con extensión .conf
find / -name "*.conf" 2>/dev/null

# Directorios llamados "backup"
find / -type d -name "backup" 2>/dev/null

# Archivos que contienen "password" en el nombre
find / -name "*password*" 2>/dev/null
```

### Búsqueda por Permisos
```bash
# Archivos SUID
find / -perm -4000 2>/dev/null

# Archivos escribibles por todos
find / -perm -o+w 2>/dev/null

# Archivos con permisos 777
find / -perm 777 2>/dev/null
```

### Búsqueda por Tamaño
```bash
# Archivos mayores a 100MB
find / -size +100M 2>/dev/null

# Archivos vacíos
find / -type f -empty 2>/dev/null

# Archivos entre 1MB y 10MB
find / -size +1M -size -10M 2>/dev/null
```

### Búsqueda por Usuario
```bash
# Archivos de root
find / -user root 2>/dev/null

# Archivos sin propietario
find / -nouser 2>/dev/null

# Archivos del grupo sudo
find / -group sudo 2>/dev/null
```

### Búsqueda con Ejecución
```bash
# Ejecutar ls -l en cada resultado
find / -name "*.conf" -exec ls -l {} \; 2>/dev/null

# Buscar string en archivos
find / -name "*.log" -exec grep -l "error" {} \; 2>/dev/null

# Eliminar archivos encontrados
find /tmp -name "*.tmp" -exec rm {} \;
```

---

## Diferencias: find vs locate

| Característica | find | locate |
|----------------|------|--------|
| Velocidad | Lento | Muy rápido |
| Base de datos | No usa | Usa DB local |
| Actualización | Tiempo real | Requiere `updatedb` |
| Filtros | Múltiples opciones | Limitado |
| Precisión | 100% | Puede estar desactualizado |
| Uso típico | Búsquedas complejas | Búsquedas rápidas |

---

## Lecciones Aprendidas

1. **find es poderoso:** Permite combinar múltiples filtros
2. **locate es rápido:** Ideal para búsquedas rápidas si la DB está actualizada
3. **which para binarios:** Encuentra rápidamente ejecutables
4. **2>/dev/null:** Esencial para ocultar errores de permisos
5. **Combinar filtros:** `-size +25k -size -28k` crea un rango

---

## Referencias

- [find(1) - Linux manual](https://man7.org/linux/man-pages/man1/find.1.html)
- [locate(1) - Linux manual](https://man7.org/linux/man-pages/man1/locate.1.html)
- [which(1) - Linux manual](https://man7.org/linux/man-pages/man1/which.1.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 10 - Find Files and Directories
- Respuestas correctas: 3/3
