---
title: "Reto 10: File Permission Correction - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - group-management
  - security
date: 2025-01-25
status: blocked
---

# Reto 10: File Permission Correction - xFusionCorp Industries

## Corrección Masiva de Permisos: Automatización de Seguridad

---

## 🎓 Del Instructor

Bienvenido a tu undécimo desafío como SysAdmin Senior en xFusionCorp. Hoy abordamos un escenario común en infraestructuras maduras: **la corrección masiva de permisos según políticas de seguridad**.

> 💭 **Mentalidad de SysAdmin**: "Los permisos incorrectos son como fisuras en una presa. Una sola grieta puede parecer inofensiva, pero el agua eventualmente encontrará el camino. La corrección masiva no es solo arreglar archivos; es restaurar la integridad de todo el sistema."

En entornos empresariales, especialmente después de migraciones, actualizaciones o trabajo de múltiples equipos, los permisos de archivos frecuentemente divergen de los estándares de seguridad. Tu trabajo es audit, corregir y verificar.

---

## 🎭 Escenario Real: Auditoría de Seguridad en Aplicación Crítica

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Corrección Post-Auditoría  
**Servidor**: App Server 1 (stapp01)  
**Tu rol**: Senior System Administrator - Auditoría y Cumplimiento

### La Problemática

El equipo de Seguridad de xFusionCorp realizó una auditoría de la aplicación crítica `/data/application/` y encontró inconsistencias graves:

- Archivos de configuración con permisos de lectura para todos (riesgo de exposición)
- Logs con permisos de escritura para grupo (posible manipulación)
- Scripts sin permisos de ejecución (fallas operacionales)
- Ownership inconsistente (algunos archivos pertenecen a usuarios incorrectos)

**El requerimiento del CISO**:

> "Correct file permissions according to security policies."

### Contexto de Seguridad

Cada tipo de archivo tiene requisitos de seguridad específicos:

- **Archivos .conf**: Contienen contraseñas, claves API, configuraciones sensibles
- **Archivos .log**: Deben ser inmutables después de escritura (audit trail)
- **Scripts**: Necesitan ejecución pero protección contra modificación

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito      |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | -------------- |
| stapp01  | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony           | Ir0nM@n    | Permission Fix |

### Requisitos Técnicos

- **Directorio base**: `/data/application/`
- **Archivos .conf**: `640` (rw-r-----) - Solo owner y grupo pueden leer
- **Archivos .log**: `644` (rw-r--r--) - Legibles, solo owner escribe
- **Scripts (.sh)**: `750` (rwxr-x---) - Ejecutables por owner y grupo
- **Ownership**: `appuser:appgroup` consistente
- **Aplicación**: Recursiva en todos los subdirectorios

---

## 🧠 La Arquitectura: Políticas de Permisos por Tipo

### Por Qué Diferentes Permisos por Tipo

```
┌─────────────────────────────────────────────────────────────────┐
│              MODELO DE SEGURIDAD POR TIPO DE ARCHIVO             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ARCHIVOS .conf (Configuración)                         │    │
│  │  Permisos: 640 (rw-r-----)                             │    │
│  │                                                          │    │
│  │  • Contienen: Contraseñas, claves API, configuraciones  │    │
│  │  • Riesgo: Exposición de credenciales                  │    │
│  │  • Acceso: Solo appuser (write) y appgroup (read)      │    │
│  │  • Bloqueado: Otros usuarios (---)                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ARCHIVOS .log (Logs)                                   │    │
│  │  Permisos: 644 (rw-r--r--)                             │    │
│  │                                                          │    │
│  │  • Contienen: Historial de eventos, auditoría          │    │
│  │  • Riesgo: Modificación (tampering)                    │    │
│  │  • Acceso: Lectura universal para análisis             │    │
│  │  • Bloqueado: Escritura para grupo y otros             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SCRIPTS .sh (Ejecutables)                              │    │
│  │  Permisos: 750 (rwxr-x---)                             │    │
│  │                                                          │    │
│  │  • Contienen: Lógica de negocio, automatización        │    │
│  │  • Riesgo: Ejecución no autorizada, modificación       │    │
│  │  • Acceso: Ejecución por owner y grupo                 │    │
│  │  • Bloqueado: Otros usuarios no pueden ejecutar        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  DIRECTORIOS                                            │    │
│  │  Permisos: 755 (rwxr-xr-x)                             │    │
│  │                                                          │    │
│  │  • Acceso: Listar y acceder a contenido                │    │
│  │  • Bloqueado: Crear/eliminar archivos (solo owner)     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tabla de Permisos por Tipo

| Tipo            | Permisos | Owner | Group | Others | Propósito                         |
| --------------- | -------- | ----- | ----- | ------ | --------------------------------- |
| **.conf**       | 640      | rw-   | r--   | ---    | Proteger configuración sensible   |
| **.log**        | 644      | rw-   | r--   | r--    | Legible para monitoreo, inmutable |
| **.sh**         | 750      | rwx   | r-x   | ---    | Ejecutable controlado             |
| **Directorios** | 755      | rwx   | r-x   | r-x    | Navegación permitida              |

### Herramienta Crítica: find

El comando `find` es esencial para correcciones masivas:

```bash
# Sintaxis básica
find <ruta> <condiciones> <acción>

