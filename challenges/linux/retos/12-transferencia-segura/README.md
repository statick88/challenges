---
title: "Reto 12: Secure Data Transfer - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - group-management
  - permissions
date: 2025-01-25
status: blocked
---

# Reto 12: Secure Data Transfer - xFusionCorp Industries

## Objetivo del Reto

Transferir datos sensibles utilizando métodos seguros:

**Transfer sensitive data using secure methods with encryption.**

## Infraestructura Objetivo

| Servidor | IP | Usuario | Contraseña | Propósito |
|----------|----|--------|-------------|-----------|
| stapp01 | 172.16.238.10 | tony | Ir0nM@n | Source server |
| stapp03 | 172.16.238.12 | banner | BigGr33n | Destination server |

## Requisitos Técnicos

- **Método**: scp con compresión y encriptación
- **Datos**: /secure/sensitive_data/
- **Destino**: /secure/incoming/
- **Compresión**: gzip during transfer
- **Verificación**: Hash MD5/SHA256
- **Logging**: Registro de transferencia completa

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor origen
ssh tony@172.16.238.10
sudo su -

# 2. Verificación y preparación
ls -la /secure/sensitive_data/
find /secure/sensitive_data/ -type f -exec md5sum {} \; > /tmp/source_checksums.txt

# 3. Transferencia segura con compresión
scp -C -r /secure/sensitive_data/ banner@172.16.238.12:/secure/incoming/

# 4. Conexión al servidor destino para verificación
ssh banner@172.16.238.12
sudo su -

# 5. Verificación de integridad
cd /secure/incoming/
find . -type f -exec md5sum {} \; > /tmp/destination_checksums.txt

# 6. Comparación de hashes
diff /tmp/source_checksums.txt /tmp/destination_checksums.txt

# 7. Verificación de permisos
chmod 600 /secure/incoming/sensitive_data/*
chown -R secure_user:secure_group /secure/incoming/

# 8. Logging de transferencia
echo "$(date): Transferencia completada de stapp01 a stapp03" >> /var/log/secure_transfers.log
```

## Resultados Esperados

- Transferencia completada con éxito
- Integridad de datos verificada (hashes coinciden)
- Permisos seguros configurados en destino
- Registro auditado de la transferencia

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*