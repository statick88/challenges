---
title: Hidden Confidential Document
platform: picoCTF
category: forensics
difficulty: easy
tags:
  - ctf
  - forensics
  - metadata
  - pdf
  - base64
  - picoCTF
  - easy
date: 2025-02-03
flag: picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
---

# Hidden Confidential Document

## 📋 Descripción

> Hi, intrepid investigator! 📄🔍 You've stumbled upon a peculiar PDF filled with what seems like nothing more than garbled nonsense. But beware! Not everything is as it appears. Amidst the chaos lies a hidden treasure—an elusive flag waiting to be uncovered.
>
> Find the PDF file here Hidden Confidential Document and uncover the flag within the metadata.

### Hints
- Look beyond the surface for hidden clues
- Don't be fooled by the visible text; it's just a decoy!

---

## 🔍 Análisis

El reto indica explícitamente que la flag está en los **metadatos** del PDF y que el texto visible es un señuelo.

### Archivos proporcionados
- `confidential.pdf` - PDF con texto basura como distracción

---

## 🛠️ Solución

### Paso 1: Extraer strings del PDF

```bash
strings confidential.pdf | grep -i author
```

**Output:**
```
/Author (cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0\075)
```

### Paso 2: Identificar el encoding

El campo `Author` contiene un string en **Base64**. El `\075` es el caracter `=` escapado en formato PDF.

### Paso 3: Decodificar Base64

```bash
echo "cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=" | base64 -d
```

**Output:**
```
picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
```

---

## 🚀 One-liner

```bash
strings confidential.pdf | grep -i author | sed 's/.*(\(.*\)).*/\1/' | sed 's/\\075/=/g' | base64 -d
```

---

## 🔧 Herramientas utilizadas

| Herramienta | Uso |
|-------------|-----|
| `strings` | Extraer texto legible del binario |
| `grep` | Filtrar por campo Author |
| `sed` | Limpiar y reemplazar caracteres escapados |
| `base64` | Decodificar el payload |

### Alternativas

```bash
# Con exiftool (si está instalado)
exiftool confidential.pdf | grep -i author

# Con Python
python3 -c "from PyPDF2 import PdfReader; print(PdfReader('confidential.pdf').metadata)"

# Con pdfinfo
pdfinfo confidential.pdf
```

---

## 🎯 Flag

```
picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
```

---

## 📝 Lecciones aprendidas

- Los metadatos de PDFs pueden contener información oculta en campos como Author, Title, Subject, Keywords
- El formato PDF escapa caracteres especiales (ej: `\075` = `=`)
- Siempre verificar encoding Base64 cuando el contenido parece aleatorio pero tiene longitud múltiplo de 4
- `strings` es una herramienta rápida para análisis inicial de binarios

---

## 🔗 Conceptos relacionados

- [[pdf-metadata-forensics]]
- [[base64-encoding]]
- [[strings-command]]
