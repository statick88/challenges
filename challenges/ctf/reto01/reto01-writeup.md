---
title: "Laboratorio de Forense: Metadatos Ocultos"
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

# 🕵️ Laboratorio de Forense Digital: Metadatos Ocultos

## Pensando como un Ethical Hacker

---

👨‍🏫 **Del Instructor**: Bienvenido a tu primer laboratorio de análisis forense. Soy tu instructor y voy a enseñarte a pensar como un **ethical hacker** - alguien que piensa como el atacante para defender mejor los sistemas.

> 🎯 **Mentalidad de Hacker**: Un hacker no ve "un archivo PDF". Ve un contenedor de datos que puede esconder información. No confía en las apariencias. Cuestiona todo. Asume que lo visible es distracción y lo valioso está oculto. Esta es la mentalidad que necesitas para forense digital.

---

## 🎭 El Escenario: El Caso del PDF Sospechoso

**Contexto de Investigación**:
Eres parte del equipo de respuesta a incidentes de una empresa. Un empleado recibió un email phishing con un archivo adjunto llamado `confidential.pdf`. El email decía "Documento confidencial urgente - ábrelo inmediatamente".

El empleado fue lo suficientemente inteligente como para no abrirlo y reportarlo al equipo de seguridad. Ahora está en tus manos analizar este archivo. **No es solo un CTF; es un escenario real de seguridad.**

### Tu Misión como Forense

1. 🔍 **Recolectar evidencia** sin modificar el archivo original
2. 🧠 **Analizar patrones** sospechosos
3. 🕵️ **Extraer información oculta** que el atacante no quiere que veas
4. 📝 **Documentar hallazgos** para el reporte final

> 💭 **Pensamiento de Investigador**: _"Si yo fuera un atacante, ¿dónde escondería información valiosa? El contenido visible es obvio... pero ¿los metadatos? ¿Datos alternativos? ¿Steganografía?"_

---

## 🧠 Fundamentos de Análisis Forense

### ¿Qué es el Análisis de Metadatos?

Como forense digital, debes entender que **cada archivo digital es como una cebolla** - tiene capas:

1. **Capa visible**: El contenido que ves (texto, imágenes)
2. **Capa de metadatos**: Información sobre el archivo (autor, fecha, software usado)
3. **Capa binaria**: Los bytes crudos que puedes analizar
4. **Capas alternativas**: Streams ocultos, datos en espacios vacíos

> 🎓 **Lección del Instructor**: Los atacantes aman los metadatos porque:
>
> - La mayoría de la gente nunca los revisa
> - Son fáciles de modificar
> - Pueden contener payloads codificados
> - Las herramientas automáticas a menudo los ignoran

### El Formato PDF: Un Contenedor Complejo

Un PDF no es solo "un documento". Técnicamente es un contenedor que puede incluir:

- 📄 Texto y fuentes
- 🖼️ Imágenes embebidas
- 🔗 Enlaces y JavaScript
- 📊 Formularios interactivos
- 🏷️ Metadatos extensivos
- 💾 Archivos adjuntos embebidos

**Como hacker**, sabes que si un formato soporta X características, alguien abusará de X+1.

---

## 🔍 Metodología de Investigación

### Fase 1: Recopilación de Inteligencia (OSINT)

Antes de tocar el archivo, documenta todo:

```bash
# Información básica del archivo
ls -lh confidential.pdf
file confidential.pdf
md5sum confidential.pdf
sha256sum confidential.pdf
```

**¿Por qué hashes?**

- **Integridad**: Si el archivo cambia un bit, el hash cambia completamente
- **Evidencia legal**: Prueba que analizaste exactamente este archivo
- **Compartir**: Otros investigadores pueden verificar el mismo archivo

> 🔐 **Mejor Práctica Forense**: Nunca trabajes en el archivo original. Crea una copia y trabaja en esa. Los hashes te permiten verificar que tu copia es idéntica.

### Fase 2: Análisis de Superficie

Primero, veamos qué nos muestra el archivo a simple vista:

```bash
# Intentar extraer texto visible
pdftotext confidential.pdf -
# O simplemente abrirlo en un visor PDF
```

Si ves "texto basura" o "caracteres sin sentido", **eso es intencional**. El atacante quiere que pierdas tiempo con el contenido visible mientras oculta lo real en los metadatos.

> 🧠 **Pensamiento Crítico**: _"Si el contenido visible es obviamente falso, ¿por qué me lo muestran? ¿Qué es lo que NO quieren que vea?"_

### Fase 3: Examinando los Metadatos

Aquí es donde un hacker/forense brilla. Vamos a ver "detrás del telón":

