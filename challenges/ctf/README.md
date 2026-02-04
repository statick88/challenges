# 🚩 CTF Challenges - Writeups de Capture The Flag

## 📋 Descripción

Repositorio de writeups para retos de seguridad informática y hacking ético. Cada writeup documenta el proceso de resolución, herramientas utilizadas y lecciones aprendidas.

---

## 📁 Estructura

```
ctf/
├── forensics/      # Análisis forense, metadata, esteganografía
├── crypto/         # Criptografía y criptoanálisis
├── web/            # Vulnerabilidades web (XSS, SQLi, SSRF, etc.)
├── pwn/            # Explotación binaria y buffer overflows
├── reversing/      # Ingeniería inversa
└── misc/           # Misceláneos y OSINT
```

---

## 📊 Progreso

> Basado en los retos disponibles en [picoCTF picoGym](https://play.picoctf.org/practice) (~150+ challenges)

| Categoría | Total | Completados | Progreso |
|-----------|-------|-------------|----------|
| 🔍 Forensics | 25 | 3 ✅ | **12%** |
| 🔐 Crypto | 30 | 0 ⏳ | **0%** |
| 🌐 Web | 30 | 0 ⏳ | **0%** |
| 💥 Pwn | 25 | 0 ⏳ | **0%** |
| 🔧 Reversing | 20 | 0 ⏳ | **0%** |
| 🎲 General Skills | 20 | 0 ⏳ | **0%** |
| **TOTAL** | **150** | **3** ✅ | **2%** |

---

## 🏆 Retos Completados

### 🔍 Forensics

| Reto | Plataforma | Dificultad | Writeup |
|------|------------|------------|---------|
| Documento Confidencial Oculto | picoCTF | ⭐ Fácil | [Ver](./forensics/hidden-metadata-pdf.md) |
| Log Hunt | picoCTF | ⭐ Fácil | [Ver](./forensics/log-hunt.md) |
| Hidden in Plainsight | picoCTF | ⭐ Fácil | [Ver](./forensics/hidden-in-plainsight.md) |

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

| Tipo | Tags |
|------|------|
| Categoría | `#forensics` `#crypto` `#web` `#pwn` `#reversing` `#misc` |
| Dificultad | `#easy` `#medium` `#hard` |
| Plataforma | `#picoCTF` `#HTB` `#THM` `#CTFtime` |
| Técnicas | `#metadata` `#base64` `#steganography` `#sqli` `#xss` |

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

*Última actualización: 04-02-2026 (3 retos completados)*
