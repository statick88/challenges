---
title: "Hidden Confidential Document"
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

# PDF Metadata Forensics - Document Analysis

---

👨‍🏫 **Del Instructor**: Ethical Hacker & Digital Forensics Expert

> 🎯 **Mentalidad de Hacker**: _"Un documento PDF no es solo lo que ves. Los metadatos son la memoria del archivo: quién lo creó, cuándo, con qué software, y a veces... secretos que el autor olvidó eliminar. Todo archivo cuenta una historia si sabes leer entre los bytes."_

---

## 🎭 El Escenario: Fuga de Información en Documento Confidencial

### Contexto de Investigación Forense

Eres analista forense contratado por una empresa que sospecha de una fuga de información. Un empleado sospechoso envió un PDF aparentemente inocuo - lleno de "texto basura" - justo antes de renunciar.

El departamento legal te entrega el archivo:

```
confidential.pdf
```

Al abrirlo, ves solo texto aleatorio sin sentido. Pero tu instinto de forense te dice que el contenido visible es un señuelo.

**Tu misión como investigador forense**:

1. Analizar la estructura del PDF a nivel binario
2. Extraer y examinar todos los metadatos
3. Identificar cualquier información oculta
4. Documentar la cadena de custodia digital

---

## 🧠 Fundamentos de Análisis: La Anatomía de un PDF

### Estructura Interna de PDF

Los archivos PDF tienen una estructura específica que permite almacenar metadatos de múltiples formas:

```
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

# Metadatos del documento
<<
/Producer (Adobe PDF Library 15.0)
/Creator (Adobe InDesign 15.0)
/Author (John Doe)
/Title (Confidential Document)
/CreationDate (D:20230101120000)
>>
```

**¿Por qué los metadatos son críticos?**

- **Atribución**: Identificar al autor/creador
- **Timeline**: Establecer cronología de eventos
- **Exfiltración**: Datos ocultos en campos inesperados
- **Autenticidad**: Verificar integridad del documento

### Campos de Metadatos Comunes

| Campo        | Descripción         | Riesgo                |
| ------------ | ------------------- | --------------------- |
| Author       | Autor del documento | Identificación        |
| Creator      | Software creador    | Fingerprinting        |
| Producer     | Software generador  | Versiones vulnerables |
| Title        | Título              | Contexto              |
| Subject      | Asunto              | Información interna   |
| Keywords     | Palabras clave      | Tags sensibles        |
| Comment      | Comentarios         | **Datos ocultos**     |
| CreationDate | Fecha creación      | Timeline              |
| ModDate      | Fecha modificación  | Análisis temporal     |

---

## 🔍 Metodología de Investigación

### Fase 1: Análisis de Identificación

```bash
# Verificar tipo de archivo
file confidential.pdf
# confidential.pdf: PDF document, version 1.4

# Verificar integridad con hashes
md5sum confidential.pdf
sha256sum confidential.pdf

# Tamaño del archivo
ls -la confidential.pdf
```

### Fase 2: Extracción de Metadatos

```bash
# Método 1: Usando pdfinfo (Poppler utils)
pdfinfo confidential.pdf

# Método 2: Usando exiftool
exiftool confidential.pdf

# Método 3: Usando strings (análisis binario básico)
strings confidential.pdf | head -30

# Método 4: Extracción con Python (PyPDF2)
python3 << 'EOF'
from PyPDF2 import PdfReader
reader = PdfReader('confidential.pdf')
print(reader.metadata)
EOF
```

### Fase 3: Análisis Forense Avanzado

```bash
# Extraer todo el texto del PDF
pdftotext confidential.pdf -

# Extraer objetos específicos
pdf-parser.py confidential.pdf --object 1

# Buscar patrones sospechosos en binario
strings confidential.pdf | grep -E "(Author|Creator|Producer|Comment|Keywords)"

# Análisis de entropía (detectar datos ocultos)
ent confidential.pdf
```

### Fase 4: Decodificación y Análisis

