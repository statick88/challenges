---
title: "Reto 05: Temporary User Setup with Expiry - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - system-config
  - security
date: 2026-01-29
status: completed
---

# Reto 05: Temporary User Setup with Expiry - xFusionCorp Industries

## Gestión del Ciclo de Vida de Usuarios: Automatizando el Acceso Temporal

---

## 🎓 Del Instructor

Bienvenido a tu quinto desafío como SysAdmin Senior en xFusionCorp. Hoy abordamos un aspecto crítico de la gobernanza de identidades: **el acceso temporal automatizado**.

> 💭 **Mentalidad de SysAdmin**: "El acceso temporal que no expira automáticamente es un acceso permanente olvidado. Un usuario temporal de hoy es una brecha de seguridad del mañana si no gestionamos su ciclo de vida."

En entornos empresariales, los accesos temporales son comunes: consultores, contratistas, desarrolladores de proyectos específicos. El problema es que estos usuarios frecuentemente quedan activos después de que su necesidad expira, creando cuentas "zombie" que son vectores de ataque.

La solución: **automatizar la expiración desde el día cero**.

---

## 🎭 Escenario Real: Consultoría Externa en Nautilus App 2

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Auditoría de Seguridad Temporal  
**Servidor**: App Server 2 (stapp02)  
**Tu rol**: Senior System Administrator - Gobernanza de Identidades

### La Problemática

Un consultor externo de ciberseguridad ha sido contratado para realizar una auditoría de 7 días en el servidor de aplicaciones. Según las políticas de seguridad de xFusionCorp:

- El acceso debe expirar automáticamente al finalizar el contrato
- No se permiten accesos extendidos sin re-autorización
- Todos los accesos temporales deben ser rastreables

**El requerimiento del CISO**:

> "Create a temporary user with account expiry for time-limited access."

### Contexto de Seguridad

El consultor necesita:

- ✅ Acceso SSH interactivo durante 7 días
- ✅ Capacidad de ejecutar scripts de auditoría
- ✅ Almacenamiento temporal de resultados

No debe tener:

- ❌ Acceso después del día 7
- ❌ Privilegios de administrador innecesarios
- ❌ Capacidad de crear usuarios adicionales

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito      |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | -------------- |
| stapp02  | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve          | Am3ric@    | Nautilus App 2 |

### Requisitos Técnicos

- **Usuario**: `temp_user`
- **Expiración**: 7 días desde la creación
- **Shell**: `/bin/bash` (interactiva - necesita trabajar)
- **Directorio home**: Sí (`/home/temp_user`)
- **Servidor**: App Server 2 (stapp02)
- **Propósito**: Acceso temporal para consultoría externa

---

## 🧠 La Arquitectura: Expiración de Cuentas en Linux

### ¿Cómo Funciona la Expiración?

Linux utiliza un sistema de "aging" (envejecimiento) de contraseñas y cuentas gestionado por el comando `chage` (change age). Este sistema permite:

1. **Expiración de cuenta completa**: El usuario no puede iniciar sesión después de la fecha
2. **Expiración de contraseña**: El usuario debe cambiar su contraseña periódicamente
3. **Periodo de advertencia**: Avisar al usuario antes de la expiración
4. **Periodo de gracia**: Permitir acceso después de expiración (inseguro, no recomendado)

### Archivos de Configuración

```
/etc/shadow           # Almacena información de expiración
/etc/login.defs       # Configuración por defecto de aging
/etc/default/useradd  # Valores por defecto al crear usuarios
```

### Estructura de /etc/shadow

```
username:password:lastchg:min:max:warn:inactive:expire:reserved
     │        │       │    │   │    │      │       │      │
     │        │       │    │   │    │      │       │      └── Reservado
     │        │       │    │   │    │      │       └───────── Fecha expiración (días desde 1970-01-01)
     │        │       │    │   │    │      └───────────────── Días inactividad antes de bloqueo
     │        │       │    │   │    └──────────────────────── Días de advertencia
     │        │       │    │   └───────────────────────────── Máximo días entre cambios de password
     │        │       │    └───────────────────────────────── Mínimo días entre cambios de password
     │        │       └────────────────────────────────────── Último cambio de password
     │        └────────────────────────────────────────────── Hash de contraseña
     └─────────────────────────────────────────────────────── Nombre de usuario
```

### Comando `chage` - Opciones Clave

