---
title: "Reto 07: Secure Root SSH Access - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - security
  - permissions
date: 2025-01-25
status: blocked
---

# Reto 07: Secure Root SSH Access - xFusionCorp Industries

## Hardening SSH: Protegiendo la Llave Maestra del Reino

---

## 🎓 Del Instructor

Bienvenido a tu octavo desafío como SysAdmin Senior en xFusionCorp. Hoy abordamos uno de los aspectos más críticos de seguridad en sistemas Linux: **el endurecimiento del acceso SSH para el usuario root**.

> 💭 **Mentalidad de SysAdmin**: "El acceso root por SSH es como tener la llave maestra del edificio. Si un atacante la obtiene, tiene control total. Por eso debe ser inaccesible excepto bajo las condiciones más estrictas."

El servicio SSH es la puerta principal a tus servidores. Si está mal configurado, es el vector de ataque más común. Este reto enseña las mejores prácticas de hardening que deben aplicarse en CUALQUIER servidor en producción.

---

## 🎭 Escenario Real: Hardening Post-Instalación en Stratos Datacenter

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Hardening de Infraestructura  
**Servidor**: stapp01 (servidor crítico de aplicaciones)  
**Tu rol**: Senior System Administrator - Seguridad

### La Problemática

El servidor stapp01 fue recientemente aprovisionado con configuraciones SSH por defecto. El equipo de CISO identificó las siguientes vulnerabilidades:

- Acceso root permitido con contraseña (riesgo de fuerza bruta)
- Puerto SSH estándar (22) - objetivo conocido para ataques
- Autenticación por contraseña habilitada para todos los usuarios
- Protocolo SSH versión 1 aún soportado (obsoleto e inseguro)

**El requerimiento del CISO**:

> "Configure secure SSH access for root user with key-based authentication."

### Contexto de Seguridad

Los ataques de fuerza bruta contra SSH son omnipresentes en Internet. Un servidor con puerto 22 expuesto y root accesible por contraseña será atacado dentro de minutos de estar en línea.

El endurecimiento SSH es una de las primeras tareas post-instalación y nunca debe omitirse.

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito         |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | ----------------- |
| stapp01  | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony           | Ir0nM@n    | SSH Configuration |

### Requisitos Técnicos

- **Autenticación**: Solo clave SSH (deshabilitar contraseña)
- **Puerto**: Cambiar de 22 a 2222 (ofuscación de seguridad)
- **Acceso root**: Permitir solo con clave SSH
- **Protocolo**: SSH-2 exclusivamente (deshabilitar SSH-1)
- **Seguridad adicional**: Deshabilitar login de usuarios sin clave

---

## 🧠 La Arquitectura: Seguridad SSH Profunda

### ¿Por Qué SSH es un Vector Crítico?

SSH (Secure Shell) es el protocolo de acceso remoto estándar en Linux. Proporciona:

- Acceso remoto encriptado
- Transferencia de archivos (SCP/SFTP)
- Túneles seguros para otros servicios

**Pero también es el objetivo #1 para atacantes porque:**

1. Está expuesto a Internet en la mayoría de servidores
2. Provee acceso shell completo si se compromete
3. Los ataques de fuerza bruta son automatizados y escalables
4. Las contraseñas débiles son comunes

### Archivos de Configuración SSH

```
/etc/ssh/sshd_config     # Configuración del servidor SSH (DEMONIO)
/etc/ssh/ssh_config      # Configuración del cliente SSH
/etc/ssh/sshd_config.d/  # Directorio de configuraciones adicionales
/etc/ssh/ssh_host_*      # Claves del host (identidad del servidor)
~/.ssh/authorized_keys   # Claves públicas permitidas (por usuario)
~/.ssh/id_*              # Claves privadas del usuario
~/.ssh/known_hosts       # Servidores conocidos (cliente)
```

### Opciones Críticas de Hardening

