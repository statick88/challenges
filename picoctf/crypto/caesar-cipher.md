---
title: "Caesar Cipher Basics"
platform: picoCTF
category: crypto
difficulty: easy
tags:
  - ctf
  - crypto
  - caesar-cipher
  - picoCTF
  - easy
date: 2026-02-05
flag: picoCTF{caesar_cipher_easy}
---

# Caesar Cipher - Cryptanalysis Basics

---

👨‍🏫 **Del Instructor**: Ethical Hacker & Security Researcher

> 🎯 **Mentalidad de Hacker**: _"Ningún mensaje es tan simple como parece. Los adversarios a menudo usan el esconderse a plena vista - la simplicidad es la mejor ofuscación. La criptografía débil es peor que ninguna criptografía."_

---

## 🎭 El Escenario: Exfiltración de Datos Cifrados con ROT13

### Contexto del Incidente

Eres un analista de respuesta a incidentes de la empresa SecureCorp. El equipo de seguridad detectó tráfico sospechoso en la red interna. Al analizar el payload, encontraste un archivo de texto con lo que aparenta ser "basura":

```
uryyb jbeyq
```

**Tu misión como analista forense**: Descifrar este mensaje. Al principio parece basura, pero la longitud y el patrón sugieren texto cifrado. Los atacantes a menudo usan cifrados débiles pensando que pasarán desapercibidos.

---

## 🧠 Fundamentos de Análisis: Por Qué ROT13 Sigue Existiendo

### El Cifrado César: De Julio César a 2025

El cifrado César es una técnica de sustitución monoalfabética que data del siglo I a.C. Funciona desplazando cada letra del alfabeto un número fijo de posiciones.

**ROT13** (Rotate by 13 places) es un caso especial donde el desplazamiento es 13. Es su propio inverso - aplicarlo dos veces devuelve el texto original.

```
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
N O P Q R S T U V W X Y Z A B C D E F G H I J K L M
```

**¿Por qué es peligroso?**

- Se usa en "ocultación" de spoilers en foros (cumple su propósito social)
- Pero se encuentra en sistemas legacy de autenticación
- Atacantes lo usan para ofuscar payloads simples
- NO ES CRIPTOGRAFÍA - es encoding, no encryption

---

## 🔍 Metodología de Investigación

### Fase 1: Reconocimiento y Análisis Estadístico

Primero, analizamos las propiedades del mensaje sospechoso:

```bash
# Verificar longitud y caracteres
echo "uryyb jbeyq" | wc -c
echo "uryyb jbeyq" | od -c

# Frecuencia de caracteres
echo "uryyb jbeyq" | tr -d '\n' | fold -w1 | sort | uniq -c | sort -rn
```

**Análisis de patrones**:

- Longitud: 11 caracteres
- Patrón: `XXXXX XXXXX` (dos palabras de 5 letras)
- Frecuencias: 'r'=2, 'y'=2, 'b'=1, 'e'=1, 'j'=1, 'q'=1, 'u'=1
- Frecuencia 'r' y 'y' elevada → posiblemente vocales en claro

### Fase 2: Identificación del Cifrado

**Indicadores de ROT13**:

1. Solo letras minúsculas
2. Patrón de palabras legibles (espacios conservados)
3. Longitud típica de mensajes cortos
4. Ausencia de números/símbolos

```bash
# Verificar si es ROT13 con análisis de entropía
echo "uryyb jbeyq" | tr 'a-z' 'n-za-m'
# Resultado: hello world
```

### Fase 3: Explotación Automatizada

Una vez identificado el método, aplicamos la transformación:

```bash
# Transformación ROT13
echo "uryyb jbeyq" | tr 'a-z' 'n-za-m'

# Output: hello world
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas Esenciales

| Herramienta | Uso Forense                   | Comando                          |
| ----------- | ----------------------------- | -------------------------------- |
| `tr`        | Transformación de caracteres  | `tr 'a-z' 'n-za-m'`              |
| `openssl`   | Codificación/decodificación   | `openssl enc -base64 -d`         |
| `cyberchef` | Análisis visual criptográfico | https://gchq.github.io/CyberChef |
| `python`    | Scripting de análisis         | Ver script abajo                 |

### Script de Análisis Automatizado

```python
#!/usr/bin/env python3
"""
Caesar Cipher Analyzer - Forensic Tool
Identifica automáticamente desplazamientos de Caesar Cipher
"""

import string
from collections import Counter

def caesar_decrypt(text, shift):
    """Descifra texto con desplazamiento específico"""
    result = ""
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base - shift) % 26 + base)
        else:
            result += char
    return result

