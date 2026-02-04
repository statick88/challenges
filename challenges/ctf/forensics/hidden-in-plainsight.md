---
title: Hidden in Plainsight
platform: picoCTF
category: forensics
difficulty: easy
tags:
  - ctf
  - forensics
  - steganography
  - steghide
  - metadata
  - base64
  - picoCTF
  - easy
date: 2026-02-04
flag: picoCTF{h1dd3n_1n_1m4g3_2ac27d95}
status: completado
author: Yahaya Meddy
---

# Hidden in Plainsight

## 📋 Descripción

> Se te proporciona una imagen JPG aparentemente ordinaria. Algo está escondido fuera de la vista dentro del archivo. Tu tarea es descubrir el payload oculto y extraer la flag.
>
> Descarga la imagen jpg aquí.

### Pistas
- Descarga la imagen jpg y lee sus metadatos

---

## 🔍 Análisis

El reto sugiere que hay datos ocultos en la imagen. El nombre "Hidden in Plainsight" (Oculto a plena vista) sugiere esteganografía.

### Archivos proporcionados
- `img.jpg` - Imagen JPEG de 640x640 píxeles

---

## 🛠️ Solución

### Paso 1: Analizar metadatos de la imagen

```bash
file img.jpg
```

**Resultado:**
```
img.jpg: JPEG image data, JFIF standard 1.01, ..., comment: "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9"
```

El campo **comment** contiene un string sospechoso en Base64.

### Paso 2: Decodificar el comentario Base64

```bash
echo "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9" | base64 -d
```

**Resultado:**
```
steghide:cEF6endvcmQ=
```

¡Es una pista! Indica que se usó **steghide** y proporciona otra cadena Base64.

### Paso 3: Decodificar la contraseña

```bash
echo "cEF6endvcmQ=" | base64 -d
```

**Resultado:**
```
pAzzword
```

La contraseña para steghide es **pAzzword**.

### Paso 4: Extraer el payload con steghide

```bash
steghide extract -sf img.jpg -p "pAzzword"
```

**Resultado:**
```
wrote extracted data to "output.txt".
```

### Paso 5: Leer la flag

```bash
cat output.txt
```

**Resultado:**
```
picoCTF{h1dd3n_1n_1m4g3_2ac27d95}
```

---

## 🚀 Comando de una línea

```bash
steghide extract -sf img.jpg -p "$(echo 'cEF6endvcmQ=' | base64 -d)" -xf - 2>/dev/null
```

---

## 🔧 Herramientas utilizadas

| Herramienta | Uso |
|-------------|-----|
| `file` | Identificar tipo de archivo y metadatos |
| `base64` | Decodificar strings en Base64 |
| `steghide` | Extraer datos ocultos de imágenes |

### Alternativas para extraer metadatos

```bash
# Con exiftool
exiftool img.jpg | grep -i comment

# Con strings
strings img.jpg | head -5

# Con identify (ImageMagick)
identify -verbose img.jpg | grep -i comment
```

### Instalación de steghide

```bash
# Linux (Debian/Ubuntu)
sudo apt install steghide

# macOS (via Docker)
docker run --rm -v $(pwd):/data dominicbreuker/stego-toolkit \
  steghide extract -sf /data/img.jpg -p "pAzzword"

# Online
# https://futureboy.us/stegano/decinput.html
```

---

## 🎯 Flag

```
picoCTF{h1dd3n_1n_1m4g3_2ac27d95}
```

---

## 📝 Lecciones aprendidas

- **Metadatos JPEG**: El campo "comment" en imágenes JPEG puede contener pistas ocultas
- **Base64 anidado**: A veces se usa Base64 múltiples veces para ofuscar información
- **Steghide**: Herramienta popular para ocultar datos en imágenes JPEG y audio
- **Análisis sistemático**: Siempre revisar metadatos antes de técnicas más complejas
- **Hint en el nombre**: "Hidden in Plainsight" sugiere que la pista está visible pero oculta

---

## 🔗 Conceptos relacionados

- [[steganography-basics]]
- [[steghide-usage]]
- [[base64-encoding]]
- [[jpeg-metadata]]
- [[image-forensics]]

---

## 📊 Estadísticas del reto

| Métrica | Valor |
|---------|-------|
| Tamaño de imagen | 73,504 bytes |
| Dimensiones | 640x640 píxeles |
| Capas de encoding | 2 (Base64 anidado) |
| Tiempo de resolución | ~10 minutos |
