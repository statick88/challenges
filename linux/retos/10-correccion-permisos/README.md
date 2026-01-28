# Reto 10: File Permission Correction - xFusionCorp Industries

## Objetivo del Reto

Corregir permisos de archivos según políticas de seguridad:

**Correct file permissions according to security policies.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp01 | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony | Ir0nM@n | Permission Fix |

## Requisitos Técnicos

- **Directorio base**: /data/application/
- **Archivos .conf**: 640 (rw-r-----)
- **Archivos .log**: 644 (rw-r--r--)
- **Scripts**: 750 (rwxr-x---)
- **Ownership**: appuser:appgroup
- **Aplicar**: Recursivamente en subdirectorios

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh tony@172.16.238.10
sudo su -

# 2. Verificación inicial
find /data/application/ -type f -name "*.conf" -exec ls -la {} \;
find /data/application/ -type f -name "*.log" -exec ls -la {} \;
find /data/application/ -name "*.sh" -exec ls -la {} \;

# 3. Corregir ownership
chown -R appuser:appgroup /data/application/

# 4. Configurar permisos específicos por tipo
find /data/application/ -type f -name "*.conf" -exec chmod 640 {} \;
find /data/application/ -type f -name "*.log" -exec chmod 644 {} \;
find /data/application/ -type f -name "*.sh" -exec chmod 750 {} \;

# 5. Configurar permisos de directorios
find /data/application/ -type d -exec chmod 755 {} \;

# 6. Verificación final
echo "Verificación archivos .conf:"
find /data/application/ -type f -name "*.conf" -exec ls -la {} \;
echo "Verificación archivos .log:"
find /data/application/ -type f -name "*.log" -exec ls -la {} \;
```

## Resultados Esperados

- Permisos correctos según tipo de archivo
- Ownership consistente appuser:appgroup
- Aplicación recursiva exitosa
- Sistema de archivos seguro y funcional

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*