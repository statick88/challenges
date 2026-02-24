---
title: "Reto 19: SELinux Installation and Configuration - xFusionCorp Industries"
category: linux
difficulty: hard
tags:
  - linux
  - ssh
  - user-management
  - selinux
  - security
date: 2025-01-25
status: blocked
---

# Reto 19: SELinux Installation and Configuration - xFusionCorp Industries

## SELinux: Seguridad de Acceso Obligatorio a Nivel de Kernel

---

## 🎓 Del Instructor

Bienvenido a tu decimonoveno desafío como SysAdmin Senior en xFusionCorp. Hoy implementamos **SELinux**, la tecnología de seguridad más poderosa de Linux.

> 💭 **Mentalidad de SysAdmin**: "SELinux es como tener un guardia de seguridad que revisa cada acción que cada proceso intenta realizar. Puede ser frustrante al principio, pero es la diferencia entre un servidor comprometido y uno que resiste ataques."

SELinux implementa **Mandatory Access Control (MAC)** - la seguridad la define el sistema, no el usuario.

---

## 🎭 Escenario Real: Hardening Avanzado en Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Seguridad de Alto Nivel  
**Servidor**: App Server 3 (stapp03)  
**Tu rol**: Senior System Administrator - Seguridad Avanzada

### La Problemática

El equipo de CISO de xFusionCorp requiere implementar controles de seguridad avanzados en stapp03:

- Protección contra exploits que comprometan servicios
- Contención de brechas de seguridad
- Auditoría detallada de accesos
- Cumplimiento de estándares gubernamentales

**El requerimiento del CISO**:

> "Install and configure SELinux with enterprise security policies."

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña |
| -------- | ------------- | ------------------------------- | -------------- | ---------- |
| stapp03  | 172.16.238.12 | stapp03.stratos.xfusioncorp.com | banner         | BigGr33n   |

### Requisitos Técnicos

- **SELinux mode**: Enforcing
- **Política**: Targeted policy
- **Instalación**: Paquetes necesarios si no presentes
- **Configuración**: `/etc/selinux/config`
- **Verificación**: `sestatus` y `getenforce`
- **Contextos**: Configurar para servicios web

---

## 🧠 La Arquitectura: SELinux

### Modos de SELinux

| Modo           | Descripción                  | Uso             |
| -------------- | ---------------------------- | --------------- |
| **Enforcing**  | Política activa y bloqueante | Producción      |
| **Permissive** | Solo loguea, no bloquea      | Troubleshooting |
| **Disabled**   | SELinux desactivado          | No recomendado  |

### Componentes Principales

```
SELinux = Labels (Contextos) + Policy (Reglas) + Enforcement (Bloqueo)

Contextos:
  user:role:type:level

  Ejemplo: system_u:system_r:httpd_t:s0
           │       │        │      │
           │       │        │      └── Nivel MLS/MCS
           │       │        └── Tipo (dominio del proceso)
           │       └── Rol
           └── Usuario SELinux

Policy:
  Reglas que definen qué tipos pueden acceder a qué tipos
```

### Contextos de Archivos

```bash
# Ver contexto SELinux
ls -Z /var/www/html/
# system_u:object_r:httpd_sys_content_t:s0 index.html
#         │        │                  │
#         │        │                  └── Nivel
#         │        └── Tipo del objeto
#         └── Usuario SELinux
```

---

## 🛠️ Implementación Profesional

### Fase 1: Verificar Estado Actual

```bash
# Conexión al servidor
ssh banner@172.16.238.12
sudo su -

# Verificar estado SELinux
sestatus
getenforce

# Verificar paquetes instalados
rpm -qa | grep selinux
```

### Fase 2: Instalar Paquetes (Si es necesario)

```bash
# En sistemas RHEL/CentOS
yum install -y policycoreutils selinux-policy-targeted selinux-policy-devel

# En sistemas Debian/Ubuntu (menos común)
# apt-get install selinux-basics selinux-policy-default
```

### Fase 3: Configurar SELinux

```bash
# Editar configuración
vi /etc/selinux/config

# Configurar:
SELINUX=enforcing
SELINUXTYPE=targeted

# Verificar cambio
grep "^SELINUX=" /etc/selinux/config
```

### Fase 4: Configurar Contextos para Web

```bash
# Establecer contexto para directorio web
semanage fcontext -a -t httpd_sys_content_t "/var/www/html(/.*)?"
restorecon -R -v /var/www/html

# Configurar puertos adicionales para web
semanage port -a -t http_port_t -p tcp 8080
semanage port -a -t http_port_t -p tcp 8443
```

### Fase 5: Activar y Verificar

```bash
# Activar enforcing mode inmediatamente
setenforce 1

# Verificar estado
sestatus
getenforce

# Ver estadísticas
seinfo
semodule -l
```

### Resumen de Comandos

```bash
# Verificar estado
sestatus

# Instalar (si es necesario)
yum install policycoreutils selinux-policy-targeted

# Configurar modo enforcing
sed -i 's/^SELINUX=.*/SELINUX=enforcing/' /etc/selinux/config

# Configurar contextos web
semanage fcontext -a -t httpd_sys_content_t "/var/www/html(/.*)?"
restorecon -R /var/www/html

# Activar
setenforce 1

# Verificar
sestatus
```

---

## 🎯 Análisis Post-Implementación

```
┌─────────────────────────────────────────────────────────────────────────┐
│              SELinux CONFIGURADO - stapp03                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ESTADO:                                                                 │
│  ├── Modo: Enforcing                                                    │
│  ├── Política: targeted                                                 │
│  ├── Estado: enabled                                                    │
│  └── Configuración: /etc/selinux/config                                 │
│                                                                          │
│  CONTEXTOS CONFIGURADOS:                                                 │
│  ├── /var/www/html → httpd_sys_content_t                                │
│  ├── Puerto 8080 → http_port_t                                          │
│  └── Puerto 8443 → http_port_t                                          │
│                                                                          │
│  ✅ SEGURIDAD IMPLEMENTADA:                                              │
│     • Control de acceso obligatorio (MAC)                               │
│     • Procesos confinados a sus dominios                                │
│     • Archivos etiquetados según función                                │
│     • Auditoría de violaciones de política                              │
│     • Protección de nivel kernel                                        │
│                                                                          │
│  COMANDOS ÚTILES:                                                        │
│  • sestatus → Ver estado                                                │
│  • getenforce → Ver modo actual                                         │
│  • setenforce 0/1 → Cambiar modo                                        │
│  • ls -Z → Ver contextos                                                │
│  • restorecon → Restaurar contextos                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Reflexión Final

### SELinux es tu Amigo

> "Desactivar SELinux es como quitar el airbag porque te molesta la luz del tablero."

Lecciones clave:

- Enforcing es el único modo seguro para producción
- Troubleshooting con audit2allow y logs
- Contextos correctos son fundamentales
- SELinux puede prevenir exploits que pasan desapercibidos

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 35 minutos
- 🎯 Dificultad: Difícil

### Criterios de Éxito

- ✅ SELinux instalado y funcionando
- ✅ Modo enforcing activo
- ✅ Políticas configuradas
- ✅ Contextos correctos para servicios
- ✅ Sistema reforzado con seguridad de nivel kernel

---

_Documentación creada siguiendo estándares de SysAdmin - Seguridad Avanzada_
