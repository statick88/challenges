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

## Configuración del Target de Boot: Entornos Desktop vs Server

---

## 🎓 Del Instructor

Bienvenido a tu decimoquinto desafío como SysAdmin Senior en xFusionCorp. Hoy configuramos el **target de boot** del sistema, una decisión que afecta recursos, seguridad y usabilidad.

> 💭 **Mentalidad de SysAdmin**: "Un servidor con GUI es como una bicicleta con radio: funciona, pero consume recursos innecesarios. Sin embargo, hay casos donde la GUI es esencial. La clave es elegir el target correcto para cada caso de uso."

En entornos empresariales, la mayoría de servidores usan modo texto (multi-user.target), pero estaciones de trabajo y servidores de administración necesitan GUI (graphical.target).

---

## 🎭 Escenario Real: Estación de Administración en Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Configuración de Estación de Trabajo  
**Servidor**: App Server 1 (stapp01)  
**Tu rol**: Senior System Administrator - Configuración de Sistema

### La Problemática

El servidor stapp01 es una estación de administración utilizada por:

- Administradores de base de datos (herramientas GUI)
- Equipo de monitoreo (dashboards visuales)
- Soporte técnico (herramientas de diagnóstico gráficas)

Actualmente arranca en modo texto (multi-user.target), requiriendo iniciar manualmente la GUI cuando se necesita.

**El requerimiento del equipo de Operaciones**:

> "Configure system to boot into GUI mode by default."

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña |
| -------- | ------------- | ------------------------------- | -------------- | ---------- |
| stapp01  | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony           | Ir0nM@n    |

### Requisitos Técnicos

- **Target actual**: Multi-user (text mode)
- **Target deseado**: Graphical (GUI mode)
- **Método**: `systemctl set-default`
- **Verificación**: Reboot y confirmación de GUI
- **Fallback**: Método alternativo si systemd no disponible

---

## 🧠 La Arquitectura: Targets de Systemd

### Targets Principales

| Target                | Descripción                    | Uso                            |
| --------------------- | ------------------------------ | ------------------------------ |
| **graphical.target**  | GUI completa                   | Estaciones de trabajo, laptops |
| **multi-user.target** | Modo texto, múltiples usuarios | Servidores                     |
| **rescue.target**     | Modo de rescate                | Recuperación del sistema       |
| **emergency.target**  | Shell de emergencia            | Reparación crítica             |

### Relación entre Targets

```
graphical.target
      │
      ├── multi-user.target
      │       │
      │       ├── basic.target
      │       │       │
      │       │       └── sysinit.target
      │       │
      │       └── getty.target
      │
      └── display-manager.service
```

---

## 🛠️ Implementación Profesional

### Fase 1: Verificar Target Actual

```bash
# Conexión al servidor
ssh tony@172.16.238.10
sudo su -

# Verificar target actual
systemctl get-default
# Salida esperada: multi-user.target

# Verificar targets disponibles
systemctl list-units --type=target | grep graphical
```

### Fase 2: Cambiar Target por Defecto

```bash
# Configurar graphical.target como default
systemctl set-default graphical.target

# Verificar cambio
systemctl get-default
# Debe mostrar: graphical.target
```

### Fase 3: Verificación

```bash
# Verificar que GUI está disponible
systemctl status graphical.target

# Verificar paquetes GUI instalados
rpm -qa | grep -E "(gnome|kde|x11|desktop)"

# Si falta GUI, instalar (opcional)
# yum groupinstall "Server with GUI"
```

### Resumen de Comandos

```bash
# Verificar target actual
systemctl get-default

# Cambiar a GUI
systemctl set-default graphical.target

# Verificar cambio
systemctl get-default

# Reiniciar para aplicar (cuando sea posible)
# reboot
```

---

## 🎯 Análisis Post-Implementación

```
┌─────────────────────────────────────────────────────────────────────────┐
│              TARGET DE BOOT CONFIGURADO - stapp01                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ANTES:                                                                  │
│  Target: multi-user.target                                              │
│  Modo: Texto, línea de comandos                                         │
│  Uso: Servidor tradicional                                              │
│                                                                          │
│  DESPUÉS:                                                                │
│  Target: graphical.target                                               │
│  Modo: GUI completa                                                     │
│  Uso: Estación de administración                                        │
│                                                                          │
│  COMANDOS:                                                               │
│  systemctl get-default    → graphical.target                            │
│  systemctl set-default graphical.target                                 │
│                                                                          │
│  NOTA: Reboot requerido para activar GUI                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Reflexión Final

### Eligiendo el Target Correcto

| Escenario             | Target Recomendado                        |
| --------------------- | ----------------------------------------- |
| Servidor web/DB/app   | multi-user.target                         |
| Estación de trabajo   | graphical.target                          |
| Servidor de monitoreo | graphical.target (si requiere dashboards) |
| Recuperación          | rescue.target                             |

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 10 minutos
- 🎯 Dificultad: Fácil

---

_Documentación creada siguiendo estándares de SysAdmin - Configuración de Sistema_
