---
title: "Reverse Engineering Basics"
platform: picoCTF
category: reversing
difficulty: easy
tags:
  - ctf
  - reversing
  - reverse-engineering
  - picoCTF
  - easy
date: 2026-02-05
flag: picoCTF{reverse_engineering_easy}
---

# Reverse Engineering - Análisis de Binarios

---

👨‍🏫 **Del Instructor**: Ethical Hacker & Malware Analyst

> 🎯 **Mentalidad de Hacker**: _"El código nunca miente. Si no entiendes cómo funciona, estás ciego. Los desarrolladores ocultan secretos en binarios pensando que nadie los encontrará. Tu trabajo es probarles que están equivocados."_

---

## 🎭 El Escenario: Análisis de Malware Sospechoso

### Contexto de Incident Response

Eres analista de malware en el SOC de una empresa financiera. Durante una investigación de incidente, encuentras un binario ejecutable sospechoso en la carpeta temp de un usuario:

```
/tmp/suspicious_binary
```

El archivo no está reconocido por tu antivirus. El usuario reporta que el programa le pide una "contraseña" y no hace nada si falla.

**Tu misión como analista forense**:

1. Identificar qué hace el binario sin ejecutarlo (análisis estático)
2. Encontrar la contraseña hardcoded o el algoritmo de validación
3. Documentar IOCs para detección futura

---

## 🧠 Fundamentos de Análisis: La Ciencia del Binario

### ¿Qué es Reverse Engineering?

El **ingeniería inversa** es el proceso de analizar un producto (binario) para comprender su diseño, arquitectura y funcionamiento interno, especialmente cuando no se dispone del código fuente.

**Categorías de análisis**:

1. **Estático**: Análisis sin ejecutar (strings, disassembly, decompilación)
2. **Dinámico**: Análisis durante ejecución (debugging, tracing)
3. **Híbrido**: Combinación de ambos

**¿Por qué es crítico?**

- Análisis de malware
- Auditar software de terceros
- Encontrar vulnerabilidades en binarios legacy
- CTF challenges y bug bounty
- Entender protecciones DRM

### Arquitectura de un Binario ELF

```
┌─────────────────────────────────┐
│           ELF Header            │
├─────────────────────────────────┤
│      Program Header Table       │
├─────────────────────────────────┤
│         .text (Código)          │
├─────────────────────────────────┤
│         .rodata (Strings)       │
├─────────────────────────────────┤
│         .data (Variables)       │
├─────────────────────────────────┤
│       .bss (Uninitialized)      │
├─────────────────────────────────┤
│       Section Header Table      │
└─────────────────────────────────┘
```

---

## 🔍 Metodología de Investigación

### Fase 1: Reconocimiento y Clasificación

```bash
# Identificar tipo de archivo
file suspicious_binary
# Output: suspicious_binary: ELF 64-bit LSB executable

# Verificar si está strippado (sin símbolos)
file suspicious_binary | grep -i stripped

# Obtener hashes para IOCs
md5sum suspicious_binary
sha256sum suspicious_binary

# Análisis rápido con strings
strings suspicious_binary | head -20
strings suspicious_binary | tail -20

# Buscar strings interesantes
strings suspicious_binary | grep -i "password\|flag\|key\|secret"
```

### Fase 2: Análisis Estático Avanzado

```bash
# Análisis con objdump (disassembly)
objdump -d suspicious_binary | less
objdump -d suspicious_binary | grep -A 5 "call.*strcmp"

# Análisis de secciones
readelf -S suspicious_binary
readelf -s suspicious_binary  # Símbolos

# Análisis con radare2
r2 -A suspicious_binary
[0x00000000]> ii  # Imports
[0x00000000]> iS  # Secciones
[0x00000000]> s main
[0x00000000]> pdf
[0x00000000]> iz  # Strings

# Análisis con Ghidra (GUI)
# Importar binario → Auto analyze → Buscar función main
```

### Fase 3: Identificación de Lógica de Validación

**Patrones comunes a buscar**:

```c
// Comparación de strings
strcmp(user_input, "secret_password")
strncmp(user_input, "secret_password", 16)

// Comparación carácter por carácter
for (i = 0; i < len; i++) {
    if (input[i] != hardcoded[i]) {
        return FAIL;
    }
}

// XOR decoding
for (i = 0; i < len; i++) {
    decoded[i] = encoded[i] ^ key[i % key_len];
}
```

### Fase 4: Extracción de la Contraseña/Flag

