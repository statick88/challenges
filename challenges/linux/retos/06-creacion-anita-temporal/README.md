# Reto 06: Temporary User Setup with Expiry - Usuario anita

## Objetivo del Reto

Configurar un usuario temporal con fecha de expiración específica para acceso limitado al proyecto Nautilus:

**Create a temporary user account with expiry date for time-limited access.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Am3ric@ | Nautilus App 2 |

## Requisitos Técnicos

- **Usuario**: anita
- **Expiración**: 2026-12-07
- **Shell**: /bin/bash (interactiva)
- **Servidor**: App Server 2 (stapp02)
- **Propósito**: Desarrolladora temporal asignada al proyecto Nautilus
- **Protocolo**: Crear usuario en minúsculas según estándar

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh steve@172.16.238.11
sudo su -

# 2. Verificación inicial
id anita
getent passwd anita
chage -l anita

# 3. Creación del usuario
useradd -m -s /bin/bash anita

# 4. Configurar fecha de expiración específica
chage -E 2026-12-07 anita

# 5. Verificación final
chage -l anita | grep "Account expires"
getent passwd anita
id anita
ls -la /home/anita
```

## Resultados Esperados

- Usuario anita creado con directorio home
- Cuenta configurada para expirar el 7 de diciembre de 2026
- Acceso permitido hasta fecha de expiración
- Sistema bloqueará acceso automáticamente después de fecha

## Detalles de Infraestructura

### Entorno xFusionCorp
- **Datacenter**: Stratos
- **Proyecto**: Nautilus
- **Desarrolladora**: anita (asignación temporal)
- **Fecha de expiración**: 2026-12-07
- **Duración del acceso**: Limitada según timeline del proyecto

## Criterios de Validación

### Verificaciones Obligatorias
1. ✅ **Usuario creado**: anita existe en /etc/passwd
2. ✅ **Directorio home**: /home/anita creado con permisos
3. ✅ **Shell interactivo**: /bin/bash configurado
4. ✅ **Expiración exacta**: Dec 07, 2026
5. ✅ **UID/GID**: 1002:1002 asignado correctamente

## Estado del Reto

✅ **COMPLETADO EXITOSAMENTE** - 2026-01-29

**Tiempo de ejecución**: ~15 minutos  
**Servidor objetivo**: stapp02  
**Configuración**: Usuario anita con expiración 2026-12-07  
**Resultado**: Todos los requisitos cumplidos

## Lecciones Aprendidas

1. **Precisión en fechas**: Formato YYYY-MM-DD es crítico
2. **Consistencia de servidores**: Verificar servidor exacto en requisito
3. **Validación completa**: No omitir pasos de verificación
4. **Comandos de expiración**: `chage -E` es fundamental para usuarios temporales

---

*Implementation Date: 2026-01-29 | Status: ✅ COMPLETED*