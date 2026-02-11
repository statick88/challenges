---
title: "Reto 08: Data Backup for Developer - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - permissions
  - backup
date: 2025-01-25
status: completed
---

# Reto 08: Data Backup for Developer - xFusionCorp Industries

## Automatización de Backups: El Seguro de Vida de los Datos

---

## 🎓 Del Instructor

Bienvenido a tu noveno desafío como SysAdmin Senior en xFusionCorp. Hoy implementamos uno de los pilares de la administración de sistemas: **la estrategia de backup automatizado**.

> 💭 **Mentalidad de SysAdmin**: "Los datos no existen a menos que estén respaldados en al menos dos lugares. Un backup que no se ha probado no es un backup; es un deseo."

En entornos empresariales, la pérdida de datos no es una opción. Desarrolladores, analistas y usuarios confían en que sus datos están protegidos. Tu trabajo como SysAdmin es garantizar esa protección de forma automatizada y verificable.

---

## 🎭 Escenario Real: Protección de Datos de Desarrollo

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Protección de Activos de Desarrollo  
**Servidor**: App Server 2 (stapp02)  
**Tu rol**: Senior System Administrator - Continuidad de Negocio

### La Problemática

El equipo de desarrollo de xFusionCorp ha experimentado pérdida de datos en el pasado debido a:

- Borrados accidentales de directorios de trabajo
- Corrupción de archivos durante actualizaciones
- Errores humanos en scripts de despliegue

El directorio `/home/developer_data` contiene:

- Código fuente crítico
- Configuraciones de desarrollo
- Scripts de automatización
- Documentación técnica

**El requerimiento del CTO**:

> "Implement automated backup system for developer data with scheduling."

### Contexto de Recuperación

El plan de respaldo debe cumplir:

- **RPO (Recovery Point Objective)**: Máximo 24 horas de datos perdidos
- **RTO (Recovery Time Objective)**: Restauración en menos de 1 hora
- **Retención**: 7 días de historial para recuperación puntual
- **Automatización**: Sin intervención humana
- **Monitoreo**: Alertas ante fallos

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito    |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | ------------ |
| stapp02  | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve          | Am3ric@    | Backup Setup |

### Requisitos Técnicos

- **Directorio origen**: `/home/developer_data`
- **Destino backup**: `/backup/daily/`
- **Frecuencia**: Diaria a las 02:00 AM
- **Rotación**: Mantener últimos 7 días
- **Método**: rsync con compresión y preservación
- **Logging**: Registro completo de operaciones
- **Notificación**: Registro de éxito/fallo

---

## 🧠 La Arquitectura: Estrategias de Backup

### Tipos de Backup

| Tipo            | Descripción                       | Ventajas                      | Desventajas              |
| --------------- | --------------------------------- | ----------------------------- | ------------------------ |
| **Full**        | Copia completa de todos los datos | Restauración simple           | Lento, ocupa más espacio |
| **Incremental** | Solo cambios desde último backup  | Rápido, eficiente             | Restauración compleja    |
| **Diferencial** | Cambios desde último full         | Balance velocidad/simplicidad | Crece con el tiempo      |

Para este escenario usaremos **Full Backup Diario** (más simple y adecuado para el volumen de datos).

### Rotación de Backups (Grandfather-Father-Son)

