---
title: "HTB Academy - Memory Forensics Basics"
category: forensics
difficulty: medium
tags: ["forensics", "memory-analysis", "volatility", "malware", "htb-academy"]
date: 2026-02-17
status: ready
platform: HTB
---

# 🎓 HTB Academy - Memory Forensics Basics

## 🎭 Análisis Forense de Memoria

---

👨‍🏫 **Del Instructor**: Bienvenido al módulo de Memory Forensics. Como Analista Forense, la capacidad de analizar volcados de memoria es crucial para investigar incidentes de seguridad, detectar malware en ejecución y recuperar evidencia que no existe en disco.

> 🎯 **Mentalidad de Forense**: "La memoria es el testigo silencioso. Mientras el disco puede ser borrado o cifrado, la memoria contiene la verdad viva del momento del incidente - procesos, conexiones, malware, todo está ahí esperando ser descubierto."

---

## 🎭 El Escenario: Investigación de Incidente

### Contexto del Caso

Eres un analista del equipo de respuesta a incidentes. Se ha detectado comportamiento sospechoso en una estación de trabajo. El equipo de SOC ha capturado un volcado de memoria antes de aislar el equipo. Tu misión es analizar el volcado para:

- Identificar procesos maliciosos
- Descubrir conexiones de red sospechosas
- Extraer malware y evidencia
- Reconstruir la cronología del ataque

**Tu misión como Forensic Analyst**:
- Analizar el volcado de memoria con Volatility
- Identificar procesos anómalos
- Extraer indicadores de compromiso (IOCs)
- Documentar hallazgos para el reporte

## 🧠 Fundamentos de Análisis: Memory Forensics

### ¿Qué es un Memory Dump?

Un volcado de memoria es una copia del contenido de la RAM de un sistema en un momento específico. Contiene:

- **Procesos en ejecución**: Programas activos y sus metadatos
- **Conexiones de red**: Sockets activos y recientes
- **Archivos mapeados**: DLLs, drivers, ejecutables
- **Registro de Windows**: Hive y configuraciones
- **Malware en memoria**: Payloads descifrados, rootkits

### Volatility Framework

Volatility es la herramienta estándar para análisis forense de memoria:

```
Volatility 3 Architecture:
├── plugins/          # Plugins de análisis
├── symbols/          # Tablas de símbolos OS
└── framework/        # Motor de análisis
```

## 🔍 Metodología de Investigación

### Paso 1: Preparación del Entorno

```bash
# Conectar a Pwnbox HTB Academy
ssh htb-ac-XXXXXX@htb-XXXXXX.htb-cloud.com

# Verificar Volatility instalado
python3 -c "import volatility3; print(volatility3.__version__)"

# Descargar el volcado de memoria
wget https://academy.hackthebox.com/storage/modules/memory_dump.raw

# Verificar integridad
md5sum memory_dump.raw
```

### Paso 2: Identificar el Profile

```bash
# Usar Volatility 3 para identificar el OS
python3 vol.py -f memory_dump.raw windows.info

# Output esperado:
# Name: Windows 10 Pro
# Version: 10.0.19041
# Architecture: x64
```

**Análisis**: Identificar el sistema operativo correcto es crucial para usar los símbolos adecuados.

### Paso 3: Listar Procesos

```bash
# Listar todos los procesos
python3 vol.py -f memory_dump.raw windows.pslist

# Procesos sospechosos a buscar:
# - Procesos con nombres extraños
# - Procesos sin ruta de imagen válida
# - Procesos con PID alto pero padres legítimos
# - Procesos con handles sospechosos

# Buscar procesos ocultos (rootkit detection)
python3 vol.py -f memory_dump.raw windows.psscan

# Comparar pslist vs psscan para detectar rootkits
diff <(python3 vol.py -f memory_dump.raw windows.pslist | grep -E "^\d") \
     <(python3 vol.py -f memory_dump.raw windows.psscan | grep -E "^\d")
```

