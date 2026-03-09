---
title: "Reto 01 - Hidden Confidential Document"
category: ctf
difficulty: easy
tags: ["ctf", "forensics", "metadata", "pdf", "base64", "picoCTF"]
date: 2025-02-03
status: completed
platform: picoCTF
flag: picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
---

# 🎓 Reto 01 - Hidden Confidential Document

## 🎭 Forense en Metadatos de PDF

---

👨‍🏫 **Del Instructor**: Bienvenido a tu primer laboratorio de análisis forense. Como Ethical Hacker, aprenderás que los archivos pueden esconder información crítica en lugares inesperados.

> 💭 **Mentalidad de Hacker**: "Nada es lo que parece. Los metadatos pueden contener payloads ocultos. Desconfía de todo archivo adjunto."

---

## 🎭 El Escenario: Investigación de Email Sospechoso

Eres analista de seguridad en una empresa que recibió un email phishing con un archivo PDF adjunto. El empleado lo reportó sin abrirlo. Tu misión es analizar el archivo forensemente para encontrar información oculta.

**Tu misión como Ethical Hacker**:

- Examinar metadatos del PDF sin modificar el archivo
- Identificar datos codificados en Base64
- Extraer la información oculta

## 🧠 Fundamentos de Análisis Forense

Los PDFs contienen metadatos extensivos que pueden ser abusados por atacantes. Campos como Author, Creator, Producer pueden contener payloads codificados.

## 🛠️ Metodología de Investigación Paso a Paso

### Paso 1: Análisis Inicial

```bash
file confidential.pdf
md5sum confidential.pdf
```

**Análisis**: Verificar tipo de archivo y hash para integridad.

### Paso 2: Extracción de Metadatos

```bash
exiftool confidential.pdf
```

**Análisis**: Examinar campos de metadatos. Buscar strings sospechosos.

> 💡 **Nota técnica**: Campos con texto alfanumérico largo pueden estar codificados en Base64.

### Paso 3: Decodificación

```bash
strings confidential.pdf | grep Author
echo "cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=" | base64 -d
```

**Análisis**: Extraer y decodificar el payload oculto.

## ✅ Checklist de Verificación

- [x] Archivo identificado como PDF válido
- [x] Metadatos extraídos con exiftool
- [x] Campo Author contiene string Base64
- [x] Flag decodificada correctamente

## 🎓 Lo Que Acabas de Aprender

Aprendiste análisis forense básico: metadatos, codificación Base64, herramientas como exiftool y strings.

**Mentalidad desarrollada**: Desconfianza sistemática hacia archivos adjuntos.

## 🚀 Próximos Pasos

1. Practica con más archivos PDF
2. Aprende otros formatos de codificación
3. Explora esteganografía en imágenes

## 📚 Recursos

- [PDF Metadata Analysis](https://en.wikipedia.org/wiki/Metadata)
- [Base64 Encoding](https://en.wikipedia.org/wiki/Base64)
- [ExifTool Documentation](https://exiftool.org/)

---

## ✅ Estado

**COMPLETADO** 🎉

- 📅 Fecha: 2025-02-03
- ⏱️ Tiempo: 15 minutos
- 🎯 Dificultad: Fácil

# Reto 01 - Hidden Confidential Document

## 📋 Descripción

Documento PDF con flag oculta en metadatos.

## 📁 Archivos

- `confidential.pdf` - Archivo PDF con la flag
- `reto01-writeup.md` - Solución del reto

## 🔗 Writeup

Ver: [reto01-writeup.md](./reto01-writeup.md)

## 🏷️ Tags

- `#ctf` `#forensics` `#metadata` `#pdf` `#base64` `#picoCTF`
