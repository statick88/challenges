# Implementación en stapp01 - Grupo nautilus_noc

## Información del Servidor
- **Nombre**: stapp01
- **IP**: 172.16.238.10
- **Hostname**: stapp01.stratos.xfusioncorp.com
- **Usuario de acceso**: tony
- **Contraseña**: Ir0nM@n

## Ejecución Detallada

### 1. Conexión al Servidor
```bash
ssh tony@172.16.238.10
# Aceptación de clave SSH: yes
# Conexión establecida exitosamente
```

### 2. Escalación de Privilegios
```bash
sudo su -
# Password: Ir0nM@n
# Acceso root obtenido
```

### 3. Verificación Inicial
```bash
[root@stapp01 ~]# getent group nautilus_noc
# Resultado: (vacío) - grupo no existe

[root@stapp01 ~]# id rajesh
# Resultado: id: 'rajesh': no such user
# Confirmado: usuario no existe
```

### 4. Creación del Grupo nautilus_noc
```bash
[root@stapp01 ~]# groupadd nautilus_noc
# Grupo creado exitosamente
```

### 5. Creación del Usuario rajesh
```bash
[root@stapp01 ~]# useradd -m -s /bin/bash rajesh
# Usuario creado con directorio home

[root@stapp01 ~]# passwd rajesh
Changing password for user rajesh.
New password: [****************]
BAD PASSWORD: The password fails the dictionary check - it is based on a dictionary word
Retype new password: [****************]
Sorry, passwords do not match.
New password: [****************]
BAD PASSWORD: The password fails the dictionary check - it is based on a dictionary word
Retype new password: [****************]
passwd: all authentication tokens updated successfully.
# Contraseña establecida (con advertencias de seguridad)
```

### 6. Asignación al Grupo
```bash
[root@stapp01 ~]# usermod -aG nautilus_noc rajesh
# Usuario agregado exitosamente al grupo
```

### 7. Verificación Final
```bash
[root@stapp01 ~]# id rajesh
uid=1002(rajesh) gid=1003(rajesh) groups=1003(rajesh),1002(nautilus_noc)
# UID: 1002, GID principal: 1003
# Grupos adicionales: nautilus_noc (1002)

[root@stapp01 ~]# getent group nautilus_noc
nautilus_noc:x:1002:rajesh
# Grupo nautilus_noc confirmado con GID 1002
# Usuario rajesh listado como miembro

[root@stapp01 ~]# grep "nautilus_noc" /etc/group
nautilus_noc:x:1002:rajesh
# Configuración persistente verificada
```

## Resultados en stapp01

| Elemento | Estado | Detalles |
|----------|---------|----------|
| Grupo nautilus_noc | ✅ Creado | GID: 1002 |
| Usuario rajesh | ✅ Creado | UID: 1002, GID: 1003 |
| Pertenencia al grupo | ✅ Configurada | rajesh pertenece a nautilus_noc |
| Verificación | ✅ Exitosa | Todos los comandos de validación OK |

*Estado: COMPLETADO*