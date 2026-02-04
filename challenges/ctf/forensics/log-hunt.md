---
title: Log Hunt
platform: picoCTF
category: forensics
difficulty: easy
tags:
  - ctf
  - forensics
  - logs
  - grep
  - linux
  - picoCTF
  - easy
date: 2026-02-04
flag: picoCTF{us3_y0urlinux_sk1lls_cedfa5fb}
status: completado
author: Yahaya Meddy
---

# Log Hunt

## 📋 Descripción

> Nuestro servidor parece estar filtrando fragmentos de una flag secreta en sus logs. Las partes están dispersas y a veces repetidas. ¿Puedes reconstruir la flag original?
>
> Descarga los logs y descubre la flag completa a partir de los fragmentos.

### Pistas
- Puedes usar `grep` para filtrar solo las líneas que coincidan
- Algunas líneas están duplicadas; ignora las ocurrencias extra

---

## 🔍 Análisis

El reto proporciona un archivo `server.log` con más de 1400 líneas de logs del servidor. Entre los logs normales (INFO, WARN, ERROR, DEBUG) se encuentran fragmentos del flag marcados con `FLAGPART:`.

### Archivos proporcionados
- `server.log` - Archivo de logs del servidor con fragmentos ocultos

### Estructura del log
```
[1990-08-09 10:00:10] INFO FLAGPART: picoCTF{us3_
[1990-08-09 10:00:16] WARN Disk space low
[1990-08-09 10:00:19] DEBUG Cache cleared
...
```

---

## 🛠️ Solución

### Paso 1: Filtrar líneas con fragmentos del flag

```bash
grep "FLAGPART" server.log
```

**Resultado (parcial):**
```
[1990-08-09 10:00:10] INFO FLAGPART: picoCTF{us3_
[1990-08-09 10:02:55] INFO FLAGPART: y0urlinux_
[1990-08-09 10:05:54] INFO FLAGPART: sk1lls_
[1990-08-09 10:10:54] INFO FLAGPART: cedfa5fb}
...
```

### Paso 2: Eliminar duplicados y ordenar

```bash
grep "FLAGPART" server.log | sort -u
```

**Resultado (fragmentos únicos ordenados por timestamp):**
```
[1990-08-09 10:00:10] INFO FLAGPART: picoCTF{us3_
[1990-08-09 10:02:55] INFO FLAGPART: y0urlinux_
[1990-08-09 10:05:54] INFO FLAGPART: sk1lls_
[1990-08-09 10:10:54] INFO FLAGPART: cedfa5fb}
```

### Paso 3: Reconstruir la flag

Concatenando los fragmentos en orden cronológico:

| Orden | Timestamp | Fragmento |
|-------|-----------|-----------|
| 1 | 10:00:10 | `picoCTF{us3_` |
| 2 | 10:02:55 | `y0urlinux_` |
| 3 | 10:05:54 | `sk1lls_` |
| 4 | 10:10:54 | `cedfa5fb}` |

---

## 🚀 Comando de una línea

```bash
grep "FLAGPART" server.log | sort -u | grep -oP 'FLAGPART: \K.*' | tr -d '\n'
```

**Alternativa más simple:**
```bash
grep -oP 'FLAGPART: \K.*' server.log | sort -u | tr -d '\n'
```

---

## 🔧 Herramientas utilizadas

| Herramienta | Uso |
|-------------|-----|
| `grep` | Filtrar líneas que contienen "FLAGPART" |
| `sort -u` | Ordenar y eliminar duplicados |
| `tr -d '\n'` | Concatenar fragmentos sin saltos de línea |

### Alternativas

```bash
# Con awk
awk '/FLAGPART/ && !seen[$0]++ {print}' server.log

# Extraer solo los valores
grep "FLAGPART" server.log | awk -F': ' '{print $2}' | sort -u

# Con uniq (requiere ordenar primero)
grep "FLAGPART" server.log | sort | uniq
```

---

## 🎯 Flag

```
picoCTF{us3_y0urlinux_sk1lls_cedfa5fb}
```

---

## 📝 Lecciones aprendidas

- **Análisis de logs**: Habilidad fundamental en seguridad y administración de sistemas
- **grep**: Herramienta esencial para filtrar texto por patrones
- **sort -u**: Combinación poderosa para eliminar duplicados manteniendo orden
- **Pensamiento lógico**: Los fragmentos deben concatenarse en orden cronológico
- **Ruido en logs**: Los atacantes pueden ocultar información entre logs normales

---

## 🔗 Conceptos relacionados

- [[grep-patterns]]
- [[log-analysis]]
- [[linux-text-processing]]
- [[forensics-fundamentals]]

---

## 📊 Estadísticas del reto

| Métrica | Valor |
|---------|-------|
| Líneas totales en log | ~1400 |
| Fragmentos del flag | 4 únicos |
| Duplicados ignorados | ~23 |
| Tiempo de resolución | < 5 minutos |
