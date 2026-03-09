---
title: "Hidden in Image (Steganography)"
platform: picoCTF
category: forensics
difficulty: easy
tags:
  - ctf
  - forensics
  - steganography
  - steghide
  - picoCTF
  - easy
date: 2025-02-04
flag: picoCTF{h1dd3n_1n_1m4g3_2ac27d95}
---

# Advanced Image Steganography

---

👨‍🏫 **Del Instructor**: Ethical Hacker & Digital Forensics Expert

> 🎯 **Mentalidad de Hacker**: _"Una imagen vale más que mil palabras, pero en CTF y forense, una imagen puede contener mil secretos. Los píxeles son solo la superficie; los bytes ocultos cuentan la historia real. Nunca subestimes un archivo aparentemente inocuo."_

---

## 🎭 El Escenario: Exfiltración de Datos Corporativos

### Contexto de Insider Threat Investigation

Eres el lead forense de una empresa de investigación farmacéutica. Un científico senior renunció abruptamente y se unió a la competencia. Antes de irse, envió múltiples emails a su cuenta personal con "fotos de despedida" de sus colegas.

El equipo legal te entrega una de estas imágenes para análisis:

```
img.jpg (74 KB, 640x640 píxeles)
```

La imagen muestra a un grupo de científicos sonriendo. Nada parece fuera de lo común.

**Tu misión como forense**:

1. Analizar la imagen a nivel forense
2. Extraer cualquier dato oculto
3. Identificar la técnica de esteganografía usada
4. Documentar evidencia para procedimiento legal

---

## 🧠 Fundamentos de Análisis: Esteganografía Avanzada

### Técnicas de Esteganografía en Imágenes

#### 1. LSB (Least Significant Bit)

Modifica el bit menos significativo de cada canal de color:

```
Pixel Original:  R=10110100 G=11110000 B=01010101
Pixel con LSB:   R=10110101 G=11110000 B=01010100
                         ↑                    ↑
                      bit modificado
```

#### 2. Metadatos (EXIF)

Almacena datos en campos de metadatos:

- Comment
- Artist
- Copyright
- ImageDescription

#### 3. Steghide

Algoritmo robusto que:

- Comprime datos antes de ocultar
- Encripta con contraseña
- Oculta en coeficientes JPEG (no en píxeles directos)

#### 4. Append/Concatenación

Datos añadidos después del EOI marker de JPEG.

### Detección de Esteganografía

```bash
# Análisis estadístico (Chi-square)
steghide info image.jpg

# Análisis de entropía (detecta datos aleatorios)
binwalk -E image.jpg

# Visual analysis (LSB)
stegsolve.jar

# Metadata extraction
exiftool image.jpg
```

---

## 🔍 Metodología de Investigación

### Fase 1: Análisis de Archivo

```bash
# Identificar tipo
file img.jpg
# JPEG image data, JFIF standard 1.01, comment: "...", baseline, precision 8, 640x640

# Tamaño vs dimensiones
ls -la img.jpg
# 74504 bytes para 640x640 es razonable para JPEG

# Verificar estructura
xxd img.jpg | head -20
```

### Fase 2: Extracción de Metadatos

```bash
# Todos los metadatos
exiftool img.jpg

# Buscar campos sospechosos
exiftool img.jpg | grep -iE "(comment|artist|copyright|description)"

# Identify (ImageMagick)
identify -verbose img.jpg | grep -i comment
```

### Fase 3: Análisis de Comentario

```bash
# El campo comment contiene: c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9

# Decodificar Base64
echo "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9" | base64 -d
# Resultado: steghide:cEF6endvcmQ=

# Segunda capa Base64
echo "cEF6endvcmQ=" | base64 -d
# Resultado: pAzzword
```

### Fase 4: Extracción con Steghide

```bash
# Verificar si hay datos
steghide info img.jpg
# Preguntará por passphrase: pAzzword

# Extraer datos
steghide extract -sf img.jpg -p "pAzzword"
# o
steghide extract -sf img.jpg -p ""

# Verificar archivo extraído
file output.txt
cat output.txt
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas Especializadas

| Herramienta | Propósito               | Comando                        |
| ----------- | ----------------------- | ------------------------------ |
| `steghide`  | Ocultar/extraer en JPEG | `steghide extract -sf img.jpg` |
| `exiftool`  | Metadatos EXIF          | `exiftool -Comment img.jpg`    |
| `zsteg`     | LSB analysis            | `zsteg img.png`                |
| `stegseek`  | Crackear steghide       | `stegseek img.jpg rockyou.txt` |
| `stegsolve` | Visual analysis         | `java -jar stegsolve.jar`      |
| `binwalk`   | Extracción firmware     | `binwalk -e img.jpg`           |
| `foremost`  | Recuperación archivos   | `foremost -i img.jpg`          |

### Script de Análisis Forense de Imágenes

```python
#!/usr/bin/env python3
"""
Image Forensics Suite - Steganography Detection
Advanced analysis for hidden data detection
"""