```bash
# Opción 1: Usando exiftool (herramienta forense profesional)
exiftool confidential.pdf

# Opción 2: Usando pdfinfo (más ligero)
pdfinfo confidential.pdf

# Opción 3: Con Python (para automatización)
python3 << 'EOF'
from PyPDF2 import PdfReader
pdf = PdfReader('confidential.pdf')
print(pdf.metadata)
EOF
```

**Salida típica:**

```
Title:           Confidential Document
Author:          cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0\075
Creator:         Microsoft Word 2019
Producer:        macOS Version 10.15.6
CreationDate:    2025-02-03
```

🚨 **¡ALERTA DE HACKER!**

Mira el campo **Author**. Eso NO es un nombre humano:

- Tiene caracteres alfanuméricos mezclados
- Termina con `\075` (escape de `=` en PDF)
- Longitud es múltiplo de 4
- Patrón característico de Base64

> 🎯 **Instinto de Hacker**: Cuando ves texto que parece aleatorio pero tiene estructura, piensa en codificación. Base64 es el favorito de los desarrolladores para ocultar datos.

### Fase 4: Extracción Forense con strings

Ahora usemos técnicas de análisis de bajo nivel:

```bash
# Extraer TODO el texto legible del binario
strings confidential.pdf

# Filtrar específicamente por el campo Author
strings confidential.pdf | grep -i author
```

**Salida:**

```
/Author (cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0\075)
```

**Análisis forense:**

- `/Author`: Campo del estándar PDF
- Los paréntesis `()` contienen el valor
- `\075`: Secuencia de escape que representa `=` en PDF
- El contenido está claramente codificado

> 💡 **Por qué `strings` funciona**: Los archivos binarios como PDFs contienen secciones de texto ASCII mezcladas con datos binarios. `strings` extrae cualquier secuencia de 4+ caracteres imprimibles, revelando metadatos y strings ocultos.

### Fase 5: Decodificación del Payload

Como hacker, reconoces Base64 inmediatamente. Vamos a decodificar:

```bash
# Limpiamos el string (quitamos el escape y decodificamos)
echo "cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9lZTQ1NDk1MH0=" | base64 -d
```

**Resultado:** 🎉

```
picoCTF{puzzl3d_m3tadata_f0und!_ee454950}
```

¡La flag! Pero más importante: **has entendido el mindset del atacante**.

---

## 🛠️ Arsenal de Herramientas Forenses

### Herramientas Utilizadas en esta Investigación

| Herramienta        | Categoría            | Uso en Caso                        |
| ------------------ | -------------------- | ---------------------------------- |
| `strings`          | Análisis de binarios | Extraer texto de archivos binarios |
| `grep`             | Filtrado             | Buscar patrones específicos        |
| `base64`           | Decodificación       | Revertir encoding Base64           |
| `exiftool`         | Metadatos            | Análisis forense profesional       |
| `file`             | Identificación       | Determinar tipo de archivo         |
| `md5sum/sha256sum` | Integridad           | Verificación de evidencia          |

### One-Liner Forense (Modo Experto)

```bash
strings confidential.pdf | grep -i author | sed 's/.*(\(.*\)).*/\1/' | sed 's/\\075/=/g' | base64 -d
```

**Desglose del comando ninja:**

1. `strings`: Extrae todo texto legible
2. `grep -i author`: Filtra línea del autor
3. `sed 's/.*(\(.*\)).*/\1/'`: Extrae contenido entre paréntesis
4. `sed 's/\\075/=/g'`: Reemplaza escape `\075` con `=`
5. `base64 -d`: Decodifica el payload

---

## 🎯 Lecciones del Mundo Real

### Ataques Reales que Usan esta Técnica

**Caso 1: Spear Phishing Avanzado (2023)**

- Atacantes enviaron PDFs con metadatos que parecían legítimos
- En el campo "Author" ocultaban C2 (Command & Control) servers codificados
- Las víctimas nunca revisaban los metadatos
- **Defensa**: Análisis forense automático de metadatos en emails

**Caso 2: Exfiltración de Datos (2022)**

- Empleado descontento ocultaba datos robados en metadatos de imágenes
- Usaba campos EXIF como "Copyright" para exfiltrar código fuente
- **Defensa**: DLP (Data Loss Prevention) que escanea metadatos

**Caso 3: Malware Steganográfico (2024)**

- PDFs aparentemente inofensivos con JavaScript en metadatos
- Al abrir, el PDF ejecutaba el payload oculto
- **Defensa**: Deshabilitar JavaScript en visores PDF corporativos