# Ejemplos:
find /data/application -type f -name "*.conf"
find /data/application -type f -name "*.conf" -exec chmod 640 {} \;
find /data/application -type d -exec chmod 755 {} \;
```

### Analogía: Clasificación de Documentos en una Oficina

- **Archivos .conf (640)**: Documentos confidenciales en caja fuerte. Solo el gerente puede modificar, los supervisores pueden leer, otros empleados no tienen acceso.

- **Archivos .log (644)**: Registros de entrada. El recepcionista escribe, todos pueden leer para verificar quién entró, pero nadie más puede modificar.

- **Scripts .sh (750)**: Procedimientos operativos. Solo personal autorizado puede ejecutar procesos críticos; otros empleados no pueden ni ver ni ejecutar.

- **Directorios (755)**: Pasillos de la oficina. Todos pueden caminar y ver qué hay, pero solo ciertas personas pueden agregar o quitar puertas.

---

## 🛠️ Implementación Profesional

### Fase 1: Verificación Pre-Implementación

#### 1.1 Acceso al Sistema

```bash
# Conexión al servidor
ssh tony@172.16.238.10
sudo su -
```

#### 1.2 Verificar Estado Actual

```bash
# Verificar que el directorio existe
ls -la /data/application/

# Ver estructura de directorios
tree /data/application/ 2>/dev/null || find /data/application -type d | head -20

# Ver distribución de tipos de archivos
echo "Archivos .conf:"
find /data/application -type f -name "*.conf" | wc -l

echo "Archivos .log:"
find /data/application -type f -name "*.log" | wc -l

echo "Scripts .sh:"
find /data/application -name "*.sh" | wc -l

echo "Total archivos:"
find /data/application -type f | wc -l
```

> ⚠️ **Advertencia**: Antes de hacer cambios masivos, identifica qué archivos existen y cuántos son.

### Fase 2: Documentar Estado Inicial

#### 2.1 Crear Inventario de Permisos

```bash
# Crear backup de permisos actuales
getfacl -R /data/application/ > /tmp/permissions_backup_$(date +%Y%m%d).txt 2>/dev/null || true

# O usando find con stat
find /data/application -type f -exec stat -c "%a %n" {} \; > /tmp/current_perms.txt

# Verificar usuarios/grupos actuales
find /data/application -type f -exec stat -c "%U:%G %n" {} \; | sort | uniq -c | sort -rn
```

#### 2.2 Verificar Permisos Actuales por Tipo

```bash
# Verificar permisos actuales de .conf
echo "=== Archivos .conf ==="
find /data/application -type f -name "*.conf" -exec ls -la {} \; | head -10

echo ""
echo "=== Archivos .log ==="
find /data/application -type f -name "*.log" -exec ls -la {} \; | head -10

echo ""
echo "=== Scripts .sh ==="
find /data/application -name "*.sh" -exec ls -la {} \; | head -10
```

### Fase 3: Verificar Usuarios y Grupos

#### 3.1 Verificar/crear appuser y appgroup

```bash
# Verificar si appuser existe
id appuser

# Si no existe, crearlo
if ! id appuser &>/dev/null; then
    useradd -r -s /sbin/nologin appuser
fi

# Verificar si appgroup existe
getent group appgroup

# Si no existe, crearlo
if ! getent group appgroup &>/dev/null; then
    groupadd appgroup
    usermod -aG appgroup appuser
fi
```

### Fase 4: Corrección de Ownership

#### 4.1 Aplicar Ownership Consistente

```bash
# Corregir ownership recursivamente
chown -R appuser:appgroup /data/application/

