---
title: "Reto 06: Linux User Data Transfer - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - permissions
  - backup
date: 2025-01-25
status: in-progress
---

# Reto 06: Linux User Data Transfer - xFusionCorp Industries

## Objetivo del Reto

Transferir datos entre usuarios y sistemas diferentes según requerimientos de migración:

**Transfer user data between different systems and user accounts.**

## Infraestructura Objetivo

| Servidor | IP | Usuario | Contraseña | Propósito |
|----------|----|--------|-------------|-----------|
| stapp01 | 172.16.238.10 | tony | Ir0nM@n | Source server |
| stapp03 | 172.16.238.12 | banner | BigGr33n | Destination server |

## Requisitos Técnicos

- **Origen**: Directorio /home/old_user en stapp01
- **Destino**: /home/new_user en stapp03
- **Método**: rsync o scp con preservación de permisos
- **Preservar**: Permisos, timestamps, ownership
- **Verificación**: Integridad de datos transferidos

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Preparación en servidor origen (stapp01)
ssh tony@172.16.238.10
sudo su -

# 2. Crear archivo de respaldo
tar -czf /tmp/user_data_backup.tar.gz /home/old_user

# 3. Transferencia a servidor destino
scp /tmp/user_data_backup.tar.gz banner@172.16.238.12:/tmp/

# 4. Preparación en servidor destino (stapp03)
ssh banner@172.16.238.12
sudo su -

# 5. Extracción y restauración
cd /home/
tar -xzf /tmp/user_data_backup.tar.gz
chown -R new_user:new_user /home/new_user

# 6. Verificación final
ls -la /home/new_user
du -sh /home/new_user
```

## Resultados Esperados

- Datos transferidos completamente entre sistemas
- Permisos y ownership preservados
- Integridad de datos verificada
- Funcionalidad completa en destino

## Estado del Reto

🔓 **POR DESBLOQUEAR** - Requiere completar retos 1-3

*Fecha planeada: Pendiente*