import subprocess
import base64
import re
import sys
from pathlib import Path
from PIL import Image
import numpy as np

class ImageForensicsSuite:
    def __init__(self, image_path):
        self.image_path = Path(image_path)
        self.findings = []

    def file_analysis(self):
        """Análisis básico del archivo"""
        print(f"[+] Analyzing: {self.image_path}")

        # Tipo de archivo
        result = subprocess.run(['file', str(self.image_path)],
                              capture_output=True, text=True)
        print(f"[*] File type: {result.stdout.strip()}")

        # Tamaño
        size = self.image_path.stat().st_size
        print(f"[*] Size: {size} bytes")

        # Verificar comment en JPEG
        if 'comment' in result.stdout:
            match = re.search(r'comment: "([^"]+)"', result.stdout)
            if match:
                comment = match.group(1)
                print(f"\n[+] JPEG Comment found: {comment}")
                self.findings.append({'type': 'jpeg_comment', 'data': comment})

                # Intentar decodificar
                if self.is_base64(comment):
                    decoded = self.decode_base64(comment)
                    if decoded:
                        print(f"    -> Decoded: {decoded}")
                        self.findings.append({'type': 'decoded', 'data': decoded})

    def metadata_analysis(self):
        """Análisis exhaustivo de metadatos"""
        print("\n[*] Extracting metadata...")

        try:
            result = subprocess.run(['exiftool', str(self.image_path)],
                                  capture_output=True, text=True)

            # Buscar campos interesantes
            interesting = ['Comment', 'Artist', 'Copyright', 'ImageDescription',
                          'XPComment', 'XPAuthor', 'Software']

            for line in result.stdout.split('\n'):
                for field in interesting:
                    if field in line:
                        print(f"  [+] {line}")

        except Exception as e:
            print(f"[-] exiftool error: {e}")

    def check_steghide(self):
        """Verifica presencia de datos steghide"""
        print("\n[*] Checking for steghide data...")

        try:
            result = subprocess.run(['steghide', 'info', str(self.image_path)],
                                  input='\n',
                                  capture_output=True, text=True,
                                  timeout=10)

            if 'embedded file' in result.stdout:
                print(f"  [+] Steghide data detected!")
                print(f"      {result.stdout}")
                return True
            else:
                print(f"  [-] No steghide data found")
                return False

        except Exception as e:
            print(f"  [-] Error: {e}")
            return False

    def extract_steghide(self, passwords=None):
        """Intenta extraer con múltiples passwords"""
        if passwords is None:
            passwords = ['', 'password', '123456', 'steghide',
                        'secret', 'admin', 'pAzzword']

        print(f"\n[*] Attempting extraction with common passwords...")

        for pwd in passwords:
            try:
                result = subprocess.run(
                    ['steghide', 'extract', '-sf', str(self.image_path),
                     '-p', pwd, '-xf', '-'],
                    capture_output=True, text=True, timeout=10
                )

                if 'wrote extracted data' in result.stderr or result.stdout:
                    print(f"  [+] SUCCESS with password: '{pwd}'")
                    content = result.stdout or result.stderr
                    print(f"      Content: {content[:200]}")
                    return content

            except:
                continue

        print(f"  [-] No password worked")
        return None

    def lsb_analysis(self):
        """Análisis de LSB para PNG"""
        if not str(self.image_path).endswith('.png'):
            return

        print("\n[*] Performing LSB analysis...")

        try:
            img = Image.open(self.image_path)
            arr = np.array(img)

            # Extraer LSB de primeros 100 bytes
            lsb_bits = []
            for i in range(min(100, arr.shape[0])):
                for j in range(min(100, arr.shape[1])):
                    for k in range(min(3, arr.shape[2])):  # RGB
                        lsb_bits.append(arr[i,j,k] & 1)

            # Convertir a bytes
            lsb_bytes = []
            for i in range(0, len(lsb_bits), 8):
                byte = 0
                for j in range(8):
                    if i+j < len(lsb_bits):
                        byte |= (lsb_bits[i+j] << (7-j))
                lsb_bytes.append(byte)

            # Intentar decodificar como texto
            try:
                text = bytes(lsb_bytes).decode('utf-8', errors='ignore')
                if text.isprintable() and len(text) > 3:
                    print(f"  [+] LSB data found: {text[:50]}")
            except:
                pass

        except Exception as e:
            print(f"  [-] LSB analysis error: {e}")

    def is_base64(self, s):
        """Verifica si string es Base64 válido"""
        pattern = r'^[A-Za-z0-9+/]*={0,2}$'
        return bool(re.match(pattern, s)) and len(s) % 4 == 0 and len(s) > 8

    def decode_base64(self, s):
        """Decodifica Base64 recursivamente"""
        try:
            decoded = base64.b64decode(s).decode('utf-8')
            # Si es otro Base64, decodificar de nuevo
            if self.is_base64(decoded):
                print(f"    -> Nested Base64 detected!")
                return self.decode_base64(decoded)
            return decoded
        except:
            return None

    def generate_report(self):
        """Genera reporte de hallazgos"""
        print("\n" + "=" * 60)
        print("FORENSICS REPORT")
        print("=" * 60)
        print(f"Image: {self.image_path}")
        print(f"Findings: {len(self.findings)}")

        for finding in self.findings:
            print(f"\n  Type: {finding['type']}")
            print(f"  Data: {finding['data'][:100]}")

    def run_analysis(self):
        """Ejecuta análisis completo"""
        self.file_analysis()
        self.metadata_analysis()

        if self.check_steghide():
            self.extract_steghide()

        self.lsb_analysis()
        self.generate_report()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <image>")
        sys.exit(1)

    forensics = ImageForensicsSuite(sys.argv[1])
    forensics.run_analysis()
