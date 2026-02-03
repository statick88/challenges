---
title: "Implementación en stapp03 - Grupo nautilus_noc"
category: linux
difficulty: medium
tags:
  - linux
  - ssh
  - user-management
  - group-management
  - security
date: 2025-01-25
status: completed
---

# Implementación en stapp03 - Grupo nautilus_noc

## Información del Servidor
- **Nombre**: stapp03
- **IP**: 172.16.238.12
- **Hostname**: stapp03.stratos.xfusioncorp.com
- **Usuario de acceso**: banner
- **Contraseña**: BigGr33n

## Ejecución Detallada

### 1. Conexión al Servidor
```bash
ssh banner@172.16.238.12
# Clave SSH aceptada (ED25519)
# Conexión establecida exitosamente
```

### 2. Escalación de Privilegios
```bash
sudo su -
# Password: BigGr33n
# Acceso root obtenido
```

### 3. Verificación Inicial
```bash
[root@stapp03 ~]# getent group nautilus_noc
# Resultado: (vacío) - grupo no existe

[root@stapp03 ~]# id rajesh
id: 'rajesh': no such user
# Confirmado: usuario no existe
```

### 4. Creación del Grupo nautilus_noc
```bash
[root@stapp03 ~]# groupadd nautilus_noc
# Grupo creado exitosamente
```

### 5. Creación del Usuario rajesh
```bash
[root@stapp03 ~]# useradd -m -s /bin/bash rajesh
# Usuario creado con directorio home

[root@stapp03 ~]# passwd rajesh
Changing password for user rajesh.
New password: [****************]
BAD PASSWORD: The password fails the dictionary check - it is based on a dictionary word
Retype new password: [****************]
passwd: all authentication tokens updated successfully.
# Contraseña establecida (con advertencias de seguridad)
```

### 6. Asignación al Grupo
```bash
[root@stapp03 ~]# usermod -aG nautilus_noc rajesh
# Usuario agregado exitosamente al grupo
```

### 7. Verificación Final
```bash
[root@stapp03 ~]# id rajesh
uid=1002(rajesh) gid=1003(rajesh) groups=1003(rajesh),1002(nautilus_noc)
# UID: 1002, GID principal: 1003
# Grupos adicionales: nautilus_noc (1002)

[root@stapp03 ~]# getent group nautilus_noc
nautilus_noc:x:1002:rajesh
# Grupo nautilus_noc confirmado con GID 1002
# Usuario rajesh listado como miembro

[root@stapp03 ~]# grep "nautilus_noc" /etc/group
nautilus_noc:x:1002:rajesh
# Configuración persistente verificada
```

## Resultados en stapp03

| Elemento | Estado | Detalles |
|----------|---------|----------|
| Grupo nautilus_noc | ✅ Creado | GID: 1002 |
| Usuario rajesh | ✅ Creado | UID: 1002, GID: 1003 |
| Pertenencia al grupo | ✅ Configurada | rajesh pertenece a nautilus_noc |
| Verificación | ✅ Exitosa | Todos los comandos de validación OK |

## Análisis de Implementación

### Cumplimientos del Reto
- ✅ **Grupo nautilus_noc creado**: GID 1002
- ✅ **Usuario rajesh creado**: UID 1002
- ✅ **Asignación al grupo**: rajesh pertenece a nautilus_noc
- ✅ **Verificación completa**: Validado con múltiples comandos

### Observaciones Técnicas
- **Consistencia de IDs**: UID 1002, GID grupo 1002 (como en stapp01 y stapp02)
- **Estructura de grupos**: Idéntica a otros servidores App
- **Seguridad de contraseñas**: Sistema valida pero permite con advertencias

### Estado del Servidor
El servidor stapp03 está completamente configurado con el grupo nautilus_noc y el usuario rajesh según las especificaciones de xFusionCorp Industries.

*Estado: COMPLETADO*