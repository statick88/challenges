---
title: "Reto 03: Usuario john con Shell No-Interactivo - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - user-management
  - backup
  - text-processing
  - security
date: 2026-01-25
status: completed
---

# Reto 03: Usuario john con Shell No-Interactivo - xFusionCorp Industries

## Seguridad en Usuarios de Servicio: El Principio del Menor Privilegio

---

## 🎓 Del Instructor

Bienvenido a tu tercer desafío como SysAdmin Senior en xFusionCorp. Hoy vamos a explorar uno de los conceptos más críticos en seguridad de sistemas: **el principio del menor privilegio** aplicado a cuentas de usuario.

> 💭 **Mentalidad de SysAdmin**: "Un usuario que no necesita iniciar sesión interactiva, NO debe poder hacerlo. Cada shell interactiva innecesaria es una superficie de ataque potencial."

En entornos empresariales, muchos procesos necesitan ejecutarse con una identidad específica (un usuario), pero no necesitan -ni deben tener- la capacidad de iniciar sesión interactivamente. Estos son los llamados **usuarios de servicio** o **service accounts**.

---

## 🎭 Escenario Real: Backup Agent Tool en Nautilus App 2

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Infraestructura de Backup Automatizado  
**Servidor**: App Server 2 (stapp02)  
**Tu rol**: Senior System Administrator - Seguridad

### La Problemática

El equipo de DevOps de xFusionCorp está implementando un nuevo **Backup Agent Tool** que necesita ejecutarse como un usuario específico del sistema. Este agente:

- Se ejecuta automáticamente mediante cron
- Accede a directorios de datos para backup
- No requiere interacción humana
- No debe permitir login interactivo por seguridad

**El requerimiento específico del fabricante del backup tool**:

> "Create a user named 'john' with a non-interactive shell on App Server 2."

### Contexto de Seguridad

El usuario `john` será utilizado exclusivamente por el servicio de backup. Si un atacante obtiene las credenciales de `john`, no debe poder:

- Iniciar sesión SSH interactiva
- Obtener una shell para explorar el sistema
- Ejecutar comandos arbitrarios

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito      |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | -------------- |
| stapp02  | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve          | Am3ric@    | Nautilus App 2 |

---

## 🧠 La Arquitectura: Shells No-Interactivos en Linux

### ¿Qué es un Shell No-Interactivo?

Un shell no-interactivo es un programa que:

- ✅ Puede ejecutar procesos y scripts
- ❌ No proporciona interfaz de comandos interactiva
- ❌ Rechaza intentos de login
- ✅ Generalmente muestra un mensaje educativo al intentar acceso

### Tipos de Shells No-Interactivos

| Shell       | Ubicación       | Comportamiento                      | Uso Típico                    |
| ----------- | --------------- | ----------------------------------- | ----------------------------- |
| **nologin** | `/sbin/nologin` | Muestra mensaje y termina           | Usuarios de servicio modernos |
| **false**   | `/bin/false`    | Termina inmediatamente con código 1 | Usuarios de servicio legacy   |
| **true**    | `/bin/true`     | Termina inmediatamente con código 0 | Casos especiales              |

### Archivos de Configuración Involucrados

```
/etc/passwd         # Define el shell del usuario (último campo)
/etc/nologin.txt    # Mensaje personalizado para nologin (opcional)
/etc/shells         # Lista de shells válidos para el sistema
/var/log/secure     # Logs de intentos de acceso (RHEL/CentOS)
/var/log/auth.log   # Logs de autenticación (Debian/Ubuntu)
```

### Estructura de /etc/passwd

```
username:password:UID:GID:GECOS:home_directory:shell
   │         │      │   │    │        │          │
   │         │      │   │    │        │          └── /sbin/nologin (¡este es el campo crítico!)
   │         │      │   │    │        └───────────── /home/john
   │         │      │   │    └────────────────────── "Service Account - Backup Tool"
   │         │      │   └─────────────────────────── 1001 (GID)
   │         │      └─────────────────────────────── 1001 (UID)
   │         └────────────────────────────────────── x (shadow)
   └──────────────────────────────────────────────── john
```

### Analogía: Tarjeta de Acceso vs. Llave Maestra

- **Usuario con shell interactivo (/bin/bash)**: Llave maestra que abre la puerta y te permite moverte por todo el edificio
- **Usuario con shell no-interactivo (/sbin/nologin)**: Tarjeta de acceso que solo permite el paso a áreas específicas, pero no te deja "entrar" al edificio propiamente

El backup tool usa la "tarjeta de acceso" para hacer su trabajo, pero incluso si alguien roba la tarjeta, no puede usarla para entrar al edificio.

---

## 🛠️ Implementación Profesional

### Fase 1: Verificación Pre-Implementación

#### 1.1 Acceso al Sistema

```bash
# Conexión vía jump host (si aplica)
ssh thor@jump_host.stratos.xfusioncorp.com

# Conexión al servidor objetivo
ssh steve@172.16.238.11

# Escalar a root
sudo su -
```

#### 1.2 Verificar Estado Actual