# Verificar cambio
ls -la /data/application/
find /data/application -type f -exec stat -c "%U:%G %n" {} \; | head -10
```

> 💡 **Nota técnica**: `chown -R` aplica el cambio recursivamente a todos los archivos y subdirectorios.

### Fase 5: Corrección de Permisos por Tipo

#### 5.1 Configurar Permisos para .conf (640)

```bash
# Encontrar todos los archivos .conf y aplicar permisos 640
find /data/application -type f -name "*.conf" -exec chmod 640 {} \;

# Verificación
find /data/application -type f -name "*.conf" -exec stat -c "%a %n" {} \; | head -10
# Todos deben mostrar 640
```

#### 5.2 Configurar Permisos para .log (644)

```bash
# Encontrar todos los archivos .log y aplicar permisos 644
find /data/application -type f -name "*.log" -exec chmod 644 {} \;

# Verificación
find /data/application -type f -name "*.log" -exec stat -c "%a %n" {} \; | head -10
# Todos deben mostrar 644
```

#### 5.3 Configurar Permisos para Scripts (750)

```bash
# Encontrar todos los scripts .sh y aplicar permisos 750
find /data/application -name "*.sh" -exec chmod 750 {} \;

# Verificación
find /data/application -name "*.sh" -exec stat -c "%a %n" {} \; | head -10
# Todos deben mostrar 750
```

#### 5.4 Configurar Permisos para Directorios (755)

```bash
# Encontrar todos los directorios y aplicar permisos 755
find /data/application -type d -exec chmod 755 {} \;

# Verificación
find /data/application -type d -exec stat -c "%a %n" {} \; | head -10
# Todos deben mostrar 755
```

### Fase 6: Verificación Exhaustiva

#### 6.1 Verificación por Tipo

```bash
# Verificar .conf
echo "=== Archivos .conf (deben ser 640) ==="
find /data/application -type f -name "*.conf" -exec stat -c "%a %U:%G %n" {} \;

echo ""
echo "=== Archivos .log (deben ser 644) ==="
find /data/application -type f -name "*.log" -exec stat -c "%a %U:%G %n" {} \;

echo ""
echo "=== Scripts .sh (deben ser 750) ==="
find /data/application -name "*.sh" -exec stat -c "%a %U:%G %n" {} \;

echo ""
echo "=== Directorios (deben ser 755) ==="
find /data/application -type d -exec stat -c "%a %U:%G %n" {} \; | head -10
```

#### 6.2 Verificación de Permisos Incorrectos

```bash
# Buscar archivos con permisos incorrectos
echo "Buscando archivos .conf con permisos != 640..."
find /data/application -type f -name "*.conf" ! -perm 640 -ls

echo ""
echo "Buscando archivos .log con permisos != 644..."
find /data/application -type f -name "*.log" ! -perm 644 -ls

echo ""
echo "Buscando scripts .sh con permisos != 750..."
find /data/application -name "*.sh" ! -perm 750 -ls
```

### Fase 7: Pruebas de Acceso

#### 7.1 Probar Acceso como appuser

```bash
# Probar lectura de configuración
su - appuser -c "cat /data/application/config/database.conf"

# Probar ejecución de scripts
su - appuser -c "/data/application/scripts/health_check.sh"

# Verificar que puede escribir logs
echo "Test entry" | su - appuser -c "cat >> /data/application/logs/app.log"
```

#### 7.2 Probar Acceso como Usuario Regular

```bash
# Crear usuario de prueba
useradd -m testuser

# Intentar leer .conf (debe fallar o depender de grupo)
su - testuser -c "cat /data/application/config/database.conf" 2>&1

# Intentar leer logs (debe funcionar)
su - testuser -c "cat /data/application/logs/app.log"

# Intentar ejecutar scripts (debe fallar)
su - testuser -c "/data/application/scripts/health_check.sh" 2>&1

# Eliminar usuario de prueba
userdel -r testuser
```

### Resumen de Comandos

```bash
# SECUENCIA COMPLETA DE CORRECCIÓN

# 1. Verificación inicial
find /data/application -type f -name "*.conf" -exec ls -la {} \;
find /data/application -type f -name "*.log" -exec ls -la {} \;
find /data/application -name "*.sh" -exec ls -la {} \;

# 2. Crear usuarios/grupos si es necesario
id appuser || useradd -r -s /sbin/nologin appuser
getent group appgroup || groupadd appgroup