```
┌────────────────────────────────────────────────────────────────┐
│                   ESQUEMA DE RETENCIÓN                          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Día 1:  backup_20250125/  ◄── Lunes                           │
│  Día 2:  backup_20250126/  ◄── Martes                          │
│  Día 3:  backup_20250127/  ◄── Miércoles                       │
│  Día 4:  backup_20250128/  ◄── Jueves                          │
│  Día 5:  backup_20250129/  ◄── Viernes                         │
│  Día 6:  backup_20250130/  ◄── Sábado                          │
│  Día 7:  backup_20250131/  ◄── Domingo                         │
│  Día 8:  backup_20250201/  ◄── Lunes (Nuevo)                   │
│                              └── backup_20250125/ ELIMINADO    │
│                                                                 │
│  Regla: Mantener solo los últimos 7 días                        │
│  Método: find + delete con mtime +7                            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Componentes del Sistema de Backup

```
┌────────────────────────────────────────────────────────────────┐
│              ARQUITECTURA DE BACKUP AUTOMATIZADO                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐                  │
│  │   CRON JOB      │      │   SCRIPT DE     │                  │
│  │   0 2 * * *     │──────→│   BACKUP        │                  │
│  │   (2:00 AM)     │      │   /usr/local/   │                  │
│  └─────────────────┘      │   bin/dev_      │                  │
│                           │   backup.sh     │                  │
│                           └────────┬────────┘                  │
│                                    │                           │
│                                    ▼                           │
│                           ┌─────────────────┐                  │
│                           │   RSYNC/TAR     │                  │
│                           │   Backup de     │                  │
│                           │   /home/        │                  │
│                           │   developer_    │                  │
│                           │   data          │                  │
│                           └────────┬────────┘                  │
│                                    │                           │
│                    ┌───────────────┴───────────────┐          │
│                    ▼                               ▼          │
│           ┌──────────────────┐          ┌──────────────────┐   │
│           │  /backup/daily/  │          │  /var/log/       │   │
│           │  backup_YYYYMMDD │          │  backup/         │   │
│           │                  │          │  backup_YYYY     │   │
│           │  • Copia         │          │  MMDD_HHMMSS.log │   │
│           │    completa      │          │                  │   │
│           │  • Permisos      │          │  • Timestamp     │   │
│           │    preservados   │          │  • Éxito/Fallo   │   │
│           │  • Timestamped   │          │  • Estadísticas  │   │
│           └──────────────────┘          └──────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  LIMPIEZA AUTOMÁTICA:                                      ││
│  │  find /backup/daily -name "backup_*" -mtime +7 -delete     ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Analogía: Sistema de Archivos de una Oficina

- **Directorio de trabajo** (`/home/developer_data`): Escritorios de los empleados con documentos activos
- **Sala de archivos** (`/backup/daily/`): Copias de seguridad organizadas por fecha
- **Bitácora** (`/var/log/backup/`): Registro de quién hizo qué y cuándo
- **Política de retención**: "Mantener solo la última semana de copias, destruir las más antiguas automáticamente"
- **Cron job**: Empleado de mantenimiento que entra todas las noches a las 2 AM a hacer las copias

---

## 🛠️ Implementación Profesional

### Fase 1: Preparación del Entorno

#### 1.1 Acceso al Sistema

```bash
# Conexión al servidor
ssh steve@172.16.238.11
sudo su -
```

#### 1.2 Verificar Datos de Origen

```bash
# Verificar que el directorio origen existe
ls -la /home/developer_data

# Calcular tamaño total
du -sh /home/developer_data

# Verificar permisos
ls -la /home/developer_data | head -10
```

> ⚠️ **Advertencia**: Antes de implementar backups, asegúrate de que el origen existe y tienes permisos de lectura.

### Fase 2: Crear Estructura de Directorios

#### 2.1 Crear Directorios de Backup y Logs

```bash
# Crear directorio para backups diarios
mkdir -p /backup/daily

# Crear directorio para logs
mkdir -p /var/log/backup

# Establecer permisos adecuados
chmod 755 /backup
chmod 755 /backup/daily
chmod 755 /var/log/backup

# Verificar creación
ls -la /backup/
ls -la /var/log/backup/
```

#### 2.2 Verificar Espacio Disponible

```bash
# Verificar espacio en disco
df -h /backup/

# Calcular espacio necesario (aproximado)
du -sh /home/developer_data

# Asegurar que hay al menos 7x el tamaño para 7 días de retención
# Más margen de crecimiento
```

### Fase 3: Crear Script de Backup

#### 3.1 Crear Script Principal

