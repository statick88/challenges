---
title: "Implementación en stapp02 - Usuario javed con UID 1467"
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

# Implementación en stapp02 - Usuario javed con UID 1467

## Información del Servidor
- **Nombre**: stapp02
- **IP**: 172.16.238.11
- **Hostname**: stapp02.stratos.xfusioncorp.com
- **Usuario de acceso**: steve
- **Contraseña**: Am3ric@

## Ejecución Detallada

### 1. Conexión al Servidor
```bash
ssh steve@172.16.238.11
# Clave SSH aceptada (ED25519)
# Conexión establecida exitosamente
```

### 2. Escalación de Privilegios
```bash
sudo su -
# Password: Am3ric@
# Acceso root obtenido
```

### 3. Verificación Inicial
```bash
[root@stapp02 ~]# grep "1467" /etc/passwd
# Resultado: (vacío) - UID 1467 no existe
# Confirmado: usuario javed no existe con ese UID

[root@stapp02 ~]# ls -la /var/www/
total 12
drwxr-xr-x 2 root root 4096 Jan 25 07:27 .
drwxr-xr-x 1 root root 4096 Jan 25 07:27 ..
# Confirmado: directorio /var/www/javed no existe
```

### 4. Creación del Usuario con UID Personalizado
```bash
[root@stapp02 ~]# useradd -u 1467 -d /var/www/javed -m javed
# Usuario creado con UID específico: 1467
# Directorio home personalizado: /var/www/javed
# Creación automática del directorio con flag -m
```

### 5. Establecimiento de Contraseña
```bash
[root@stapp02 ~]# passwd javed
Changing password for user javed.
New password: [****************]
BAD PASSWORD: The password fails dictionary check - it is based on a dictionary word
Retype new password: [****************]
passwd: all authentication tokens updated successfully.
# Contraseña establecida exitosamente
```

### 6. Verificación Final
```bash
[root@stapp02 ~]# id javed
uid=1467(javed) gid=1467(javed) groups=1467(javed)
# UID 1467 confirmado ✅
# GID coincidente con UID ✅
# Único grupo principal ✅

[root@stapp02 ~]# su - javed
# Verificación de acceso funcional
[javed@stapp02 ~]$ pwd
/var/www/javed
# Directorio home correcto ✅
[javed@stapp02 ~]$ exit
logout

[root@stapp02 ~]# ls -la /var/www/javed
total 20
drwxr-x--- 2 javed javed 4096 Jan 25 07:30 .
drwxr-xr-x 3 root root 4096 Jan 25 07:30 ..
-rw-r--r-- 1 javed javed   18 Feb 15  2024 .bash_logout
-rw-r--r-- 1 javed javed  141 Feb 15  2024 .bash_profile
-rw-r--r-- 1 javed javed  492 Feb 15  2024 .bashrc
# Directorio home creado con archivos estándar ✅
# Permisos correctos: drwxr-x--- (javed:javed) ✅
```

## Resultados en stapp02

| Elemento | Estado | Detalles |
|----------|---------|----------|
| Usuario javed | ✅ Creado | UID: 1467, GID: 1467 |
| Directorio home | ✅ Creado | /var/www/javed |
| Permisos | ✅ Configurados | drwxr-x--- javed:javed |
| Contraseña | ✅ Establecida | Con advertencia de diccionario |
| Verificación | ✅ Exitosa | Acceso funcional validado |
| Persistencia | ✅ Confirmada | Configuración almacenada |

## Análisis de Implementación

### Cumplimientos del Reto
- ✅ **Usuario creado**: javed con UID específico 1467
- ✅ **Servidor correcto**: App Server 2 (stapp02)
- ✅ **Directorio personalizado**: /var/www/javed
- ✅ **Verificación funcional**: Acceso y permisos validados

### Observaciones Técnicas

#### UID Personalizado
- **UID 1467**: Único según especificaciones
- **GID 1467**: Coincidente con UID (comportamiento estándar)
- **Validación exitosa**: Comando `id javed` confirma UID específico

#### Directorio Home Personalizado
- **Ruta**: /var/www/javed (no /home/javed)
- **Creación automática**: Flag `-m` creó estructura completa
- **Archivos de configuración**: .bashrc, .bash_profile, .bash_logout generados

#### Permisos de Seguridad
- **Propietario**: javed (UID 1467)
- **Grupo**: javed (GID 1467)
- **Acceso**: drwxr-x--- (acceso restringido a dueño y grupo)

#### Contraseña y Validación
- **Políticas de seguridad**: Sistema detectó patrón de diccionario
- **Flexibilidad**: Permite establecimiento despite advertencia
- **Tokens actualizados**: Contraseña funcional activa

### Estado del Servidor
El usuario javed está completamente configurado en App Server 2 según las especificaciones personalizadas de xFusionCorp Industries, con UID único y directorio home específico para aplicación web.

*Estado: COMPLETADO EXITOSAMENTE*