| Opción | Descripción                             | Ejemplo                    |
| ------ | --------------------------------------- | -------------------------- |
| `-E`   | Fecha de expiración (YYYY-MM-DD)        | `chage -E 2026-02-01 user` |
| `-M`   | Máximo días entre cambios de password   | `chage -M 90 user`         |
| `-m`   | Mínimo días entre cambios de password   | `chage -m 7 user`          |
| `-W`   | Días de advertencia antes de expiración | `chage -W 7 user`          |
| `-I`   | Días de inactividad permitidos          | `chage -I 30 user`         |
| `-l`   | Listar información actual               | `chage -l user`            |

### Analogía: Tarjeta de Acceso Temporal de Hotel

- **Usuario normal**: Habitante permanente del hotel con tarjeta de acceso sin fecha de vencimiento
- **Usuario temporal (temp_user)**: Huésped con tarjeta que deja de funcionar automáticamente a medianoche del día de checkout
- **Expiración**: El sistema del hotel desactiva la tarjeta; no se requiere acción manual del recepcionista

El consultor tiene su "tarjeta" (credenciales) que funcionan perfectamente durante 7 días. El día 8, simplemente deja de funcionar - no se le "bloquea", no se le "cancela", simplemente ya no puede entrar.

---

## 🛠️ Implementación Profesional

### Fase 1: Verificación Pre-Implementación

#### 1.1 Acceso al Sistema

```bash
# Conexión al servidor
ssh steve@172.16.238.11
sudo su -
```

#### 1.2 Verificar Estado Actual

```bash
# ¿Existe el usuario?
id temp_user
echo "Exit code: $?"  # 1 = no existe (correcto para crear)

# Verificar comando chage disponible
which chage
chage --help | head -5

# Verificar fecha actual
date
date +%Y-%m-%d  # Formato ISO recomendado
```

### Fase 2: Creación del Usuario Temporal

#### 2.1 Crear Usuario con Shell Interactivo

```bash
# Crear usuario con home y shell bash
useradd -m -s /bin/bash temp_user

# Análisis de flags:
# -m : Crear directorio home (/home/temp_user)
# -s /bin/bash : Shell interactivo para trabajar
# temp_user : Nombre descriptivo indicando propósito temporal
```

#### 2.2 Verificar Creación

```bash
# Confirmar que existe
id temp_user
# Salida: uid=1002(temp_user) gid=1002(temp_user) groups=1002(temp_user)

# Verificar shell y home
grep temp_user /etc/passwd
# Salida: temp_user:x:1002:1002::/home/temp_user:/bin/bash

# Verificar directorio creado
ls -la /home/temp_user
```

### Fase 3: Configuración de Expiración

#### 3.1 Calcular Fecha de Expiración

```bash
# Calcular fecha exacta: hoy + 7 días
# Método 1: Usando date
date -d "+7 days" +%Y-%m-%d
# Salida: 2025-02-01 (ejemplo)

# Método 2: Especificar fecha exacta
# Si hoy es 2025-01-25, 7 días después es 2025-02-01
```

#### 3.2 Configurar Expiración con chage

```bash
# Configurar expiración para 7 días desde hoy
chage -E $(date -d "+7 days" +%Y-%m-%d) temp_user

# Análisis del comando:
# chage       → Cambiar aging de contraseña
# -E          → Establecer fecha de expiración (Expiry)
# $(date...)  → Expansión de comando para calcular fecha
# temp_user   → Usuario objetivo

# Alternativa: Fecha específica explícita
chage -E 2025-02-01 temp_user
```

> 💡 **Nota técnica**: La fecha se almacena internamente como días desde el 1 de enero de 1970 (epoch time). `chage` convierte automáticamente el formato legible.

#### 3.3 Establecer Contraseña

```bash
# Establecer contraseña inicial
passwd temp_user

# Ingresar contraseña temporal segura
# El sistema pedirá cambiarla al primer login (opcional)
```

### Fase 4: Verificación Exhaustiva

#### 4.1 Verificar Configuración de Expiración

```bash
# Ver información completa de aging
chage -l temp_user

# Salida esperada:
# Last password change                    : Jan 25, 2025
# Password expires                        : never
# Password inactive                       : never
# Account expires                         : Feb 01, 2025  ← ¡IMPORTANTE!
# Minimum number of days between password change      : 0
# Maximum number of days between password change      : 99999
# Number of days of warning before password expires   : 7
```

#### 4.2 Verificar en /etc/shadow

```bash
# Verificar directamente en shadow
grep temp_user /etc/shadow

# Salida típica:
# temp_user:$6$rounds=5000$...:19800:0:99999:7::19807:
#                                                      │
#                                                      └── Días desde epoch para expiración

# Calcular fecha desde epoch:
date -d "1970-01-01 +19807 days" +%Y-%m-%d
# Salida: 2025-02-01
```

