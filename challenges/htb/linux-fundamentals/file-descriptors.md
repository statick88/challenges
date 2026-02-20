---
title: "Linux Fundamentals - File Descriptors and Redirections"
category: htb
difficulty: easy
tags: [linux, file-descriptors, redirections, pipes, stdin, stdout, stderr]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 11
quarto: /learning-journey/security/linux-fundamentals/05-file-descriptors.qmd
---

# Linux Fundamentals - File Descriptors and Redirections

## Objetivo

Comprender los descriptores de archivo (STDIN, STDOUT, STDERR) y aprender a redirigir flujos de datos usando operadores de redirección y pipes.

---

## Conexión al Target

```bash
ssh htb-student@10.129.2.219
# Password: HTB_@cademy_stdnt!
```

---

## Preguntas y Soluciones

### Question 1: Contar Archivos .log

**Pregunta:** How many files exist on the system that have the ".log" file extension?

**Solución:**
```bash
find / -type f -name "*.log" 2>/dev/null | wc -l
```

**Output:**
```
32
```

**Respuesta:** `32`

**Explicación:**
- `find / -type f -name "*.log"` - Busca todos los archivos .log
- `2>/dev/null` - Descarta errores de permisos (STDERR)
- `wc -l` - Cuenta el número de líneas (archivos encontrados)

---

### Question 2: Paquetes Instalados

**Pregunta:** How many total packages are installed on the target system?

**Solución:**
```bash
dpkg -l | grep -c "^ii"
```

**Output:**
```
737
```

**Respuesta:** `737`

**Explicación:**
- `dpkg -l` - Lista todos los paquetes conocidos por dpkg
- El estado "ii" significa: primer "i" = instalado, segundo "i" = correctamente instalado
- `grep -c "^ii"` - Cuenta líneas que empiezan con "ii"

**Alternativas incorrectas:**
```bash
dpkg -l | wc -l          # Incorrecto: cuenta headers
dpkg --get-selections    # Cuenta paquetes pero incluye otros estados
```

---

## Conceptos Clave

### File Descriptors

| FD | Nombre | Descripción | Default |
|----|--------|-------------|---------|
| 0 | STDIN | Entrada estándar | Teclado |
| 1 | STDOUT | Salida estándar | Pantalla |
| 2 | STDERR | Salida de errores | Pantalla |

### Operadores de Redirección

| Operador | Función | Ejemplo |
|----------|---------|---------|
| `>` | Redirigir STDOUT (sobrescribe) | `cmd > file.txt` |
| `>>` | Redirigir STDOUT (append) | `cmd >> file.txt` |
| `<` | Redirigir STDIN desde archivo | `cmd < input.txt` |
| `<<` | Here document (input en línea) | `cmd << EOF` |
| `2>` | Redirigir STDERR | `cmd 2> errors.txt` |
| `2>/dev/null` | Descartar STDERR | `cmd 2>/dev/null` |
| `&>` | Redirigir STDOUT y STDERR | `cmd &> all.txt` |
| `|` | Pipe: STDOUT → STDIN | `cmd1 | cmd2` |

---

## Ejemplos Prácticos

### Redirección de STDOUT
```bash
# Guardar salida en archivo (sobrescribe)
find /etc/ -name "*.conf" > results.txt

# Añadir salida a archivo existente
find /etc/ -name "*.conf" >> results.txt
```

### Redirección de STDERR
```bash
# Descartar errores
find /etc/ -name shadow 2>/dev/null

# Guardar errores en archivo
find /etc/ -name shadow 2> errors.txt

# Separar STDOUT y STDERR
find /etc/ -name shadow 2> stderr.txt 1> stdout.txt
```

### Redirección de STDIN
```bash
# Leer desde archivo
cat < archivo.txt

# Here document
cat << EOF > nuevo.txt
Línea 1
Línea 2
EOF
```

### Pipes
```bash
# Filtrar con grep
find /etc/ -name "*.conf" 2>/dev/null | grep systemd

# Contar resultados
find /etc/ -name "*.conf" 2>/dev/null | wc -l

# Múltiples pipes
find /etc/ -name "*.conf" 2>/dev/null | grep systemd | wc -l
```

---

## Estados de Paquetes dpkg

| Estado | Significado |
|--------|-------------|
| `ii` | Instalado correctamente |
| `rc` | Eliminado pero config presente |
| `un` | Desconocido/no instalado |
| `in` | Instalación pendiente |
| `hn` | Half-installed |

### Comandos Útiles para Gestión de Paquetes
```bash
# Listar paquetes instalados
dpkg -l | grep "^ii"

# Buscar paquete específico
dpkg -l | grep nginx

# Ver detalles de paquete
dpkg -s nginx

# Archivos instalados por paquete
dpkg -L nginx
```

---

## Lecciones Aprendidas

1. **File Descriptors:** 0=STDIN, 1=STDOUT, 2=STDERR
2. **2>/dev/null:** Esencial para ocultar errores de permisos
3. **Pipes:** Conectan STDOUT de un comando a STDIN de otro
4. **dpkg -l:** Cuenta headers, usar `grep -c "^ii"` para precisión
5. **Append vs Sobrescribir:** `>>` añade, `>` sobrescribe

---

## Referencias

- [File descriptors - Wikipedia](https://en.wikipedia.org/wiki/File_descriptor)
- [Redirections - Bash Manual](https://www.gnu.org/software/bash/manual/html_node/Redirections.html)
- [dpkg(1) - Linux manual](https://man7.org/linux/man-pages/man1/dpkg.1.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 11 - File Descriptors and Redirections
- Respuestas correctas: 2/2