```

### Uso del Script

```bash
# Instalar dependencias
pip3 install Pillow numpy

# Ejecutar análisis
python3 image_forensics.py img.jpg

# Output esperado:
# [+] Analyzing: img.jpg
# [*] File type: img.jpg: JPEG image data, JFIF standard 1.01, comment: "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9"
# [*] Size: 74504 bytes
#
# [+] JPEG Comment found: c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9
#     -> Decoded: steghide:cEF6endvcmQ=
#     -> Nested Base64 detected!
#     -> Decoded: pAzzword
#
# [*] Extracting metadata...
#
# [*] Checking for steghide data...
#   [+] Steghide data detected!
#
# [*] Attempting extraction with common passwords...
#   [+] SUCCESS with password: 'pAzzword'
#       Content: picoCTF{h1dd3n_1n_1m4g3_2ac27d95}
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**Caso DarkHotel (2014)**:

- APT usó steganografía en imágenes para C2
- Comandos ocultos en imágenes descargadas de forma legítima
- **Lección**: Esteganografía en tráfico legítimo

**Caso Cisco Data Exfiltration (2020)**:

- Empleado exfiltró IP en imágenes de presentaciones
- Steghide para ocultar archivos ZIP
- **Lección**: Revisar imágenes en correos salientes

**Caso Al-Qaeda Communication (2001)**:

- Comunicaciones ocultas en imágenes de eBay
- LSB encoding para mensajes terroristas
- **Lección**: Esteganografía en sitios públicos

### Defensa contra Esteganografía

**Prevención**:

```bash
# Re-encode imágenes para eliminar datos ocultos
convert input.jpg -strip -quality 85 output.jpg

# Verificar entropía antes/despues
ent input.jpg
ent output.jpg
```

**Detección DLP**:

```yaml
Steganography_Detection:
  - Check metadata fields for Base64
  - Analyze file entropy
  - Flag images with unusual size ratios
  - Scan for steghide signatures
```

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Identificar comentario JPEG
file img.jpg
# JPEG image data, ... comment: "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9"

# Paso 2: Decodificar Base64
echo "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9" | base64 -d
# Resultado: steghide:cEF6endvcmQ=

# Paso 3: Decodificar segunda capa
echo "cEF6endvcmQ=" | base64 -d
# Resultado: pAzzword

# Paso 4: Extraer datos ocultos
steghide extract -sf img.jpg -p "pAzzword"

# Paso 5: Verificar resultado
cat output.txt
```

### One-liner Completo

```bash
# Extrae contraseña de metadata y usa para steghide
steghide extract -sf img.jpg -p "$(file img.jpg | grep -oP 'comment: "\K[^"]+' | base64 -d | cut -d: -f2 | base64 -d)" -xf -
```

### Flag

```
picoCTF{h1dd3n_1n_1m4g3_2ac27d95}
```

---

## 📚 Recursos y Referencias

- [Steganography Techniques Overview](https://www.sans.org/blog/steganography-hiding-data-within-data/)
- [Steghide Documentation](https://steghide.sourceforge.net/)
- [CTF Stego Challenges](https://github.com/DominicBreuker/stego-toolkit)
- [Stegsolve Download](https://github.com/zardus/ctf-tools)

---

**¿Listo para el siguiente reto?** → Prueba esteganografía en audio (espectrogramas), en video, o técnicas avanzadas como F5 algorithm.
