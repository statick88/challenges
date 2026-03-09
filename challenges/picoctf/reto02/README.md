---
title: "Reto 02 - Server Log Hunt"
category: ctf
difficulty: easy
tags: ["ctf", "forensics", "logs", "grep", "picoCTF"]
date: 2025-02-03
status: completed
platform: picoCTF
flag: picoCTF{logz_babyyyy_6ae3c2fb}
---

# 🎓 Reto 02 - Server Log Hunt

## 🎭 Análisis de Logs de Servidor

---

👨‍🏫 **Del Instructor**: En este reto aprenderás análisis de logs, una habilidad crucial para cualquier ethical hacker que investiga incidentes de seguridad.

> 💭 **Mentalidad de Hacker**: "Los logs cuentan historias. Cada entrada es evidencia. Busca patrones que otros ignoran."

---

## 🎭 El Escenario: Investigación de Acceso Sospechoso

Eres administrador de sistemas que detectó acceso no autorizado. Tienes logs del servidor Apache y necesitas encontrar la flag que el atacante dejó.

**Tu misión como Ethical Hacker**:

- Analizar logs de acceso HTTP
- Identificar patrones de requests sospechosos
- Extraer la información oculta en los logs

## 🧠 Fundamentos de Análisis de Logs

Los logs de servidor registran todas las requests. Atacantes pueden usar técnicas para ocultar data en headers, paths, o fragmentar información.

## 🛠️ Metodología de Investigación Paso a Paso

### Paso 1: Exploración Inicial

```bash
head -20 server.log
tail -20 server.log
wc -l server.log
```

**Análisis**: Examinar estructura del log y volumen de entries.

### Paso 2: Búsqueda de Patrones

```bash
grep -i flag server.log
grep "GET" server.log | head -10
```

**Análisis**: Buscar menciones directas de flag o requests GET sospechosos.

> 💡 **Nota técnica**: Atacantes fragmentan flags en múltiples requests para evadir detección.

### Paso 3: Extracción de Flag

```bash
grep "picoCTF" server.log
strings server.log | grep picoCTF
```

**Análisis**: Buscar partes de la flag y reconstruirla.

## ✅ Checklist de Verificación

- [x] Log analizado con grep
- [x] Patrones de requests identificados
- [x] Partes de flag encontradas y reconstruidas
- [x] Flag completa extraída

## 🎓 Lo Que Acabas de Aprender

Técnicas de análisis de logs: grep, patrones de búsqueda, reconstrucción de información fragmentada.

**Mentalidad desarrollada**: Paciencia y atención al detalle en grandes volúmenes de data.

## 🚀 Próximos Pasos

1. Aprende expresiones regulares avanzadas
2. Practica con logs de diferentes servicios
3. Explora herramientas de análisis automatizado

## 📚 Recursos

- [Apache Log Analysis](https://httpd.apache.org/docs/current/logs.html)
- [Grep Tutorial](https://www.gnu.org/software/grep/manual/grep.html)

---

## ✅ Estado

**COMPLETADO** 🎉

- 📅 Fecha: 2025-02-03
- ⏱️ Tiempo: 10 minutos
- 🎯 Dificultad: Fácil

# Reto 02 - Server Log Hunt

## 📋 Descripción

Archivo de log con flag fragmentada.

## 📁 Archivos

- `server.log` - Log del servidor con partes de la flag

## 🔗 Writeup

Ver: [reto02-log-hunt.md](../reto02-log-hunt.md)

## 🏷️ Tags

- `#ctf` `#forensics` `#logs` `#grep` `#picoCTF`
