---
title: "Log Hunt"
platform: picoCTF
category: forensics
difficulty: easy
tags:
  - ctf
  - forensics
  - logs
  - grep
  - linux
  - picoCTF
  - easy
date: 2026-02-04
flag: picoCTF{us3_y0urlinux_sk1lls_cedfa5fb}
status: completado
author: Yahaya Meddy
---

# Log Analysis - Digital Forensics Investigation

---

👨‍🏫 **Del Instructor**: Ethical Hacker & SOC Analyst

> 🎯 **Mentalidad de Hacker**: _"Los logs no mienten. Son la memoria del sistema, testigos silenciosos de todo lo que sucedió. Un buen analista de logs puede reconstruir un incidente completo, encontrar el IOC que todos pasaron por alto, y atrapar al atacante que pensó que había cubierto sus huellas."_

---

## 🎭 El Escenario: Breach de Servidor Web

### Contexto de Incident Response

Eres el analista principal del SOC de una empresa de e-commerce. A las 3:47 AM, el sistema de detección de intrusiones (IDS) generó una alerta crítica:

```
ALERT: Anomalía de tráfico detectada en web-server-03
Patrón: Múltiples conexiones desde IP sospechosa
Severidad: CRÍTICA
```

El administrador de sistemas te entrega el archivo de logs del servidor:

```
server.log  (1,400+ líneas)
```

El incidente parece contener una fuga de datos. Los atacantes dejaron pistas deliberadamente fragmentadas.

**Tu misión como analista forense**:

1. Procesar y filtrar 1,400+ líneas de logs
2. Identificar patrones de ataque y anomalías
3. Reconstruir el indicador de compromiso (IOC)
4. Generar timeline del incidente

---

## 🧠 Fundamentos de Análisis: La Anatomía de un Log

### Estructura de Logs de Servidor

Los logs de servidor típicamente siguen formatos estándar:

```
# Formato Combinado Apache/Nginx
[1990-08-09 10:00:10] INFO Server started successfully
[1990-08-09 10:00:11] WARN High memory usage detected: 85%
[1990-08-09 10:00:12] ERROR Connection timeout from 192.168.1.100
```

**Componentes clave**:

- **Timestamp**: Cuándo ocurrió el evento
- **Log Level**: INFO, WARN, ERROR, DEBUG, CRITICAL
- **Message**: Descripción del evento
- **Context**: IPs, usuarios, rutas, etc.

### ¿Por qué los Logs son Críticos?

1. **Forense Post-Incidente**: Reconstruir qué sucedió
2. **Detección Temprana**: Identificar ataques en progreso
3. **Cumplimiento**: Auditorías y regulaciones (PCI-DSS, GDPR)
4. **Threat Hunting**: Buscar amenazas desconocidas
5. **Tuning**: Mejorar detección basada en falsos positivos

### Volumen y Escalabilidad

```
Small Server:     ~1MB/día   → grep funciona
Medium Site:      ~100MB/día → awk, sed, scripts
Enterprise:       ~10GB/día  → ELK Stack, Splunk
Cloud Scale:      ~1TB/día   → Data pipelines, ML
```

---

## 🔍 Metodología de Investigación

### Fase 1: Reconocimiento del Dataset

```bash
# Verificar archivo
file server.log
wc -l server.log
ls -lh server.log

# Vista general
head -20 server.log
tail -20 server.log

# Estadísticas básicas
wc -l server.log
awk '{print $3}' server.log | sort | uniq -c  # Contar por log level
```

### Fase 2: Identificación de Patrones

```bash
# Buscar palabras clave sospechosas
grep -i "error\|fail\|attack\|exploit\|flag" server.log

# Identificar IPs únicas
grep -oE '\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b' server.log | sort | uniq -c | sort -rn

# Buscar el patrón FLAGPART
grep "FLAGPART" server.log
```

### Fase 3: Extracción y Reconstrucción

