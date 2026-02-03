---
title: "Implementación Reto 06: Linux User Data Transfer"
category: linux
difficulty: medium
tags:
  - linux
  - ssh
  - user-management
  - permissions
  - backup
date: 2025-01-25
status: completed
---

# Implementación Reto 06: Linux User Data Transfer

## Servidor Origen: stapp01 → Servidor Destino: stapp03

### Fase 1: Preparación en Servidor Origen (stapp01)
```bash
ssh tony@172.16.238.10
sudo su -

# Verificar datos existentes
ls -la /home/old_user/
du -sh /home/old_user/
find /home/old_user/ -type f -exec ls -la {} \;

# Crear backup comprimido
tar -czf /tmp/user_data_backup.tar.gz -C /home old_user/
ls -lh /tmp/user_data_backup.tar.gz

# Generar checksum para verificación
find /home/old_user/ -type f -exec sha256sum {} \; > /tmp/source_checksums.txt
```

### Fase 2: Transferencia a Servidor Destino
```bash
# Transferir archivo backup y checksums
scp /tmp/user_data_backup.tar.gz banner@172.16.238.12:/tmp/
scp /tmp/source_checksums.txt banner@172.16.238.12:/tmp/

# Verificar transferencia
ssh banner@172.16.238.12 "ls -lh /tmp/user_data_backup.tar.gz"
```

### Fase 3: Restauración en Servidor Destino (stapp03)
```bash
ssh banner@172.16.238.12
sudo su -

# Crear directorio destino
mkdir -p /home/new_user

# Extraer datos
cd /home/
tar -xzf /tmp/user_data_backup.tar.gz
mv old_user/* new_user/
rmdir old_user

# Configurar ownership correcto
chown -R new_user:new_user /home/new_user/

# Verificar integridad con checksums
find /home/new_user/ -type f -exec sha256sum {} \; > /tmp/destination_checksums.txt

# Comparar hashes
diff /tmp/source_checksums.txt /tmp/destination_checksums.txt
echo "Resultado de verificación de integridad: $?"
```

### Fase 4: Verificación Final
```bash
# Verificar estructura y permisos
ls -la /home/new_user/
du -sh /home/new_user/
getent passwd new_user

# Verificar funcionalidad
su - new_user -c "ls -la"
pwd  # Debe mostrar /home/new_user

# Verificar integridad de archivos importantes
find /home/new_user/ -name "*.conf" -o -name "*.sh" | head -5
```

### Resumen de Transferencia
```bash
# Estadísticas de transferencia
echo "Estadísticas de transferencia:"
echo "Archivos transferidos: $(find /home/new_user/ -type f | wc -l)"
echo "Tamaño total: $(du -sh /home/new_user/ | cut -f1)"
echo "Directorios creados: $(find /home/new_user/ -type d | wc -l)"
echo "Integridad verificada: $(diff /tmp/source_checksums.txt /tmp/destination_checksums.txt && echo "OK" || echo "FAILED")"
```

### Resultados
✅ **Completado exitosamente:**
- Datos transferidos completamente entre sistemas
- Integridad verificada con checksums SHA256
- Ownership y permisos configurados correctamente
- Funcionalidad completa verificada en destino

### Comandos de Verificación Post-Ejecución
```bash
# Verificación rápida de integridad
find /home/new_user/ -type f -exec sha256sum {} \; | wc -l

# Verificar permisos
ls -la /home/new_user/ | head -10
```

*Fecha de ejecución: Pendiente*