| Opción                   | Valor Seguro                             | Propósito                                                  |
| ------------------------ | ---------------------------------------- | ---------------------------------------------------------- |
| `Port`                   | 2222                                     | Ofuscación del puerto (no es seguridad, pero reduce ruido) |
| `PermitRootLogin`        | `without-password` o `prohibit-password` | Root solo con clave, nunca contraseña                      |
| `PasswordAuthentication` | `no`                                     | Deshabilitar contraseñas completamente                     |
| `PubkeyAuthentication`   | `yes`                                    | Habilitar autenticación por clave                          |
| `Protocol`               | `2`                                      | Solo SSH protocolo 2 (SSH-1 es obsoleto)                   |
| `PermitEmptyPasswords`   | `no`                                     | Bloquear cuentas sin contraseña                            |
| `MaxAuthTries`           | 3                                        | Limitar intentos de autenticación                          |
| `ClientAliveInterval`    | 300                                      | Desconectar sesiones inactivas                             |
| `ClientAliveCountMax`    | 2                                        | Máximo de mensajes de keepalive perdidos                   |

### Autenticación por Clave SSH

```
┌─────────────────────────────────────────────────────────────────┐
│               AUTENTICACIÓN POR CLAVE SSH                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CLIENTE                            SERVIDOR                     │
│  ┌─────────────┐                    ┌─────────────┐             │
│  │ ~/.ssh/     │                    │ ~/.ssh/     │             │
│  │   id_rsa    │────── Conexión ────→│ authorized  │             │
│  │ (privada)   │     Inicial        │   _keys     │             │
│  └──────┬──────┘                    └──────┬──────┘             │
│         │                                   │                    │
│         │  1. Cliente envía ID de clave    │                    │
│         │─────────────────────────────────→│                    │
│         │                                   │                    │
│         │  2. Servidor genera desafío       │                    │
│         │←─────────────────────────────────│                    │
│         │                                   │                    │
│         │  3. Cliente firma con clave       │                    │
│         │     privada                       │                    │
│         │─────────────────────────────────→│                    │
│         │                                   │                    │
│         │  4. Servidor verifica con         │                    │
│         │     clave pública                 │                    │
│         │←─────────────────────────────────│                    │
│         │     Acceso concedido              │                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Analogía: Sistema de Acceso Bancario

- **SSH con contraseña**: Tarjeta de débito + PIN que puedes compartir (inseguro, reutilizable)
- **SSH con clave**: Tarjeta de acceso biométrico única que no puedes compartir y que el banco verifica contra un registro seguro
- **Cambio de puerto (22→2222)**: El banco está en la calle principal vs. en una calle secundaria (no es más seguro, pero menos visible)
- **Deshabilitar root**: Ni siquiera los gerentes del banco pueden entrar por la puerta principal; deben usar acceso especial

---

## 🛠️ Implementación Profesional

### Fase 1: Preparación y Backup

#### 1.1 Acceso al Sistema

```bash
# Conexión al servidor
ssh tony@172.16.238.10
sudo su -
```

> ⚠️ **ADVERTENCIA CRÍTICA**: Antes de modificar SSH, asegúrate de tener:
>
> 1. Acceso físico o alternativo (consola, IPMI, etc.)
> 2. Una sesión SSH activa que no cierres hasta confirmar que todo funciona
> 3. Backup de la configuración original

#### 1.2 Crear Backup de Configuración

```bash
# Backup de la configuración SSH actual
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)

# Verificar backup creado
ls -la /etc/ssh/sshd_config*

# Opcional: Backup del directorio SSH completo
tar -czf /root/ssh_backup_$(date +%Y%m%d).tar.gz /etc/ssh/
```

#### 1.3 Verificar Configuración Actual

```bash
# Ver configuración activa
cat /etc/ssh/sshd_config | grep -v "^#" | grep -v "^$"

# Verificar estado del servicio
systemctl status sshd

