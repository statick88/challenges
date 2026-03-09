---
title: "Implementación en stapp02 - Usuario john con Shell No-Interactivo"
category: linux
difficulty: medium
tags:
  - linux
  - ssh
  - user-management
  - security
  - text-processing
date: 2025-01-25
status: completed
---

# Implementación en stapp02 - Usuario john con Shell No-Interactivo

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
[root@stapp02 ~]# id john
id: 'john': no such user
# Usuario john no existe

[root@stapp02 ~]# getent passwd john
# Sin resultados
# Confirmado: usuario no existe en sistema
```

### 4. Creación del Usuario con Shell No-Interactivo
```bash
[root@stapp02 ~]# useradd -m -s /sbin/nologin john
# Usuario creado exitosamente
# Shell: /sbin/nologin (no-interactiva)
# Directorio home: /home/john (con -m)
```

### 5. Intento Duplicado (Error Controlado)
```bash
[root@stapp02 ~]# useradd -m -s /bin/false john
useradd: user 'john' already exists
# Error esperado - usuario ya creado
# Sistema evita duplicación correcta
```

### 6. Establecimiento de Contraseña
```bash
[root@stapp02 ~]# passwd john
Changing password for user john.
New password: [****************]
BAD PASSWORD: The password is a palindrome
Retype new password: [****************]
passwd: all authentication tokens updated successfully.
# Contraseña establecida (con advertencia de palíndromo)
# Validación de seguridad funcionando
```

### 7. Verificación de Configuración en Sistema
```bash
[root@stapp02 ~]# getent passwd john | grep john
john:x:1002:1002::/home/john:/sbin/nologin
# UID: 1002, GID: 1002
# Directorio: /home/john
# Shell: /sbin/nologin

[root@stapp02 ~]# grep "john" /etc/passwd
john:x:1002:1002::/home/john:/sbin/nologin
# Configuración persistente verificada
# Entrada correcta en /etc/passwd
```

### 8. Verificación Funcional de Shell No-Interactiva
```bash
[root@stapp02 ~]# su - john
This account is currently not available.
# ✅ Shell no-interactiva funcionando correctamente
# Mensaje estándar de /sbin/nologin
# Login interactivo bloqueado exitosamente
```

## Resultados en stapp02

| Elemento | Estado | Detalles |
|----------|---------|----------|
| Usuario john | ✅ Creado | UID: 1002, GID: 1002 |
| Shell no-interactiva | ✅ Configurada | /sbin/nologin |
| Directorio home | ✅ Creado | /home/john |
| Contraseña | ✅ Establecida | Con advertencia de palíndromo |
| Bloqueo interactivo | ✅ Funcional | Mensaje "not available" |
| Verificación completa | ✅ Exitosa | Todos los comandos OK |

## Análisis de Implementación

### Cumplimientos del Reto
- ✅ **Usuario creado**: john con UID/GID específicos
- ✅ **Shell no-interactiva**: /sbin/nologin implementado
- ✅ **Servidor correcto**: stapp02 (App Server 2)
- ✅ **Funcionalidad verificada**: Login interactivo bloqueado

### Observaciones Técnicas
- **UID/GID consistentes**: 1002:1002
- **Validación de seguridad**: Sistema detectó palíndromo en contraseña
- **Mensaje educativo**: /sbin/nologin muestra mensaje informativo
- **Persistencia**: Configuración almacenada correctamente en /etc/passwd

### Validación Final

El usuario john está listo para uso en:
- Automatización de scripts
- Tareas de servicio
- Operaciones no-interactivas
- Acceso remoto sin terminal

*Estado: COMPLETADO EXITOSAMENTE*