```bash
# Crear el script de backup
cat > /usr/local/bin/dev_backup.sh << 'EOF'
#!/bin/bash

#===============================================================================
# Script de Backup para Datos de Desarrollador
# xFusionCorp Industries - Nautilus Project
#
# Descripción: Realiza backup diario de /home/developer_data
# Frecuencia: Diaria a las 02:00 AM
# Retención: 7 días
#===============================================================================

# Configuración
SOURCE_DIR="/home/developer_data"
BACKUP_BASE="/backup/daily"
LOG_DIR="/var/log/backup"
RETENTION_DAYS=7

# Generar timestamp
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_BASE}/backup_${DATE}"
LOG_FILE="${LOG_DIR}/backup_${DATE}.log"

# Función de logging
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Iniciar backup
log "=========================================="
log "INICIANDO BACKUP"
log "Origen: $SOURCE_DIR"
log "Destino: $BACKUP_DIR"
log "=========================================="

# Verificar que el origen existe
if [ ! -d "$SOURCE_DIR" ]; then
    log "ERROR: Directorio origen no existe: $SOURCE_DIR"
    exit 1
fi

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"
if [ $? -ne 0 ]; then
    log "ERROR: No se pudo crear directorio de backup: $BACKUP_DIR"
    exit 1
fi

# Realizar backup con rsync
log "Ejecutando rsync..."
rsync -avz --delete "$SOURCE_DIR/" "$BACKUP_DIR/" >> "$LOG_FILE" 2>&1
RSYNC_EXIT=$?

if [ $RSYNC_EXIT -eq 0 ]; then
    log "✓ Backup completado exitosamente"

    # Calcular estadísticas
    SOURCE_SIZE=$(du -sb "$SOURCE_DIR" | awk '{print $1}')
    BACKUP_SIZE=$(du -sb "$BACKUP_DIR" | awk '{print $1}')
    FILE_COUNT=$(find "$BACKUP_DIR" -type f | wc -l)

    log "Estadísticas:"
    log "  - Archivos respaldados: $FILE_COUNT"
    log "  - Tamaño origen: $(du -sh "$SOURCE_DIR" | awk '{print $1}')"
    log "  - Tamaño backup: $(du -sh "$BACKUP_DIR" | awk '{print $1}')"

else
    log "✗ ERROR en rsync (exit code: $RSYNC_EXIT)"
    exit 1
fi

# Limpiar backups antiguos
log "Limpiando backups antiguos (> $RETENTION_Días días)..."
DELETED=$(find "$BACKUP_BASE" -name "backup_*" -type d -mtime +$RETENTION_DAYS)
if [ -n "$DELETED" ]; then
    echo "$DELETED" | while read dir; do
        log "  Eliminando: $dir"
    done
    find "$BACKUP_BASE" -name "backup_*" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null
fi
REMAINING=$(find "$BACKUP_BASE" -name "backup_*" -type d | wc -l)
log "Backups restantes: $REMAINING"

log "=========================================="
log "BACKUP FINALIZADO"
log "=========================================="

exit 0
EOF

# Hacer script ejecutable
chmod +x /usr/local/bin/dev_backup.sh

# Verificar script
cat /usr/local/bin/dev_backup.sh | head -20
```

#### 3.2 Probar Script Manualmente

```bash
# Ejecutar script manualmente para verificar
/usr/local/bin/dev_backup.sh

# Verificar resultado
echo "Exit code: $?"

# Verificar log generado
ls -la /var/log/backup/
cat /var/log/backup/backup_*.log | tail -30

# Verificar backup creado
ls -la /backup/daily/
```

### Fase 4: Configurar Automatización con Cron

#### 4.1 Editar Crontab

```bash
# Editar crontab del usuario root (o usuario específico)
crontab -e

# O crear archivo en /etc/cron.d/
```

#### 4.2 Agregar Entrada de Cron

