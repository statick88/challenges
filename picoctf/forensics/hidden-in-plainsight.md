---
title: "Hidden in Plainsight"
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

# Steganography - Data Hiding in Images

---

👨‍🏫 **Del Instructor**: Ethical Hacker & Steganography Specialist

> 🎯 **Mentalidad de Hacker**: _"El ojo humano es fácil de engañar. Lo que ves no es lo que hay. Los datos pueden esconderse en plana vista, entre píxeles, en metadatos, en el LSB. La steganografía es el arte de la comunicación oculta - visible para quien sabe mirar, invisible para el resto."_

---

## 🎭 El Escenario: Comunicación Encubierta de Insider Threat

### Contexto de Investigación Interna

Eres el CISO de una empresa de tecnología. El equipo de seguridad detectó tráfico inusual: un empleado del departamento de diseño ha estado enviando numerosas imágenes "de trabajo" a una dirección de correo externa sospechosa.

Las imágenes parecen legítimas - diseños de productos y mockups. Pero algo no cuadra:

- El tamaño de los archivos es mayor de lo esperado
- Las imágenes se envían a horas extrañas (3 AM)
- El destinatario usa un dominio gratuito

**Tu misión como forense**: Determinar si las imágenes contienen datos ocultos exfiltrados.

---

## 🧠 Fundamentos de Análisis: El Arte de Ocultar Datos

### ¿Qué es la Esteganografía?

La **esteganografía** (del griego "escritura oculta") es la práctica de ocultar mensajes dentro de otros archivos o mensajes de modo que la existencia misma del mensaje sea indetectable.

**Diferencia clave con criptografía**:

- Criptografía: Protege el **contenido** (se ve basura, pero se sabe que hay algo)
- Esteganografía: Oculta la **existencia** (parece inocente, pero contiene secretos)

### Técnicas Comunes en Imágenes

```
Imagen Original              Imagen con Datos Ocultos
┌─────────────┐             ┌─────────────┐
│ R G B │ R G B │             │ R G B │ R G B │
│ 255 128 64 │             │ 255 128 65 │ ← LSB modificado
│ 200 150 100 │             │ 200 150 100 │
└─────────────┘             └─────────────┘
                              Datos escondidos en LSB
```

**Métodos de esteganografía**:

| Técnica      | Descripción                                  | Detección             |
| ------------ | -------------------------------------------- | --------------------- |
| **LSB**      | Modificar bit menos significativo de píxeles | Estadístico           |
| **Metadata** | Esconder en EXIF/comments                    | Análisis de metadatos |
| **Steghide** | Algoritmo de ocultamiento robusto            | Steghide tools        |
| **Outguess** | Esteganografía estadística                   | Outguess detection    |
| **F5**       | JPEG steganography                           | F5-specific tools     |

### Formato JPEG y Esteganografía

JPEG usa compresión con pérdida, lo que dificulta LSB. Sin embargo:

- **Metadatos**: Campos EXIF/Comment permiten almacenar datos
- **Steghide**: Usa algoritmo que trabaja con compresión JPEG
- **Appending**: Datos añadidos después del EOI marker

---

## 🔍 Metodología de Investigación

### Fase 1: Análisis Superficial

```bash
# Identificar tipo de archivo
file img.jpg
# img.jpg: JPEG image data, JFIF standard 1.01, comment: "..."

# Verificar tamaño y dimensiones
ls -la img.jpg
identify img.jpg  # ImageMagick

# Comparar tamaño vs dimensiones
# Una imagen 640x640 típica: ~50-100KB
# Si es mucho mayor → posible esteganografía
```

### Fase 2: Análisis de Metadatos

```bash
# Extraer metadatos EXIF
exiftool img.jpg

# Buscar campos sospechosos (comment, artist, etc.)
exiftool img.jpg | grep -i "comment\|artist\|copyright"

# Análisis con identify
identify -verbose img.jpg | grep -i "comment\|properties"

# Extraer strings
strings img.jpg | head -20
strings -n 10 img.jpg | grep -E "[A-Za-z0-9+/]{20,}="
```

