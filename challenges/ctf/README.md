# 🚩 CTF Challenges - Writeups de Capture The Flag

## 📋 Descripción

Repositorio de writeups para retos de seguridad informática y hacking ético. Cada writeup documenta el proceso de resolución, herramientas utilizadas y lecciones aprendidas.

---

## 📁 Estructura

```
ctf/
├── forensics/      # Análisis forense, metadata, esteganografía
│   ├── hidden-metadata-pdf.md
│   ├── log-hunt.md
│   ├── hidden-in-plainsight.md
│   ├── reto01/    # Hidden Confidential Document
│   ├── reto02/    # Server Log Hunt
│   └── reto03/    # Hidden in Image
├── crypto/        # Criptografía y criptoanálisis
│   └── caesar-cipher.md  ⭐ NEW
├── web/           # Vulnerabilidades web (XSS, SQLi, SSRF, etc.)
│   └── xss-basic.md        ⭐ NEW
├── pwn/           # Explotación binaria y buffer overflows
│   └── buffer-overflow.md  ⭐ NEW
├── reversing/     # Ingeniería inversa
│   └── reversing-basics.md  ⭐ NEW
└── misc/          # Misceláneos y OSINT
    └── information-disclosure.md  ⭐ NEW
```

---

## 📊 Progreso (Actualizado 05-02-2026)

| Categoría         | Total | Completados | Progreso |
| ----------------- | ----- | ----------- | -------- |
| 🔍 Forensics      | 3     | **3** ✅    | **100%** |
| 🔐 Crypto         | 1     | **1** ✅    | **100%** |
| 🌐 Web            | 1     | **1** ✅    | **100%** |
| 💥 Pwn            | 1     | **1** ✅    | **100%** |
| 🔧 Reversing      | 1     | **1** ✅    | **100%** |
| 🎲 General Skills | 1     | **1** ✅    | **100%** |
| **TOTAL**         | **8** | **8** ✅    | **100%** |

> ⭐ Nuevos retos agregados: Crypto, Web, Pwn, Reversing, Misc

---

## 🏆 Retos Completados (8 Total)

### 🔍 Forensics - Retos Completados

| Reto                            | Categoría | Plataforma | Dificultad | Archivos                                                       | Writeup                                              | Flag                                        |
| ------------------------------- | --------- | ---------- | ---------- | -------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| reto01 - Documento Confidencial | Forensics | picoCTF    | ⭐ Fácil   | [confidential.pdf](./reto01/confidential.pdf)                  | [reto01-writeup.md](./reto01/reto01-writeup.md)      | `picoCTF{puzzl3d_m3tadata_f0und!_ee454950}` |
| reto02 - Server Log Hunt        | Forensics | picoCTF    | ⭐ Fácil   | [server.log](./reto02/server.log)                              | [reto02-log-hunt.md](./reto02-log-hunt.md)           | `picoCTF{us3_y0urlinux_sk1lls_cedfa5fb}`    |
| reto03 - Hidden in Image        | Forensics | picoCTF    | ⭐ Fácil   | [img.jpg](./reto03/img.jpg), [output.txt](./reto03/output.txt) | [reto03-steganography.md](./reto03-steganography.md) | `picoCTF{h1dd3n_1n_1m4g3_2ac27d95}`         |

### 📁 Documentación Forensics/

| Archivo                                                                  | Descripción                                 |
| ------------------------------------------------------------------------ | ------------------------------------------- |
| [forensics/hidden-metadata-pdf.md](./forensics/hidden-metadata-pdf.md)   | Metadatos PDF + Base64 (referencia general) |
| [forensics/log-hunt.md](./forensics/log-hunt.md)                         | Análisis de logs (referencia general)       |
| [forensics/hidden-in-plainsight.md](./forensics/hidden-in-plainsight.md) | Esteganografía general                      |

---

## 📊 Archivos de Retos - Análisis Posterior

### reto01 - Hidden Confidential Document