> 🛡️ **Mentalidad Defensiva**: Como ethical hacker, tu trabajo no es solo encontrar la flag. Es entender cómo un atacante real abusaría de esto y cómo defenderse.

### Indicadores de Compromiso (IOCs) a Buscar

Como analista SOC (Security Operations Center), busca estos patrones:

```yaml
Suspicious_PDF_Metadata:
  - Author: Contains base64 strings
  - Creator: Unknown/unusual software
  - Producer: Mismatched with Creator
  - CreationDate: Suspicious timestamps
  - Custom_Fields: Non-standard metadata

Analysis_Priority:
  High:
    - Base64 in metadata fields
    - URLs in metadata
    - Executable code strings
  Medium:
    - Mismatched creation/modification dates
    - Unusual software combinations
```

---

## 🚀 Técnicas Avanzadas

### Análisis con Python (Automatización)

```python
#!/usr/bin/env python3
"""
PDF Metadata Forensics Scanner
Herramienta para analizar PDFs en búsqueda de IOCs
"""

import base64
import re
from PyPDF2 import PdfReader

def analyze_pdf(filepath):
    pdf = PdfReader(filepath)
    metadata = pdf.metadata

    print(f"[*] Analyzing: {filepath}")
    print("=" * 50)

    for key, value in metadata.items():
        print(f"\n[+] {key}: {value}")

        # Detectar Base64
        if looks_like_base64(value):
            print(f"    [!] BASE64 DETECTED")
            try:
                decoded = base64.b64decode(value).decode('utf-8')
                print(f"    [✓] Decoded: {decoded}")
            except:
                print(f"    [✗] Failed to decode")

def looks_like_base64(s):
    """Detecta si un string parece Base64"""
    pattern = r'^[A-Za-z0-9+/]*={0,2}$'
    return bool(re.match(pattern, str(s))) and len(s) % 4 == 0 and len(s) > 20

if __name__ == "__main__":
    analyze_pdf("confidential.pdf")
```

### Análisis Hexadecimal (Nivel Hardcore)

```bash
# Ver los bytes crudos del archivo
xxd confidential.pdf | head -100

# Buscar específicamente la sección de metadatos
xxd confidential.pdf | grep -A5 -B5 "Author"
```

---

## 🎓 Reflexión Final: La Mentalidad Hacker

Después de este laboratorio, has desarrollado:

1. **Desconfianza Saludable**: Nunca confíes en las apariencias
2. **Pensamiento en Capas**: Ver más allá de lo obvio
3. **Patrones de Codificación**: Reconocer Base64, hex, rot13, etc.
4. **Metodología Forense**: Recopilar → Analizar → Documentar
5. **Perspectiva del Atacante**: Entender cómo piensa quien quiere ocultar algo

> 🏆 **Sabiduría de un Ethical Hacker**: _"El mejor forense no es el que tiene las herramientas más caras. Es el que piensa: 'Si yo fuera el atacante, ¿cómo ocultaría esto?'. Cuando desarrollas ese instinto, las herramientas son solo extensiones de tu mente."_

---

## 📚 Recursos para Seguir Aprendiendo

### Herramientas Forenses Profesionales

- **Autopsy**: Suite forense completa
- **Sleuth Kit**: Análisis de disco
- **Volatility**: Análisis de memoria RAM
- **Wireshark**: Análisis de red

### Certificaciones Relevantes

- **GCFA** (GIAC Certified Forensic Analyst)
- **CHFI** (Computer Hacking Forensic Investigator)
- **OSCP** (Offensive Security Certified Professional)

### Laboratorios Prácticos

- **picoCTF**: Más retos forenses
- **CyberSecLabs**: Laboratorios realistas
- **BlueTeamLabsOnline**: Defensa y forense

---

## ✅ Estado de la Investigación

**CASO RESUELTO** 🕵️‍♂️✅

- 📅 Fecha de análisis: 2025-02-03
- ⏱️ Tiempo de investigación: ~15 minutos
- 🎯 Tipo: Metadata Forensics
- 🔐 Flag recuperada: `picoCTF{puzzl3d_m3tadata_f0und!_ee454950}`
- 📊 Nivel de amenaza: Baja (ejercicio educativo)

**Lecciones Aprendidas**:

- Los metadatos son campos de batalla ignorados
- Base64 es el "escondite" más común
- `strings` + `grep` = 80% de análisis forense básico

---

_Recuerda: En ciberseguridad, la curiosidad es tu superpoder y la desconfianza es tu escudo. Nunca aceptes la superficie; siempre excava más profundo._ 🛡️🔍

**¿Listo para tu próximo caso, detective digital?**
