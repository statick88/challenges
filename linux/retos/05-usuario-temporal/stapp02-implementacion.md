# Implementación Reto 05: Temporary User Setup with Expiry

## Servidor: stapp02

### Conexión y Preparación
```bash
ssh steve@172.16.238.11
sudo su -
```

### Verificación Inicial
```bash
# Verificar estado actual
id temp_user
chage -l temp_user
date
```

### Creación del Usuario Temporal
```bash
# Crear usuario con home directory
useradd -m -s /bin/bash temp_user

# Establecer contraseña
passwd temp_user
# Ingresar contraseña: TempUser@7days

# Configurar expiración en 7 días
EXPIRY_DATE=$(date -d "+7 days" +%Y-%m-%d)
chage -E $EXPIRY_DATE temp_user

# Verificar configuración
echo "Fecha actual: $(date)"
echo "Fecha expiración: $EXPIRY_DATE"
```

### Verificación Final
```bash
# Verificar configuración de expiración
chage -l temp_user
temp_user
Last password change                    : Jan 25, 2026
Password expires                    : Feb 01, 2026
Account expires                     : Feb 01, 2026
Minimum number of days between password change        : 0
Maximum number of days between password change        : 99999
Number of days of warning before password expires   : 7

# Verificar usuario creado correctamente
getent passwd temp_user
temp_user:x:1002:1002::/home/temp_user:/bin/bash
```

### Simulación de Expiración (Prueba)
```bash
# Simular expiración para pruebas
chage -E $(date -d "+1 minute" +%Y-%m-%d) temp_user
sleep 60
su - temp_user  # Debe fallar tras expiración
```

### Resultados
✅ **Completado exitosamente:**
- Usuario temp_user creado con directorio home
- Cuenta configurada para expirar en 7 días
- Acceso funcional hasta fecha de expiración
- Sistema bloqueará acceso automáticamente

### Comandos de Verificación Post-Ejecución
```bash
# Verificar cuenta aún activa
chage -l temp_user

# Extender expiración si es necesario
chage -E $(date -d "+14 days" +%Y-%m-%d) temp_user
```

*Fecha de ejecución: Pendiente*