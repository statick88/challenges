---
title: "Reto 09: Script Execution Permissions - xFusionCorp Industries"
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

# Reto 09: Script Execution Permissions - xFusionCorp Industries

## Control de Acceso a Scripts del Sistema: Seguridad Operacional

---

## 🎓 Del Instructor

Bienvenido a tu décimo desafío como SysAdmin Senior en xFusionCorp. Hoy abordamos un aspecto fundamental de la seguridad operacional: **el control de permisos de ejecución para scripts del sistema**.

> 💭 **Mentalidad de SysAdmin**: "Un script con permisos incorrectos es tan peligroso como una puerta sin cerradura. Todos deben poder ejecutar las herramientas que necesitan, pero solo los administradores deben poder modificarlas."

En entornos empresariales, los scripts de administración son herramientas compartidas. La configuración correcta de permisos permite que operadores y desarrolladores ejecuten tareas automatizadas sin comprometer la integridad del sistema.

---

## 🎭 Escenario Real: Scripts de Operaciones en Nautilus App 3

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Operaciones de Infraestructura  
**Servidor**: App Server 3 (stapp03)  
**Tu rol**: Senior System Administrator - Seguridad Operacional

### La Problemática

El equipo de operaciones de xFusionCorp ha desarrollado varios scripts para tareas comunes:

- **deploy.sh**: Despliegue de aplicaciones
- **monitor.sh**: Monitoreo de servicios
- **backup.sh**: Ejecución de respaldos

Estos scripts están ubicados en `/usr/local/scripts/` pero tienen problemas de permisos:

- Algunos usuarios no pueden ejecutarlos
- Otros usuarios pueden modificarlos accidentalmente
- No hay consistencia en los permisos

**El requerimiento del equipo de Operaciones**:

> "Configure proper execution permissions for system scripts."

### Contexto de Seguridad

El esquema de permisos debe cumplir:

- **Ejecución**: Todos los usuarios necesitan ejecutar los scripts
- **Modificación**: Solo root (o administradores designados)
- **Lectura**: Permitida para auditoría y transparencia
- **Consistencia**: Mismo esquema para todos los scripts del sistema

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito         |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | ----------------- |
| stapp03  | 172.16.238.12 | stapp03.stratos.xfusioncorp.com | banner         | BigGr33n   | Script Management |

### Requisitos Técnicos

- **Ubicación**: `/usr/local/scripts/`
- **Scripts**: `deploy.sh`, `monitor.sh`, `backup.sh`
- **Permisos objetivo**: `755` (rwxr-xr-x)
- **Ownership**: `root:staff`
- **Ejecución**: Todos los usuarios pueden ejecutar
- **Modificación**: Solo root puede modificar
- **Verificación**: Funcionamiento como usuario regular

---

## 🧠 La Arquitectura: Permisos de Archivos en Linux

### Notación de Permisos

```
-rwxr-xr-x  1 root staff  2341 Jan 25 10:00 deploy.sh
 │││││││││
 ││││││││└── Otros: Ejecución (x)
 │││││││└─── Otros: Escritura (w)
 ││││││└──── Otros: Lectura (r)
 │││││└───── Grupo: Ejecución (x)
 ││││└────── Grupo: Escritura (w)
 │││└─────── Grupo: Lectura (r)
 ││└──────── Owner: Ejecución (x)
 │└───────── Owner: Escritura (w)
 └────────── Owner: Lectura (r)

 Tipo: - (archivo regular)
```

### Permisos Numéricos vs Simbólicos

| Notación  | Numérico | Significado                                    |
| --------- | -------- | ---------------------------------------------- |
| rwxr-xr-x | 755      | Owner: todo, Grupo/Otros: leer+ejecutar        |
| rwxr-x--- | 750      | Owner: todo, Grupo: leer+ejecutar, Otros: nada |
| rw-r--r-- | 644      | Owner: leer+escribir, Grupo/Otros: solo leer   |
| rwx------ | 700      | Solo owner puede todo, nadie más nada          |