# Verificar puerto actual
ss -tlnp | grep ssh
# o
netstat -tlnp | grep ssh
```

### Fase 2: Generar Par de Claves SSH

#### 2.1 Generar Clave en Cliente (o en servidor si es acceso root)

```bash
# Generar par de claves RSA de 4096 bits
ssh-keygen -t rsa -b 4096 -C "root@stapp01" -f /root/.ssh/id_rsa_stapp01

# Flags:
# -t rsa = tipo RSA
# -b 4096 = 4096 bits (seguro)
# -C = comentario
# -f = nombre de archivo

# Cuando pregunte passphrase:
# Opción A: Presionar ENTER (sin passphrase - conveniente pero menos seguro)
# Opción B: Ingresar passphrase (más seguro, requiere ingresarla cada vez)
```

#### 2.2 Verificar Claves Generadas

```bash
# Listar claves generadas
ls -la /root/.ssh/

# Ver contenido de clave pública
cat /root/.ssh/id_rsa_stapp01.pub
# Salida: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC... root@stapp01

# Verificar permisos
cat /root/.ssh/id_rsa_stapp01
# Debe mostrar: -rw------- (solo owner puede leer)
```

> 💡 **Nota técnica**: La clave privada (`id_rsa_stapp01`) debe mantenerse segura. Nunca debe compartirse o transferirse por canales inseguros.

### Fase 3: Configurar Clave Autorizada

#### 3.1 Instalar Clave Pública para root

```bash
# Crear directorio .ssh si no existe
mkdir -p /root/.ssh

# Establecer permisos correctos
chmod 700 /root/.ssh

# Agregar clave pública a authorized_keys
cat /root/.ssh/id_rsa_stapp01.pub >> /root/.ssh/authorized_keys

# Establecer permisos correctos
chmod 600 /root/.ssh/authorized_keys

# Verificar
cat /root/.ssh/authorized_keys
ls -la /root/.ssh/
```

> ⚠️ **Importante**: Los permisos deben ser exactos:
>
> - `.ssh/`: 700 (drwx------)
> - `authorized_keys`: 600 (-rw-------)

### Fase 4: Configurar sshd_config

#### 4.1 Editar Configuración SSH

```bash
# Editar archivo de configuración
vi /etc/ssh/sshd_config

# O usar editor alternativo
nano /etc/ssh/sshd_config
```

#### 4.2 Aplicar Configuraciones de Seguridad

Agrega o modifica las siguientes líneas:

```bash
# Puerto SSH (cambiar de 22 a 2222)
Port 2222

# Protocolo SSH (solo versión 2)
Protocol 2

# Acceso root (solo con clave, nunca contraseña)
PermitRootLogin without-password

# Autenticación por clave
PubkeyAuthentication yes

# Deshabilitar autenticación por contraseña
PasswordAuthentication no

# No permitir contraseñas vacías
PermitEmptyPasswords no

# Limitar intentos de autenticación
MaxAuthTries 3

# Desconectar sesiones inactivas (5 minutos)
ClientAliveInterval 300
ClientAliveCountMax 2

# Deshabilitar forwarding si no es necesario (opcional, más seguro)
# X11Forwarding no
# AllowTcpForwarding no
```

#### 4.3 Verificar Sintaxis de Configuración

```bash
# Verificar que la configuración es válida
sshd -t

# Si no hay salida, la configuración es válida
# Si hay errores, corregir antes de reiniciar el servicio
```

### Fase 5: Aplicar Cambios

#### 5.1 Reiniciar Servicio SSH

```bash
# Reiniciar servicio SSH (no afecta sesiones existentes inmediatamente)
systemctl restart sshd

# O en sistemas antiguos:
# service ssh restart
# /etc/init.d/ssh restart

