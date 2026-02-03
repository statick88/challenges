---
title: "Reto 14: Default GUI Boot Configuration - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - group-management
  - text-processing
date: 2025-01-25
status: blocked
---

# Reto 14: Default GUI Boot Configuration - xFusionCorp Industries

## Objetivo del Reto

Configurar el sistema para iniciar en modo GUI por defecto:

**Configure system to boot into GUI mode by default.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp01 | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony | Ir0nM@n | GUI Configuration |

## Requisitos Técnicos

- **Target actual**: Multi-user (text mode)
- **Target deseado**: Graphical (GUI mode)
- **Método**: systemctl set-default
- **Verificación**: Reboot y confirmación de GUI
- **Fallback**: Método alternativo si systemd no disponible

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh tony@172.16.238.10
sudo su -

# 2. Verificación del target actual
systemctl get-default
systemctl list-units --type=target | grep graphical

# 3. Verificar disponibilidad de GUI target
systemctl status graphical.target

# 4. Configurar target por defecto
systemctl set-default graphical.target

# 5. Verificación del cambio
systemctl get-default  # Debe mostrar "graphical.target"

# 6. Método alternativo (si falla systemd)
# Editar /etc/inittab
# id:5:initdefault:  # Cambiar a 5 para GUI

# 7. Verificar paquetes GUI necesarios
rpm -qa | grep -i x11
# Si falta: yum groupinstall "Server with GUI" o similar

# 8. Verificación final (requiere reboot)
echo "Sistema configurado para GUI. Reboot necesario para verificar."
reboot  # Solo después de confirmación
```

## Resultados Esperados

- Sistema configurado para iniciar en modo GUI
- Target por defecto cambiado a graphical.target
- Interfaz gráfica disponible después del reboot
- Funcionalidad completa del entorno desktop

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*