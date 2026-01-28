# Reto 05: Temporary User Setup with Expiry - xFusionCorp Industries

## Objetivo del Reto

Configurar un usuario temporal con fecha de expiración según políticas de acceso temporal:

**Create a temporary user with account expiry for time-limited access.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Am3ric@ | Nautilus App 2 |

## Requisitos Técnicos

- **Usuario**: temp_user
- **Expiración**: 7 días desde creación
- **Shell**: /bin/bash (interactiva)
- **Servidor**: App Server 2 (stapp02)
- **Propósito**: Acceso temporal para consultoría externa

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh steve@172.16.238.11
sudo su -

# 2. Verificación inicial
id temp_user
chage -l temp_user

# 3. Creación del usuario con expiración
useradd -m -s /bin/bash temp_user
passwd temp_user

# 4. Configurar fecha de expiración (7 días)
chage -E $(date -d "+7 days" +%Y-%m-%d) temp_user

# 5. Verificación final
chage -l temp_user
getent passwd temp_user
```

## Resultados Esperados

- Usuario temp_user creado con home directory
- Cuenta configurada para expirar en 7 días
- Acceso permitido hasta fecha de expiración
- Sistema bloqueará acceso automáticamente después de fecha

## Estado del Reto

🔓 **POR DESBLOQUEAR** - Requiere completar retos 1-3

*Fecha planeada: Pendiente*