#### 4.3 Prueba de Acceso (Antes de Expiración)

```bash
# En otra terminal o como otro usuario, probar acceso
ssh temp_user@172.16.238.11
# Debe permitir login con contraseña establecida

# Dentro de la sesión, verificar identidad
whoami  # temp_user
id      # uid=1002(temp_user) gid=1002(temp_user)
```

### Resumen de Comandos

```bash
# SECUENCIA COMPLETA

# 1. Verificación inicial
id temp_user

# 2. Creación del usuario
useradd -m -s /bin/bash temp_user

# 3. Establecer contraseña
passwd temp_user

# 4. Configurar fecha de expiración (7 días)
chage -E $(date -d "+7 days" +%Y-%m-%d) temp_user

# 5. Verificación final
chage -l temp_user
getent passwd temp_user

# 6. Verificar acceso funciona
su - temp_user
exit
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura Implementada

```
┌────────────────────────────────────────────────────────────┐
│                       stapp02                               │
│              Nautilus App Server 2                          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Fecha de creación: 2025-01-25                              │
│  Fecha de expiración: 2025-02-01 (7 días después)          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Usuario: temp_user                        │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  📅 Timeline de acceso:                                │ │
│  │                                                        │ │
│  │  Día 0 (Hoy)      ████████████████████████████████   │ │
│  │  Día 1            ████████████████████████████████   │ │
│  │  Día 2            ████████████████████████████████   │ │
│  │  Día 3            ████████████████████████████████   │ │
│  │  Día 4            ████████████████████████████████   │ │
│  │  Día 5            ████████████████████████████████   │ │
│  │  Día 6            ████████████████████████████████   │ │
│  │  Día 7 (Último)   ████████████████████████████████   │ │
│  │  Día 8            ❌ ACCESO BLOQUEADO AUTOMÁTICAMENTE │ │
│  │                                                        │ │
│  │  🔧 Mecanismo:                                         │ │
│  │     /etc/shadow → campo expire = fecha en epoch        │ │
│  │     PAM → verifica fecha antes de permitir login       │ │
│  │                                                        │ │
│  │  ✅ Características:                                   │ │
│  │     • Shell: /bin/bash (trabajo interactivo)          │ │
│  │     • Home: /home/temp_user                           │ │
│  │     • Expiración automática: 2025-02-01               │ │
│  │     • Sin intervención manual requerida               │ │
│  │                                                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Beneficios de la Expiración Automática

| Aspecto          | Sin Expiración Automática         | Con Expiración Automática         |
| ---------------- | --------------------------------- | --------------------------------- |
| **Gestión**      | Recordatorio manual en calendario | Sistema gestiona automáticamente  |
| **Seguridad**    | Riesgo de olvidar desactivar      | Cuenta inactiva automáticamente   |
| **Auditoría**    | Seguimiento manual                | Fecha documentada en /etc/shadow  |
| **Cumplimiento** | Difícil probar que se desactivó   | Registro automático de expiración |

### Checklist de Verificación

- [x] Usuario `temp_user` creado con home directory
- [x] Shell `/bin/bash` configurado (interactivo)
- [x] Contraseña establecida
- [x] Fecha de expiración configurada: +7 días
- [x] Verificación con `chage -l` muestra fecha correcta
- [x] /etc/shadow actualizado con fecha en epoch
- [x] Prueba de acceso exitosa antes de expiración

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### Automatización de Gobernanza

> "La seguridad que depende de recordatorios humanos es seguridad fallida."

Este reto demuestra un principio de gobernanza de identidades:

- **Crear con expiración**: Nunca crees acceso temporal sin fecha de expiración
- **Verificar antes de entregar**: Confirma que la expiración está configurada
- **Documentar el propósito**: El nombre `temp_user` indica claramente su naturaleza
- **Auditar regularmente**: Usa `chage -l` para revisar cuentas temporales

### Lecciones Clave

1. **Expiración desde el Día Cero**: Configurar expiración durante la creación, no "después".

2. **Fechas Calculadas vs. Fijas**: Usar `date -d "+7 days"` es más mantenible que hardcodear fechas.

3. **Verificación Triple**:
   - `chage -l` para información legible
   - `/etc/shadow` para confirmar almacenamiento
   - Prueba de login para verificar funcionalidad

4. **Naming Matters**: Un nombre como `temp_user` o `consultant_audit` comunica el propósito.

### Manejo de Cuentas Temporales en Producción

