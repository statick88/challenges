# Reto 03: Usuario john con Shell No-Interactivo - xFusionCorp Industries

## Objetivo del Reto

Crear un usuario con shell no-interactivo según especificaciones del backup agent tool:

**Crear un usuario named john with a non-interactive shell on App Server 2.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Am3ric@ | Nautilus App 2 |

## Requisitos Técnicos

- **Usuario**: john
- **Shell**: No-interactiva (/sbin/nologin o /bin/false)
- **Servidor**: App Server 2 (stapp02)
- **Acceso**: Sin inicio de sesión interactiva permitido

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Verificación inicial
id john
getent passwd john

# 2. Creación del usuario
useradd -m -s /sbin/nologin john

# 3. Establecer contraseña
passwd john

# 4. Verificación final
getent passwd john | grep john
grep "john" /etc/passwd
su - john  # Debe fallar
```

## Resultados Esperados

- Usuario john creado con UID/GID específicos
- Shell configurada como /sbin/nologin
- Directorio home en /home/john
- Login interactivo bloqueado con mensaje educativo

## Estado del Reto

✅ **COMPLETADO** - Implementación exitosa con shell no-interactiva

*Fecha de ejecución: 2025-01-25*