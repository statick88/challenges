---
title: "Linux Fundamentals - Filter Contents"
category: htb
difficulty: easy
tags: [linux, grep, sed, awk, filtering, pipes]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 12
---

# Linux Fundamentals - Filter Contents

## Objetivo

Dominar el filtrado de contenido en Linux: grep, sed, awk, cut, tr, y otras herramientas de procesamiento de texto.

---

## Preguntas y Soluciones

### Question 1: Listening Services

**Pregunta:** How many services are listening on the target system on all interfaces? (Not on localhost and IPv4 only)

**Respuesta:** `7`

**Comando:**
```bash
ss -tlnp | grep -v "127.0.0.1" | grep "LISTEN" | wc -l
```

**Explicación:**
- `ss -tlnp`: Muestra sockets TCP listening con información de procesos
- `grep -v "127.0.0.1"`: Excluye localhost
- `grep "LISTEN"`: Filtra solo conexiones en escucha
- `wc -l`: Cuenta las líneas

---

### Question 2: ProFTPd User

**Pregunta:** Determine what user the ProFTPd server is running under. Submit the username as the answer.

**Respuesta:** `proftpd`

**Comando:**
```bash
ps aux | grep proftpd
```

**Explicación:**
- `ps aux`: Muestra todos los procesos con detalles
- `grep proftpd`: Filtra procesos de ProFTPd
- La primera columna muestra el usuario

---

### Question 3: Unique Paths from Website

**Pregunta:** Use cURL from your Pwnbox (not the target machine) to obtain the source code of the "https://www.inlanefreight.com" website and filter all unique paths of that domain. Submit the number of these paths.

**Respuesta:** `34`

**Comando:**
```bash
curl https://www.inlanefreight.com > htb.txt && cat htb.txt | tr " " "\n" | cut -d"'" -f2 | cut -d'"' -f2 | grep "www.inlanefreight.com" | sort -u | wc -l 2>/dev/null
```

**Explicación:**
1. `curl https://www.inlanefreight.com > htb.txt` - Descarga el HTML a un archivo
2. `tr " " "\n"` - Convierte espacios a nuevas líneas
3. `cut -d"'" -f2` - Extrae contenido entre comillas simples
4. `cut -d'"' -f2` - Extrae contenido entre comillas dobles
5. `grep "www.inlanefreight.com"` - Filtra solo URLs del dominio
6. `sort -u` - Ordena y elimina duplicados
7. `wc -l` - Cuenta líneas únicas

**Nota:** El truco está en convertir espacios a nuevas líneas para separar todos los tokens del HTML, luego extraer el contenido entre comillas.

---

## Herramientas de Filtrado

### more / less - Pagers

```bash
# Ver archivo con paginación
more /etc/passwd
less /etc/passwd

# Navegación:
# [SPACE] - Página siguiente
# [b] - Página anterior
# [q] - Salir
# [/] - Buscar
```

### head / tail

```bash
# Primeras 10 líneas
head /etc/passwd

# Primeras 20 líneas
head -n 20 /etc/passwd

# Últimas 10 líneas
tail /etc/passwd

# Últimas 20 líneas
tail -n 20 /etc/passwd

# Seguir archivo en tiempo real
tail -f /var/log/syslog
```

### sort

```bash
# Ordenar alfabéticamente
sort /etc/passwd

# Ordenar numéricamente
sort -n numeros.txt

# Ordenar inverso
sort -r /etc/passwd

# Ordenar por columna específica
sort -k 3 -n /etc/passwd
```

### grep

```bash
# Buscar patrón
grep "bash" /etc/passwd

# Excluir patrón
grep -v "nologin" /etc/passwd

# Ignorar caso
grep -i "ERROR" /var/log/syslog

# Mostrar números de línea
grep -n "bash" /etc/passwd

# Contar coincidencias
grep -c "bash" /etc/passwd

# Buscar recursivamente
grep -r "password" /etc/

# Expresiones regulares extendidas
grep -E "(bash|sh)" /etc/passwd
```

### cut

```bash
# Cortar por delimitador
cut -d":" -f1 /etc/passwd

# Cortar por posición de caracteres
cut -c 1-10 /etc/passwd

# Múltiples campos
cut -d":" -f1,3,7 /etc/passwd
```

### tr

```bash
# Reemplazar caracteres
cat /etc/passwd | tr ":" " "

# Convertir a minúsculas
cat archivo.txt | tr 'A-Z' 'a-z'

# Eliminar caracteres
cat archivo.txt | tr -d '0-9'

# Comprimir espacios repetidos
cat archivo.txt | tr -s ' '
```

### column

```bash
# Formato tabular
cat /etc/passwd | tr ":" " " | column -t
```

### awk

```bash
# Imprimir campos específicos
awk '{print $1, $NF}' archivo.txt

# Con delimitador
awk -F":" '{print $1}' /etc/passwd

# Condicionales
awk -F":" '$3 >= 1000 {print $1}' /etc/passwd

# Sumar columna
awk '{sum+=$1} END {print sum}' numeros.txt
```

### sed

```bash
# Reemplazar primera ocurrencia
sed 's/old/new/' archivo.txt

# Reemplazar todas las ocurrencias
sed 's/old/new/g' archivo.txt

# Reemplazar en línea específica
sed '2s/old/new/' archivo.txt

# Eliminar líneas
sed '5d' archivo.txt
sed '/patron/d' archivo.txt

# Editar archivo in-place
sed -i 's/old/new/g' archivo.txt
```

### wc

```bash
# Contar líneas
wc -l archivo.txt

# Contar palabras
wc -w archivo.txt

# Contar caracteres
wc -c archivo.txt

# Contar todo
wc archivo.txt
```

---

## Combinaciones Útiles

### Filtrar usuarios con shell bash

```bash
cat /etc/passwd | grep "/bin/bash"
```

### Usuarios sin nologin

```bash
cat /etc/passwd | grep -v "false\|nologin"
```

### Extraer usernames

```bash
cat /etc/passwd | grep -v "false\|nologin" | cut -d":" -f1
```

### Formato tabular

```bash
cat /etc/passwd | grep -v "false\|nologin" | tr ":" " " | column -t
```

### Primero y último campo con awk

```bash
cat /etc/passwd | grep -v "false\|nologin" | tr ":" " " | awk '{print $1, $NF}'
```

### Reemplazar texto con sed

```bash
cat /etc/passwd | grep -v "false\|nologin" | tr ":" " " | awk '{print $1, $NF}' | sed 's/bin/HTB/g'
```

---

## Lecciones Aprendidas

1. **grep**: Filtrar líneas por patrones
2. **cut**: Extraer campos por delimitador
3. **tr**: Transformar/reemplazar caracteres
4. **awk**: Procesamiento avanzado de texto
5. **sed**: Editor de streams para reemplazos
6. **Pipes (|)**: Combinar herramientas poderosamente

---

## Referencias

- [grep(1)](https://man7.org/linux/man-pages/man1/grep.1.html)
- [sed(1)](https://man7.org/linux/man-pages/man1/sed.1.html)
- [awk(1)](https://man7.org/linux/man-pages/man1/awk.1.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 12 - Filter Contents
- Respuestas correctas: 3/3
