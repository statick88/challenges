---
title: "Reto 11: String Replacement - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - backup
  - text-processing
date: 2025-01-25
status: blocked
---

# Reto 11: String Replacement - xFusionCorp Industries

## Objetivo del Reto

Realizar reemplazo de cadenas de texto en archivos de configuración:

**Perform string replacement in configuration files.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Am3ric@ | Text Processing |

## Requisitos Técnicos

- **Archivo objetivo**: /etc/app/config.properties
- **Búsqueda**: old_server.local
- **Reemplazo**: new_server.production
- **Método**: sed con backup
- **Verificación**: Validar cambios sin romper sintaxis
- **Respaldo**: Archivo backup antes de cambios

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh steve@172.16.238.11
sudo su -

# 2. Verificación inicial
grep -n "old_server.local" /etc/app/config.properties
cp /etc/app/config.properties /etc/app/config.properties.backup

# 3. Reemplazo con sed
sed -i 's/old_server.local/new_server.production/g' /etc/app/config.properties

# 4. Verificación del cambio
grep -n "new_server.production" /etc/app/config.properties
grep "old_server.local" /etc/app/config.properties  # Debe estar vacío

# 5. Verificación de sintaxis (si es archivo de configuración)
# Asumiendo que es un archivo .properties
java -cp /path/to/properties-validator.jar PropertiesValidator /etc/app/config.properties

# 6. Verificación funcional
systemctl restart app-service  # Si aplica
```

## Resultados Esperados

- Todas las ocurrencias reemplazadas correctamente
- Backup creado antes de modificaciones
- Sintaxis del archivo preservada
- Servicio funcionando con nueva configuración

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*