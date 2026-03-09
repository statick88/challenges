---
title: "HTB Academy - Nmap Full Port Scan"
category: ctf
difficulty: easy
tags: ["nmap", "enumeration", "htb-academy", "full-scan"]
date: 2026-02-19
status: completed
platform: HTB
flag: "31337"
---

# 🎓 HTB Academy - Nmap Full Port Scan

## 🎭 Escaneo Completo de Puertos con Nmap

---

👨‍🏫 **Del Instructor**: En el mundo del Ethical Hacking, la diferencia entre un escaneo rápido y uno completo puede significar encontrar vulnerabilidades críticas. Hoy aprenderás a realizar un escaneo exhaustivo de todos los puertos TCP y generar informes profesionales.

> 🎯 **Mentalidad de Hacker**: "La paciencia es virtud en el escaneo de redes. Un análisis completo revela lo que los escaneos rápidos pierden: puertos no estándar, servicios ocultos y vectores de ataque inesperados."

---

## 🎭 El Escenario: Auditoría de Red Profunda

Eres un pentester contratado para auditar la seguridad de un servidor corporativo. A diferencia del escaneo rápido, esta vez necesitas un análisis completo para descubrir TODOS los servicios expuestos, incluyendo aquellos en puertos no convencionales.

**Tu misión como Ethical Hacker**:

- Realizar un escaneo completo de todos los puertos TCP (65535 puertos)
- Generar un informe HTML profesional del escaneo
- Identificar el puerto más alto encontrado
- Documentar cada servicio expuesto

## 🧠 Fundamentos de Análisis: Escaneo Exhaustivo vs Rápido

### ¿Por qué hacer un escaneo completo?

Los escaneos rápidos (`nmap` por defecto) solo analizan los 1000 puertos más comunes. Esto deja fuera:

- **Puertos de administración** (2222, 9000, 10000)
- **Servicios internos** (3306, 5432, 6379)
- **Backdoors y reverse shells** (31337, 4444, 1337)
- **Servicios personalizados** (8080, 8443, 12345)

### Opciones de Escaneo de Nmap

| Opción | Descripción |
|--------|-------------|
| `-p-` | Todos los puertos TCP (1-65535) |
| `-p 1-1000` | Rango específico de puertos |
| `-T5` | Timing más rápido (agresivo) |
| `-Pn` | Sin ping (ignorar detección de host) |
| `-oX` | Salida en formato XML |

## 🔍 Metodología de Investigación: Ejecución del Escaneo Completo

### Paso 1: Conexión al Laboratorio

```bash
# Conectar a la VPN de HTB Academy
openvpn academy-regular.ovpn

# O usar Pwnbox (entorno basado en navegador)
ssh htb-ac-2300153@htb-xxx.htb-cloud.com
```

### Paso 2: Verificar Conectividad con el Objetivo

```bash
# Verificar que el target está activo
ping -c 3 10.129.4.45
```

**Análisis**:
- El ping confirma que el host está activo (0% packet loss)
- Tiempo de respuesta: ~82ms (típico de laboratorios cloud)

### Paso 3: Escaneo Completo de Puertos TCP

```bash
sudo nmap -p- -Pn -T5 -oX scan.xml 10.129.4.45
```

**Análisis de Opciones**:

- `-p-`: Escanea todos los 65535 puertos TCP
- `-Pn`: Desactiva el ping (algunos hosts bloquean ICMP)
- `-T5`: Timing agresivo para escaneo rápido
- `-oX scan.xml`: Salida en formato XML para procesamiento

**Resultados del Escaneo**:

```
PORT      STATE SERVICE
22/tcp    open  ssh
80/tcp    open  http
110/tcp   open  pop3
139/tcp   open  netbios-ssn
143/tcp   open  imap
445/tcp   open  microsoft-ds
31337/tcp open  Elite
```

### Paso 4: Generar Informe HTML

```bash
xsltproc scan.xml -o scan.html
```

**Análisis**:
- `xsltproc` transforma el XML a HTML usando hojas de estilo XSLT
- El informe HTML es útil para presentaciones a clientes

### Paso 5: Extraer el Puerto Más Alto

```bash
grep -oP 'portid="\K[0-9]+' scan.xml | sort -n | tail -1
```

**Resultado**: **31337**

> 💡 **Nota técnica**: El puerto 31337 (pronunciado "eleet") es históricamente usado por backdoors y servicios de prueba. En este caso, es un servicio "Elite" que revela información del sistema.

## 🛠️ Arsenal de Herramientas

- **Nmap**: Escáner de puertos principal
- **xsltproc**: Transformador XSLT para generar HTML
- **grep/sort**: Extracción de datos del XML

## ✅ Checklist de Verificación

- [x] VPN de HTB conectada
- [x] Target 10.129.4.45 accesible (ping exitoso)
- [x] Escaneo completo de puertos TCP ejecutado (`-p-`)
- [x] Puerto más alto identificado: 31337
- [x] Informe HTML generado con xsltproc
- [x] Respuesta enviada a HTB Academy

## 🎓 Lo Que Acabas de Aprender

**Habilidades Técnicas**:

- Escaneo completo de todos los puertos TCP
- Generación de informes XML y HTML
- Procesamiento de resultados con herramientas Unix
- Optimización de timing de escaneo

**Mentalidad Desarrollada**:

- **Exhaustividad**: No asumir que los escaneos rápidos son suficientes
- **Documentación**: Informes profesionales son esenciales para clientes
- **Verificación**: Siempre confirmar conectividad antes de escanear

## 🚀 Próximos Pasos

1. **Aprende NSE**: Scripts de Nmap para enumeración avanzada
2. **Escaneo UDP**: No solo TCP - UDP también tiene servicios vitales
3. **Automatización**: Integra escaneos en pipelines de pentesting

## 📚 Recursos

- [Nmap Documentation](https://nmap.org/docs.html)
- [HTB Academy - Network Enumeration](https://academy.hackthebox.com/module/details/19)
- [Nmap Timing Templates](https://nmap.org/book/man-performance.html)

---

## ✅ Estado

**COMPLETADO** 🎉

- 📅 Fecha: 2026-02-19
- ⏱️ Tiempo: 5 minutos
- 🎯 Dificultad: Fácil
- 🎯 Puerto Encontrado: **31337**
