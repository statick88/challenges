---
title: "Reto 03 - Hidden in Image"
category: ctf
difficulty: easy
tags: ["ctf", "forensics", "steganography", "steghide", "picoCTF"]
date: 2025-02-03
status: completed
platform: picoCTF
flag: picoCTF{h1dd3n_1n_pLaIn_51GHT_4370189b}
---

# 🎓 Reto 03 - Hidden in Image

## 🎭 Esteganografía en Imágenes

---

👨‍🏫 **Del Instructor**: La esteganografía es el arte de ocultar información en medios aparentemente inocentes. Como ethical hacker, debes saber detectarla y usarla defensivamente.

> 💭 **Mentalidad de Hacker**: "Las imágenes pueden esconder secretos. No confíes en lo que ves; examina lo invisible."

---

## 🎭 El Escenario: Imagen Sospechosa

Recibiste una imagen JPEG que parece normal, pero sospechas que oculta información. Necesitas extraer el mensaje oculto usando técnicas de esteganografía.

**Tu misión como Ethical Hacker**:

- Analizar la imagen con herramientas de esteganografía
- Intentar extraer datos ocultos con contraseñas comunes
- Descubrir el método de ocultamiento usado

## 🧠 Fundamentos de Esteganografía

La esteganografía oculta data en archivos multimedia modificando bits menos significativos. Herramientas como steghide usan algoritmos LSB (Least Significant Bit).

## 🛠️ Metodología de Investigación Paso a Paso

### Paso 1: Análisis Básico

```bash
file img.jpg
exiftool img.jpg
strings img.jpg | head -20
```

**Análisis**: Verificar tipo de archivo y buscar metadatos o strings obvios.

### Paso 2: Detección de Esteganografía

```bash
steghide info img.jpg
```

**Análisis**: Verificar si la imagen contiene datos ocultos.

> 💡 **Nota técnica**: steghide requiere contraseña si los datos están encriptados.

### Paso 3: Extracción con Contraseñas Comunes

```bash
steghide extract -sf img.jpg -p ""  # Sin contraseña
steghide extract -sf img.jpg -p "password"
steghide extract -sf img.jpg -p "picoCTF"
```

**Análisis**: Probar contraseñas comunes hasta encontrar la correcta.

## ✅ Checklist de Verificación

- [x] Imagen analizada con exiftool
- [x] steghide detectó datos ocultos
- [x] Contraseña correcta encontrada
- [x] Datos extraídos exitosamente

## 🎓 Lo Que Acabas de Aprender

Técnicas básicas de esteganografía: detección, extracción, uso de herramientas como steghide.

**Mentalidad desarrollada**: Curiosidad sobre capas ocultas en archivos multimedia.

## 🚀 Próximos Pasos

1. Aprende otros algoritmos de esteganografía
2. Practica con diferentes tipos de archivos
3. Explora esteganografía en audio y video

## 📚 Recursos

- [Steganography Overview](https://en.wikipedia.org/wiki/Steganography)
- [Steghide Manual](https://steghide.sourceforge.net/documentation.php)

---

## ✅ Estado

**COMPLETADO** 🎉

- 📅 Fecha: 2025-02-03
- ⏱️ Tiempo: 10 minutos
- 🎯 Dificultad: Fácil

# Reto 03 - Hidden in Image

## 📋 Descripción

Imagen JPEG con esteganografía.

## 📁 Archivos

- `img.jpg` - Imagen con datos ocultos
- `output.txt` - Flag extraída

## 🔗 Writeup

Ver: [reto03-steganography.md](../reto03-steganography.md)

## 🏷️ Tags

- `#ctf` `#forensics` `#steganography` `#steghide` `#picoCTF`