```bash
# Extraer todas las líneas FLAGPART
grep "FLAGPART" server.log

# Eliminar duplicados y ordenar
grep "FLAGPART" server.log | sort -u

# Extraer solo el contenido de la flag
grep "FLAGPART" server.log | awk -F': ' '{print $2}' | sort -u

# Concatenar para formar la flag completa
grep "FLAGPART" server.log | sort -u | awk -F': ' '{print $2}' | tr -d '\n'
```

### Fase 4: Timeline Analysis

```bash
# Timeline de eventos FLAGPART
grep "FLAGPART" server.log | sort

# Extraer timestamps
awk '/FLAGPART/ {print $1, $2}' server.log | tr -d '[]'

# Cronología completa
awk -F'[][]' '/FLAGPART/ {print $2}' server.log
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas de Línea de Comandos

| Herramienta | Uso                     | Ejemplo                    |
| ----------- | ----------------------- | -------------------------- |
| `grep`      | Filtrar por patrón      | `grep "ERROR" logfile`     |
| `awk`       | Procesamiento de campos | `awk '{print $1}' logfile` |
| `sed`       | Transformación de texto | `sed 's/old/new/g'`        |
| `sort`      | Ordenar líneas          | `sort -u` (único)          |
| `uniq`      | Eliminar duplicados     | `uniq -c` (contar)         |
| `cut`       | Extraer campos          | `cut -d' ' -f1`            |
| `tr`        | Traducir caracteres     | `tr -d '\n'`               |
| `head/tail` | Ver inicio/fin          | `head -100`                |

### Herramientas Avanzadas

| Herramienta | Uso                           | Instalación                                   |
| ----------- | ----------------------------- | --------------------------------------------- |
| `lnav`      | Navegador de logs interactivo | `apt install lnav`                            |
| `gron`      | JSON con grep                 | `go install github.com/tomnomnom/gron@latest` |
| `jq`        | Procesador JSON               | `apt install jq`                              |
| `mlr`       | Miller (CSV/TSV)              | `apt install miller`                          |

### Script de Análisis Forense de Logs

```python
#!/usr/bin/env python3
"""
Log Forensics Analyzer - Digital Investigation Tool
For SOC analysts and incident response teams
"""

import re
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
import argparse

