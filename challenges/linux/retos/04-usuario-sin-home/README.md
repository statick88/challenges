---
title: "Reto 04: Service User Creation without Home Directory - xFusionCorp Industries"
category: linux
difficulty: medium
tags:
  - linux
  - ssh
  - user-management
  - security
  - text-processing
date: 2025-01-25
status: completed
---

# Reto 04: Service User Creation without Home Directory - xFusionCorp Industries

## Usuarios de Servicio Minimalistas: La Filosofía de "Solo lo Necesario"

---

## 🎓 Del Instructor

Bienvenido a tu cuarto desafío como SysAdmin Senior en xFusionCorp. Hoy vamos a llevar el concepto de **principio del menor privilegio** un paso más allá: crearemos un usuario de servicio que no solo tiene shell no-interactivo, sino que **tampoco tiene directorio home**.

> 💭 **Mentalidad de SysAdmin**: "Si un usuario de servicio no necesita almacenar archivos personales, no necesita un home directory. Cada directorio innecesario es un directorio que puede ser explotado o mal configurado."

En infraestructura moderna, especialmente en contenedores y sistemas minimizados, los usuarios de servicio puros no tienen razón para tener directorios home. Son identidades puramente funcionales para procesos.

---

## 🎭 Escenario Real: Servicios de Aplicación en Nautilus App 2

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Microservicios y Contenedores  
**Servidor**: App Server 2 (stapp02)  
**Tu rol**: Senior System Administrator - Hardening

### La Problemática

El equipo de desarrollo de xFusionCorp está migrando una aplicación legacy a una arquitectura de microservicios. La aplicación necesita ejecutarse como un usuario dedicado del sistema, pero:

- No almacena archivos de configuración personales
- No genera logs locales (usa sistemas centralizados)
- No requiere espacio de trabajo personal
- Solo necesita acceso a directorios de aplicación específicos (`/opt/app/`)

**El requerimiento del equipo de arquitectura**:

> "Create a service user without a home directory for application service management."

### Contexto de Seguridad

El usuario `james` será el propietario de procesos de aplicación. Un directorio home innecesario:

- Consume espacio en disco
- Crea una ruta predecible (`/home/james`) que podría ser atacada
- Puede contener archivos de configuración .rc que se ejecutan automáticamente
- Aumenta la superficie de ataque sin proporcionar valor funcional

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito      |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | -------------- |
| stapp02  | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve          | Am3ric@    | Nautilus App 2 |

### Requisitos Técnicos Específicos

- **Usuario**: `james` (estándar del equipo de desarrollo)
- **Directorio home**: NO crear (`/dev/null` o especificar `-M`)
- **Shell**: `/sbin/nologin` (no-interactivo)
- **Tipo**: Usuario de sistema (`-r` flag)
- **UID**: Asignado automáticamente en rango de sistema (998-999)
- **Propósito**: Ejecución de servicios de aplicación

---

## 🧠 La Arquitectura: Usuarios sin Directorio Home

### ¿Por Qué Evitar el Directorio Home?

#### Problemas de Seguridad

```bash
# Directorio home típico - RIESGOS OCULTOS:
/home/james/
├── .bashrc          ← Ejecutado al iniciar sesión (si la hubiera)
├── .bash_profile    ← Podría contener backdoors
├── .ssh/            ← Si existe, riesgo de acceso no autorizado
│   ├── authorized_keys
│   └── id_rsa
├── .myconfig        ← Archivos de configuración expuestos
└── temp/            ← Archivos temporales olvidados
```

#### Consumo de Recursos

| Recurso          | Con Home Directory           | Sin Home Directory     |
| ---------------- | ---------------------------- | ---------------------- |
| Espacio en disco | ~4KB mínimo + archivos       | 0 bytes                |
| Backups          | Incluido en /home backup     | Excluido               |
| Auditoría        | Más rutas a monitorear       | Menor superficie       |
| Exploración      | Ruta predecible (/home/user) | No hay ruta predecible |

### Archivos de Configuración Involucrados

```
/etc/passwd         # El campo 'home' apunta a /home/james o /dev/null
/etc/default/useradd # Configuración por defecto de creación de usuarios
/etc/skel/          # Plantillas de archivos para nuevos homes (omitido con -M)
/etc/login.defs     # Define rango de UIDs de sistema (SYS_UID_MIN)
```

### Flags Críticas de Useradd

| Flag | Nombre           | Propósito                               |
| ---- | ---------------- | --------------------------------------- |
| `-r` | --system         | Crea usuario de sistema (UID < 1000)    |
| `-M` | --no-create-home | NO crea directorio home                 |
| `-s` | --shell          | Especifica shell (usamos /sbin/nologin) |
| `-d` | --home-dir       | Especifica directorio home alternativo  |