```bash
# ¿Existe el usuario john?
id john
echo "Exit code: $?"  # 0 = existe, 1 = no existe

# ¿Qué usuarios tienen shell no-interactivo?
grep -E "(nologin|false)" /etc/passwd | head -10

# ¿Está disponible /sbin/nologin?
ls -la /sbin/nologin
file /sbin/nologin
```

> ⚠️ **Advertencia**: Siempre verifica que el shell `/sbin/nologin` existe antes de asignarlo.

### Fase 2: Creación del Usuario john

#### 2.1 Crear Usuario con Shell No-Interactivo

```bash
# Crear usuario con shell nologin
useradd -m -s /sbin/nologin john

# Análisis de flags:
# -m : Crear directorio home (/home/john)
# -s /sbin/nologin : Asignar shell no-interactivo
# john : Nombre de usuario
```

#### 2.2 Verificar Creación

```bash
# Verificar entrada en /etc/passwd
grep john /etc/passwd
# Salida esperada: john:x:1001:1001::/home/john:/sbin/nologin

# Verificar directorio home
ls -la /home/john
# Debe mostrar: drwxr-x--- 2 john john 4096 ... /home/john

# Verificar información completa
id john
# Salida: uid=1001(john) gid=1001(john) groups=1001(john)
```

### Fase 3: Configuración de Seguridad

#### 3.1 Establecer Contraseña (Obligatorio)

```bash
# Establecer contraseña para el usuario
passwd john

# Sistema solicitará:
# Changing password for user john.
# New password: [Ingresar contraseña segura]
# Retype new password: [Confirmar]
# passwd: all authentication tokens updated successfully.
```

> 💡 **Nota técnica**: Aunque el usuario no puede iniciar sesión interactivamente, NECESITA contraseña para:
>
> - Ejecutar comandos con `su` (si se configura)
> - Autenticación en servicios que verifiquen la cuenta
> - Cumplimiento de políticas de seguridad (todas las cuentas deben tener contraseña)

#### 3.2 Documentar el Propósito del Usuario

```bash
# Agregar comentario GECOS (opcional pero recomendado)
usermod -c "Backup Agent Service Account - No Interactive Login" john

# Verificar cambio
grep john /etc/passwd
# Ahora muestra: john:x:1001:1001:Backup Agent Service Account - No Interactive Login:/home/john:/sbin/nologin
```

### Fase 4: Verificación de Seguridad

#### 4.1 Probar Acceso Interactivo (Debe Fallar)

```bash
# Intentar iniciar sesión como john (desde root)
su - john

# Salida esperada:
# This account is currently not available.
# O similar, dependiendo del sistema
```

#### 4.2 Verificar en Logs

```bash
# En sistemas RHEL/CentOS
tail /var/log/secure | grep john

# En sistemas Debian/Ubuntu
tail /var/log/auth.log | grep john

# Debe mostrar intento de login denegado
```

#### 4.3 Verificar Estado del Shell

```bash
# Confirmar shell asignado
getent passwd john

# Método alternativo
grep "^john:" /etc/passwd | cut -d: -f7
# Debe retornar: /sbin/nologin
```

### Resumen de Comandos

```bash
# SECUENCIA COMPLETA

# 1. Verificación inicial
id john
getent passwd john

# 2. Creación del usuario con shell no-interactivo
useradd -m -s /sbin/nologin john

# 3. Establecer contraseña
passwd john

# 4. Agregar comentario descriptivo (opcional)
usermod -c "Backup Agent Service Account" john

# 5. Verificación final
getent passwd john | grep john
su - john  # Debe fallar con mensaje de cuenta no disponible
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────┐
│                    stapp02                              │
│           Nautilus App Server 2                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Usuario: john                         │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │  UID: 1001                              │    │   │
│  │  │  GID: 1001                              │    │   │
│  │  │  Home: /home/john                       │    │   │
│  │  │  Shell: /sbin/nologin  ◄── BLOQUEO      │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  │                                                 │   │
│  │  ✅ Puede:                                      │   │
│  │     • Ejecutar procesos (cron, scripts)         │   │
│  │     • Acceder a archivos con permisos           │   │
│  │     • Ser propietario de procesos               │   │
│  │                                                 │   │
│  │  ❌ No puede:                                   │   │
│  │     • Iniciar sesión SSH interactiva            │   │
│  │     • Obtener shell bash interactivo            │   │
│  │     • Ejecutar comandos interactivos            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Comparativa: Usuario Normal vs. Usuario de Servicio

| Característica       | Usuario Normal | Usuario de Servicio (john) |
| -------------------- | -------------- | -------------------------- |
| Shell                | /bin/bash      | /sbin/nologin              |
| Login SSH            | ✅ Permitido   | ❌ Bloqueado               |
| Ejecución de scripts | ✅ Sí          | ✅ Sí                      |
| Uso en cron          | ✅ Sí          | ✅ Sí                      |
| Acceso interactivo   | ✅ Sí          | ❌ No                      |
| Superficie de ataque | Mayor          | Mínima                     |

### Checklist de Verificación

- [x] Usuario `john` creado con UID específico
- [x] Shell configurada como `/sbin/nologin`
- [x] Directorio home creado en `/home/john`
- [x] Contraseña establecida
- [x] Login interactivo bloqueado con mensaje educativo
- [x] Documentación GECOS agregada
- [x] Logs de seguridad verificados

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### El Principio del Menor Privilegio

> "Dar a cada usuario solo los permisos necesarios para su trabajo, ni más ni menos."

En este caso, aplicamos el principio a nivel de shell:

- **¿Necesita john un shell interactivo?** NO, es un usuario de servicio
- **¿Qué necesita john?** Una identidad para ejecutar el backup tool
- **¿Cuál es el riesgo si tiene shell interactivo?** Si las credenciales se filtran, el atacante tiene acceso completo al sistema

### Lecciones Clave

1. **Shell es un Privilegio**: No todos los usuarios necesitan shell interactivo.

2. **Verificación de Seguridad**: Siempre prueba que el bloqueo funciona intentando acceder.

3. **Documentación del Propósito**: El campo GECOS en /etc/passwd documenta por qué existe el usuario.

4. **Auditoría**: Los logs de `/var/log/secure` o `/var/log/auth.log` registran intentos de acceso.

### Cuándo Usar Cada Tipo de Shell No-Interactivo

```bash
# /sbin/nologin - Recomendado para usuarios de servicio modernos
# Ventaja: Muestra mensaje educativo al usuario
useradd -s /sbin/nologin service_account

