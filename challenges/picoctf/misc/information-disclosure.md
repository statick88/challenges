---
title: "Information Disclosure"
platform: picoCTF
category: misc
difficulty: easy
tags:
  - ctf
  - misc
  - osint
  - information-disclosure
  - picoCTF
  - easy
date: 2026-02-05
flag: picoCTF{information_disclosure_easy}
---

# Information Disclosure - OSINT & Reconnaissance

---

👨‍🏫 **Del Instructor**: Ethical Hacker & OSINT Specialist

> 🎯 **Mentalidad de Hacker**: _"La información que consideras basura es oro para un atacante. Cada comentario HTML, cada metadato, cada archivo robots.txt cuenta una historia. Tu trabajo es escuchar lo que los desarrolladores no quieren que escuches."_

---

## 🎭 El Escenario: Fuga de Información en Aplicación Web

### Contexto de Bug Bounty

Eres un bug bounty hunter auditando "TechStartup Inc.", una nueva plataforma SaaS que acaba de lanzar su MVP. Durante tu reconocimiento inicial, notas que la aplicación parece básica pero prometedora.

**Tu misión como investigador de seguridad**: Realizar reconocimiento pasivo y activo para encontrar información sensible que no debería ser pública - credenciales, rutas internas, datos de desarrollo, o cualquier fuga de información que pueda facilitar un ataque.

---

## 🧠 Fundamentos de Análisis: La Superficie de Ataque Invisible

### ¿Qué es Information Disclosure?

La **fuga de información** ocurre cuando una aplicación revela datos sensibles a usuarios que normalmente no tendrían acceso a ellos. Estos datos pueden ser usados por atacantes para:

1. **Mapear la infraestructura**: Descubrir rutas, tecnologías, arquitectura
2. **Encontrar credenciales**: API keys, contraseñas, tokens hardcodeados
3. **Identificar vulnerabilidades**: Versiones de software, paths de debugging
4. **Social engineering**: Emails, nombres de empleados, información interna

**Fuentes comunes de fugas**:

- HTML comments (`<!-- admin panel at /admin -->`)
- Archivos de configuración expuestos (`.env`, `config.json`)
- Metadatos (EXIF en imágenes, PDF metadata)
- Error messages detallados
- `robots.txt` y `sitemap.xml`
- Repositorios públicos (GitHub, GitLab)
- Documentación Swagger/API expuesta

---

## 🔍 Metodología de Investigación

### Fase 1: Reconocimiento Pasivo (OSINT)

```bash
# Recopilación de subdominios
subfinder -d target.com -o subdomains.txt
amass enum -d target.com

# Wayback Machine para URLs históricas
waybackurls target.com | tee wayback.txt
gau target.com | tee gau.txt

# GitHub reconnaissance
github-search -t "target.com" -s "password\|api_key\|secret"
git-hound --config config.yml

# Google dorks
site:target.com filetype:env
site:target.com filetype:sql
site:target.com intitle:"index of"
```

### Fase 2: Análisis Activo de la Aplicación

```bash
# Inspección de código fuente HTML
curl -s https://target.com | grep -i "<!--"
curl -s https://target.com | grep -i "password\|secret\|key\|api"

# Verificar archivos comunes
curl -s https://target.com/robots.txt
curl -s https://target.com/.env
curl -s https://target.com/config.json
curl -s https://target.com/.git/config
curl -s https://target.com/api/swagger.json

# Fuzzing de directorios
ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt

# Análisis de headers
curl -I https://target.com | grep -i "server\|x-powered\|via"
```

### Fase 3: Análisis de Metadatos

```bash
# Extraer metadatos de imágenes
exiftool image.jpg | grep -i "author\|copyright\|comment"

# Análisis de PDFs
pdfinfo document.pdf
exiftool document.pdf

# Buscar strings en binarios
strings binary_file | grep -i "password\|secret\|key"
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas Esenciales

| Herramienta   | Uso                           | Instalación                                                                |
| ------------- | ----------------------------- | -------------------------------------------------------------------------- |
| `subfinder`   | Descubrimiento de subdominios | `go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest` |
| `amass`       | OSINT y enumeración de DNS    | `snap install amass`                                                       |
| `waybackurls` | URLs históricas               | `go install github.com/tomnomnom/waybackurls@latest`                       |
| `gau`         | GetAllUrls                    | `go install github.com/lc/gau/v2/cmd/gau@latest`                           |
| `ffuf`        | Fuzzer de directorios         | `go install github.com/ffuf/ffuf@latest`                                   |
| `gobuster`    | Directorio/file brute forcer  | `apt install gobuster`                                                     |
| `exiftool`    | Análisis de metadatos         | `apt install libimage-exiftool-perl`                                       |
| `trufflehog`  | Búsqueda de secretos          | `pip3 install trufflehog`                                                  |

### Script de Reconocimiento Automatizado

```python
#!/usr/bin/env python3
"""
Information Disclosure Scanner - OSINT Automation
For authorized security testing only
"""