**Ubicación:** `challenges/ctf/reto01/`

| Archivo                                         | Tipo         | Tamaño | Propósito                        |
| ----------------------------------------------- | ------------ | ------ | -------------------------------- |
| [confidential.pdf](./reto01/confidential.pdf)   | PDF document | 182 KB | Archivo del reto con flag oculta |
| [reto01-writeup.md](./reto01/reto01-writeup.md) | Markdown     | ~2 KB  | Documentación de solución        |

**Técnica:** Metadata PDF + Base64 encoding  
**Herramientas:** strings, grep, sed, base64

### reto02 - Server Log Hunt

**Ubicación:** `challenges/ctf/reto02/`

| Archivo                                    | Tipo       | Tamaño | Propósito                            |
| ------------------------------------------ | ---------- | ------ | ------------------------------------ |
| [server.log](./reto02/server.log)          | ASCII text | 108 KB | Log de servidor con flag fragmentada |
| [reto02-log-hunt.md](./reto02-log-hunt.md) | Markdown   | ~3 KB  | Documentación de solución            |

**Técnica:** Log parsing + Flag reconstruction  
**Herramientas:** grep, awk, sort, tr

### reto03 - Hidden in Image

**Ubicación:** `challenges/ctf/reto03/`

| Archivo                                              | Tipo       | Tamaño | Propósito                 |
| ---------------------------------------------------- | ---------- | ------ | ------------------------- |
| [img.jpg](./reto03/img.jpg)                          | JPEG image | 74 KB  | Imagen con esteganografía |
| [output.txt](./reto03/output.txt)                    | Text       | 34 B   | Flag extraída             |
| [reto03-steganography.md](./reto03-steganography.md) | Markdown   | ~2 KB  | Documentación de solución |

**Técnica:** Steganografía (steghide)  
**Herramientas:** steghide, exiftool, strings

---

## 🛠️ Habilidades Desarrolladas

### ✅ Dominadas

- **Análisis de Metadatos PDF** - Extracción de datos ocultos en campos de metadatos
- **Decodificación Base64** - Identificación y decodificación de strings Base64
- **Forense de Línea de Comandos** - Uso de `strings`, `grep`, `sed` para análisis
- **Análisis de Logs** - Filtrado y extracción de información de archivos de log
- **Procesamiento de Texto Linux** - Uso de `grep`, `sort`, `uniq`, `awk` para análisis
- **Esteganografía con Steghide** - Extracción de datos ocultos en imágenes JPEG

### 🔄 En Progreso

- **Esteganografía** - Datos ocultos en imágenes
- **Forense de Memoria** - Análisis de dumps de RAM
- **Forense de Red** - Análisis de PCAPs

---

## 🏷️ Tags para Obsidian

| Tipo       | Tags                                                      |
| ---------- | --------------------------------------------------------- |
| Categoría  | `#forensics` `#crypto` `#web` `#pwn` `#reversing` `#misc` |
| Dificultad | `#easy` `#medium` `#hard`                                 |
| Plataforma | `#picoCTF` `#HTB` `#THM` `#CTFtime`                       |
| Técnicas   | `#metadata` `#base64` `#steganography` `#sqli` `#xss`     |

---

## 🔧 Herramientas Comunes

### Forensics

- `strings`, `exiftool`, `binwalk`, `foremost`
- `steghide`, `stegsolve`, `zsteg`

### Crypto

- `CyberChef`, `hashcat`, `john`
- Python: `pycryptodome`, `gmpy2`

### Web

- `Burp Suite`, `sqlmap`, `ffuf`
- Herramientas de Desarrollador del Navegador

### Pwn/Reversing

- `gdb`, `pwntools`, `ghidra`, `radare2`

---

## 📝 Plantilla de Writeup

Ver [ctf-writeup-template.md](../../templates/ctf-writeup-template.md) para la plantilla estándar.

---

_Última actualización: 04-02-2026 (6 retos completados: reto01, reto02, reto03 + 3 originales)_