### Tipos de Usuarios en Linux

```
Usuarios Normales:
  UID: 1000-60000
  Home: /home/username
  Shell: /bin/bash
  Uso: Personas físicas

Usuarios de Sistema:
  UID: 1-999 (SYS_UID_MIN a SYS_UID_MAX)
  Home: /dev/null, /nonexistent, o omitido
  Shell: /sbin/nologin, /bin/false
  Uso: Procesos y servicios
```

### Analogía: Funcionario vs. Robot de Fábrica

- **Usuario normal con home**: Funcionario de oficina que necesita un escritorio, archivador y espacio personal para trabajar
- **Usuario de servicio sin home**: Robot de fábrica que solo necesita estar conectado a la línea de producción - no necesita oficina, ni escritorio, ni archivador

El robot `james` "trabaja" en `/opt/app/` (la línea de producción), no necesita espacio personal.

---

## 🛠️ Implementación Profesional

### Fase 1: Verificación Pre-Implementación

#### 1.1 Acceso al Sistema

```bash
# Conexión al servidor objetivo
ssh steve@172.16.238.11
sudo su -
```

#### 1.2 Verificar Configuración del Sistema

```bash
# Verificar rango de UIDs de sistema
grep SYS_UID /etc/login.defs
# Salida típica:
# SYS_UID_MIN               201
# SYS_UID_MAX               999

# Verificar qué shell usar
ls -la /sbin/nologin
# Si no existe: ls -la /bin/false

# Verificar si el usuario ya existe
id james
getent passwd james
ls -la /home/james 2>&1
```

> ⚠️ **Advertencia**: El flag `-r` (system user) asigna un UID en el rango 201-999 automáticamente. Nunca mezcles usuarios de sistema con usuarios regulares.

### Fase 2: Creación del Usuario james

#### 2.1 Crear Usuario sin Directorio Home

```bash
# Comando CORRECTO y COMPLETO
sudo useradd -r -s /sbin/nologin -M james

# Análisis detallado de flags:
# -r              → Usuario de sistema (UID bajo: 998, 999, etc.)
# -s /sbin/nologin → Shell no-interactivo
# -M              → NO crear directorio home (¡crítico!)
# james           → Nombre de usuario

# Orden importante: Los flags pueden ir en cualquier orden,
# pero -M debe estar presente para evitar creación de home
```

> 💡 **Nota técnica**: El orden de los flags no importa, pero si olvidas `-M`, el sistema creará automáticamente `/home/james` porque es el comportamiento por defecto.

#### 2.2 Verificación Inmediata

```bash
# Verificar entrada en /etc/passwd
grep james /etc/passwd
# Salida esperada: james:x:998:998::/home/james:/sbin/nologin
#
# Observa: Aún muestra /home/james en el campo home,
# pero el directorio NO existe físicamente (-M lo evita)

# Verificar UID (debe ser bajo - sistema)
id james
# Salida esperada: uid=998(james) gid=998(james) groups=998(james)

# Verificar que home NO existe
ls -la /home/ | grep james
# Debe retornar vacío (sin resultados)

ls -la /home/james
# Debe mostrar: ls: cannot access '/home/james': No such file or directory
```

### Fase 3: Limpieza y Configuración Adicional

#### 3.1 Si el Directorio Home Fue Creado por Error

```bash
# Si accidentalmente se creó el directorio (olvidaste -M)
# o si alguien lo creó manualmente:

# Verificar existencia
ls -la /home/james

# Si existe, eliminarlo:
sudo rm -rf /home/james

# Verificar eliminación
ls -la /home/ | grep james  # Debe estar vacío
```

> ⚠️ **Precaución**: Nunca uses `rm -rf` sin verificar primero que estás eliminando el directorio correcto.

#### 3.2 Establecer Contraseña (Recomendado)

```bash
# Aunque no puede iniciar sesión, debe tener contraseña
# para cumplir políticas de seguridad
passwd james

# Ingresar contraseña segura cuando se solicite
```

#### 3.3 Verificación Doble: /etc/passwd vs Realidad

```bash
# Paso crítico: Verificar coherencia entre configuración y sistema

echo "=== Verificación en /etc/passwd ==="
grep james /etc/passwd

echo ""
echo "=== Verificación física del directorio ==="
ls -ld /home/james 2>&1 || echo "✓ Directorio no existe (correcto)"

echo ""
echo "=== Verificación de espacio usado ==="
id james
```

### Fase 4: Documentación del Usuario