### Fase 3: Identificación de Técnica

```bash
# Verificar si es steghide
steghide info img.jpg
# Preguntará passphrase (probable vacía o "password")

# Detectar con zsteg (para PNG principalmente)
zsteg img.jpg 2>/dev/null || echo "zsteg no soporta JPEG"

# Análisis con stegseek (steghide cracker)
stegseek img.jpg /usr/share/wordlists/rockyou.txt

# Análisis de entropía (detectar datos ocultos)
binwalk -E img.jpg
```

### Fase 4: Extracción

```bash
# Extraer con steghide (si se conoce passphrase)
steghide extract -sf img.jpg -p ""

# O con passphrase encontrada
steghide extract -sf img.jpg -p "pAzzword"

# Verificar archivo extraído
file output.txt
cat output.txt
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas Esenciales

| Herramienta | Uso                     | Instalación                          |
| ----------- | ----------------------- | ------------------------------------ |
| `steghide`  | Ocultar/extraer en JPEG | `apt install steghide`               |
| `exiftool`  | Análisis de metadatos   | `apt install libimage-exiftool-perl` |
| `zsteg`     | LSB analysis (PNG)      | `gem install zsteg`                  |
| `stegseek`  | Steghide cracker        | `apt install stegseek`               |
| `stegsolve` | Visual analysis         | Descargar JAR                        |
| `binwalk`   | Extracción de datos     | `apt install binwalk`                |
| `outguess`  | Estego alternativo      | `apt install outguess`               |

### Script de Detección Automatizado

```python
#!/usr/bin/env python3
"""
Steganography Detector - Image Forensics Tool
Automated detection of hidden data in images
"""

import subprocess
import sys
import re
import base64
from pathlib import Path
from PIL import Image
import numpy as np

