# Implementación en stapp02 - Grupo nautilus_noc

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
[root@stapp02 ~]# getent group nautilus_noc
# Resultado: (vacío) - grupo no existe

[root@stapp02 ~]# id rajesh
id: 'rajesh': no such user
# Confirmado: usuario no existe
```

### 4. Creación del Grupo nautilus_noc
```bash
[root@stapp02 ~]# groupadd nautilus_noc
# Grupo creado exitosamente
```

### 5. Creación del Usuario rajesh
```bash
[root@stapp02 ~]# useradd -m -s /bin/bash rajesh
# Usuario creado con directorio home

[root@stapp02 ~]# passwd rajesh
Changing password for user rajesh.
New password: [****************]
BAD PASSWORD: The password fails the dictionary check - it is based on a dictionary word
Retype new password: [****************]
passwd: all authentication tokens updated successfully.
# Contraseña establecida (con advertencias de seguridad)
```

### 6. Asignación al Grupo
```bash
[root@stapp02 ~]# usermod -aG nautilus_noc rajesh
# Usuario agregado exitosamente al grupo
```

### 7. Verificación Final
```bash
[root@stapp02 ~]# id rajesh
uid=1002(rajesh) gid=1003(rajesh) groups=1003(rajesh),1002(nautilus_noc)
# UID: 1002, GID principal: 1003
# Grupos adicionales: nautilus_noc (1002)

[root@stapp02 ~]# getent group nautilus_noc
nautilus_noc:x:1002:rajesh
# Grupo nautilus_noc confirmado con GID 1002
# Usuario rajesh listado como miembro

[root@stapp02 ~]# grep "nautilus_noc" /etc/group
nautilus_noc:x:1002:rajesh
# Configuración persistente verificada
```

## Resultados en stapp02

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
- **Consistencia de IDs**: UID 1002, GID grupo 1002 (como en stapp01)
- **Estructura de grupos**: Identica a otros servidores
- **Seguridad de contraseñas**: Sistema valida pero permite con advertencias

### Estado del Servidor
El servidor stapp02 está completamente configurado con el grupo nautilus_noc y el usuario rajesh según las especificaciones de xFusionCorp Industries.

*Estado: COMPLETADO*