class LogForensicsAnalyzer:
    def __init__(self, log_file):
        self.log_file = Path(log_file)
        self.logs = []
        self.timeline = defaultdict(list)
        self.iocs = {
            'ips': Counter(),
            'users': Counter(),
            'paths': Counter(),
            'errors': Counter()
        }

    def parse_logs(self):
        """Parsea el archivo de logs"""
        print(f"[+] Parseando: {self.log_file}")

        with open(self.log_file, 'r') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue

                # Parsear timestamp y nivel
                # Formato esperado: [1990-08-09 10:00:10] LEVEL message
                match = re.match(r'\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (\w+) (.*)', line)

                if match:
                    timestamp_str, level, message = match.groups()
                    try:
                        timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
                    except:
                        timestamp = None

                    entry = {
                        'line_num': line_num,
                        'timestamp': timestamp,
                        'timestamp_str': timestamp_str,
                        'level': level,
                        'message': message,
                        'raw': line
                    }

                    self.logs.append(entry)
                    if timestamp:
                        self.timeline[timestamp.strftime('%Y-%m-%d %H:%M')].append(entry)
                else:
                    # Línea sin formato estándar
                    self.logs.append({
                        'line_num': line_num,
                        'timestamp': None,
                        'level': 'UNKNOWN',
                        'message': line,
                        'raw': line
                    })

        print(f"[+] {len(self.logs)} entradas parseadas")

    def extract_iocs(self):
        """Extrae Indicadores de Compromiso"""
        print("\n[*] Extrayendo IOCs...")

        ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        user_pattern = r'user[:\s=]+(\S+)'
        path_pattern = r'(/[a-zA-Z0-9_/.-]+)'

        for entry in self.logs:
            message = entry['message']

            # IPs
            ips = re.findall(ip_pattern, message)
            self.iocs['ips'].update(ips)

            # Usuarios
            users = re.findall(user_pattern, message, re.IGNORECASE)
            self.iocs['users'].update(users)

            # Rutas
            paths = re.findall(path_pattern, message)
            self.iocs['paths'].update(paths)

            # Errores
            if entry['level'] == 'ERROR':
                self.iocs['errors'][message[:50]] += 1

    def analyze_patterns(self):
        """Analiza patrones sospechosos"""
        print("\n[*] Analizando patrones...")

        suspicious_patterns = {
            'FLAGPART': [],
            'SQL_INJECTION': [],
            'PATH_TRAVERSAL': [],
            'BRUTE_FORCE': [],
        }

        # Contar eventos por minuto para detectar brute force
        events_per_minute = Counter()
        for entry in self.logs:
            if entry['timestamp']:
                key = entry['timestamp'].strftime('%Y-%m-%d %H:%M')
                events_per_minute[key] += 1

        # Buscar FLAGPART
        for entry in self.logs:
            if 'FLAGPART' in entry['message']:
                suspicious_patterns['FLAGPART'].append(entry)

        return suspicious_patterns

    def generate_timeline(self, suspicious_patterns):
        """Genera timeline del incidente"""
        print("\n" + "=" * 60)
        print("TIMELINE DEL INCIDENTE")
        print("=" * 60)

        flag_parts = suspicious_patterns['FLAGPART']
        if flag_parts:
            print(f"\n[+] Flag Parts encontrados: {len(flag_parts)}")
            for entry in flag_parts:
                print(f"    {entry['timestamp_str']} - {entry['message'][:60]}")

        # Top 5 minutos con más actividad
        print("\n[+] Periodos de alta actividad:")
        for period, count in Counter({k: v for k, v in events_per_minute.items()}).most_common(5):
            print(f"    {period}: {count} eventos")

    def generate_ioc_report(self):
        """Genera reporte de IOCs"""
        print("\n" + "=" * 60)
        print("INDICADORES DE COMPROMISO (IOCs)")
        print("=" * 60)

        print("\n[+] Top IPs:")
        for ip, count in self.iocs['ips'].most_common(10):
            print(f"    {ip}: {count} ocurrencias")

        print("\n[+] Top Errores:")
        for error, count in self.iocs['errors'].most_common(5):
            print(f"    {count}x: {error}")

        print("\n[+] Rutas accedidas:")
        for path, count in self.iocs['paths'].most_common(10):
            print(f"    {path}: {count}x")

    def reconstruct_flag(self, suspicious_patterns):
        """Reconstruye la flag desde fragmentos"""
        print("\n" + "=" * 60)
        print("RECONSTRUCCIÓN DE EVIDENCIA")
        print("=" * 60)

        flag_parts = suspicious_patterns['FLAGPART']
        if not flag_parts:
            print("[-] No se encontraron fragmentos de flag")
            return

        # Extraer partes únicas ordenadas por tiempo
        unique_parts = {}
        for entry in flag_parts:
            match = re.search(r'FLAGPART:\s*(.+)', entry['message'])
            if match:
                part = match.group(1)
                if entry['timestamp'] and part not in unique_parts:
                    unique_parts[part] = entry['timestamp']

        # Ordenar por timestamp
        sorted_parts = sorted(unique_parts.items(), key=lambda x: x[1])

        print("\n[+] Partes de la flag (ordenadas cronológicamente):")
        for part, timestamp in sorted_parts:
            print(f"    [{timestamp}] {part}")

        # Reconstruir flag completa
        flag = ''.join([part for part, _ in sorted_parts])
        print(f"\n[+] Flag reconstruida: {flag}")
        return flag

    def run_analysis(self):
        """Ejecuta análisis completo"""
        print(f"[+] Iniciando análisis forense de logs")
        print(f"[*] Archivo: {self.log_file}")
        print("=" * 60)

        self.parse_logs()
        self.extract_iocs()
        suspicious = self.analyze_patterns()
        self.generate_timeline(suspicious)
        self.generate_ioc_report()
        flag = self.reconstruct_flag(suspicious)

        return flag

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Log Forensics Analyzer')
    parser.add_argument('logfile', help='Archivo de logs a analizar')

    args = parser.parse_args()

    analyzer = LogForensicsAnalyzer(args.logfile)
    flag = analyzer.run_analysis()