```bash
# Agregar línea al crontab
echo "0 2 * * * /usr/local/bin/dev_backup.sh" | crontab -

# O crear archivo dedicado
cat > /etc/cron.d/dev-backup << 'EOF'
# Backup diario de datos de desarrollador
# Se ejecuta todos los días a las 02:00 AM
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

0 2 * * * root /usr/local/bin/dev_backup.sh
EOF

# Establecer permisos correctos para cron.d
chmod 644 /etc/cron.d/dev-backup
```

> 💡 **Nota técnica**: Los archivos en `/etc/cron.d/` deben tener permisos 644 y terminar en newline.

#### 4.3 Verificar Configuración de Cron

```bash
# Listar tareas cron
crontab -l

# O verificar archivo
ls -la /etc/cron.d/dev-backup
cat /etc/cron.d/dev-backup

# Verificar servicio cron activo
systemctl status crond
# o
systemctl status cron
```

### Fase 5: Verificación y Monitoreo

#### 5.1 Simular Ejecución

```bash
# Verificar que el script existe y es ejecutable
ls -la /usr/local/bin/dev_backup.sh
file /usr/local/bin/dev_backup.sh

# Verificar sintaxis del script
bash -n /usr/local/bin/dev_backup.sh
echo "Syntax OK: $?"

# Ejecutar en modo verbose para verificar
bash -x /usr/local/bin/dev_backup.sh 2>&1 | head -50
```

#### 5.2 Verificar Backups Generados

```bash
# Listar todos los backups
ls -ltr /backup/daily/

# Verificar contenido del backup más reciente
ls -la /backup/daily/backup_*/

# Comparar con origen
diff -r /home/developer_data /backup/daily/backup_$(ls /backup/daily/ | tail -1)/
# Si no hay salida, son idénticos
```

#### 5.3 Verificar Logs

```bash
# Ver último log
tail -50 /var/log/backup/backup_*.log | tail -50

# Buscar errores en logs
grep -i "error" /var/log/backup/backup_*.log

# Ver resumen de todos los backups
cat /var/log/backup/backup_*.log | grep -E "(INICIANDO|FINALIZADO|ERROR)"
```

### Resumen de Comandos