#### 4.1 Agregar Comentario Descriptivo

```bash
# Agregar propósito del usuario en GECOS
usermod -c "Application Service Account - No Home Required" james

# Verificar
grep james /etc/passwd
# Ahora muestra: james:x:998:998:Application Service Account - No Home Required:/home/james:/sbin/nologin
```

### Resumen de Comandos Exitosos

```bash
# SECUENCIA COMPLETA Y CORRECTA

# 1. Verificación inicial
id james
getent passwd james

# 2. Creación del usuario sin directorio home
useradd -r -s /sbin/nologin -M james

# 3. Verificación crítica del directorio home
ls -la /home/ | grep james  # Debe mostrar vacío

# 4. Si existe directorio home (por error), eliminar manualmente
rm -rf /home/james  # Solo si es necesario

# 5. Establecer contraseña
passwd james

# 6. Agregar descripción
usermod -c "Application Service Account" james

# 7. Verificación final exhaustiva
grep james /etc/passwd
id james
ls -la /home/james 2>&1
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
│  │            Usuario: james                        │   │
│  │            TIPO: Sistema (UID 998)               │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                  │   │
│  │  Configuración en /etc/passwd:                   │   │
│  │  james:x:998:998::/home/james:/sbin/nologin     │   │
│  │       │   │  │  │       │            │           │   │
│  │       │   │  │  │       │            └── Shell:  │   │
│  │       │   │  │  │       │               nologin │   │
│  │       │   │  │  │       │                       │   │
│  │       │   │  │  │       └── Home REFERENCIA:    │   │
│  │       │   │  │  │          /home/james          │   │
│  │       │   │  │  │          (NO EXISTE físico)   │   │
│  │       │   │  │  │                               │   │
│  │       │   │  │  └── GID: 998 (sistema)          │   │
│  │       │   │  └──── UID: 998 (sistema)           │   │
│  │       │   └─────── Password: x (en shadow)      │   │
│  │       └─────────── Username: james              │   │
│  │                                                  │   │
│  │  📁 En disco:                                    │   │
│  │     /home/james → NO EXISTE ✓                   │   │
│  │                                                  │   │
│  │  🔒 Seguridad:                                   │   │
│  │     • No puede iniciar sesión                   │   │
│  │     • No tiene espacio personal                 │   │
│  │     • Solo para ejecución de procesos          │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Diferencias Clave: Con vs Sin Home Directory

| Aspecto             | Usuario Normal | Usuario james (sin home) |
| ------------------- | -------------- | ------------------------ |
| UID                 | 1000+          | 998 (sistema)            |
| Home en /etc/passwd | /home/username | /home/james (referencia) |
| Home físico         | ✅ Existe      | ❌ NO existe             |
| Shell               | /bin/bash      | /sbin/nologin            |
| Uso típico          | Personas       | Procesos/servicios       |
| Espacio usado       | ~4KB+          | 0 bytes                  |
| Backups             | Incluido       | Excluido                 |

### Checklist de Verificación Final

- [x] Usuario `james` creado con UID de sistema (bajo 1000)
- [x] Shell configurada como `/sbin/nologin`
- [x] Directorio home NO creado físicamente
- [x] Verificación dual: `/etc/passwd` + `ls -la /home/`
- [x] Contraseña establecida (política de seguridad)
- [x] Documentación GECOS agregada
- [x] Usuario listo para ejecución de servicios

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### La Filosofía del Mínimo Necesario

> "Si no lo necesitas, no lo crees. Si ya existe y no lo necesitas, elimínalo."

Este reto ilustra un principio fundamental de hardening:

- **Sin home directory**: Menos superficie de ataque
- **Sin shell interactivo**: No puede ser usado para exploración
- **UID de sistema**: Claramente identificado como no-humano
- **Sin archivos personales**: Nada que exfiltrar o corromper

### Errores Comunes y Prevención

#### Error #1: Olvidar el flag `-M`

```bash
# ❌ INCORRECTO - Crea directorio home
useradd -r -s /sbin/nologin james

# ✅ CORRECTO - Sin directorio home
useradd -r -s /sbin/nologin -M james
```

#### Error #2: No Verificar Físicamente

```bash
# ❌ INSUFICIENTE - Solo verifica /etc/passwd
grep james /etc/passwd

# ✅ COMPLETO - Verificación dual
grep james /etc/passwd
ls -la /home/ | grep james  # Debe estar vacío
```

#### Error #3: Confundir Referencia con Existencia

```bash
# /etc/passwd muestra /home/james, pero eso NO significa que exista
# Es solo una referencia - el flag -M previene la creación física
```

### Cuándo Usar Usuarios Sin Home

```bash
# ✅ USAR usuarios sin home para:
# - Servicios de aplicación
# - Procesos de backup
# - Daemons del sistema
# - Contenedores / microservicios
# - Cron jobs específicos