import requests
import re
import sys
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor
import argparse

class InfoDisclosureScanner:
    def __init__(self, target_url, threads=10):
        self.target_url = target_url
        self.threads = threads
        self.findings = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Security Scanner)'
        })

    def check_common_files(self):
        """Busca archivos comunes que podrían exponer información"""
        common_files = [
            '/robots.txt',
            '/.env',
            '/config.json',
            '/.git/config',
            '/.htaccess',
            '/web.config',
            '/api/swagger.json',
            '/api/docs',
            '/phpinfo.php',
            '/.DS_Store',
            '/sitemap.xml',
            '/admin/',
            '/backup/',
            '/.svn/entries',
            '/.hg/hgrc',
        ]

        print(f"[*] Escaneando archivos comunes...")

        def check_file(path):
            url = urljoin(self.target_url, path)
            try:
                resp = self.session.get(url, timeout=5, allow_redirects=False)
                if resp.status_code == 200:
                    size = len(resp.text)
                    print(f"  [+] {path} - {resp.status_code} ({size} bytes)")
                    return {
                        'type': 'file',
                        'path': path,
                        'status': resp.status_code,
                        'size': size,
                        'content': resp.text[:500]  # Primeros 500 chars
                    }
            except:
                pass
            return None

        with ThreadPoolExecutor(max_workers=self.threads) as executor:
            results = executor.map(check_file, common_files)

        self.findings.extend([r for r in results if r])

    def analyze_html(self):
        """Analiza el HTML en busca de información sensible"""
        print(f"\n[*] Analizando HTML fuente...")

        try:
            resp = self.session.get(self.target_url, timeout=10)
            html = resp.text

            # Buscar comentarios HTML
            comments = re.findall(r'<!--(.*?)-->', html, re.DOTALL)
            for comment in comments:
                comment = comment.strip()
                if len(comment) > 5:
                    print(f"  [+] Comentario HTML encontrado")
                    self.findings.append({
                        'type': 'html_comment',
                        'content': comment[:200]
                    })

            # Buscar patrones sensibles
            patterns = {
                'api_key': r'api[_-]?key\s*[=:]\s*["\']([^"\']+)["\']',
                'secret': r'secret\s*[=:]\s*["\']([^"\']+)["\']',
                'password': r'password\s*[=:]\s*["\']([^"\']+)["\']',
                'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
                'internal_ip': r'\b(?:192\.168\.|10\.|172\.(?:1[6-9]|2[0-9]|3[01])\.)[0-9.]+\b',
            }

            for pattern_name, pattern in patterns.items():
                matches = re.findall(pattern, html, re.IGNORECASE)
                for match in matches:
                    print(f"  [+] {pattern_name.upper()}: {match}")
                    self.findings.append({
                        'type': pattern_name,
                        'content': match
                    })

            # Buscar rutas en JavaScript
            js_paths = re.findall(r'["\'](/[^"\']*(?:api|admin|internal)[^"\']*)["\']', html)
            for path in set(js_paths):
                print(f"  [+] Ruta potencial: {path}")
                self.findings.append({
                    'type': 'potential_path',
                    'content': path
                })

        except Exception as e:
            print(f"  [-] Error analizando HTML: {e}")

    def check_headers(self):
        """Analiza headers HTTP"""
        print(f"\n[*] Analizando headers HTTP...")

        try:
            resp = self.session.head(self.target_url, timeout=10)

            interesting_headers = ['server', 'x-powered-by', 'via',
                                   'x-aspnet-version', 'x-generator']

            for header in interesting_headers:
                if header in resp.headers:
                    value = resp.headers[header]
                    print(f"  [+] {header}: {value}")
                    self.findings.append({
                        'type': 'header',
                        'header': header,
                        'value': value
                    })
        except Exception as e:
            print(f"  [-] Error: {e}")

    def generate_report(self):
        """Genera reporte de hallazgos"""
        print("\n" + "=" * 60)
        print("REPORTE DE INFORMATION DISCLOSURE")
        print("=" * 60)
        print(f"\nTarget: {self.target_url}")
        print(f"Hallazgos totales: {len(self.findings)}")
        print("\nDetalles:")

        for i, finding in enumerate(self.findings, 1):
            print(f"\n{i}. Tipo: {finding['type']}")
            for key, value in finding.items():
                if key != 'type' and value:
                    print(f"   {key}: {str(value)[:100]}")

    def scan(self):
        """Ejecuta escaneo completo"""
        print(f"[+] Iniciando Information Disclosure Scan")
        print(f"[*] Target: {self.target_url}")
        print("=" * 60)

        self.check_common_files()
        self.analyze_html()
        self.check_headers()
        self.generate_report()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Information Disclosure Scanner')
    parser.add_argument('url', help='URL objetivo')
    parser.add_argument('-t', '--threads', type=int, default=10, help='Número de threads')

    args = parser.parse_args()

    scanner = InfoDisclosureScanner(args.url, args.threads)
    scanner.scan()
