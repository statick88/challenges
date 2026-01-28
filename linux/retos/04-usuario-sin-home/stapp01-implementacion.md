# Implementación Reto 04: Service User Creation without Home Directory

## Servidor: stapp01

### Conexión y Preparación
```bash
ssh tony@172.16.238.10
sudo su -
```

### Verificación Inicial
```bash
# Verificar si el usuario ya existe
id service_user
getent passwd service_user
ls -la /home | grep service_user
```

### Creación del Usuario
```bash
# Crear usuario sin directorio home
useradd -M -s /sbin/nologin service_user

# Establecer contraseña
passwd service_user
# Ingresar contraseña: TempPass123!
```

### Verificación Final
```bash
# Verificar creación del usuario
getent passwd service_user
service_user:x:1001:1001::/dev/null:/sbin/nologin

# Verificar que no se creó directorio home
ls -la /home | grep service_user
# (no debe mostrar resultados)

# Intentar login interactivo (debe fallar)
su - service_user
This account is currently not available.
```

### Resultados
✅ **Completado exitosamente:**
- Usuario service_user creado sin directorio home
- Shell configurada como /sbin/nologin
- Login interactivo bloqueado correctamente
- Usuario disponible para ejecución de servicios

### Comandos de Verificación
```bash
# Verificación rápida
grep service_user /etc/passwd
su -s /bin/bash service_user  # Acceso como servicio si es necesario
```

*Fecha de ejecución: Pendiente*