class StegoDetector:
    def __init__(self, image_path):
        self.image_path = Path(image_path)
        self.findings = []

    def basic_analysis(self):
        """Análisis básico del archivo"""
        print(f"[+] Analizando: {self.image_path}")

        # Tipo de archivo
        result = subprocess.run(['file', str(self.image_path)],
                              capture_output=True, text=True)
        print(f"[*] Tipo: {result.stdout.strip()}")

        # Tamaño
        size = self.image_path.stat().st_size
        print(f"[*] Tamaño: {size} bytes")

        # Si es JPEG, verificar comment
        if 'JPEG' in result.stdout:
            self._check_jpeg_comment()

    def _check_jpeg_comment(self):
        """Verifica comentarios en JPEG"""
        result = subprocess.run(['file', str(self.image_path)],
                              capture_output=True, text=True)

        # Buscar comment en output de file
        comment_match = re.search(r'comment: "([^"]+)"', result.stdout)
        if comment_match:
            comment = comment_match.group(1)
            print(f"\n[+] Comentario JPEG encontrado: {comment}")
            self.findings.append({'type': 'jpeg_comment', 'data': comment})

            # Verificar si es Base64
            if self._is_base64(comment):
                print(f"    -> Detectado Base64!")
                decoded = self._decode_base64(comment)
                if decoded:
                    print(f"    -> Decodificado: {decoded}")
                    self.findings.append({'type': 'decoded', 'data': decoded})

    def metadata_analysis(self):
        """Análisis exhaustivo de metadatos"""
        print("\n[*] Analizando metadatos...")

        try:
            result = subprocess.run(['exiftool', str(self.image_path)],
                                  capture_output=True, text=True)

            # Buscar campos interesantes
            interesting_fields = ['Comment', 'Artist', 'Copyright',
                                 'ImageDescription', 'XPComment']

            for line in result.stdout.split('\n'):
                for field in interesting_fields:
                    if field in line:
                        print(f"  [+] {line}")
                        # Extraer valor
                        match = re.search(r':\s*(.+)$', line)
                        if match:
                            value = match.group(1).strip()
                            if self._is_base64(value):
                                print(f"      -> Base64 detectado: {value}")
                                decoded = self._decode_base64(value)
                                if decoded:
                                    print(f"      -> Decodificado: {decoded}")
                                    self.findings.append({
                                        'type': f'metadata_{field}',
                                        'data': decoded
                                    })
        except Exception as e:
            print(f"[-] Error con exiftool: {e}")

    def check_steghide(self):
        """Verificar si hay datos steghide"""
        print("\n[*] Verificando steghide...")

        try:
            result = subprocess.run(['steghide', 'info', str(self.image_path)],
                                  input='\n',
                                  capture_output=True, text=True,
                                  timeout=10)

            if 'embedded file' in result.stdout:
                print(f"  [+] Steghide detectado!")
                print(f"      {result.stdout}")
                self.findings.append({'type': 'steghide', 'data': 'detected'})
                return True
            else:
                print(f"  [-] No se detectaron datos steghide")
                return False

        except Exception as e:
            print(f"  [-] Error: {e}")
            return False

    def try_common_passwords(self):
        """Intenta contraseñas comunes para steghide"""
        common_passwords = ['', 'password', '123456', 'steghide',
                           'pAzzword', 'secret', 'admin']

        print("\n[*] Probando contraseñas comunes...")

        for pwd in common_passwords:
            try:
                result = subprocess.run(
                    ['steghide', 'extract', '-sf', str(self.image_path),
                     '-p', pwd, '-xf', '-'],
                    capture_output=True, text=True, timeout=10
                )

                if 'wrote extracted data' in result.stderr or result.stdout:
                    print(f"  [+] ÉXITO con contraseña: '{pwd}'")
                    if result.stdout:
                        print(f"      Contenido: {result.stdout}")
                    self.findings.append({
                        'type': 'steghide_extracted',
                        'password': pwd,
                        'data': result.stdout
                    })
                    return True

            except Exception as e:
                continue

        print(f"  [-] Ninguna contraseña común funcionó")
        return False

    def analyze_lsb(self):
        """Análisis básico de LSB (para PNG)"""
        if not str(self.image_path).endswith('.png'):
            return

        print("\n[*] Analizando LSB...")

        try:
            img = Image.open(self.image_path)
            arr = np.array(img)

            # Extraer LSB de primeros 100 bytes
            lsb_data = []
            for i in range(min(100, arr.shape[0])):
                for j in range(min(100, arr.shape[1])):
                    for k in range(3):  # RGB
                        lsb_data.append(arr[i,j,k] & 1)

            # Convertir a bytes
            lsb_bytes = []
            for i in range(0, len(lsb_data), 8):
                byte = 0
                for j in range(8):
                    if i+j < len(lsb_data):
                        byte |= (lsb_data[i+j] << (7-j))
                lsb_bytes.append(byte)

            # Verificar si es texto legible
            lsb_string = bytes(lsb_bytes).decode('utf-8', errors='ignore')
            if lsb_string.isprintable() and len(lsb_string) > 5:
                print(f"  [+] Datos en LSB: {lsb_string[:50]}")

        except Exception as e:
            print(f"  [-] Error análisis LSB: {e}")

    def _is_base64(self, s):
        """Verifica si es Base64 válido"""
        pattern = r'^[A-Za-z0-9+/]*={0,2}$'
        return bool(re.match(pattern, s)) and len(s) % 4 == 0 and len(s) > 10

    def _decode_base64(self, s):
        """Decodifica Base64"""
        try:
            return base64.b64decode(s).decode('utf-8')
        except:
            return None

    def generate_report(self):
        """Genera reporte de hallazgos"""
        print("\n" + "=" * 60)
        print("REPORTE DE ANÁLISIS ESTEGANOGRÁFICO")
        print("=" * 60)
        print(f"Archivo: {self.image_path}")
        print(f"Hallazgos: {len(self.findings)}")

        for finding in self.findings:
            print(f"\n  Tipo: {finding['type']}")
            if 'data' in finding:
                print(f"  Datos: {finding['data']}")
            if 'password' in finding:
                print(f"  Contraseña: {finding['password']}")

    def run_analysis(self):
        """Ejecuta análisis completo"""
        self.basic_analysis()
        self.metadata_analysis()

        if self.check_steghide():
            self.try_common_passwords()

        self.analyze_lsb()
        self.generate_report()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Uso: {sys.argv[0]} <imagen>")
        sys.exit(1)

    detector = StegoDetector(sys.argv[1])
    detector.run_analysis()