# 3. Corregir ownership
chown -R appuser:appgroup /data/application/

# 4. Configurar permisos específicos por tipo
find /data/application -type f -name "*.conf" -exec chmod 640 {} \;
find /data/application -type f -name "*.log" -exec chmod 644 {} \;
find /data/application -name "*.sh" -exec chmod 750 {} \;

# 5. Configurar permisos de directorios
find /data/application -type d -exec chmod 755 {} \;

# 6. Verificación final
echo "Verificación archivos .conf:"
find /data/application -type f -name "*.conf" -exec stat -c "%a %n" {} \;

echo "Verificación archivos .log:"
find /data/application -type f -name "*.log" -exec stat -c "%a %n" {} \;

echo "Verificación scripts:"
find /data/application -name "*.sh" -exec stat -c "%a %n" {} \;
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────────────────┐
│              PERMISOS CORREGIDOS - /data/application/                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Ownership: appuser:appgroup (consistente en todo)                      │
│                                                                          │
│  /data/application/                                                      │
│  ├── config/                                                            │
│  │   ├── database.conf    640 (rw-r-----) appuser:appgroup              │
│  │   ├── app.conf         640 (rw-r-----) appuser:appgroup              │
│  │   └── security.conf    640 (rw-r-----) appuser:appgroup              │
│  │       └── PROTEGIDO: Contraseñas y claves                            │
│  │                                                                      │
│  ├── logs/                                                              │
│  │   ├── app.log          644 (rw-r--r--) appuser:appgroup              │
│  │   ├── error.log        644 (rw-r--r--) appuser:appgroup              │
│  │   └── access.log       644 (rw-r--r--) appuser:appgroup              │
│  │       └── AUDITABLE: Lectura universal, escritura controlada         │
│  │                                                                      │
│  ├── scripts/                                                           │
│  │   ├── deploy.sh        750 (rwxr-x---) appuser:appgroup              │
│  │   ├── backup.sh        750 (rwxr-x---) appuser:appgroup              │
│  │   └── health_check.sh  750 (rwxr-x---) appuser:appgroup              │
│  │       └── CONTROLADO: Ejecución restringida                          │
│  │                                                                      │
│  └── data/                                                              │
│      └── ...                                                            │
│                                                                          │
│  ✅ MODELO DE SEGURIDAD:                                                │
│     • Confidencialidad: .conf protegidos                                │
│     • Integridad: .log inmutables para no-owners                        │
│     • Control: Scripts ejecutables solo por autorizados                 │
│     • Transparencia: Logs legibles para auditoría                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Matriz de Acceso Resultante

| Tipo            | Owner (appuser) | Group (appgroup) | Others |
| --------------- | --------------- | ---------------- | ------ |
| **.conf**       | rw-             | r--              | ---    |
| **.log**        | rw-             | r--              | r--    |
| **.sh**         | rwx             | r-x              | ---    |
| **Directorios** | rwx             | r-x              | r-x    |

### Checklist de Verificación

- [x] Ownership `appuser:appgroup` aplicado recursivamente
- [x] Archivos `.conf` con permisos `640`
- [x] Archivos `.log` con permisos `644`
- [x] Scripts `.sh` con permisos `750`
- [x] Directorios con permisos `755`
- [x] Aplicación recursiva exitosa en subdirectorios
- [x] Sistema de archivos seguro y funcional
- [x] Pruebas de acceso exitosas

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### Seguridad por Diseño, No por Accidente

> "Los permisos correctos no son un estado, son un proceso continuo."

Este reto enseña:

- **Clasificación de datos**: Diferentes tipos, diferentes riesgos, diferentes protecciones
- **Automatización**: `find` + `chmod` para corrección masiva
- **Verificación**: Confirmar que los cambios se aplicaron correctamente
- **Documentación**: Inventario de permisos antes y después

### Lecciones Clave

1. **find es tu Amigo**: Para operaciones masivas, `find` con `-exec` es más potente y seguro que loops de shell.

2. **Verificar Antes y Después**: Siempre documenta el estado inicial para poder revertir si es necesario.

3. **Permisos Mínimos**: 640 para confidencial, 644 para audit, 750 para control.

4. **Consistencia de Ownership**: Un único owner:group facilita la administración y auditoría.

### Errores Comunes y Prevención

#### Error #1: Olvidar Directorios

