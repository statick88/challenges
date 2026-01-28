# Linux Challenges - xFusionCorp Industries

Repository containing solved Linux administration challenges for xFusionCorp Industries training program.

## 📚 Challenges Solved

### Reto 01: Creación de Usuario javed
- **Objetivo**: Crear usuario personalizado para aplicación web
- **Servidor**: App Server 2 (stapp02)
- **Usuario**: javed (UID: 1467)
- **Directorio**: /var/www/javed
- **Estado**: ✅ COMPLETADO
- **Documentación**: [Ver detalles](./retos/01-creacion-usuarios/README.md) | [Ver implementación](./retos/01-creacion-usuarios/stapp02-javed-implementacion.md)

### Reto 02: Gestión de Grupos nautilus_noc
- **Objetivo**: Implementar control de acceso basado en grupos
- **Alcance**: Todos los servidores App del Stratos Datacenter
- **Grupo**: nautilus_noc
- **Usuario**: rajesh
- **Estado**: ✅ COMPLETADO
- **Documentación**: [Ver resumen](./retos/02-gestion-grupos-xfusioncorp/README.md) | [Ver implementaciones](./retos/02-gestion-grupos-xfusioncorp/)

### Reto 03: Usuario john con Shell No-Interactivo
- **Objetivo**: Crear usuario para backup agent tool
- **Servidor**: App Server 2 (stapp02)
- **Usuario**: john
- **Shell**: /sbin/nologin
- **Estado**: ✅ COMPLETADO
- **Documentación**: [Ver detalles](./retos/03-usuario-no-interactivo-xfusioncorp/README.md) | [Ver implementación](./retos/03-usuario-no-interactivo-xfusioncorp/stapp02-john-implementacion.md)

### 🏆 Reto 04: Service User Creation without Home Directory
- **Objetivo**: Crear usuario de servicio sin directorio home
- **Servidor**: App Server 2 (stapp02)
- **Usuario**: james
- **Shell**: /sbin/nologin
- **UID**: 998
- **Estado**: ✅ COMPLETADO
- **Documentación**: [Ver detalles](./retos/04-usuario-sin-home/README.md) | [Ver implementación](./retos/04-usuario-sin-home/stapp02-james-implementacion.md)

### 🔄 Reto 05: Temporary User Setup with Expiry
- **Objetivo**: Configurar usuario temporal con fecha de expiración
- **Servidor**: App Server 2 (stapp02)
- **Usuario**: temp_user
- **Duración**: 7 días
- **Estado**: 🔓 POR DESBLOQUEAR
- **Documentación**: [Ver detalles](./retos/05-usuario-temporal/README.md) | [Ver implementación](./retos/05-usuario-temporal/stapp02-implementacion.md)

### 📊 Reto 06: Linux User Data Transfer
- **Objetivo**: Transferir datos entre usuarios y sistemas
- **Servidores**: stapp01 → stapp03
- **Método**: rsync/scp con preservación de permisos
- **Estado**: 🔓 POR DESBLOQUEAR
- **Documentación**: [Ver detalles](./retos/06-transferencia-datos/README.md) | [Ver implementación](./retos/06-transferencia-datos/stapp01-stapp03-implementacion.md)

### 🔐 Reto 07: Secure Root SSH Access
- **Objetivo**: Configurar acceso SSH seguro para root
- **Servidor**: App Server 1 (stapp01)
- **Seguridad**: Clave SSH + puerto 2222
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/07-ssh-root-seguro/README.md)

### 💾 Reto 08: Data Backup for Developer
- **Objetivo**: Implementar backup automatizado para desarrollador
- **Servidor**: App Server 2 (stapp02)
- **Frecuencia**: Diario 02:00 AM
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/08-backup-desarrollador/README.md)

### ⚡ Reto 09: Script Execution Permissions
- **Objetivo**: Configurar permisos de ejecución para scripts
- **Servidor**: App Server 3 (stapp03)
- **Permisos**: 755 (rwxr-xr-x)
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/09-permisos-scripts/README.md)

### 🔧 Reto 10: File Permission Correction
- **Objetivo**: Corregir permisos de archivos según políticas
- **Servidor**: App Server 1 (stapp01)
- **Directorio**: /data/application/
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/10-correccion-permisos/README.md)

### 🔤 Reto 11: String Replacement
- **Objetivo**: Realizar reemplazo de cadenas en configuración
- **Servidor**: App Server 2 (stapp02)
- **Archivo**: /etc/app/config.properties
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/11-reemplazo-cadenas/README.md)

### 🔒 Reto 12: Secure Data Transfer
- **Objetivo**: Transferencia de datos sensibles con encriptación
- **Servidores**: stapp01 → stapp03
- **Método**: scp con compresión y verificación
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/12-transferencia-segura/README.md)

### ⏰ Reto 13: Restrict Cron Access
- **Objetivo**: Restringir acceso a cron para usuarios
- **Servidor**: App Server 3 (stapp03)
- **Método**: /etc/cron.allow y cron.deny
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/13-restriccion-cron/README.md)

### 🖥️ Reto 14: Default GUI Boot Configuration
- **Objetivo**: Configurar sistema para iniciar en modo GUI
- **Servidor**: App Server 1 (stapp01)
- **Target**: graphical.target
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/14-config-gui-default/README.md)

### 🌍 Reto 15: Timezone Alignment
- **Objetivo**: Configurar zona horaria consistente
- **Servidores**: stapp01, stapp02, stapp03
- **Timezone**: America/New_York
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/15-configuracion-timezone/README.md)

