---
title: "SELinux Installation and Configuration"
category: devops
day: 5
difficulty: 3
tags:
  - devops
  - linux
  - seguridad
  - selinux
  - dnf
date: 2026-01-29
status: completed
---

## 🎯 Objetivo

Instalar los paquetes SELinux requeridos y deshabilitar permanentemente
SELinux en App Server 1 como parte de la iniciativa de seguridad de
xFusionCorp Industries.

---

## 🏗️ Detalles de Infraestructura

- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Contraseña**: Ir0nM@n
- **Package Manager**: DNF (CentOS Stream 9)
- **Sistema**: RPM-based Linux

---

## 🔧 Proceso de Solución

### Paso 1: Conexión al servidor

```bash
ssh tony@172.16.238.10
# Password: Ir0nM@n
```

### Paso 2: Identificación del tipo de sistema y verificación inicial

```bash
# Identificar si es .deb o .rpm
which dnf || which yum || which apt
# Confirmado: DNF disponible (RPM-based)

# Verificar estado actual de SELinux
sestatus 2>/dev/null || echo "SELinux packages not installed"
getenforce 2>/dev/null || echo "getenforce command not available"

# Verificar paquetes existentes
rpm -qa | grep selinux
# Salida: libselinux-3.6-3.el9.x86_64
```

### Paso 3: Instalación de paquetes SELinux con DNF

```bash
sudo dnf install policycoreutils selinux-policy-targeted selinux-policy-devel

# 19 paquetes instalados exitosamente incluyendo:
# - policycoreutils-3.6-4.el9.x86_64
# - selinux-policy-targeted-38.1.72-1.el9.noarch
# - selinux-policy-devel-38.1.72-1.el9.noarch
# + 16 dependencias
```

### Paso 4: Configuración permanente deshabilitada

```bash
# Editar archivo de configuración principal
sudo vi /etc/selinux/config

# Configuración aplicada:
SELINUX=disabled
SELINUXTYPE=targeted
```

### Paso 5: Verificación final

```bash
# Verificar configuración permanente
cat /etc/selinux/config | grep SELINUX=
# Salida: SELINUX=disabled

# Verificar estado actual
sestatus
# Salida: SELinux status: disabled

getenforce
# Salida: Disabled
```

---

## ✅ Verificación Final

- Paquetes SELinux instalados exitosamente (19 paquetes) ✅
- Configuración permanente establecida en `disabled` ✅
- Estado actual verificado como `disabled` ✅
- Sistema listo para maintenance reboot confirmado ✅

---

## 🐛 Solución de Problemas

No se encontraron inconvenientes durante el proceso. El único aspecto clave fue
la identificación correcta del sistema de paquetes (RPM-based con DNF)
antes de proceder con la instalación.

---

## 📚 Aprendizajes Clave

- **Identificación de Sistema**: Diferenciar entre sistemas .deb (Debian/Ubuntu)
  y .rpm (RHEL/CentOS/Fedora)
- **Package Management**: DNF es el gestor de paquetes moderno para sistemas
  Fedora/RHEL, preferido sobre YUM
- **SELinux Configuration**: Diferencia entre configuración temporal
  (`setenforce`) y permanente (`/etc/selinux/config`)
- **Security Frameworks**: Comprensión de SELinux como framework de
  seguridad a nivel kernel
- **DNF vs YUM**: DNF ofrece mejor rendimiento y gestión de dependencias
  comparado con YUM tradicional

---

## 🔗 Comandos Relacionados

- `dnf install package-name` - Instalación moderna en sistemas RPM
- `which dnf || which yum || which apt` - Identificar gestor de paquetes disponible
- `sestatus` - Verificar estado completo de SELinux
- `getenforce` - Verificar modo de ejecución actual
- `cat /etc/selinux/config | grep SELINUX=` - Verificar configuración permanente

---

## 📖 Recursos

- DNF Documentation: <https://dnf.readthedocs.io/>
- SELinux Project: <https://selinuxproject.org/>
- CentOS Stream 9 Documentation

---

## 📊 Seguimiento de Tiempo

- **Hora de Inicio**: 10:00
- **Hora de Finalización**: 10:15
- **Duración Total**: 15 minutos

---

## 🏆 Criterios de Éxito Cumplidos

- [x] Paquetes SELinux instalados correctamente
- [x] Sistema identificado como RPM-based con DNF
- [x] Configuración permanente establecida en `disabled`
- [x] Estado verificado sin necesidad de reboot
- [x] Uso correcto de DNF sobre YUM

---

## 🌐 Contexto Adicional y Importancia del Reto

Este reto es fundamental para el programa "100 Days of DevOps" porque:

1. **Seguridad Empresarial**: SELinux es estándar en entornos empresariales Linux
   para seguridad a nivel kernel
2. **Configuración de Sistemas**: Demuestra habilidad para configurar
   permanentemente aspectos críticos del sistema
3. **Gestión de Paquetes**: Refuerza conocimiento de diferentes gestores de
   paquetes (DNF/YUM/APT)
4. **Preparación para Retos Futuros**: Base para configuraciones de seguridad
   más avanzadas
5. **Habilidades DevOps Reales**: Tarea común en roles de SysAdmin y DevOps
   Engineer
6. **Seguimiento de Auditoría**: Responde a requisitos de auditoría de
   seguridad corporativa

Completar este reto establece una base sólida para gestionar frameworks de
seguridad en entornos de producción, una habilidad esencial para cualquier
profesional DevOps.