# Verificar que el servicio está activo
systemctl status sshd
```

#### 5.2 Verificar Puerto Nuevo

```bash
# Verificar que SSH está escuchando en puerto 2222
ss -tlnp | grep 2222
# Salida: tcp LISTEN 0 128 *:2222 *:* users:(("sshd",pid=1234,fd=3))

# Verificar que ya no está en puerto 22
ss -tlnp | grep :22
# No debe mostrar sshd
```

### Fase 6: Pruebas de Conexión

#### 6.1 Probar Acceso con Clave (¡IMPORTANTE!)

```bash
# En una NUEVA terminal (mantener la sesión actual abierta), probar:
ssh -p 2222 -i /root/.ssh/id_rsa_stapp01 root@172.16.238.10

# Flags:
# -p 2222 = puerto específico
# -i = archivo de clave privada
# root@ = usuario root en servidor

# Si funciona: verás prompt de root
# Si falla: revisar logs en /var/log/secure o /var/log/auth.log
```

> 🔴 **CRÍTICO**: NO cierres tu sesión SSH actual hasta confirmar que puedes reconectar con la nueva configuración.

#### 6.2 Verificar Bloqueo de Contraseña

```bash
# Intentar conexión sin clave (debe fallar)
ssh -p 2222 root@172.16.238.10

# Debe pedir contraseña pero luego fallar, o directamente rechazar
```

### Fase 7: Verificación Final

#### 7.1 Verificar Logs

```bash
# En sistemas RHEL/CentOS
tail -20 /var/log/secure | grep sshd

# En sistemas Debian/Ubuntu
tail -20 /var/log/auth.log | grep sshd

# Buscar:
# - Conexiones exitosas
# - Intentos fallidos bloqueados
# - Errores de configuración
```

#### 7.2 Validar Configuración

```bash
# Verificar configuración activa
sshd -T | grep -E "(port|permitrootlogin|passwordauthentication|pubkeyauthentication)"

# Debe mostrar:
# port 2222
# permitrootlogin without-password
# passwordauthentication no
# pubkeyauthentication yes
```

### Resumen de Comandos

```bash
# SECUENCIA COMPLETA DE HARDENING SSH

# 1. Backup de configuración
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 2. Generar claves SSH
ssh-keygen -t rsa -b 4096 -C "root@stapp01" -f /root/.ssh/id_rsa_stapp01

# 3. Configurar clave autorizada
mkdir -p /root/.ssh
chmod 700 /root/.ssh
cat /root/.ssh/id_rsa_stapp01.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

# 4. Configurar sshd
# Editar /etc/ssh/sshd_config y agregar:
cat >> /etc/ssh/sshd_config << 'EOF'
Port 2222
Protocol 2
PermitRootLogin without-password
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

# 5. Verificar sintaxis
sshd -t

# 6. Reiniciar SSH
systemctl restart sshd

# 7. Probar conexión (en nueva terminal)
ssh -p 2222 -i /root/.ssh/id_rsa_stapp01 root@172.16.238.10

# 8. Verificar logs
tail /var/log/secure
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SSH HARDENED - stapp01                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ANTES (Inseguro)                    DESPUÉS (Hardened)                 │
│  ┌──────────────────────┐           ┌──────────────────────┐            │
│  │ Puerto: 22           │           │ Puerto: 2222         │            │
│  │ Protocolo: 1,2       │           │ Protocolo: 2 only    │            │
│  │ Root: Sí, con pass   │           │ Root: Sí, solo clave │            │
│  │ PasswordAuth: Yes    │           │ PasswordAuth: No     │            │
│  │ EmptyPasswords: Yes  │           │ EmptyPasswords: No   │            │
│  └──────────────────────┘           └──────────────────────┘            │
│                                                                          │
│  🔓 Superficie de ataque            🔒 Superficie reducida              │
│     grande                             mínima                           │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    FLUJO DE ACCESO                                │   │
│  │                                                                   │   │
│  │  Usuario ──→ SSH Client ──→ Puerto 2222 ──→ sshd               │   │
│  │                              (ofuscado)                           │   │
│  │                                       │                           │   │
│  │                                       ▼                           │   │
│  │                              ┌──────────────┐                    │   │
│  │                              │  ¿Clave      │                    │   │
│  │                              │  válida?     │                    │   │
│  │                              └──────┬───────┘                    │   │
│  │                                     │                             │   │
│  │                        ┌────────────┴────────────┐               │   │
│  │                        ▼                         ▼               │   │
│  │                   ❌ Rechazar              ✅ Permitir            │   │
│  │                   (logueado)              Acceso root            │   │
│  │                                                                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Beneficios del Hardening SSH