### 🛡️ Reto 16: Firewall Configuration
- **Objetivo**: Configurar firewall según políticas de seguridad
- **Servidor**: App Server 1 (stapp01)
- **Puertos**: 22, 80, 443
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/16-configuracion-firewall/README.md)

### ⚙️ Reto 17: Process Limit Adjustment
- **Objetivo**: Ajustar límites de procesos del sistema
- **Servidor**: App Server 2 (stapp02)
- **Límites**: /etc/security/limits.conf
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/17-ajuste-limites-procesos/README.md)

### 🔐 Reto 18: SELinux Installation and Configuration
- **Objetivo**: Instalar y configurar SELinux
- **Servidor**: App Server 3 (stapp03)
- **Modo**: Enforcing
- **Estado**: 🔒 BLOQUEADO
- **Documentación**: [Ver detalles](./retos/18-instalacion-selinux/README.md)

## 🔗 Platform Information

**Training Platform**: [KodeKloud Engine](https://engineer.kodekloud.com/)

This repository contains Linux challenges from the KodeKloud Engine platform, demonstrating practical system administration skills in enterprise environments. Each challenge represents real-world scenarios encountered in production infrastructure management.

## 📁 Repository Structure

```
retos/
├── 01-creacion-usuarios/
│   └── stapp02-javed-implementacion.md
├── 02-gestion-grupos-xfusioncorp/
│   ├── README.md
│   ├── stapp01-implementacion.md
│   ├── stapp02-implementacion.md
│   ├── stapp03-implementacion.md
│   └── resumen-ejecucion.md
├── 03-usuario-no-interactivo-xfusioncorp/
│   ├── README.md
│   ├── stapp02-john-implementacion.md
│   └── resumen-ejecucion.md
├── 04-usuario-sin-home/
│   ├── README.md
│   └── stapp01-implementacion.md
├── 05-usuario-temporal/
│   ├── README.md
│   └── stapp02-implementacion.md
├── 06-transferencia-datos/
│   ├── README.md
│   └── stapp01-stapp03-implementacion.md
├── 07-ssh-root-seguro/
│   └── README.md
├── 08-backup-desarrollador/
│   └── README.md
├── 09-permisos-scripts/
│   └── README.md
├── 10-correccion-permisos/
│   └── README.md
├── 11-reemplazo-cadenas/
│   └── README.md
├── 12-transferencia-segura/
│   └── README.md
├── 13-restriccion-cron/
│   └── README.md
├── 14-config-gui-default/
│   └── README.md
├── 15-configuracion-timezone/
│   └── README.md
├── 16-configuracion-firewall/
│   └── README.md
├── 17-ajuste-limites-procesos/
│   └── README.md
├── 18-instalacion-selinux/
│   └── README.md
└── README.md
```

## 🎯 Skills Demonstrated

### 🎯 Habilidades Actuales ✅
- User management and creation
- Group-based access control  
- Shell configuration (interactive vs non-interactive)
- UID/GID management
- Security policy implementation
- Multi-server administration
- SSH connection and privilege escalation
- **Service user management (no home directory)**

### 🚀 Próximas Habilidades 🔓
- Temporary account configuration with expiry
- Data migration between systems
- Secure SSH key authentication
- Backup and restore operations
- Script automation and permissions
- Security hardening and policies

## 🔧 Technologies & Commands

### 🛠️ Tecnologías Dominadas ✅
- `useradd` with custom UID and home directory
- `groupadd` and group management
- `usermod` for group assignment
- `passwd` for password management
- `id`, `getent`, `grep` for verification
- SSH authentication and privilege escalation
- **`useradd` without home directory (service users)**

### 🚀 Tecnologías Pendientes 🔓
- `usermod` for account expiry
- `rsync`, `scp` for data transfer
- SSH key authentication and security
- Cron job management and restriction
- File permissions and ownership
- String manipulation and text processing
- Firewall configuration (iptables/ufw)
- SELinux policy management

## 📊 Progress

- **Total Challenges**: 18
- **Completed**: 4 ✅
- **Unlocked**: 5 🔓
- **Locked**: 9 🔒
- **Success Rate**: 100% (4/4)
- **Overall Progress**: 22.2% (4/18)
- **Documentation Coverage**: 100% (18/18 challenges documented)

## 👨‍💻 Author Information

**Diego Medardo Saavedra García**  
FullStack Developer & Linux System Administrator  
Portfolio: [https://statick88.github.io](https://statick88.github.io)  
LinkedIn: [linkedin.com/in/diego-saavedra-developer](https://linkedin.com/in/diego-saavedra-developer)  
GitHub: [github.com/statick88](https://github.com/statick88)  

### Expertise
- **Linux System Administration** (8+ years)
- **FullStack Development** (8+ years) 
- **DevOps & Infrastructure** (5+ years)
- **Technical Training & Facilitation** (4+ years)

## 🎯 Training Objectives

This repository contains practical Linux challenges solved in real enterprise environments, focusing on:
- User and group management
- Security implementation
- System administration best practices
- Multi-server environment management
- Enterprise-grade infrastructure handling

---

*# Linux Challenges - xFusionCorp Industries

> **Build the future of enterprise Linux administration, one challenge at a time.** 🚀

## 🔍 Project Overview

Repository containing **comprehensive Linux administration challenges** for xFusionCorp Industries training program, demonstrating practical system administration skills in enterprise environments. Each challenge represents real-world scenarios encountered in production infrastructure management.

## 📚 Challenges Solved*