# /bin/false - Para compatibilidad legacy
# Ventaja: Universalmente disponible
# Desventaja: No muestra mensaje, solo termina
useradd -s /bin/false legacy_account

# /usr/sbin/nologin - En algunas distribuciones modernas
# Verificar primero: ls /usr/sbin/nologin
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 04**: Usuario sin Home Directory - Optimización para usuarios de servicio puros
- **Reto 05**: Usuario Temporal con Expiración - Control de acceso temporal
- **Reto 13**: Restricción de Cron - Controlar quién puede usar cron

### Escenarios de Expansión

1. **Integración con Backup Tool**:

   ```bash
   # Configurar crontab para john
   crontab -u john -e
   # 0 2 * * * /opt/backup-tool/backup.sh
   ```

2. **Permisos de Archivos**:

   ```bash
   # Asegurar que john solo puede acceder a lo necesario
   chown -R john:backup /data/backup-source
   chmod 750 /data/backup-source
   ```

3. **Monitoreo de Actividad**:
   ```bash
   # Auditar procesos ejecutados por john
   ps -u john -o pid,ppid,cmd,etime
   # Ver archivos abiertos
   lsof -u john
   ```

### Comandos para Profundizar

```bash
# Verificar todos los usuarios con shell no-interactivo
awk -F: '$7 ~ /(nologin|false)/ {print $1 ":" $7}' /etc/passwd

# Cambiar shell de usuario existente
usermod -s /sbin/nologin username

# Verificar shells disponibles
chsh -l
cat /etc/shells

# Crear mensaje personalizado para nologin
echo "Acceso restringido. Contacte al administrador." > /etc/nologin.txt
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Linux User Shells - Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_managing-users-and-groups_configuring-basic-system-settings)
- [Useradd Manual](https://man7.org/linux/man-pages/man8/useradd.8.html)
- [Passwd Manual](https://man7.org/linux/man-pages/man1/passwd.1.html)

### Troubleshooting Común

| Síntoma                                             | Causa Probable         | Solución                                |
| --------------------------------------------------- | ---------------------- | --------------------------------------- |
| "su: failed to execute /sbin/nologin: No such file" | Shell no existe        | Usar `/bin/false` como alternativa      |
| "su: Authentication failure"                        | Contraseña incorrecta  | Reestablecer con `passwd john`          |
| Usuario puede iniciar sesión                        | Shell no es nologin    | Verificar con `grep john /etc/passwd`   |
| Mensaje genérico en lugar de personalizado          | Falta /etc/nologin.txt | Crear archivo con mensaje personalizado |

### Casos de Uso en el Mundo Real

- **Servidores Web**: Usuario `nginx`, `apache` con nologin
- **Bases de Datos**: Usuario `mysql`, `postgres` con nologin
- **Servicios de Backup**: Usuario `backup` con nologin
- **Aplicaciones Containerizadas**: Usuarios de servicio sin shell

---

## ✅ Estado del Reto

**✅ COMPLETADO** - Implementación exitosa con shell no-interactiva

- 📅 Fecha de ejecución: 2025-01-25
- ⏱️ Tiempo estimado: 10 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidor configurado: stapp02
- 🔒 Seguridad implementada: Shell no-interactivo activo

### Métricas de Éxito

✅ Usuario `john` creado con UID/GID específicos  
✅ Shell configurada como `/sbin/nologin`  
✅ Directorio home en `/home/john`  
✅ Login interactivo bloqueado correctamente  
✅ Mensaje educativo mostrado al intentar acceso  
✅ Logs de seguridad verificados

---

_Documentación creada siguiendo estándares de SysAdmin - Principio del Menor Privilegio_