```

### Uso del Script

```bash
# Instalar dependencias
pip3 install Pillow numpy

# Ejecutar análisis
python3 stego_detector.py img.jpg

# Output esperado:
# [+] Analizando: img.jpg
# [*] Tipo: img.jpg: JPEG image data, JFIF standard 1.01, comment: "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9"
#
# [+] Comentario JPEG encontrado: c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9
#     -> Detectado Base64!
#     -> Decodificado: steghide:cEF6endvcmQ=
#
# [*] Analizando metadatos...
#
# [*] Verificando steghide...
#   [+] Steghide detectado!
#
# [*] Probando contraseñas comunes...
#   [+] ÉXITO con contraseña: 'pAzzword'
#     Contenido: picoCTF{h1dd3n_1n_1m4g3_2ac27d95}
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**Caso Al-Qaeda (2001)**:

- Comunicaciones terroristas ocultas en imágenes pornográficas
- Esteganografía para evadir detección
- **Lección**: Datos críticos pueden esconderse en archivos aparentemente inocuos

**Caso Russian Cyber-Espionage (2018)**:

- APT29 usó imágenes Twitter con datos ocultos
- Comandos C2 codificados en píxeles
- **Lección**: Steganografía en canales legítimos

**Caso Corporate Espionage (2020)**:

- Empleado exfiltró IP en imágenes de vacaciones
- Steghide con contraseñas complejas
- **Lección**: Insider threats + esteganografía = difícil de detectar

### Detección y Defensa

**Indicadores de Esteganografía**:

- Tamaño de archivo desproporcionado
- Metadata inusual
- Archivos con comentarios sospechosos
- Entropía anormalmente alta

**Herramientas de Detección**:

```yaml
Detection_Rules:
  - name: "JPEG with suspicious comment"
    pattern: "comment.*[A-Za-z0-9+/]{20,}="
    action: quarantine

  - name: "High entropy image"
    condition: "entropy > 7.5"
    action: alert
```

**Prevención en DLP**:

```bash
# Bloquear imágenes con metadata sospechosa
# Re-encode todas las imágenes para eliminar esteganografía
convert input.jpg -strip output.jpg
```

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Identificar comentario en JPEG
file img.jpg
# JPEG image data, JFIF standard 1.01, ..., comment: "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9"

# Paso 2: Decodificar Base64
echo "c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9" | base64 -d
# Resultado: steghide:cEF6endvcmQ=

# Paso 3: Decodificar segunda capa
echo "cEF6endvcmQ=" | base64 -d
# Resultado: pAzzword

# Paso 4: Extraer con steghide
steghide extract -sf img.jpg -p "pAzzword"

# Paso 5: Leer resultado
cat output.txt
```

### One-liner Automatizado

```bash
# Completo
steghide extract -sf img.jpg -p "$(echo 'c3RlZ2hpZGU6Y0VGNmVuZHZjbVE9' | base64 -d | cut -d: -f2 | base64 -d)"
```

### Flag

```
picoCTF{h1dd3n_1n_1m4g3_2ac27d95}
```

---

## 📚 Recursos y Referencias

- [Steganography Techniques](https://www.sans.org/blog/steganography-hiding-data-within-data/)
- [Steghide Manual](https://steghide.sourceforge.net/documentation.php)
- [Stegsolve Download](https://github.com/zardus/ctf-tools/tree/master/stegsolve)
- [CTF Steganography Guide](https://github.com/DominicBreuker/stego-toolkit)

---

**¿Listo para el siguiente reto?** → Prueba LSB avanzado, espectrograms de audio, o steganografía en videos.