```

### Uso del Script

```bash
# Instalar dependencias
pip3 install requests

# Ejecutar escaneo
python3 info_disclosure_scanner.py https://target.com

# Output esperado:
# [+] Iniciando Information Disclosure Scan
# [*] Target: https://target.com
# ============================================================
# [*] Escaneando archivos comunes...
#   [+] /robots.txt - 200 (234 bytes)
#   [+] /.env - 200 (156 bytes)
#
# [*] Analizando HTML fuente...
#   [+] Comentario HTML encontrado
#   [+] API_KEY: sk_live_12345...
#
# [*] Analizando headers HTTP...
#   [+] server: nginx/1.18.0
#   [+] x-powered-by: PHP/7.4.3
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**Caso Uber (2016)**:

- Credentials expuestas en repositorio GitHub público
- AWS keys comprometidas
- Impacto: Datos de 57 millones de usuarios
- **Lección**: Repositorios públicos son minas de oro para atacantes

**Caso Tesla (2018)**:

- Kubernetes console expuesta sin autenticación
- Cryptominer desplegado en infraestructura
- **Lección**: Dashboards administrativos deben estar protegidos

**Caso Capital One (2019)**:

- SSRF + Information disclosure
- 100+ millones de registros expuestos
- **Lección**: Metadatos cloud pueden ser peligrosos

### OWASP Top 10 Relacionados

- **A01:2021 – Broken Access Control**: Acceso a información sin autorización
- **A05:2021 – Security Misconfiguration**: Configuraciones por defecto inseguras
- **A06:2021 – Vulnerable and Outdated Components**: Versión expuesta en headers

### Defensa y Mitigación

**Prevención**:

```bash
# Remover comentarios HTML en producción
# Usar build process que limpia comentarios

# Proteger archivos sensibles
location ~ /\. {
    deny all;
}

location ~ ^/(\.env|config\.json|\.git) {
    deny all;
}

# Headers de seguridad
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
server_tokens off;
```

**IOCs**:

- Respuestas 200 en archivos `.env`, `config`
- Comentarios HTML con rutas internas
- Headers que revelan versiones exactas
- Repositorios Git expuestos

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Revisar código fuente
curl -s http://example.com | grep -i "<!--"
# <!-- admin panel at /admin-panel -->

# Paso 2: Verificar robots.txt
curl -s http://example.com/robots.txt
# User-agent: *
# Disallow: /admin-panel
# Disallow: /secret-config

# Paso 3: Acceder a rutas descubiertas
curl -s http://example.com/secret-config
# {"flag": "picoCTF{information_disclosure_easy}"}
```

### Flag

```
picoCTF{information_disclosure_easy}
```

---

## 📚 Recursos y Referencias

- [OWASP Information Disclosure](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/)
- [PayloadsAllTheThings - Information Disclosure](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Information%20Disclosure)
- [Bug Bounty Hunter Methodology](https://github.com/0xmaximus/Galaxy-Bugbounty-Checklist)
- [GitHub OSINT Tools](https://github.com/jivoi/awesome-osint)

---

**¿Listo para el siguiente reto?** → Prueba reconocimiento avanzado, análisis de APIs, o bug bounty hunting real.