```bash
# El campo Author contiene: cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0\075

# Nota: \075 es el escape en PDF del carácter '=' (ASCII 75 octal = 61 decimal = '=')

# Limpiar y decodificar
echo "cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=" | base64 -d

# Output: picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas Esenciales

| Herramienta     | Uso                           | Instalación                                                          |
| --------------- | ----------------------------- | -------------------------------------------------------------------- |
| `pdfinfo`       | Metadatos básicos             | `apt install poppler-utils`                                          |
| `exiftool`      | Metadatos exhaustivos         | `apt install libimage-exiftool-perl`                                 |
| `strings`       | Texto legible en binario      | Built-in                                                             |
| `pdf-parser.py` | Análisis de objetos PDF       | [DidierStevens](https://github.com/DidierStevens/DidierStevensSuite) |
| `peepdf`        | Análisis PDF interactivo      | `pip3 install peepdf`                                                |
| `qpdf`          | Manipulación PDF              | `apt install qpdf`                                                   |
| `binwalk`       | Extracción de datos embebidos | `apt install binwalk`                                                |

### Script de Análisis Forense Automatizado

```python
#!/usr/bin/env python3
"""
PDF Forensics Analyzer - Metadata Extraction
For digital forensics investigations
"""

import subprocess
import re
import sys
from pathlib import Path
from PyPDF2 import PdfReader
import base64

class PDFForensicsAnalyzer:
    def __init__(self, pdf_path):
        self.pdf_path = Path(pdf_path)
        self.metadata = {}
        self.suspicious_patterns = []

    def extract_basic_info(self):
        """Extrae información básica del archivo"""
        print(f"[+] Analizando: {self.pdf_path}")
        print(f"[*] Tamaño: {self.pdf_path.stat().st_size} bytes")

        # Verificar tipo
        result = subprocess.run(['file', str(self.pdf_path)],
                              capture_output=True, text=True)
        print(f"[*] Tipo: {result.stdout.strip()}")

    def extract_metadata_pypdf2(self):
        """Extrae metadatos usando PyPDF2"""
        try:
            reader = PdfReader(str(self.pdf_path))
            self.metadata = reader.metadata

            print("\n[+] Metadatos (PyPDF2):")
            for key, value in self.metadata.items():
                print(f"    {key}: {value}")
        except Exception as e:
            print(f"[-] Error con PyPDF2: {e}")

    def extract_metadata_exiftool(self):
        """Extrae metadatos usando exiftool"""
        try:
            result = subprocess.run(
                ['exiftool', str(self.pdf_path)],
                capture_output=True, text=True
            )

            print("\n[+] Metadatos (ExifTool):")
            for line in result.stdout.strip().split('\n')[:20]:
                print(f"    {line}")
        except Exception as e:
            print(f"[-] Error con exiftool: {e}")

    def analyze_strings(self):
        """Analiza strings del PDF"""
        try:
            result = subprocess.run(
                ['strings', str(self.pdf_path)],
                capture_output=True, text=True
            )

            strings_output = result.stdout

            # Buscar campos específicos
            print("\n[+] Campos relevantes encontrados:")

            fields = ['Author', 'Creator', 'Producer', 'Title',
                     'Subject', 'Keywords', 'Comment']

            for field in fields:
                pattern = rf'/{field}\s*\(([^)]+)\)'
                matches = re.findall(pattern, strings_output)
                for match in matches:
                    print(f"    /{field}: {match}")

                    # Verificar si parece Base64
                    if self.is_base64(match):
                        print(f"      -> Posible Base64 detectado")
                        decoded = self.try_decode_base64(match)
                        if decoded:
                            print(f"      -> Decodificado: {decoded}")

        except Exception as e:
            print(f"[-] Error analizando strings: {e}")

    def is_base64(self, s):
        """Verifica si un string parece Base64"""
        # Patrón Base64
        pattern = r'^[A-Za-z0-9+/]*={0,2}$'
        # Limpiar escapes de PDF
        cleaned = s.replace('\\075', '=').replace('\\n', '')
        return bool(re.match(pattern, cleaned)) and len(cleaned) % 4 == 0

    def try_decode_base64(self, s):
        """Intenta decodificar Base64"""
        try:
            # Limpiar escapes de PDF
            cleaned = s.replace('\\075', '=').replace('\\n', '')
            decoded = base64.b64decode(cleaned).decode('utf-8')
            return decoded
        except:
            return None

    def check_suspicious_patterns(self):
        """Busca patrones sospechosos"""
        try:
            result = subprocess.run(
                ['strings', str(self.pdf_path)],
                capture_output=True, text=True
            )

            strings = result.stdout

            # Patrones sospechosos
            patterns = {
                'base64': r'[A-Za-z0-9+/]{40,}={0,2}',
                'emails': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                'urls': r'https?://[^\s<>"{}|\\^`\[\]]+',
                'flags': r'flag\{|ctf\{|picoCTF\{',
            }

            print("\n[+] Patrones sospechosos:")
            for pattern_name, pattern in patterns.items():
                matches = re.findall(pattern, strings)
                if matches:
                    print(f"    {pattern_name}: {len(matches)} encontrados")
                    for match in matches[:3]:
                        print(f"      - {match[:50]}")

        except Exception as e:
            print(f"[-] Error: {e}")

    def generate_report(self):
        """Genera reporte forense"""
        print("\n" + "=" * 60)
        print("REPORTE FORENSE DE PDF")
        print("=" * 60)
        print(f"Archivo: {self.pdf_path}")
        print(f"Hash MD5: ", end='')
        subprocess.run(['md5sum', str(self.pdf_path)])
        print(f"Hash SHA256: ", end='')
        subprocess.run(['sha256sum', str(self.pdf_path)])

    def run_analysis(self):
        """Ejecuta análisis completo"""
        self.extract_basic_info()
        self.extract_metadata_pypdf2()
        self.extract_metadata_exiftool()
        self.analyze_strings()
        self.check_suspicious_patterns()
        self.generate_report()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Uso: {sys.argv[0]} <archivo.pdf>")
        sys.exit(1)

    analyzer = PDFForensicsAnalyzer(sys.argv[1])
    analyzer.run_analysis()
