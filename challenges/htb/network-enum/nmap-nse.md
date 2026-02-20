---
title: "HTB Academy - Nmap Scripting Engine (NSE)"
category: htb
difficulty: easy
tags: ["nmap", "nse", "enumeration", "htb-academy", "http-enum", "scripts"]
date: 2026-02-20
status: completed
platform: HTB
flag: "HTB{873nniuc71bu6usbs1i96as6dsv26}"
---

# HTB Academy - Nmap Scripting Engine (NSE)

## 🎓 Del Instructor: El Poder de los Scripts NSE

Nmap Scripting Engine (NSE) extiende las capacidades de Nmap más allá del simple escaneo de puertos. Con más de 600 scripts disponibles, NSE puede detectar vulnerabilidades, enumerar servicios, e incluso encontrar flags ocultas.

> 🎯 **Mentalidad de Hacker**: "NSE es tu ejército de scripts automatizados. Pero recuerda: siempre verifica los resultados con herramientas básicas. Un simple curl puede revelar lo que un script complejo pasó por alto."

---

## 🎭 El Escenario: NSE Discovery

**Plataforma**: Hack The Box Academy  
**Módulo**: Network Enumeration with Nmap  
**Sección**: Nmap Scripting Engine  
**Target**: 10.129.4.45 (ACADEMY-NMAP-DEFAULT)

### Objetivo

Usar NSE y sus scripts para encontrar el flag que uno de los servicios contiene.

---

## 🧠 Fundamentos: Categorías NSE

| Categoría | Descripción | Uso Común |
|-----------|-------------|-----------|
| `auth` | Detección de credenciales | Brute force, autenticación |
| `broadcast` | Descubrimiento por broadcast | Host discovery |
| `brute` | Ataques de fuerza bruta | Credenciales |
| `default` | Scripts por defecto (-sC) | Enumeración general |
| `discovery` | Evaluación de servicios | Información del objetivo |
| `exploit` | Explotación de vulnerabilidades | Known CVEs |
| `safe` | Scripts no intrusivos | Safe enumeration |
| `vuln` | Detección de vulnerabilidades | CVE scanning |

---

## 🔍 Metodología de Investigación

### Paso 1: HTTP Enumeration con http-enum

```bash
sudo nmap 10.129.4.45 -p 80 --script http-enum
```

**Output:**
```
PORT   STATE SERVICE
80/tcp open  http
| http-enum: 
|_  /robots.txt: Robots file
```

**Análisis**: El script detectó `/robots.txt` pero no mostró su contenido.

### Paso 2: Vulnerability Scan con vuln

```bash
sudo nmap 10.129.4.45 -p 80 -sV --script vuln
```

**Output**: Lista extensa de CVEs para Apache 2.4.29, pero sin flag.

### Paso 3: Verificación Manual

```bash
curl http://10.129.4.45/robots.txt
```

**Output:**
```
User-agent: *
Allow: /

HTB{873nniuc71bu6usbs1i96as6dsv26}
```

**¡Flag encontrada!**

---

## 🛠️ Scripts NSE Útiles

### HTTP Scripts

```bash
# Enumeración HTTP
nmap -p 80 --script http-enum <target>

# Banner y headers
nmap -p 80 --script banner,http-headers <target>

# Título y generador
nmap -p 80 --script http-title,http-generator <target>

# Todos los scripts HTTP
nmap -p 80 --script "http-*" <target>
```

### SMB Scripts

```bash
# Enumeración de shares
nmap -p 139,445 --script smb-enum-shares <target>

# Descubrimiento de OS
nmap -p 139,445 --script smb-os-discovery <target>
```

### Vulnerability Scripts

```bash
# Escaneo de vulnerabilidades
nmap -p 80 --script vuln <target>

# Scripts específicos
nmap -p 80 --script http-sql-injection,http-xss <target>
```

---

## 📊 Lecciones Aprendidas

### Error Común

| Comportamiento | Problema |
|---------------|----------|
| Confiar solo en NSE | Scripts pueden pasar por alto contenido |
| Ignorar archivos detectados | `robots.txt` puede contener información sensible |
| No verificar manualmente | Siempre confirmar con herramientas básicas |

### Flujo Correcto

```
NSE detecta archivo → Verificar con curl/wget → Analizar contenido → Encontrar flag
```

---

## ✅ Checklist de Verificación

- [x] Scripts NSE ejecutados
- [x] `http-enum` detectó `/robots.txt`
- [x] Contenido verificado con curl
- [x] Flag encontrada: `HTB{873nniuc71bu6usbs1i96as6dsv26}`

---

## 🚀 Próximos Pasos

1. **Explorar más categorías NSE**: `auth`, `brute`, `exploit`
2. **Crear scripts personalizados**: Lua para casos específicos
3. **Automatizar con scripts combinados**: Múltiples categorías

---

## 📚 Recursos

- [Nmap NSE Documentation](https://nmap.org/nsedoc/)
- [NSE Scripts Categories](https://nmap.org/book/nse-usage.html#nse-categories)
- [Writing NSE Scripts](https://nmap.org/book/nse-tutorial.html)

---

## ✅ Estado

**COMPLETADO** 🎉

- 📅 Fecha: 2026-02-20
- ⏱️ Tiempo: 10 minutos
- 🎯 Dificultad: Fácil
- 🚩 Flag: `HTB{873nniuc71bu6usbs1i96as6dsv26}`
- 🎯 Ubicación: `/robots.txt`