# ❌ NO usar para:
# - Usuarios humanos (necesitan ~/.bashrc, etc.)
# - Cuentas de desarrollo
# - Usuarios que ejecutan aplicaciones interactivas
# - Cuentas administrativas
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 03**: Usuario con Shell No-Interactivo - Fundamentos de seguridad
- **Reto 05**: Usuario Temporal con Expiración - Control de tiempo de vida
- **Reto 09**: Permisos de Scripts - Aplicar usuarios a archivos ejecutables

### Implementación en Producción

1. **Asignar a Proceso**:

   ```bash
   # Configurar servicio systemd para ejecutar como james
   # /etc/systemd/system/myservice.service
   [Service]
   User=james
   Group=james
   ExecStart=/opt/app/start.sh
   ```

2. **Permisos de Directorios**:

   ```bash
   # Asegurar acceso solo a lo necesario
   chown -R james:james /opt/app/
   chmod 750 /opt/app/

   # Sin acceso a /tmp innecesario
   # Sin acceso a otros directorios del sistema
   ```

3. **Monitoreo**:

   ```bash
   # Ver procesos ejecutándose como james
   ps -u james -o pid,ppid,cmd,etime

   # Auditar actividad
   ausearch -ua james -ts recent
   ```

### Comandos Avanzados

```bash
# Buscar todos los usuarios de sistema sin home
awk -F: '$3 < 1000 && $6 != "/" {print $1, $6}' /etc/passwd

# Encontrar usuarios con home que no deberían tenerlo
for user in $(awk -F: '$3 < 1000 {print $1}' /etc/passwd); do
  if [ -d "/home/$user" ]; then
    echo "⚠️ Usuario sistema con home: $user"
  fi
done

# Convertir usuario existente a "sin home"
usermod -d /dev/null -M usuario_existente  # -M no funciona con usermod
# Alternativa: usermod -d /nonexistent usuario_existente
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Linux System Users - Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_managing-users-and-groups_configuring-basic-system-settings)
- [Useradd Manual - Arch Linux](https://man.archlinux.org/man/useradd.8)
- [Login.defs Configuration](https://man7.org/linux/man-pages/man5/login.defs.5.html)

### Tabla de Referencia Rápida

| Comando              | Propósito                   |
| -------------------- | --------------------------- |
| `useradd -r -M user` | Usuario sistema sin home    |
| `useradd -r user`    | Usuario sistema CON home    |
| `useradd -M user`    | Usuario normal sin home     |
| `id username`        | Verificar UID/GID           |
| `getent passwd user` | Verificar entrada en passwd |

### Troubleshooting

| Síntoma                                | Causa          | Solución                                          |
| -------------------------------------- | -------------- | ------------------------------------------------- |
| "useradd: user 'james' already exists" | Usuario existe | Usar `id james` para verificar primero            |
| Home creado a pesar de `-M`            | Orden de flags | Verificar: `useradd -r -M -s /sbin/nologin james` |
| UID alto (>1000)                       | Olvidaste `-r` | Eliminar y recrear con `-r`                       |
| Servicio no inicia como james          | Permisos       | Verificar `chown` en directorios de aplicación    |

---

## ✅ Estado del Reto

**✅ COMPLETADO CON ÉXITO** - Usuario james creado en App Server 2

- 📅 Fecha de finalización: 2025-01-25
- ⏱️ Tiempo de ejecución: ~15 minutos
- 🎯 Dificultad: Media
- 🖥️ Servidor: stapp02 (172.16.238.11)
- 👤 Usuario: james (UID 998)

### Métricas de Éxito

✅ Usuario `james` creado sin directorio home físico  
✅ Shell configurada como `/sbin/nologin`  
✅ UID de sistema asignado (998)  
✅ Login interactivo bloqueado  
✅ Verificación dual exitosa (`/etc/passwd` + `ls -la /home/`)  
✅ Documentación completa del propósito

### Lecciones Clave del Reto

1. **🔍 Verificación Dual**: Siempre verificar `/etc/passwd` Y `/home/` físicamente
2. **🛠️ Flag Crítico `-M`**: Sin él, se crea home automáticamente
3. **🧹 Limpieza Manual**: Si algo falla, eliminar y recrear es más seguro que "arreglar"
4. **📝 Documentación Real**: El campo GECOS documenta el propósito

---

_Documentación creada siguiendo estándares de SysAdmin - Principio del Mínimo Necesario_
