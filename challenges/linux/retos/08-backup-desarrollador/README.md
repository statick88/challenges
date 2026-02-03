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

## Objetivo del Reto

Implementar sistema de backup automatizado para datos de desarrollador:

**Implement automated backup system for developer data with scheduling.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Am3ric@ | Backup Setup |

## Requisitos Técnicos

- **Directorio origen**: /home/developer_data
- **Destino backup**: /backup/daily/
- **Frecuencia**: Diaria a las 02:00 AM
- **Rotación**: Mantener últimos 7 días
- **Método**: rsync con compresión
- **Logging**: Registro de operaciones de backup

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh steve@172.16.238.11
sudo su -

# 2. Crear directorios de backup
mkdir -p /backup/daily
mkdir -p /var/log/backup

# 3. Crear script de backup
cat > /usr/local/bin/dev_backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/backup/backup_$DATE.log"
SOURCE="/home/developer_data"
DEST="/backup/daily/backup_$DATE"

echo "Iniciando backup: $DATE" >> $LOG_FILE
rsync -avz --delete $SOURCE/ $DEST/ >> $LOG_FILE 2>&1
echo "Backup completado: $DATE" >> $LOG_FILE

# Mantener últimos 7 días
find /backup/daily -name "backup_*" -mtime +7 -exec rm -rf {} \;
EOF

chmod +x /usr/local/bin/dev_backup.sh

# 4. Configurar cron job
crontab -e
# Agregar línea:
# 0 2 * * * /usr/local/bin/dev_backup.sh

# 5. Verificación
crontab -l
/usr/local/bin/dev_backup.sh
```

## Resultados Esperados

- Script de backup funcional y programado
- Directorios de backup creados con estructura adecuada
- Rotación automática de backups antiguos
- Logging completo de operaciones

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*