| Aspecto                  | Antes                            | Después                  |
| ------------------------ | -------------------------------- | ------------------------ |
| **Puerto**               | 22 (objetivo conocido)           | 2222 (ofuscación)        |
| **Protocolo**            | 1 y 2 (1 es inseguro)            | Solo 2                   |
| **Root**                 | Contraseña vulnerable            | Solo clave criptográfica |
| **Contraseñas**          | Permitidas (ataque fuerza bruta) | Bloqueadas               |
| **Superficie de ataque** | Grande                           | Mínima                   |

### Checklist de Verificación

- [x] Backup de `sshd_config` creado
- [x] Par de claves SSH generado (4096 bits)
- [x] Clave pública instalada en `/root/.ssh/authorized_keys`
- [x] Permisos correctos en `.ssh/` (700) y `authorized_keys` (600)
- [x] Puerto cambiado a 2222
- [x] Protocolo 2 exclusivo
- [x] `PermitRootLogin` configurado como `without-password`
- [x] `PasswordAuthentication` deshabilitado
- [x] `MaxAuthTries` limitado a 3
- [x] Sesiones inactivas terminadas después de 10 minutos
- [x] Sintaxis de configuración verificada (`sshd -t`)
- [x] Servicio reiniciado exitosamente
- [x] Conexión de prueba con clave exitosa
- [x] Conexión con contraseña bloqueada correctamente

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### Seguridad en Capas

> "La seguridad no es un producto, es un proceso. Cada capa de protección reduce el riesgo."

Este reto implementa múltiples capas:

1. **Ofuscación**: Cambio de puerto (no es seguridad, pero reduce ruido)
2. **Protocolo moderno**: Solo SSH-2
3. **Autenticación fuerte**: Claves criptográficas vs. contraseñas
4. **Limitación de acceso**: Root solo con clave
5. **Prevención de ataques**: Límite de intentos, timeouts

### Lecciones Críticas

1. **Nunca pierdas acceso**: Siempre mantén una sesión abierta mientras pruebas cambios SSH.

2. **Backup primero**: Un error en SSH puede bloquearte completamente del servidor.

3. **Verificación gradual**: Cambiar una opción a la vez, probar, luego continuar.

4. **Logs son tu amigo**: Monitorea `/var/log/secure` para detectar problemas.

### Errores Comunes y Prevención

#### Error #1: Reiniciar SSH sin probar configuración

```bash
# ❌ PELIGROSO
systemctl restart sshd
# Si hay error de sintaxis, puedes perder acceso

# ✅ SEGURO
sshd -t && systemctl restart sshd
# Solo reinicia si la configuración es válida
```

#### Error #2: Cerrar todas las sesiones antes de probar

```bash
# ❌ PELIGROSO
# Cerrar terminal actual, abrir nueva para probar
# Si no funciona, no hay forma de regresar

# ✅ SEGURO
# Mantener sesión actual ABIERTA
# Abrir NUEVA terminal para probar conexión
# Si falla, usar sesión original para corregir
```

#### Error #3: Permisos incorrectos en .ssh