### Paso 4: Análisis de Red

```bash
# Conexiones de red activas
python3 vol.py -f memory_dump.raw windows.netscan

# Buscar conexiones sospechosas:
# - Puertos altos (>49152)
# - IPs externas desconocidas
# - Conexiones ESTABLISHED a puertos no estándar

# Filtrar por puertos sospechosos
python3 vol.py -f memory_dump.raw windows.netscan | grep -E ":4444|:6667|:31337"
```

### Paso 5: Análisis de Malware

```bash
# Buscar procesos inyectados
python3 vol.py -f memory_dump.raw windows.malfind

# Extraer ejecutable de un proceso sospechoso
python3 vol.py -f memory_dump.raw -o ./output windows.dump --pid 1234

# Analizar strings del proceso
strings ./output/process.1234.dmp | grep -i "password\|key\|http"

# Buscar DLLs inyectadas
python3 vol.py -f memory_dump.raw windows.dlllist --pid 1234
```

### Paso 6: Análisis de Persistencia

```bash
# Buscar claves de registro de persistencia
python3 vol.py -f memory_dump.raw windows.registry.printkey \
  --key "Software\\Microsoft\\Windows\\CurrentVersion\\Run"

# Buscar servicios maliciosos
python3 vol.py -f memory_dump.raw windows.svcscan | grep -i "unknown"

# Buscar tareas programadas
python3 vol.py -f memory_dump.raw windows.tasks
```

## 🛠️ Arsenal de Herramientas

| Herramienta | Uso | Comando |
|-------------|-----|---------|
| `volatility3` | Análisis de memoria | `python3 vol.py -f dump.raw` |
| `strings` | Búsqueda de texto | `strings dump.dmp` |
| `grep` | Filtrado | `grep -i "password"` |
| `bulk_extractor` | Extracción masiva | `bulk_extractor -o output dump.raw` |
| `memprocfs` | Análisis interactivo | `MemProcFS -device dump.raw` |

## ✅ Checklist de Verificación

- [ ] Identificar sistema operativo del volcado
- [ ] Listar todos los procesos activos
- [ ] Detectar procesos ocultos (rootkits)
- [ ] Analizar conexiones de red
- [ ] Buscar inyecciones de código
- [ ] Extraer procesos sospechosos
- [ ] Analizar persistencia
- [ ] Documentar IOCs encontrados

## 🎓 Lo Que Acabas de Aprender

**Habilidades Técnicas**:
- Uso de Volatility 3 para análisis de memoria
- Detección de procesos maliciosos
- Análisis de conexiones de red
- Extracción de malware de memoria

**Mentalidad Forense**:
- **Metodología sistemática**: Seguir el orden correcto de análisis
- **Correlación de evidencia**: Procesos + Red + Registro
- **Documentación**: Cada hallazgo debe ser reproducible

## 🚀 Próximos Pasos

1. **Malware Analysis**: Analizar los ejecutables extraídos
2. **Timeline Analysis**: Reconstruir la cronología del ataque
3. **Threat Intelligence**: Correlacionar IOCs con bases de datos
4. **Incident Report**: Documentar hallazgos para stakeholders

## 📚 Recursos HTB Academy

- [HTB Academy - Memory Forensics Module](https://academy.hackthebox.com/module/details/115)
- [Volatility 3 Documentation](https://github.com/volatilityfoundation/volatility3)
- [Memory Forensics Cheat Sheet](https://downloads.volatilityfoundation.org/cheatsheets/)
- [SANS Memory Forensics](https://www.sans.org/blog/memory-forensics/)

---

## ✅ Estado

**LISTO PARA COMPLETAR** 🔵

- 📅 Fecha: 2026-02-17
- ⏱️ Tiempo estimado: 45 minutos
- 🎯 Dificultad: Media (HTB Academy Intermediate)