```bash
# Extraer strings después de cierto offset
strings -t x suspicious_binary | grep "password"

# Buscar en sección .rodata
objdump -s -j .rodata suspicious_binary

# Script para XOR decoding
python3 << 'EOF'
encoded = bytes.fromhex('1b2c3d4e5f')
key = b'secret'
decoded = bytes([encoded[i] ^ key[i % len(key)] for i in range(len(encoded))])
print(decoded)
EOF
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas Esenciales

| Herramienta   | Uso                       | Tipo            |
| ------------- | ------------------------- | --------------- |
| `strings`     | Extraer texto legible     | CLI             |
| `objdump`     | Disassembly               | CLI             |
| `radare2`     | Framework completo RE     | CLI             |
| `Ghidra`      | Decompiler y disassembler | GUI             |
| `IDA Pro`     | Disassembler profesional  | GUI (comercial) |
| `binaryninja` | Análisis intermedio       | GUI             |
| `cutter`      | GUI para radare2          | GUI             |
| `rizin`       | Fork de radare2           | CLI             |

### Script de Análisis Automatizado

```python
#!/usr/bin/env python3
"""
Binary Analyzer - Automated Reverse Engineering
For educational purposes and authorized security testing
"""

import subprocess
import re
import sys
from pathlib import Path

class BinaryAnalyzer:
    def __init__(self, binary_path):
        self.binary_path = Path(binary_path)
        self.findings = {
            'strings': [],
            'passwords': [],
            'urls': [],
            'ips': [],
            'emails': [],
            'suspicious_functions': []
        }

    def extract_strings(self, min_length=4):
        """Extrae strings del binario"""
        print(f"[*] Extrayendo strings de {self.binary_path}...")

        try:
            result = subprocess.run(
                ['strings', '-n', str(min_length), str(self.binary_path)],
                capture_output=True,
                text=True,
                timeout=30
            )

            all_strings = result.stdout.split('\n')

            # Filtrar strings interesantes
            self.findings['strings'] = all_strings

            # Buscar contraseñas
            password_patterns = [
                r'password[:\s=]+(\S+)',
                r'passwd[:\s=]+(\S+)',
                r'pwd[:\s=]+(\S+)',
                r'flag[:\s=]+(\S+)',
                r'key[:\s=]+(\S+)',
            ]

            for string in all_strings:
                for pattern in password_patterns:
                    matches = re.findall(pattern, string, re.IGNORECASE)
                    self.findings['passwords'].extend(matches)

            # Buscar URLs
            url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
            for string in all_strings:
                matches = re.findall(url_pattern, string)
                self.findings['urls'].extend(matches)

            # Buscar IPs
            ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
            for string in all_strings:
                matches = re.findall(ip_pattern, string)
                self.findings['ips'].extend(matches)

            # Buscar emails
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            for string in all_strings:
                matches = re.findall(email_pattern, string)
                self.findings['emails'].extend(matches)

            print(f"[+] {len(all_strings)} strings extraídos")

        except Exception as e:
            print(f"[-] Error extrayendo strings: {e}")

    def analyze_functions(self):
        """Analiza funciones del binario con objdump"""
        print(f"\n[*] Analizando funciones...")

        try:
            result = subprocess.run(
                ['objdump', '-d', str(self.binary_path)],
                capture_output=True,
                text=True,
                timeout=30
            )

            # Buscar funciones sospechosas
            suspicious = ['strcmp', 'strncmp', 'memcmp', 'system', 'execve',
                         'socket', 'connect', 'send', 'recv']

            for func in suspicious:
                if func in result.stdout:
                    self.findings['suspicious_functions'].append(func)

            print(f"[+] Funciones sospechosas: {self.findings['suspicious_functions']}")

        except Exception as e:
            print(f"[-] Error analizando funciones: {e}")

    def generate_report(self):
        """Genera reporte de hallazgos"""
        print("\n" + "=" * 60)
        print("REPORTE DE ANÁLISIS DE BINARIO")
        print("=" * 60)

        print(f"\n[+] Contraseñas/Flags encontradas:")
        for pwd in set(self.findings['passwords']):
            print(f"    - {pwd}")

        print(f"\n[+] URLs encontradas:")
        for url in set(self.findings['urls'][:10]):  # Limitar a 10
            print(f"    - {url}")

        print(f"\n[+] IPs encontradas:")
        for ip in set(self.findings['ips']):
            print(f"    - {ip}")

        print(f"\n[+] Emails encontrados:")
        for email in set(self.findings['emails']):
            print(f"    - {email}")

        print(f"\n[+] Funciones sospechosas:")
        for func in self.findings['suspicious_functions']:
            print(f"    - {func}")

        print(f"\n[+] Strings interesantes (muestra):")
        interesting = [s for s in self.findings['strings']
                      if any(x in s.lower() for x in ['password', 'secret', 'key', 'flag', 'admin'])]
        for s in interesting[:5]:
            print(f"    - {s}")

    def run_full_analysis(self):
        """Ejecuta análisis completo"""
        print(f"[+] Iniciando análisis de: {self.binary_path}")

        if not self.binary_path.exists():
            print(f"[-] Error: Archivo no encontrado")
            return

        self.extract_strings()
        self.analyze_functions()
        self.generate_report()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Uso: {sys.argv[0]} <ruta_al_binario>")
        sys.exit(1)

    analyzer = BinaryAnalyzer(sys.argv[1])
    analyzer.run_full_analysis()