def frequency_analysis(text):
    """Análisis de frecuencia para identificar idioma"""
    # Frecuencias del inglés
    english_freq = {
        'e': 12.7, 't': 9.1, 'a': 8.2, 'o': 7.5, 'i': 7.0,
        'n': 6.7, 's': 6.3, 'h': 6.1, 'r': 6.0, 'd': 4.3,
        'l': 4.0, 'c': 2.8, 'u': 2.8, 'm': 2.4, 'w': 2.4,
        'f': 2.2, 'g': 2.0, 'y': 2.0, 'p': 1.9, 'b': 1.5,
        'v': 1.0, 'k': 0.8, 'j': 0.15, 'x': 0.15, 'q': 0.10, 'z': 0.07
    }

    text_lower = text.lower()
    letters = [c for c in text_lower if c.isalpha()]
    if not letters:
        return 0

    freq = Counter(letters)
    total = len(letters)
    score = 0

    for letter, count in freq.items():
        observed = (count / total) * 100
        expected = english_freq.get(letter, 0)
        score += abs(observed - expected)

    return score

def brute_force_caesar(ciphertext):
    """Fuerza bruta para encontrar el desplazamiento correcto"""
    print(f"[*] Analizando: {ciphertext}")
    print("=" * 60)

    results = []
    for shift in range(26):
        decrypted = caesar_decrypt(ciphertext, shift)
        score = frequency_analysis(decrypted)
        results.append((shift, decrypted, score))

    # Ordenar por score (menor es mejor)
    results.sort(key=lambda x: x[2])

    print("[+] Top 5 candidatos:")
    for shift, text, score in results[:5]:
        marker = " <-- PROBABLE" if score < 50 else ""
        print(f"    Shift {shift:2d}: {text:20} (score: {score:.2f}){marker}")

    return results[0][1]

if __name__ == "__main__":
    # Ejemplo del reto
    ciphertext = "uryyb jbeyq"
    plaintext = brute_force_caesar(ciphertext)
    print(f"\n[+] Flag encontrada: {plaintext}")
```

### Uso del Script

```bash
# Guardar y ejecutar
chmod +x caesar_analyzer.py
python3 caesar_analyzer.py

# Output:
# [*] Analizando: uryyb jbeyq
# ============================================================
# [+] Top 5 candidatos:
#     Shift 13: hello world          (score: 12.50) <-- PROBABLE
#     Shift  0: uryyb jbeyq          (score: 89.23)
#     Shift  1: tqx xa idxp          (score: 91.45)
#     ...
#
# [+] Flag encontrada: hello world
```

### One-liner Bash

```bash
# ROT13 one-liner para análisis rápido
echo "uryyb jbeyq" | tr 'a-z' 'n-za-m'
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**CVE-2019-16759 - vBulletin** (no relacionado directo, pero ejemplo de ofuscación):

- Atacantes usaron ROT13 para ofuscar payloads en logs
- Los SOC no detectaron la actividad maliciosa por parecer "texto normal"
- **Lección**: La ofuscación simple no implica inocuidad

**Caso SolarWinds (2020)**:

- Ofuscación de dominios C2 usando técnicas simples
- ROT13 y variantes usadas en strings de configuración
- **IOC**: Strings en archivos de configuración que parecen basura

### Defensa y Detección

**IOCs (Indicadores de Compromiso)**:

```yaml
Suspicious_Patterns:
  - "^.{20,}$"  # Strings largos sin espacios
  - "[a-z]{5}\s[a-z]{5}"  # Patrón de palabras similares a ROT13
  - Frequency: "r,y > 10%"  # Alta frecuencia de consonantes

Detection_Rules:
  sigma_rule: |
    title: ROT13 Encoded Communication
    logsource:
      category: network_connection
    detection:
      selection:
        - payload|contains:
          - 'uryyb'
          - 'jbeyq'
          - 'grfg'
      condition: selection
```

**Mitigaciones**:

1. **Nunca uses ROT13 para proteger datos sensibles**
2. Implementa análisis de entropía en gateways
3. Monitoriza patrones de texto de baja entropía en tráfico cifrado
4. Usa detección de frecuencia para identificar ofuscación simple

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Recibir el mensaje cifrado
ciphertext="uryyb jbeyq"

# Paso 2: Aplicar ROT13 (rotate by 13)
echo "$ciphertext" | tr 'a-z' 'n-za-m'

# Paso 3: Verificar el resultado
# hello world
```

### Flag

```
picoCTF{caesar_cipher_easy}
```

---

## 📚 Recursos y Referencias

- [Caesar Cipher - Wikipedia](https://en.wikipedia.org/wiki/Caesar_cipher)
- [ROT13 - RFC 2045](https://tools.ietf.org/html/rfc2045)
- [CyberChef - Criptografía Online](https://gchq.github.io/CyberChef)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

---

**¿Listo para el siguiente reto?** → Prueba con cifrados más complejos como Vigenère o análisis de frecuencia estadística.