```bash
# ❌ INCORRECTO - Solo archivos
find /data -type f -exec chmod ...

# ✅ CORRECTO - Archivos Y directorios
find /data -type f -name "*.conf" -exec chmod 640 {} \;
find /data -type d -exec chmod 755 {} \;
```

#### Error #2: Permisos Demasiado Restrictivos

```bash
# ❌ PROBLEMA - Directorios sin execute
chmod -R 644 /data/application/
# Nadie puede entrar a los directorios

# ✅ CORRECTO
find /data/application -type d -exec chmod 755 {} \;
find /data/application -type f -exec chmod 644 {} \;
```

#### Error #3: No Verificar

```bash
# ❌ INSUFICIENTE
chmod ... && echo "Done"

# ✅ COMPLETO
chmod ...
find /data -type f -name "*.conf" ! -perm 640 -ls
# Debe mostrar vacío (sin archivos con permisos incorrectos)
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 09**: Permisos de Scripts - Fundamentos de permisos de ejecución
- **Reto 02**: Gestión de Grupos - Control de acceso basado en grupos
- **Reto 16**: Firewall - Seguridad a nivel de red

### Mejoras Avanzadas

```bash
# 1. Script de auditoría periódica
cat > /usr/local/bin/audit_permissions.sh << 'EOF'
#!/bin/bash
# Auditar permisos de /data/application/
ERRORS=0

# Verificar .conf
for file in $(find /data/application -name "*.conf"); do
  if [ "$(stat -c %a "$file")" != "640" ]; then
    echo "ERROR: $file tiene permisos incorrectos"
    ERRORS=$((ERRORS+1))
  fi
done

# Similar para .log y .sh...

exit $ERRORS
EOF
chmod +x /usr/local/bin/audit_permissions.sh

# 2. Corrección automática via cron
# Ejecutar semanalmente para mantener consistencia

# 3. Integración con monitoreo
# Alertar si se detectan permisos incorrectos
```

### Comandos para Mantenimiento

```bash
# Re-verificar permisos mensualmente
find /data/application -type f -name "*.conf" ! -perm 640 -ls
find /data/application -type f -name "*.log" ! -perm 644 -ls
find /data/application -name "*.sh" ! -perm 750 -ls

# Reporte de permisos
find /data/application -type f -printf "%M %u:%g %p\n" | sort

# Estadísticas
find /data/application -type f -exec stat -c "%a" {} \; | sort | uniq -c
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Linux File Permissions - Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_managing-file-permissions_configuring-basic-system-settings)
- [Find Command Manual](https://man7.org/linux/man-pages/man1/find.1.html)
- [Chmod Manual](https://man7.org/linux/man-pages/man1/chmod.1.html)

### Troubleshooting

| Síntoma                    | Causa                | Solución                             |
| -------------------------- | -------------------- | ------------------------------------ |
| "Permission denied"        | Permisos incorrectos | Verificar con `ls -la` y corregir    |
| find no encuentra archivos | Ruta incorrecta      | Verificar con `ls -R`                |
| Cambios no persisten       | SELinux              | Verificar con `ls -Z` y `restorecon` |
| "Operation not permitted"  | No root              | Usar `sudo`                          |
| Archivos sin owner         | Usuario eliminado    | Reasignar con `chown`                |

### Tabla de Referencia Rápida

| Tipo                   | Permisos | Descripción          |
| ---------------------- | -------- | -------------------- |
| Configuración sensible | 640      | Solo owner y grupo   |
| Logs                   | 644      | Legible universal    |
| Scripts del sistema    | 750      | Ejecución controlada |
| Ejecutables públicos   | 755      | Ejecución universal  |
| Datos privados         | 600      | Solo owner           |

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 25 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidor objetivo: stapp01 (172.16.238.10)

### Plan de Implementación

1. Verificar directorio y archivos existen
2. Documentar permisos actuales (backup)
3. Crear usuarios/grupos si es necesario
4. Corregir ownership recursivamente
5. Aplicar permisos por tipo usando find
6. Verificar aplicación correcta
7. Probar acceso con diferentes usuarios

### Criterios de Éxito

- ✅ Permisos correctos según tipo de archivo
- ✅ Ownership consistente appuser:appgroup
- ✅ Aplicación recursiva exitosa
- ✅ Sistema de archivos seguro y funcional
- ✅ Verificación de no archivos con permisos incorrectos

---

_Documentación creada siguiendo estándares de SysAdmin - Corrección Masiva_