```bash
# SECUENCIA COMPLETA

# 1. Crear estructura de directorios
mkdir -p /backup/daily /var/log/backup

# 2. Crear script de backup
cat > /usr/local/bin/dev_backup.sh << 'EOF'
#!/bin/bash
SOURCE_DIR="/home/developer_data"
BACKUP_BASE="/backup/daily"
LOG_DIR="/var/log/backup"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${LOG_DIR}/backup_${DATE}.log"

echo "$(date) - Iniciando backup" >> "$LOG_FILE"
mkdir -p "${BACKUP_BASE}/backup_${DATE}"
rsync -avz --delete "$SOURCE_DIR/" "${BACKUP_BASE}/backup_${DATE}/" >> "$LOG_FILE" 2>&1
echo "$(date) - Backup completado" >> "$LOG_FILE"
find "$BACKUP_BASE" -name "backup_*" -type d -mtime +7 -exec rm -rf {} +
EOF
chmod +x /usr/local/bin/dev_backup.sh

# 3. Configurar cron
echo "0 2 * * * /usr/local/bin/dev_backup.sh" | crontab -

# 4. Verificación
crontab -l
/usr/local/bin/dev_backup.sh
ls -la /backup/daily/
ls -la /var/log/backup/
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────────────────┐
│              SISTEMA DE BACKUP AUTOMATIZADO - stapp02                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    CRON JOB (2:00 AM diario)                      │   │
│  │  0 2 * * * /usr/local/bin/dev_backup.sh                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              SCRIPT: /usr/local/bin/dev_backup.sh                 │   │
│  │                                                                   │   │
│  │  PASO 1: Logging inicial                                          │   │
│  │     ↓                                                             │   │
│  │  PASO 2: Verificar origen existe                                  │   │
│  │     ↓                                                             │   │
│  │  PASO 3: Crear directorio backup_YYYYMMDD_HHMMSS/                 │   │
│  │     ↓                                                             │   │
│  │  PASO 4: rsync -avz --delete                                      │   │
│  │          /home/developer_data/ → /backup/daily/backup_*/          │   │
│  │     ↓                                                             │   │
│  │  PASO 5: Estadísticas de backup                                   │   │
│  │     ↓                                                             │   │
│  │  PASO 6: Limpiar backups > 7 días                                 │   │
│  │     ↓                                                             │   │
│  │  PASO 7: Logging final                                            │   │
│  │                                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                    ┌───────────────┴───────────────┐                    │
│                    ▼                               ▼                    │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐    │
│  │   /backup/daily/             │  │   /var/log/backup/           │    │
│  │                              │  │                              │    │
│  │   backup_20250125_020000/    │  │   backup_20250125_020000.log │    │
│  │   backup_20250126_020000/    │  │   backup_20250126_020000.log │    │
│  │   backup_20250127_020000/    │  │   backup_20250127_020000.log │    │
│  │   backup_20250128_020000/    │  │   backup_20250128_020000.log │    │
│  │   backup_20250129_020000/    │  │   backup_20250129_020000.log │    │
│  │   backup_20250130_020000/    │  │   backup_20250130_020000.log │    │
│  │   backup_20250131_020000/    │  │   backup_20250131_020000.log │    │
│  │                              │  │                              │    │
│  │   (backup_20250124 eliminado)│  │   [Historial completo]       │    │
│  │                              │  │                              │    │
│  └──────────────────────────────┘  └──────────────────────────────┘    │
│                                                                          │
│  ✅ Características:                                                     │
│     • Automático: Sin intervención humana                               │
│     • Timestamped: Cada backup identificable                            │
│     • Incremental: Solo copia cambios (rsync --delete)                  │
│     • Preservador: Permisos, timestamps intactos                        │
│     • Rotación: Máximo 7 días de historial                              │
│     • Auditado: Logs detallados de cada operación                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Beneficios del Sistema Implementado

| Aspecto          | Antes             | Después                 |
| ---------------- | ----------------- | ----------------------- |
| **Frecuencia**   | Manual/esporádico | Diario automatizado     |
| **Consistencia** | Variable          | 02:00 AM todos los días |
| **Retención**    | Sin política      | 7 días automático       |
| **Verificación** | Subjetiva         | Logs detallados         |
| **Recuperación** | Incierta          | Rápida y predecible     |

### Checklist de Verificación

- [x] Directorios `/backup/daily/` y `/var/log/backup/` creados
- [x] Script `/usr/local/bin/dev_backup.sh` creado y ejecutable
- [x] Script probado manualmente sin errores
- [x] Cron job configurado para 02:00 AM diario
- [x] Backup generado correctamente
- [x] Logs generados con información útil
- [x] Rotación de 7 días funcionando
- [x] Permisos y timestamps preservados en backup
- [x] Servicio cron activo

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### La Regla 3-2-1 de Backups

> "3 copias de los datos, en 2 medios diferentes, 1 fuera del sitio."

Este reto implementa la base (copias locales), pero para producción real necesitas:

- **3 copias**: Original + backup local + backup remoto
- **2 medios**: Disco local + disco externo/nube
- **1 offsite**: Backup en ubicación geográfica diferente

### Lecciones Clave

1. **Automatización > Manual**: Un backup que requiere que alguien lo ejecute no se ejecutará consistentemente.

2. **Logs son Evidencia**: Sin logs, no puedes probar que el backup funcionó ni diagnosticar fallos.

3. **Rotación Automática**: Los backups infinitos llenan discos. La rotación debe ser automática.

4. **Prueba de Restauración**: Un backup que nunca has restaurado es un riesgo. Debes probar restauraciones periódicamente.

### Mejores Prácticas de Backup

```bash
# ✅ HACER:
# Verificar backup después de crearlo
diff -r /origen /backup/latest/

# Monitorear espacio disponible
df -h /backup/

# Probar restauración periódicamente
# (en ambiente de prueba)