```bash
# ❌ INSEGURO/FALLARÁ
chmod 755 /root/.ssh
chmod 644 /root/.ssh/authorized_keys

# ✅ CORRECTO
chmod 700 /root/.ssh
chmod 600 /root/.ssh/authorized_keys
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 12**: Transferencia Segura - SSH para transferencia de datos
- **Reto 16**: Configuración de Firewall - Proteger puertos SSH
- **Reto 17**: Ajuste de Límites - Control de recursos

### Mejoras Adicionales de Seguridad SSH

```bash
# 1. Fail2ban - Bloquear IPs con intentos fallidos
# Instalar y configurar fail2ban para SSH

# 2. AllowUsers - Solo usuarios específicos pueden conectar
# En /etc/ssh/sshd_config:
AllowUsers tony root@10.0.0.*

# 3. 2FA con Google Authenticator
# Instalar libpam-google-authenticator

# 4. Banner legal
# En /etc/ssh/sshd_config:
Banner /etc/ssh/banner
# Crear /etc/ssh/banner con advertencia legal

# 5. Rate limiting con iptables
iptables -A INPUT -p tcp --dport 2222 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 2222 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
```

### Comandos de Administración SSH

```bash
# Ver intentos de login fallidos
grep "Failed password" /var/log/secure | tail -20

# Ver conexiones activas
ss | grep ssh

# Desconectar sesión específica
kill -9 <PID>

# Ver configuración efectiva
sshd -T

# Ver claves instaladas
ssh-keygen -l -f /root/.ssh/authorized_keys

# Revocar acceso de clave específica
# Eliminar línea de authorized_keys
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [OpenSSH Manual](https://www.openssh.com/manual.html)
- [SSH Hardening Guide - Mozilla](https://infosec.mozilla.org/guidelines/openssh)
- [CIS SSH Benchmark](https://www.cisecurity.org/benchmark/ssh/)

### Troubleshooting

| Síntoma                                         | Causa                      | Solución                                               |
| ----------------------------------------------- | -------------------------- | ------------------------------------------------------ |
| "Connection refused"                            | Puerto incorrecto          | Verificar `Port` en sshd_config                        |
| "Permission denied (publickey)"                 | Clave no instalada         | Verificar authorized_keys                              |
| "Bad owner or permissions"                      | Permisos incorrectos       | `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys` |
| "No supported authentication methods available" | PasswordAuth deshabilitado | Usar clave SSH                                         |
| Servicio no inicia                              | Sintaxis error             | `sshd -t` para diagnosticar                            |

### Mejores Prácticas

```bash
# ✅ SIEMPRE:
# 1. Backup antes de cambiar
# 2. Verificar sintaxis: sshd -t
# 3. Mantener sesión abierta mientras pruebas
# 4. Usar claves de 4096 bits o más
# 5. Proteger clave privada con passphrase (si es posible)

# ❌ NUNCA:
# 1. Permitir root con contraseña en producción
# 2. Usar SSH protocolo 1
# 3. Permitir contraseñas vacías
# 4. Compartir claves privadas
# 5. Deshabilitar todos los métodos de acceso sin tener alternativa
```

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 30 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidor objetivo: stapp01 (172.16.238.10)

### Plan de Implementación

1. Crear backup de configuración SSH
2. Generar par de claves SSH de 4096 bits
3. Instalar clave pública en authorized_keys
4. Configurar sshd_config con hardening
5. Verificar sintaxis (sshd -t)
6. Reiniciar servicio SSH
7. Probar conexión con clave en nueva terminal
8. Verificar que contraseñas están bloqueadas
9. Monitorear logs

### Criterios de Éxito

- ✅ SSH configurado en puerto 2222
- ✅ Acceso root solo con clave SSH
- ✅ Autenticación por contraseña desactivada
- ✅ Protocolo SSH-2 exclusivo
- ✅ Conexión verificada exitosa con clave
- ✅ Intento de conexión con contraseña bloqueado

---

_Documentación creada siguiendo estándares de SysAdmin - Hardening Crítico_