```bash
# Listar todas las cuentas temporales próximas a expirar
for user in $(awk -F: '$8 > 0 {print $1}' /etc/shadow); do
  expiry=$(chage -l $user 2>/dev/null | grep "Account expires" | cut -d: -f2)
  if [ ! -z "$expiry" ] && [ "$expiry" != " never" ]; then
    days_left=$(( ($(date -d "$expiry" +%s) - $(date +%s)) / 86400 ))
    echo "$user expira en $days_left días ($expiry)"
  fi
done

# Extender acceso temporal (si aplica)
chage -E $(date -d "+14 days" +%Y-%m-%d) temp_user

# Revocar acceso inmediatamente (si es necesario)
chage -E 0 temp_user  # Expira inmediatamente
# O mejor:
usermod -L temp_user  # Bloquear cuenta
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 06**: Usuario anita con Expiración Específica - Fechas exactas
- **Reto 04**: Usuario sin Home - Optimización para servicios
- **Reto 13**: Restricción de Cron - Controlar acceso a programación

### Escenarios de Expansión

1. **Usuarios de Proyecto**:

   ```bash
   # Usuario para proyecto de 3 meses
   useradd -m -c "Project X Developer - Expires 2025-04-25" project_dev
   chage -E 2025-04-25 project_dev
   ```

2. **Acceso de Emergencia**:

   ```bash
   # Acceso de 24 horas para soporte
   useradd -m -c "Emergency Support - 24h" emergency_support
   chage -E $(date -d "+1 day" +%Y-%m-%d) emergency_support
   ```

3. **Auditoría Automática**:
   ```bash
   # Script para alertar sobre cuentas temporales
   # Agregar a cron diario
   ```

### Comandos Avanzados

```bash
# Ver usuarios que expiran esta semana
awk -F: '$8 > 0 {
  cmd = "date -d \"1970-01-01 " $8 " days\" +%Y-%m-%d"
  cmd | getline expiry
  close(cmd)
  days = int((expiry - systime()) / 86400)
  if (days < 7 && days > 0) print $1 " expires in " days " days"
}' /etc/shadow

# Configurar expiración de contraseña también
chage -M 30 -W 7 temp_user  # Cambiar cada 30 días, advertir 7 días antes

# Desactivar cuenta inmediatamente
usermod --expiredate 1 temp_user  # Expiró ayer
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Linux Password Aging - Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_managing-users-and-groups_configuring-basic-system-settings)
- [Chage Manual](https://man7.org/linux/man-pages/man1/chage.1.html)
- [Shadow Password Suite](https://man7.org/linux/man-pages/man5/shadow.5.html)

### Troubleshooting Común

| Síntoma                                | Causa                       | Solución                       |
| -------------------------------------- | --------------------------- | ------------------------------ |
| "chage: invalid date"                  | Formato de fecha incorrecto | Usar YYYY-MM-DD                |
| Usuario puede loguear después de fecha | Zona horaria diferente      | Verificar `date` en servidor   |
| "Account expires: never"               | No se configuró expiración  | Ejecutar `chage -E` nuevamente |
| Fecha en shadow no coincide            | Cálculo epoch incorrecto    | Usar `date -d` para verificar  |

### Mejores Prácticas

```bash
# ✅ HACER:
# Siempre configurar expiración al crear usuario temporal
useradd -m temp_user && chage -E $(date -d "+7 days" +%Y-%m-%d) temp_user

# Documentar propósito en GECOS
usermod -c "Consultant - Expires 2025-02-01 - Project Audit" temp_user

# Verificar periódicamente cuentas temporales
chage -l temp_user

# ❌ EVITAR:
# Crear usuario temporal sin fecha de expiración
useradd -m temp_user  # ¡Peligro! Sin expiración

# Hardcodear fechas
chage -E 2025-02-01 temp_user  # Menos mantenible

# Olvidar establecer contraseña
# El usuario temporal debe poder acceder inicialmente
```

---

## ✅ Estado del Reto

🔓 **POR DESBLOQUEAR** - Requiere completar retos 1-3

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 15 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidor objetivo: stapp02 (172.16.238.11)

### Plan de Implementación

1. Verificar acceso a stapp02
2. Crear usuario `temp_user` con home y bash
3. Configurar expiración a 7 días
4. Establecer contraseña
5. Verificar con `chage -l`
6. Probar acceso

### Criterios de Éxito

- ✅ Usuario `temp_user` existe en `/etc/passwd`
- ✅ Directorio home `/home/temp_user` creado
- ✅ `chage -l` muestra fecha de expiración específica
- ✅ Acceso funciona antes de fecha de expiración
- ✅ Acceso bloqueado automáticamente después de expiración

---

_Documentación creada siguiendo estándares de SysAdmin - Automatización de Gobernanza_
