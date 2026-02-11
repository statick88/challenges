---
title: "Configuración de Respaldo con tar"
category: devops
day: 14
difficulty: 2
tags:
  - devops
  - backup
  - tar
  - shell-script
date: 2026-02-05
status: ready
---

# 🎓 Día 14: Automatización de Backups

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "Un backup que no has restaurado es un backup que no existe. Los backups automatizados son tu red de seguridad invisible, trabajando silenciosamente para que puedas dormir tranquilo sabiendo que tu infraestructura puede recuperarse de cualquier desastre."

Hoy implementamos **backups automatizados** - una de las responsabilidades más críticas en DevOps. Cuando todo falla, los backups son tu última línea de defensa.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-13**: Infraestructura, servicios, troubleshooting
- **Hoy**: Protegemos todo lo construido con backups
- **Día 15**: Configuramos timezone para logs y backups consistentes

### Progresión hacia el Pipeline CI/CD

Backups son parte de:

- **Disaster Recovery**: Plan de recuperación ante desastres
- **Data Protection**: Cumplimiento normativo (GDPR, HIPAA)
- **CI/CD Safety**: Poder rollback si un deploy falla
- **Business Continuity**: Minimizar RTO/RPO

### Escenario Empresarial

El contenido web en `/var/www/html` es crítico para el negocio. Necesitamos:

1. Backup diario automatizado
2. Almacenamiento en `/backup/daily/`
3. Compresión para ahorrar espacio
4. Timestamp para identificación
5. Verificación de integridad

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Backups requieren coordinación:

- **Desarrolladores**: Saber qué datos son críticos
- **Operaciones**: Implementar y monitorear backups
- **Business**: Definir RPO/RTO (objetivos de recuperación)

### Automatización

```bash
# Sin automatización (riesgoso):
# "Alguien debe recordar hacer backup manualmente"

# Con automatización (confiable):
# Backup ejecuta a las 2 AM todos los días, sin excepciones
```

### Métricas y Confiabilidad

- **Backup Success Rate**: % de backups completados
- **Backup Age**: Cuánto tiempo desde el último backup exitoso
- **Restore Time**: Cuánto toma recuperar (DR drills)
- **Storage Usage**: Cuánto espacio ocupan los backups

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Preparar Estructura de Directorios

```bash
# Crear directorio de backups
sudo mkdir -p /backup/daily

# Establecer permisos adecuados
sudo chmod 750 /backup
sudo chown root:root /backup
```

**Análisis DevOps**:

- `750`: Root puede todo, grupo puede leer/ejecutar, otros nada
- Estructura separada: `/backup/daily/`, `/backup/weekly/`, `/backup/monthly/`

### Paso 2: Crear Script de Backup

```bash
# Crear script de backup
sudo tee /usr/local/bin/backup.sh <<'EOF'
#!/bin/bash

# Backup Script for /var/www/html
# Created: $(date)
# Purpose: Daily automated backup

# Configuración
SOURCE_DIR="/var/www/html"
BACKUP_DIR="/backup/daily"
DATE=$(date +%Y%m%d_%H%M%S)
HOSTNAME=$(hostname)
BACKUP_FILE="${BACKUP_DIR}/backup_${HOSTNAME}_${DATE}.tar.gz"

# Crear directorio si no existe
mkdir -p "$BACKUP_DIR"

# Ejecutar backup
tar -czf "$BACKUP_FILE" "$SOURCE_DIR" 2>/dev/null

# Verificar éxito
if [ $? -eq 0 ]; then
    echo "✓ Backup completed: $BACKUP_FILE"
    echo "  Size: $(du -h "$BACKUP_FILE" | cut -f1)"
    echo "  Created: $(date)"
    logger -t backup "Daily backup completed: $BACKUP_FILE"
    exit 0
else
    echo "✗ Backup failed!"
    logger -t backup "Daily backup FAILED"
    exit 1
fi
EOF
```

**Análisis DevOps**:

- **Shebang**: `#!/bin/bash` - Especifica intérprete
- **Variables**: Configuración al inicio, fácil de modificar
- **Logging**: `logger` envía a syslog para auditoría
- **Error handling**: Códigos de salida explícitos (0=éxito, 1=fallo)

### Paso 3: Hacer Script Ejecutable

```bash
sudo chmod +x /usr/local/bin/backup.sh

# Verificar permisos
ls -la /usr/local/bin/backup.sh
```

### Paso 4: Probar Script Manualmente

```bash
# Ejecutar backup manualmente
sudo /usr/local/bin/backup.sh
```

**Salida esperada**:

```
✓ Backup completed: /backup/daily/backup_stapp01_20260205_143022.tar.gz
  Size: 2.5M
  Created: Wed Feb 5 14:30:22 UTC 2026
```

**Verificación**:

```bash
# Listar backup creado
ls -lh /backup/daily/

# Verificar contenido
tar -tzf /backup/daily/backup_stapp01_*.tar.gz | head -20
```

### Paso 5: Programar en Cron

```bash
# Crear entrada cron para ejecución diaria a las 2 AM
echo "0 2 * * * root /usr/local/bin/backup.sh" | sudo tee /etc/cron.d/daily-backup
```