# Documentar procedimiento de recuperación

# ❌ EVITAR:
# Backups sin verificación
# Rotación manual (propenso a errores)
# Backup en mismo disco físico que origen
# Ignorar errores en logs
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 12**: Transferencia Segura - Backup a servidores remotos
- **Reto 06**: Transferencia de Datos - Migración de backups
- **Reto 11**: Reemplazo de Cadenas - Modificación de configuraciones

### Mejoras Avanzadas

```bash
# 1. Backup a servidor remoto
# Agregar al script:
rsync -avz /backup/daily/ backup-server:/backups/stapp02/

# 2. Notificación por email en caso de fallo
# Agregar al script:
if [ $RSYNC_EXIT -ne 0 ]; then
    echo "Backup failed on $(hostname)" | mail -s "Backup Error" admin@xfusioncorp.com
fi

# 3. Compresión de backups antiguos
find /backup/daily -name "backup_*" -type d -mtime +3 -exec tar -czf {}.tar.gz {} \; -exec rm -rf {} \;

# 4. Backup incremental con snapshots (LVM/Btrfs)
# Si el sistema soporta snapshots

# 5. Integración con monitoreo (Nagios/Zabbix)
# Agregar check que verifique backup reciente
```

### Comandos de Mantenimiento

```bash
# Verificar estado de backups
ls -ltr /backup/daily/

# Espacio usado por backups
du -sh /backup/daily/*

# Último backup exitoso
grep "completado exitosamente" /var/log/backup/backup_*.log | tail -1

# Limpiar manualmente si es necesario
find /backup/daily -name "backup_*" -type d -mtime +7 -ls

# Verificar integridad de backup específico
diff -r /home/developer_data /backup/daily/backup_20250125_020000/
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Rsync Documentation](https://rsync.samba.org/documentation.html)
- [Cron How-To](https://help.ubuntu.com/community/CronHowto)
- [Linux Backup Strategies](https://tldp.org/LDP/sag/html/backup-strategies.html)

### Troubleshooting

| Síntoma                     | Causa                       | Solución                                     |
| --------------------------- | --------------------------- | -------------------------------------------- |
| "No such file or directory" | Directorio origen no existe | Crear o verificar ruta                       |
| "Permission denied"         | Sin permisos de lectura     | Ejecutar como root o ajustar permisos        |
| Backup vacío                | Ruta incorrecta en rsync    | Verificar barras finales en paths            |
| Cron no ejecuta             | Permisos o sintaxis         | Verificar `crontab -l` y logs de cron        |
| Disco lleno                 | Sin rotación o muchos datos | Limpiar backups antiguos, aumentar retención |
| Logs vacíos                 | Redirección incorrecta      | Verificar `>>` en lugar de `>`               |

### Mejores Prácticas

```bash
# ✅ SIEMPRE:
# - Verificar espacio antes de backup
# - Incluir timestamps en nombres
# - Rotar automáticamente
# - Loggear todo
# - Probar restauración periódicamente

# ❌ NUNCA:
# - Backups en mismo filesystem que origen
# - Sin verificación de integridad
# - Retención infinita sin política
# - Ignorar errores de rsync
```

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 25 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidor objetivo: stapp02 (172.16.238.11)

### Plan de Implementación

1. Verificar datos de origen existen
2. Crear estructura de directorios (/backup, /var/log/backup)
3. Crear script de backup con rsync
4. Probar script manualmente
5. Configurar cron job para 02:00 AM
6. Verificar ejecución automática
7. Validar logs y backups generados

### Criterios de Éxito

- ✅ Script de backup funcional y programado
- ✅ Directorios de backup creados con estructura adecuada
- ✅ Rotación automática de backups antiguos (>7 días)
- ✅ Logging completo de operaciones
- ✅ Backups con timestamps identificables
- ✅ Permisos y metadatos preservados

---

_Documentación creada siguiendo estándares de SysAdmin - Continuidad de Negocio_
