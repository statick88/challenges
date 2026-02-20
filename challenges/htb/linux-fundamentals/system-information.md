---
title: "Linux Fundamentals - System Information"
category: htb
difficulty: easy
tags: [linux, system-info, ssh, uname, passwd]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 6
---

# Linux Fundamentals - System Information

## Objetivo

Aprender a obtener información del sistema Linux usando comandos básicos de enumeración. Este ejercicio cubre la recopilación de información esencial como hardware, usuarios, kernel y configuración de red.

---

## Conexión al Target

```bash
ssh htb-student@10.129.2.219
# Password: HTB_@cademy_stdnt!
```

---

## Preguntas y Soluciones

### Question 1: Machine Hardware Name

**Pregunta:** Find out the machine hardware name and submit it as the answer.

**Solución:**
```bash
uname -m
```

**Output:**
```
x86_64
```

**Respuesta:** `x86_64`

---

### Question 2: Home Directory Path

**Pregunta:** What is the path to htb-student's home directory?

**Solución:**
```bash
grep htb-student /etc/passwd | cut -d: -f6
```

**Alternativa:**
```bash
echo $HOME
pwd
```

**Output:**
```
/home/htb-student
```

**Respuesta:** `/home/htb-student`

---

### Question 3: Mail Path

**Pregunta:** What is the path to the htb-student's mail?

**Solución:**
```bash
ls /var/mail/
```

El path estándar para el mail de usuarios en Linux es `/var/mail/<username>`.

**Respuesta:** `/var/mail/htb-student`

---

### Question 4: User Shell

**Pregunta:** Which shell is specified for the htb-student user?

**Solución:**
```bash
grep htb-student /etc/passwd | cut -d: -f7
```

**Output:**
```
/bin/bash
```

**Respuesta:** `/bin/bash`

---

### Question 5: Kernel Release

**Pregunta:** Which kernel release is installed on the system? (Format: 1.22.3)

**Solución:**
```bash
uname -r
```

**Output:**
```
4.15.0-123-generic
```

HTB requiere el formato simplificado (X.Y.Z), por lo que tomamos solo los primeros 3 números.

**Respuesta:** `4.15.0`

---

### Question 6: Network Interface with MTU 1500

**Pregunta:** What is the name of the network interface that MTU is set to 1500?

**Solución:**
```bash
ip link show | grep "mtu 1500"
```

**Output:**
```
2: ens192: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
```

**Respuesta:** `ens192`

---

## Conceptos Clave

### Estructura de /etc/passwd

El archivo `/etc/passwd` contiene información de usuarios con el siguiente formato:

```
username:x:uid:gid:GECOS:home:shell
```

| Campo | Descripción |
|-------|-------------|
| username | Nombre del usuario |
| x | Placeholder de la contraseña (está en /etc/shadow) |
| uid | User ID |
| gid | Group ID principal |
| GECOS | Comentarios/info del usuario (puede incluir mail) |
| home | Directorio home del usuario |
| shell | Shell por defecto |

**Ejemplo:**
```
htb-student:x:1002:1002::/home/htb-student:/bin/bash
```

### Comandos de Sistema

| Comando | Descripción |
|---------|-------------|
| `uname -m` | Arquitectura del hardware |
| `uname -r` | Versión del kernel (release) |
| `uname -a` | Toda la información del sistema |
| `hostname` | Nombre del host |
| `whoami` | Usuario actual |
| `id` | IDs y grupos del usuario |
| `ip link show` | Interfaces de red |
| `ifconfig` | Configuración de red (deprecated) |

---

## Lecciones Aprendidas

1. **uname** es fundamental para enumeración de sistemas
2. **/etc/passwd** es una fuente clave de información de usuarios
3. El formato de respuestas importa (HTB puede requerir formatos específicos)
4. **ip link show** reemplaza a ifconfig en sistemas modernos
5. El path estándar de mail es `/var/mail/<username>`

---

## Referencias

- [uname man page](https://man7.org/linux/man-pages/man1/uname.1.html)
- [/etc/passwd format](https://man7.org/linux/man-pages/man5/passwd.5.html)
- [ip command](https://man7.org/linux/man-pages/man8/ip.8.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 6 - System Information
- Respuestas correctas: 6/6