**Análisis DevOps**:

- `0 2 * * *`: A las 2:00 AM todos los días
- `root`: Ejecuta como usuario root (acceso completo)
- Archivo en `/etc/cron.d/`: Mejor que `crontab -e` para scripts de sistema

### Paso 6: Verificar Configuración Cron

```bash
# Verificar entrada cron
cat /etc/cron.d/daily-backup

# Verificar que cron reconoce el job
sudo crontab -l -u root  # O simplemente verificar el archivo
```

### Paso 7: Testing de Restauración (Crítico)

```bash
# Crear directorio de prueba
sudo mkdir -p /tmp/restore-test

# Extraer backup
sudo tar -xzf /backup/daily/backup_stapp01_*.tar.gz -C /tmp/restore-test

# Verificar contenido
ls -la /tmp/restore-test/var/www/html/

# Comparar con original
diff -r /var/www/html /tmp/restore-test/var/www/html && echo "✓ Restauración verificada"
```

**⚠️ Importante**: Un backup que no puedes restaurar es inútil. Siempre verificar restauración.

---

## ✅ Criterios de Éxito

- [x] Directorio `/backup/daily/` creado con permisos correctos
- [x] Script `/usr/local/bin/backup.sh` creado y funcional
- [x] Script marcado como ejecutable (`chmod +x`)
- [x] Backup manual ejecutado exitosamente
- [x] Cron job configurado para ejecución diaria a las 2 AM
- [x] Verificación de backup (listar archivos creados)
- [x] Test de restauración completado exitosamente
- [x] Logging configurado (`logger` para syslog)

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Backup 3-2-1 Rule**:
   - **3** copias de los datos
   - **2** medios diferentes
   - **1** copia offsite/remota

2. **RPO vs RTO**:
   - **RPO** (Recovery Point Objective): Cuántos datos puedes perder
   - **RTO** (Recovery Time Objective): Cuánto tiempo para recuperar

3. **Tar Options**:
   ```bash
   -c  # Create archive
   -x  # Extract archive
   -t  # List contents
   -v  # Verbose
   -z  # Compress with gzip
   -f  # Specify filename
   ```

### 🚨 Troubleshooting DevOps

**Problema 1**: "Permission denied" al ejecutar backup

- **Causa**: Script no tiene permisos de ejecución
- **Solución**: `chmod +x /usr/local/bin/backup.sh`

**Problema 2**: Archivo de backup vacío o muy pequeño

- **Causa**: Ruta incorrecta o directorio vacío
- **Diagnóstico**: Verificar `SOURCE_DIR` existe y tiene contenido
- **Solución**: `ls -la $SOURCE_DIR`

**Problema 3**: Cron job no ejecuta

- **Causas**:
  - Servicio cron no está corriendo
  - Sintaxis incorrecta en crontab
  - Permisos del script
- **Solución**:
  ```bash
  sudo systemctl status cron
  sudo grep CRON /var/log/syslog
  ```

### 💡 Mejores Prácticas

1. **Retention Policy**: Rotar backups antiguos

   ```bash
   # Agregar al script de backup
   # Mantener solo últimos 7 días
   find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
   ```

2. **Remote Backup**: Copiar a ubicación remota

   ```bash
   # Agregar al final del script
   rsync -avz "$BACKUP_FILE" backup-server:/backups/
   ```

3. **Backup Verification**:

   ```bash
   # Verificar integridad del archivo tar
   tar -tzf "$BACKUP_FILE" > /dev/null && echo "✓ Integrity OK"
   ```

4. **Ansible Automation**:

   ```yaml
   - name: Setup automated backups
     template:
       src: backup.sh.j2
       dest: /usr/local/bin/backup.sh
       mode: "0755"

   - name: Configure cron job
     cron:
       name: "Daily backup"
       hour: "2"
       minute: "0"
       job: "/usr/local/bin/backup.sh"
       user: root
   ```

5. **Monitoring**:
   ```bash
   # Verificar último backup (alertar si > 25 horas)
   if [ $(find /backup/daily -name "*.tar.gz" -mtime -1 | wc -l) -eq 0 ]; then
     echo "ALERT: No recent backup found!"
   fi
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 15** configura timezone - esencial para:

- Backups con timestamp correcto
- Logs con hora local apropiada
- Cron jobs ejecutando en horario esperado

**Conexión**: Backup funcional + Timezone correcto = Operaciones temporales consistentes.

---

## 📚 Recursos DevOps

- [Backup Best Practices](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/)
- [Tar Command Tutorial](https://www.gnu.org/software/tar/manual/)
- [Rsync Documentation](https://rsync.samba.org/documentation.html)

---

## 📊 Seguimiento de Progreso

- **Día**: 14 de 100
- **Bloque**: Data Protection y Resiliencia
- **Progresión**: 1-13 → 14 → 15 (Operaciones → Backups → Timezone)
- **Habilidad**: Implementación de backups automatizados

**¡Excelente! Tu infraestructura ahora está protegida contra pérdida de datos.** 💾
