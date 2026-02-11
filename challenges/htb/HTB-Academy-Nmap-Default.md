---
title: "HTB Academy - Nmap Default"
category: ctf
difficulty: easy
tags: ["nmap", "enumeration", "htb-academy"]
date: 2026-02-11
status: completed
platform: HTB
flag: HTB{pr0F7pDv3r510nb4nn3r}
---

# 🎓 HTB Academy - Nmap Default

## 🎭 Enumeración Básica con Nmap

---

👨‍🏫 **Del Instructor**: Bienvenido a tu primer reto de Hack The Box Academy. Como Ethical Hacker, la enumeración es el primer paso crítico en cualquier pentest. Hoy exploraremos el uso fundamental de Nmap para mapear puertos y servicios en un objetivo simulado.

> 🎯 **Mentalidad de Hacker**: "Nada es lo que parece. Cada puerto abierto cuenta una historia sobre el sistema objetivo. Piensa como un detective: recopila pistas sistemáticamente antes de actuar."

---

## 🎭 El Escenario: Investigación de Red Corporativa

Imagina que eres un consultor de ciberseguridad contratado por una empresa para auditar su red interna. Has recibido una IP objetivo (10.129.43.41) de un servidor Linux Ubuntu que supuestamente debería estar protegido. Tu misión es identificar todos los servicios expuestos y recopilar información crítica sobre el host.

**Tu misión como Ethical Hacker**:

- Descubrir todos los puertos TCP abiertos en el objetivo
- Enumerar el nombre del host (hostname) de manera precisa
- Documentar cada hallazgo con explicaciones técnicas

## 🧠 Fundamentos de Análisis: Nmap como Herramienta de Reconocimiento

Nmap (Network Mapper) es el escáner de puertos más poderoso y versátil disponible. Sus capacidades van más allá del simple escaneo de puertos:

- **Escaneo de Puertos**: Identifica qué puertos están abiertos, cerrados o filtrados
- **Detección de Servicios**: Intenta determinar qué servicios corren en cada puerto
- **Detección de OS**: Analiza respuestas para identificar el sistema operativo
- **Version Scanning**: Obtiene versiones exactas de servicios y software

En un entorno real, esta información es crucial para:

- Identificar vectores de ataque potenciales
- Planificar estrategias de explotación
- Evaluar la superficie de ataque del objetivo

## 🔍 Metodología de Investigación: Enfoque Sistemático de Enumeración

### Paso 1: Preparación del Entorno

Primero, conectémonos al laboratorio de HTB Academy:

```bash
# Conectar a la VPN de HTB
openvpn academy-regular.ovpn

# Acceder a Pwnbox vía SSH
ssh htb-ac-2300153@htb-qyd5plq1et.htb-cloud.com
```

> 💡 **Nota técnica**: La VPN asegura que estamos en la misma red que el objetivo, permitiendo comunicación directa con IPs privadas como 10.129.43.41.

### Paso 2: Escaneo Completo de Puertos

El primer paso en cualquier enumeración es identificar todos los puertos TCP abiertos:

```bash
nmap -p- 10.129.43.41
```

**Análisis**:

- `-p-` escanea todos los 65535 puertos TCP (no solo los 1000 más comunes)
- Esto es crucial porque muchos servicios corren en puertos no estándar
- En este caso, descubrimos 7 puertos abiertos: 22, 80, 110, 139, 143, 445, 31337

> ⚠️ **Advertencia**: Un escaneo completo puede tomar tiempo y generar logs en el objetivo. En entornos de producción, considera la discreción.

### Paso 3: Enumeración de Servicios y Versiones

Una vez identificados los puertos, determinemos qué servicios corren en ellos:

```bash
nmap -sV 10.129.43.41
```

**Análisis del Output**:

- **Puerto 22 (SSH)**: OpenSSH 7.6p1 Ubuntu - Acceso remoto seguro
- **Puerto 80 (HTTP)**: Apache 2.4.29 - Servidor web
- **Puerto 110 (POP3)**: Dovecot - Protocolo de correo electrónico
- **Puerto 139/445 (NetBIOS/SMB)**: Samba - Compartición de archivos Windows/Linux
- **Puerto 143 (IMAP)**: Dovecot - Otro protocolo de correo
- **Puerto 31337**: Servicio personalizado que revela la flag HTB{pr0F7pDv3r510nb4nn3r}

> 💡 **Nota técnica**: El puerto 31337 es inusual - típicamente usado por backdoors o servicios personalizados. El banner revela directamente la flag, mostrando un error de configuración común.

## ✅ Checklist de Verificación

- [x] VPN de HTB conectada correctamente
- [x] Acceso a Pwnbox establecido
- [x] Escaneo completo de puertos ejecutado (-p-)
- [x] 7 puertos TCP identificados correctamente
- [x] Servicios enumerados con versiones (-sV)
- [x] Hostname extraído: NIX-NMAP-DEFAULT
- [x] Flag capturada del banner del puerto 31337

## 🎓 Lo Que Acabas de Aprender: Mentalidad Desarrollada

Este reto te ha enseñado los fundamentos de la enumeración sistemática:

**Habilidades Técnicas**:

- Uso básico de Nmap para escaneo de puertos y servicios
- Interpretación de outputs de escaneo
- Identificación de servicios comunes (SSH, HTTP, SMB, email)
- Reconocimiento de puertos no estándar y servicios personalizados

**Mentalidad de Hacker Desarrollada**:

- **Metodología Sistemática**: Siempre empezar con reconocimiento amplio antes de profundizar
- **Atención al Detalle**: Cada puerto cuenta una historia sobre el sistema
- **Curiosidad Investigativa**: ¿Por qué un puerto personalizado revela información sensible?
- **Documentación Rigurosa**: Registrar cada comando y hallazgo para análisis posterior

## 🚀 Próximos Pasos: Evolución en la Carrera de Hacker

1. **Profundiza en Nmap**: Aprende opciones avanzadas como `-sC` (scripts NSE), `-O` (detección OS), y escaneo UDP
2. **Explora Servicios**: Una vez enumerados, investiga vulnerabilidades en SSH 7.6p1, Apache 2.4.29, Samba 3.X-4.X
3. **HTB Machines**: Pasa de Academy a máquinas reales con desafíos más complejos
4. **Herramientas Complementarias**: Integra nmap con tools como nikto, dirbuster, o metasploit

## 📚 Recursos y Referencias

- [Nmap Official Documentation](https://nmap.org/docs.html)
- [HTB Academy - Nmap Module](https://academy.hackthebox.com/module/details/19)
- [Samba Security Best Practices](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html)
- [Common Ports and Services](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers)

---

## ✅ Estado

**COMPLETADO** 🎉

- 📅 Fecha: 2026-02-11
- ⏱️ Tiempo: 15 minutos
- 🎯 Dificultad: Fácil (Beginner)