```

### Uso del Script

```bash
# Instalar dependencias
pip3 install PyPDF2

# Ejecutar análisis
python3 pdf_forensics.py confidential.pdf

# Output esperado:
# [+] Analizando: confidential.pdf
# [*] Tamaño: 21453 bytes
# [*] Tipo: confidential.pdf: PDF document, version 1.4
#
# [+] Metadatos (PyPDF2):
#     /Author: cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=
#
# [+] Patrones sospechosos:
#     base64: 1 encontrados
#       - cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**Caso Microsoft Word (2021)**:

- Metadatos en documentos Word revelaban autores internos
- Usado en spear-phishing para legitimidad
- **Lección**: Limpiar metadatos antes de distribución externa

**Caso Panama Papers (2016)**:

- Análisis de metadatos PDF reveló información de fuentes
- PDFs originales rastreados a organizaciones específicas
- **Lección**: Metadatos pueden identificar fuentes

**Caso Apple iPhone (2010)**:

- Geotags en fotos tomadas por iPhone
- Localización precisa de usuarios
- **Lección**: EXIF data es información sensible

### Defensa y Mitigación

**Prevención**:

```bash
# Limpiar metadatos antes de distribución
exiftool -all= document.pdf
qpdf --linearize input.pdf output.pdf  # También limpia metadatos

# Configurar software para no incluir metadatos
# Microsoft Office: File → Info → Check for Issues → Inspect Document
```

**Detección**:

```yaml
DLP_Rules:
  - pattern: "Author:.*[A-Za-z0-9+/]{20,}={0,2}"
    action: block
    description: "Base64 en metadatos"

  - pattern: "Comment:.*flag\{|ctf\{"
    action: alert
    description: "Posible flag en comentarios"
```

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Extraer strings y buscar campo Author
strings confidential.pdf | grep -i author
# Output: /Author (cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0\075)

# Paso 2: Limpiar el string (remover escapes PDF)
# \075 = '=' en octal

# Paso 3: Decodificar Base64
echo "cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=" | base64 -d
```

### One-liner

```bash
strings confidential.pdf | grep -i author | sed 's/.*(\(.*\)).*/\1/' | sed 's/\\075/=/g' | base64 -d
```

### Flag

```
picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
```

---

## 📚 Recursos y Referencias

- [PDF Specification ISO 32000](https://www.iso.org/standard/51502.html)
- [ExifTool PDF Metadata](https://exiftool.org/TagNames/PDF.html)
- [SANS PDF Forensics](https://www.sans.org/blog/pdf-file-format-forensic-analysis/)
- [Didier Stevens PDF Tools](https://github.com/DidierStevens/DidierStevensSuite)

---

**¿Listo para el siguiente reto?** → Prueba análisis de Office documents, imágenes con esteganografía, o análisis de discos.