```

### Uso del Script

```bash
# Ejecutar análisis
chmod +x binary_analyzer.py
python3 binary_analyzer.py suspicious_binary

# Output esperado:
# [+] Iniciando análisis de: suspicious_binary
# [*] Extrayendo strings de suspicious_binary...
# [+] 1234 strings extraídos
#
# [*] Analizando funciones...
# [+] Funciones sospechosas: ['strcmp', 'system']
#
# ============================================================
# REPORTE DE ANÁLISIS DE BINARIO
# ============================================================
#
# [+] Contraseñas/Flags encontradas:
#     - picoCTF{reverse_engineering_easy}
# ...
```

### Flujo de Trabajo en Ghidra

```bash
# 1. Crear nuevo proyecto
# File → New Project → Non-shared

# 2. Importar binario
# File → Import File → seleccionar binario

# 3. Auto-analizar
# Click derecho → Auto Analyze

# 4. Buscar función main
# Window → Functions → buscar "main"

# 5. Decompilar
# Click en función → Window → Decompile

# 6. Buscar strings
# Window → Defined Strings
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**Caso Stuxnet (2010)**:

- Análisis de ingeniería inversa reveló ataque a sistemas SCADA
- Zero-days en Windows para propagación
- **Lección**: RE revela capacidades ocultas del malware

**Caso WannaCry (2017)**:

- Reverse engineering reveló killswitch (domain check)
- Permite detener propagación
- **Lección**: RE puede salvar infraestructura

**Caso Pegasus (2021)**:

- Análisis de binarios iOS reveló spyware gubernamental
- Zero-click exploits
- **Lección**: RE crítico para defensa móvil

### Protecciones Anti-RE

| Técnica             | Descripción         | Bypass                     |
| ------------------- | ------------------- | -------------------------- |
| Stripping           | Eliminar símbolos   | Análisis de patrones       |
| Packing             | Comprimir/encriptar | Unpacking automático (UPX) |
| Obfuscation         | Código confuso      | Deobfuscation manual       |
| Anti-debugging      | Detectar debugger   | Parchear checks            |
| Code virtualization | VM de bytecode      | Análisis de VM             |

### Defensa y Detección

**Prevenir la ingeniería inversa**:

```bash
# Stripping de símbolos
strip binary

# Ofuscación con Obfuscator-LLVM
clang -mllvm -fla -mllvm -sub -mllvm -bcf programa.c

# Packing con UPX
upx -9 binary
```

**IOCs de malware**:

- Binarios con strings encriptados/ofuscados
- Llamadas a funciones sospechosas (system, execve, socket)
- Secciones de código con alta entropía
- Imports inusuales

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Extraer strings básicos
strings binary | grep -i password

# Paso 2: Buscar patrón de flag
strings binary | grep -E 'picoCTF\{.*\}'

# Paso 3: Análisis con objdump (si no está en strings)
objdump -d binary | grep -A 10 -B 5 "password"

# Paso 4: Si está codificado, usar radare2
r2 -A binary
> iz  # Ver strings en sección .rodata
> s main
> pdf  # Disassembly
```

### Flag

```
picoCTF{reverse_engineering_easy}
```

---

## 📚 Recursos y Referencias

- [Reverse Engineering for Beginners](https://beginners.re/)
- [Radare2 Book](https://book.rada.re/)
- [Ghidra Class](https://ghidra-sre.org/)
- [CTF Wiki - Reverse Engineering](https://ctf-wiki.org/reverse/introduction/)
- [Malware Analysis Tutorials](https://0xpat.github.io/Malware_development_part_1/)

---

**¿Listo para el siguiente reto?** → Prueba unpacking, análisis de malware, o reversing de protocolos de red.