```

### Uso del Script

```bash
# Ejecutar análisis
python3 log_forensics.py server.log

# Output esperado:
# [+] Iniciando análisis forense de logs
# [*] Archivo: server.log
# ============================================================
# [+] Parseando: server.log
# [+] 1423 entradas parseadas
#
# [*] Extrayendo IOCs...
#
# [*] Analizando patrones...
#
# ============================================================
# TIMELINE DEL INCIDENTE
# ============================================================
#
# [+] Flag Parts encontrados: 27
#     1990-08-09 10:00:10 - FLAGPART: picoCTF{us3_
#     1990-08-09 10:02:55 - FLAGPART: y0urlinux_
#     1990-08-09 10:05:54 - FLAGPART: sk1lls_
#     1990-08-09 10:10:54 - FLAGPART: cedfa5fb}
#
# [+] Flag reconstruida: picoCTF{us3_y0urlinux_sk1lls_cedfa5fb}
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**Caso Target Breach (2013)**:

- Logs mostraron movimiento lateral durante 2 semanas antes de detección
- Malware exfiltró 40M tarjetas de crédito
- **Lección**: Logs son críticos pero necesitan análisis proactivo

**Caso SolarWinds (2020)**:

- Logs de red revelaron comunicaciones C2 sospechosas
- Timeline de 9 meses de actividad no detectada
- **Lección**: Correlación de logs es esencial

**Caso Equifax (2017)**:

- Vulnerabilidad Apache Struts explotada
- Logs mostraron 76 días de actividad maliciosa antes de detección
- **Lección**: Logging adecuado puede reducir MTTD (Mean Time To Detect)

### Mejores Prácticas en Logging

**Centralización**:

```bash
# Usar ELK Stack o Splunk
filebeat → logstash → elasticsearch → kibana
```

**Retención**:

```yaml
Retention_Policies:
  web_access: 90_days
  authentication: 1_year
  security_events: 7_years
  audit_logs: permanent
```

**Formato Estructurado**:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "ERROR",
  "service": "auth-api",
  "user_id": "12345",
  "ip": "192.168.1.100",
  "event": "login_failed",
  "message": "Invalid credentials"
}
```

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Verificar el archivo
wc -l server.log  # ~1400 líneas

# Paso 2: Buscar el patrón FLAGPART
grep "FLAGPART" server.log

# Paso 3: Eliminar duplicados y ordenar
grep "FLAGPART" server.log | sort -u

# Paso 4: Extraer solo las partes de la flag
grep "FLAGPART" server.log | sort -u | awk -F': ' '{print $2}'

# Paso 5: Concatenar sin saltos de línea
grep "FLAGPART" server.log | sort -u | awk -F': ' '{print $2}' | tr -d '\n'
```

### One-liners

```bash
# Versión simple
grep "FLAGPART" server.log | sort -u | grep -oP 'FLAGPART: \K.*' | tr -d '\n'

# Versión con awk
grep "FLAGPART" server.log | sort -u | awk -F': ' '{printf "%s", $2}'

# Versión completa con timestamp
grep "FLAGPART" server.log | sort -t'[' -k2 | awk -F': ' '/FLAGPART/ {printf "%s", $2}'
```

### Flag

```
picoCTF{us3_y0urlinux_sk1lls_cedfa5fb}
```

---

## 📚 Recursos y Referencias

- [SANS Log Analysis](https://www.sans.org/white-papers/coming-age-log-analysis-37172/)
- [Awesome Log Analysis Tools](https://github.com/aliijaz1997/awesome-log-analysis)
- [Elastic Security Labs](https://www.elastic.co/security-labs)
- [Sigma Rules](https://github.com/SigmaHQ/sigma) - Generic SIEM signatures

---

**¿Listo para el siguiente reto?** → Prueba análisis de logs complejos, threat hunting con ELK, o detección de APTs.