### Jerarquía de Permisos para Scripts del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│              JERARQUÍA DE ACCESO A SCRIPTS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     ROOT (root:root)                    │    │
│  │                   Permisos: rwx (7)                     │    │
│  │              Puede: Leer, Escribir, Ejecutar            │    │
│  │              Propietario absoluto del script            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              STAFF GROUP (root:staff)                   │    │
│  │                   Permisos: r-x (5)                     │    │
│  │              Puede: Leer, Ejecutar                      │    │
│  │              NO puede: Modificar                        │    │
│  │              (Operadores, desarrolladores senior)       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    OTHERS (todos)                       │    │
│  │                   Permisos: r-x (5)                     │    │
│  │              Puede: Leer, Ejecutar                      │    │
│  │              NO puede: Modificar                        │    │
│  │              (Cualquier usuario del sistema)            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Archivos de Configuración Relacionados

```
/etc/group          # Definición del grupo 'staff'
/usr/local/scripts/ # Directorio de scripts del sistema
/etc/sudoers        # Si se requiere elevación de privilegios
```

### Analogía: Biblioteca de Procedimientos

- **Scripts en /usr/local/scripts/**: Libros de procedimientos en la biblioteca de la empresa
- **Permisos 755**: Cualquiera puede leer el libro y seguir los procedimientos, pero solo el bibliotecario (root) puede modificar el contenido
- **Grupo staff**: Los usuarios avanzados que tienen acceso prioritario y pueden sugerir cambios
- **Ownership root:staff**: El bibliotecario es responsable, pero el personal de la biblioteca (staff) tiene acceso especial

---

## 🛠️ Implementación Profesional

### Fase 1: Verificación Pre-Implementación

#### 1.1 Acceso al Sistema

```bash
# Conexión al servidor
ssh banner@172.16.238.12
sudo su -
```

#### 1.2 Verificar Estado Actual

```bash
# Verificar que el directorio existe
ls -la /usr/local/scripts/

# Ver scripts existentes
ls -la /usr/local/scripts/*.sh 2>/dev/null || echo "No .sh files found"

# Verificar permisos actuales detallados
ls -la /usr/local/scripts/ | grep -E "(deploy|monitor|backup)"

# Verificar ACLs si existen
getfacl /usr/local/scripts/* 2>/dev/null || echo "No ACLs configured"
```

> ⚠️ **Advertencia**: Si los scripts no existen, necesitarás crearlos primero o verificar la ruta correcta.

### Fase 2: Crear Directorio y Scripts (Si es necesario)

#### 2.1 Crear Directorio de Scripts

```bash
# Crear directorio si no existe
mkdir -p /usr/local/scripts

# Verificar creación
ls -la /usr/local/
```

#### 2.2 Crear Scripts de Ejemplo (Para Práctica)

```bash
# Crear deploy.sh
cat > /usr/local/scripts/deploy.sh << 'EOF'
#!/bin/bash
# Script de despliegue de aplicaciones
# xFusionCorp Industries

echo "Iniciando despliegue de aplicación..."
echo "Timestamp: $(date)"
echo "Usuario: $(whoami)"
echo "Despliegue completado exitosamente."
EOF

# Crear monitor.sh
cat > /usr/local/scripts/monitor.sh << 'EOF'
#!/bin/bash
# Script de monitoreo de servicios
# xFusionCorp Industries

echo "Estado de servicios críticos:"
echo "==========================="
systemctl status sshd --no-pager 2>/dev/null || echo "sshd: estado no disponible"
echo "==========================="
echo "Monitoreo completado: $(date)"
EOF

# Crear backup.sh
cat > /usr/local/scripts/backup.sh << 'EOF'
#!/bin/bash
# Script de backup
# xFusionCorp Industries

echo "Iniciando procedimiento de backup..."
echo "Usuario ejecutando: $(whoami)"
echo "Timestamp inicio: $(date)"
echo "Backup completado: $(date)"
EOF

# Hacer scripts ejecutables (temporalmente)
chmod +x /usr/local/scripts/*.sh
```

### Fase 3: Configurar Ownership Correcto

#### 3.1 Establecer Usuario y Grupo

```bash
# Verificar que el grupo staff existe
getent group staff

# Si no existe, crearlo
if ! getent group staff > /dev/null; then
    groupadd staff
fi

# Establecer ownership root:staff para todo el directorio
chown -R root:staff /usr/local/scripts/

# Verificar cambio
ls -la /usr/local/scripts/
```

> 💡 **Nota técnica**: El grupo `staff` es un grupo tradicional de sistemas Unix/Linux para usuarios de soporte técnico y operaciones.

### Fase 4: Configurar Permisos 755

#### 4.1 Aplicar Permisos

```bash
# Configurar permisos 755 para todos los scripts .sh
chmod 755 /usr/local/scripts/*.sh

# Verificar permisos aplicados
ls -la /usr/local/scripts/*.sh

# Salida esperada:
# -rwxr-xr-x 1 root staff backup.sh
# -rwxr-xr-x 1 root staff deploy.sh
# -rwxr-xr-x 1 root staff monitor.sh
```

#### 4.2 Verificar Permisos Detallados

```bash
# Verificación detallada por script
for script in /usr/local/scripts/*.sh; do
    echo "=== $script ==="
    ls -la "$script"
    echo "Permisos numéricos: $(stat -c %a "$script")"
    echo "Owner: $(stat -c %U "$script")"
    echo "Group: $(stat -c %G "$script")"
    echo ""
done
```

### Fase 5: Verificación de Funcionamiento

#### 5.1 Probar Ejecución como root

```bash
# Ejecutar scripts como root
/usr/local/scripts/deploy.sh
/usr/local/scripts/monitor.sh
/usr/local/scripts/backup.sh

# Todos deben ejecutar sin errores
```

#### 5.2 Probar Ejecución como Usuario Regular

```bash
# Crear usuario de prueba si es necesario
id someuser || useradd -m someuser

# Ejecutar como usuario regular
su - someuser -c "/usr/local/scripts/deploy.sh"
su - someuser -c "/usr/local/scripts/monitor.sh"
su - someuser -c "/usr/local/scripts/backup.sh"

# Todos deben ejecutar exitosamente
```

#### 5.3 Verificar Bloqueo de Modificación

```bash
# Intentar modificar como usuario regular (debe fallar)
su - someuser -c "echo '# test' >> /usr/local/scripts/deploy.sh"
# Debe mostrar: Permission denied

# Verificar que el script no fue modificado
tail -5 /usr/local/scripts/deploy.sh
# No debe mostrar la línea '# test'
```

### Fase 6: Verificación Exhaustiva

#### 6.1 Verificación de Permisos con find

```bash
# Verificar que todos los scripts tienen permisos correctos
echo "Verificación de permisos:"
find /usr/local/scripts -name "*.sh" -type f -exec ls -la {} \;

echo ""
echo "Verificación numérica:"
find /usr/local/scripts -name "*.sh" -type f -exec stat -c "%n: %a %U:%G" {} \;
```

#### 6.2 Script de Verificación Automatizado

```bash
# Crear script de verificación
cat > /tmp/verify_scripts.sh << 'EOF'
#!/bin/bash

echo "=== Verificación de Scripts del Sistema ==="
echo ""

ERRORS=0

for script in /usr/local/scripts/*.sh; do
    if [ -f "$script" ]; then
        echo "Verificando: $script"

        # Verificar permisos
        PERMS=$(stat -c %a "$script")
        if [ "$PERMS" != "755" ]; then
            echo "  ✗ Permisos incorrectos: $PERMS (esperado: 755)"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✓ Permisos correctos: $PERMS"
        fi

        # Verificar owner
        OWNER=$(stat -c %U "$script")
        if [ "$OWNER" != "root" ]; then
            echo "  ✗ Owner incorrecto: $OWNER (esperado: root)"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✓ Owner correcto: $OWNER"
        fi

        # Verificar grupo
        GROUP=$(stat -c %G "$script")
        if [ "$GROUP" != "staff" ]; then
            echo "  ✗ Grupo incorrecto: $GROUP (esperado: staff)"
            ERRORS=$((ERRORS + 1))
        else
            echo "  ✓ Grupo correcto: $GROUP"
        fi

        echo ""
    fi
done

if [ $ERRORS -eq 0 ]; then
    echo "✓ Todos los scripts verificados correctamente"
    exit 0
else
    echo "✗ Se encontraron $ERRORS errores"
    exit 1
fi
EOF

chmod +x /tmp/verify_scripts.sh
/tmp/verify_scripts.sh
```

### Resumen de Comandos

```bash
# SECUENCIA COMPLETA

# 1. Verificar directorio y scripts
ls -la /usr/local/scripts/

# 2. Establecer ownership
chown -R root:staff /usr/local/scripts/

# 3. Configurar permisos 755
chmod 755 /usr/local/scripts/*.sh

# 4. Verificar permisos
ls -la /usr/local/scripts/*.sh

# 5. Probar ejecución como usuario regular
su - someuser -c "/usr/local/scripts/deploy.sh"

# 6. Verificar que no se puede modificar
su - someuser -c "echo test >> /usr/local/scripts/deploy.sh"  # Debe fallar
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────────────────┐
│                PERMISOS DE SCRIPTS CONFIGURADOS - stapp03               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Directorio: /usr/local/scripts/                                         │
│  Ownership: root:staff                                                   │
│  Permisos de directorio: 755 (drwxr-xr-x)                               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Scripts Configurados:                                            │   │
│  │                                                                   │   │
│  │  deploy.sh                                                        │   │
│  │  ├─ Permisos: -rwxr-xr-x (755)                                   │   │
│  │  ├─ Owner: root (rwx)    ← Puede todo                            │   │
│  │  ├─ Group: staff (r-x)   ← Ejecutar + Leer                       │   │
│  │  └─ Others: r-x          ← Ejecutar + Leer                       │   │
│  │                                                                   │   │
│  │  monitor.sh                                                       │   │
│  │  ├─ Permisos: -rwxr-xr-x (755)                                   │   │
│  │  ├─ Owner: root (rwx)                                            │   │
│  │  ├─ Group: staff (r-x)                                           │   │
│  │  └─ Others: r-x                                                  │   │
│  │                                                                   │   │
│  │  backup.sh                                                        │   │
│  │  ├─ Permisos: -rwxr-xr-x (755)                                   │   │
│  │  ├─ Owner: root (rwx)                                            │   │
│  │  ├─ Group: staff (r-x)                                           │   │
│  │  └─ Others: r-x                                                  │   │
│  │                                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ✅ Modelo de Acceso:                                                    │
│     • Root: Control total (lectura, escritura, ejecución)               │
│     • Staff: Uso operacional (lectura, ejecución)                       │
│     • Usuarios: Uso general (lectura, ejecución)                        │
│     • Modificación: Solo root (integridad protegida)                    │
│                                                                          │
│  🔒 Seguridad Implementada:                                              │
│     • Scripts inmutables para usuarios no-root                          │
│     • Ejecución universal permitida                                     │
│     • Auditoría de lectura posible                                      │
│     • Consistencia en todos los scripts                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Permisos Resultante

| Rol       | Lectura | Escritura | Ejecución | Propósito            |
| --------- | ------- | --------- | --------- | -------------------- |
| **root**  | ✅      | ✅        | ✅        | Administración total |
| **staff** | ✅      | ❌        | ✅        | Operaciones          |
| **otros** | ✅      | ❌        | ✅        | Uso general          |

### Checklist de Verificación

- [x] Directorio `/usr/local/scripts/` existe
- [x] Scripts `deploy.sh`, `monitor.sh`, `backup.sh` existen
- [x] Ownership `root:staff` establecido
- [x] Permisos `755` (rwxr-xr-x) configurados
- [x] Ejecución exitosa como usuario root
- [x] Ejecución exitosa como usuario regular
- [x] Modificación bloqueada para usuarios no-root
- [x] Verificación automatizada exitosa

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### El Principio del Menor Privilegio Aplicado

> "Cada usuario debe tener exactamente los permisos necesarios para su trabajo, ni más ni menos."

En este caso:

- **Usuarios necesitan**: Ejecutar scripts para su trabajo diario
- **Usuarios NO necesitan**: Modificar scripts del sistema
- **Root necesita**: Control total para mantenimiento

### Lecciones Clave

1. **Consistencia es Clave**: Todos los scripts del sistema deben tener el mismo esquema de permisos.

2. **Grupos Facilitan la Gestión**: Usar grupo `staff` permite agregar usuarios al grupo sin modificar permisos individuales.

3. **755 es el Estándar**: Para scripts ejecutables del sistema, 755 es el permiso estándar (750 si solo ciertos grupos deben ejecutar).

4. **Verificación Doble**: Siempre probar tanto la ejecución permitida como la modificación bloqueada.

### Permisos Comunes para Diferentes Escenarios

```bash
# Scripts del sistema (como este reto)
chmod 755 script.sh      # rwxr-xr-x - Ejecutable por todos

# Scripts solo para administradores
chmod 750 script.sh      # rwxr-x--- - Solo root y grupo

# Scripts con datos sensibles (ej: contraseñas)
chmod 700 script.sh      # rwx------ - Solo root

# Scripts de configuración (no ejecutables)
chmod 644 config.sh      # rw-r--r-- - Lectura universal, solo root escribe

# Directorios de scripts
chmod 755 /usr/local/scripts/   # drwxr-xr-x - Listable y usable por todos
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 10**: Corrección de Permisos - Ajuste fino según tipo de archivo
- **Reto 02**: Gestión de Grupos - Más sobre control de acceso basado en grupos
- **Reto 13**: Restricción de Cron - Controlar acceso a programación

### Escenarios de Expansión

1. **Integración con Sudo**:

   ```bash
   # Permitir que grupo staff ejecute scripts sin password
   # En /etc/sudoers:
   %staff ALL=(root) NOPASSWD: /usr/local/scripts/*.sh
   ```

2. **Auditoría de Uso**:

   ```bash
   # Loggear quién ejecuta qué script
   # Agregar al inicio de cada script:
   echo "$(date): $0 ejecutado por $(whoami)" >> /var/log/scripts_usage.log
   ```

3. **Control de Versiones**:
   ```bash
   # Crear directorio para versiones
   mkdir /usr/local/scripts/.versions
   # Backup antes de modificar
   cp /usr/local/scripts/deploy.sh /usr/local/scripts/.versions/deploy.sh.$(date +%Y%m%d)
   ```

### Comandos Avanzados

```bash
# Aplicar permisos recursivamente manteniendo directorios ejecutables
find /usr/local/scripts -type f -name "*.sh" -exec chmod 755 {} \;
find /usr/local/scripts -type d -exec chmod 755 {} \;

# Verificar permisos inconsistentes
find /usr/local/scripts -type f ! -perm 755 -ls

# Restaurar permisos por defecto
chmod -R u+rwX,go+rX,go-w /usr/local/scripts/

# Verificar scripts sin shebang (problema de ejecución)
for f in /usr/local/scripts/*.sh; do
  head -1 "$f" | grep -q "^#!" || echo "Sin shebang: $f"
done
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Linux File Permissions - Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_managing-file-permissions_configuring-basic-system-settings)
- [Chmod Manual](https://man7.org/linux/man-pages/man1/chmod.1.html)
- [Chown Manual](https://man7.org/linux/man-pages/man1/chown.1.html)

### Troubleshooting

| Síntoma                                    | Causa                                | Solución                        |
| ------------------------------------------ | ------------------------------------ | ------------------------------- |
| "Permission denied" al ejecutar            | Sin permiso de ejecución             | `chmod +x script.sh`            |
| "Permission denied" al modificar como root | Filesystem read-only                 | Verificar montaje con `mount`   |
| Script no aparece en ls                    | Sin permiso de lectura en directorio | `chmod 755 /usr/local/scripts/` |
| Cambios de permisos no persisten           | SELinux/AppArmor                     | Verificar con `ls -Z`           |
| "Operation not permitted"                  | No root                              | Usar `sudo` para cambios        |

### Tabla de Referencia Rápida

| Permiso   | Numérico | Uso Típico                        |
| --------- | -------- | --------------------------------- |
| rwxr-xr-x | 755      | Scripts ejecutables               |
| rwxr-x--- | 750      | Scripts solo para grupo           |
| rw-r--r-- | 644      | Archivos de configuración         |
| rwx------ | 700      | Scripts con datos sensibles       |
| r-------- | 400      | Archivos de solo lectura estricta |

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 20 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidor objetivo: stapp03 (172.16.238.12)

### Plan de Implementación

1. Verificar directorio y scripts existen
2. Crear grupo staff si no existe
3. Establecer ownership root:staff
4. Configurar permisos 755 en todos los scripts
5. Verificar permisos aplicados
6. Probar ejecución como usuario regular
7. Verificar que modificación está bloqueada

### Criterios de Éxito

- ✅ Scripts con permisos 755 correctamente configurados
- ✅ Ownership root:staff establecido
- ✅ Ejecución funcional para todos los usuarios
- ✅ Seguridad mantenida (solo root puede modificar)
- ✅ Todos los scripts (.sh) con esquema consistente

---

_Documentación creada siguiendo estándares de SysAdmin - Seguridad Operacional_
