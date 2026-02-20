# 🐧 Linux Challenges - xFusionCorp Industries

## 📋 Overview

Repository containing solved Linux administration challenges for xFusionCorp Industries training program. These challenges demonstrate practical system administration skills in enterprise environments.

---

## 📚 Challenges Index

### ✅ Completed Challenges (9/20)

| # | Challenge | Status | Server | Skills | Documentation |
|---|-----------|--------|---------|-------|---------------|
| 01 | [Creación de Usuario javed](retos/01-creacion-usuarios/README.md) | ✅ | stapp02 | User Management | [Implementation](retos/01-creacion-usuarios/stapp02-javed-implementacion.md) |
| 02 | [Gestión de Grupos nautilus_noc](retos/02-gestion-grupos-xfusioncorp/README.md) | ✅ | All Servers | Group Management | [Multi-server](retos/02-gestion-grupos-xfusioncorp/) |
| 03 | [Usuario john con Shell No-Interactivo](retos/03-usuario-no-interactivo-xfusioncorp/README.md) | ✅ | stapp02 | Shell Configuration | [Implementation](retos/03-usuario-no-interactivo-xfusioncorp/stapp02-john-implementacion.md) |
| 04 | [Service User Creation without Home Directory](retos/04-usuario-sin-home/README.md) | ✅ | stapp01 | Service Users | [Implementation](retos/04-usuario-sin-home/stapp01-implementacion.md) |
| 05 | [Temporary User Setup with Expiry](retos/05-usuario-temporal/README.md) | ✅ | stapp02 | User Expiry | [Implementation](retos/05-usuario-temporal/stapp02-implementacion.md) |
| 06 | [Linux User Data Transfer](retos/06-transferencia-datos/README.md) | ✅ | stapp01→stapp03 | Data Migration | [Implementation](retos/06-transferencia-datos/stapp01-stapp03-implementacion.md) |
| 06b | [Temporary User Setup with Expiry - anita](retos/06-creacion-anita-temporal/README.md) | ✅ | stapp02 | User Expiry | [Implementation](retos/06-creacion-anita-temporal/stapp02-implementacion.md) |
| 08 | [Data Backup for Developer](retos/08-backup-desarrollador/README.md) | ✅ | stapp02 | Backup Automation | [Implementation](retos/08-backup-desarrollador/) |
| 19 | [Filtrado y Copia de Archivos de Usuario](retos/19-filtrado-archivos-usuario/README.md) | ✅ | stapp02 | File Management | [Implementation](retos/19-filtrado-archivos-usuario/) |

### 🔒 Locked Challenges (11/20)

| # | Challenge | Status | Server | Skills |
|---|-----------|--------|---------|-------|
| 07 | [Secure Root SSH Access](retos/07-ssh-root-seguro/README.md) | 🔒 | stapp01 | SSH Security |
| 09 | [Script Execution Permissions](retos/09-permisos-scripts/README.md) | 🔒 | stapp03 | Script Management |
| 10 | [File Permission Correction](retos/10-correccion-permisos/README.md) | 🔒 | stapp01 | Permission Management |
| 11 | [String Replacement](retos/11-reemplazo-cadenas/README.md) | 🔒 | stapp02 | Text Processing |
| 12 | [Secure Data Transfer](retos/12-transferencia-segura/README.md) | 🔒 | stapp01→stapp03 | Secure Copy |
| 13 | [Restrict Cron Access](retos/13-restriccion-cron/README.md) | 🔒 | stapp03 | Cron Management |
| 14 | [Default GUI Boot Configuration](retos/14-config-gui-default/README.md) | 🔒 | stapp01 | System Configuration |
| 15 | [Timezone Alignment](retos/15-configuracion-timezone/README.md) | 🔒 | All Servers | Time Management |
| 16 | [Firewall Configuration](retos/16-configuracion-firewall/README.md) | 🔒 | stapp01 | Security Hardening |
| 17 | [Process Limit Adjustment](retos/17-ajuste-limites-procesos/README.md) | 🔒 | stapp02 | System Tuning |
| 18 | [SELinux Installation and Configuration](retos/18-instalacion-selinux/README.md) | 🔒 | stapp03 | Security Framework |

---

## 🎯 Skills Progression

### ✅ Mastered Skills
- **User Management** - Creation, UID assignment, home directories
- **Group Administration** - Group creation, user assignment, access control
- **Shell Configuration** - Interactive vs non-interactive shells
- **Service User Management** - System accounts without home directories
- **Account Expiry Management** - Temporary user configurations
- **Multi-server Administration** - Coordinated changes across infrastructure
- **Data Migration** - Secure transfers between systems
- **Backup Automation** - Scheduled backup operations
- **File Management** - Find, filter, copy with structure preservation

### 🚀 Skills in Development
- **SSH Security** - Key-based authentication, port configuration
- **Permission Management** - Advanced file system permissions
- **System Hardening** - SELinux, Firewall, Process Limits

---

## 🏗️ xFusionCorp Infrastructure

### 🌐 Server Environment
| Server | IP | Hostname | Primary User | Role |
|--------|----|----------|---------------|------|
| stapp01 | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony | Application Server 1 |
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Application Server 2 |
| stapp03 | 172.16.238.12 | stapp03.stratos.xfusioncorp.com | banner | Application Server 3 |

### 📋 Environment Details
- **Platform**: KodeKloud Engine
- **Datacenter**: Stratos
- **Company**: xFusionCorp Industries
- **Operating System**: CentOS/RHEL based

---

## 📊 Progress Statistics

### 🎯 Completion Metrics
- **Total Challenges**: 20
- **Completed**: 9 ✅ (45%)
- **Locked**: 11 🔒 (55%)
- **Success Rate**: 100% (9/9 completed)

### 📈 Skill Coverage
- **User Administration**: 100% ✅
- **Group Management**: 100% ✅
- **Account Expiry Management**: 100% ✅
- **Data Migration**: 100% ✅
- **Backup Automation**: 100% ✅
- **File Management**: 100% ✅
- **Security Configuration**: 18% 🔄
- **System Administration**: 15% 🔄

---

## 🛠️ Command Reference

### 👤 User Management
```bash
# Create user with custom UID and home
useradd -u 1467 -d /var/www/javed -m javed

# Create user without home directory
useradd -u 998 -s /sbin/nologin james

# Create user with expiry date
useradd -m -s /bin/bash anita
chage -E 2026-12-07 anita

# Set user password
passwd username

# Verify user creation
id username
getent passwd username
chage -l username
```

### 👥 Group Management
```bash
# Create group
groupadd nautilus_noc

# Add user to group
usermod -aG nautilus_noc rajesh

# Verify group membership
groups username
getent group groupname
```

### 🔧 Shell Configuration
```bash
# Create user with non-interactive shell
useradd -s /sbin/nologin john

# Verify shell configuration
cat /etc/passwd | grep username
```

---

## 📖 Learning Resources

### 📚 Documentation
- [Linux User Administration](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/)
- [CentOS System Administration](https://docs.centos.org/)
- [KodeKloud Engine Platform](https://engineer.kodekloud.com/)

### 🎓 Best Practices
- Always verify user creation with `id` and `getent`
- Use descriptive UIDs for service accounts
- Implement principle of least privilege
- Document all system changes
- Test configurations in non-production environments

---

## 🏆 Achievement Badges

### 🎯 Completed Milestones
- 🏅 **Linux User Management** - Challenges 01-04
- 🏅 **Account Expiry Specialist** - Challenges 05-06
- 🏅 **Multi-server Administration** - Challenge 02
- 🏅 **Security Fundamentals** - Challenge 03
- 🏅 **Data Migration Expert** - Challenge 06
- 🏅 **Backup Automation Specialist** - Challenge 08
- 🏅 **File Management Expert** - Challenge 19

### 🚀 Upcoming Milestones
- 🎖️ **SSH Security Expert** - Challenge 07
- 🎖️ **Script Permissions Master** - Challenge 09
- 🎖️ **System Hardening** - Challenges 16-18

---

## 🔗 Quick Navigation

### 📋 Challenge Categories
- [👤 User Management](#-completed-challenges-418) - Challenges 01-06
- [🔒 Security Configuration](#-locked-challenges-1218) - Challenges 07-18
- [📊 System Administration](#-locked-challenges-1218) - Challenges 08-18

### 📊 Progress Tracking
- [📈 Overall Progress](#-progress-statistics)
- [🎯 Skills Development](#-skills-progression)
- [🏆 Achievements](#-achievement-badges)

---

> **Note**: This repository represents practical Linux administration experience in enterprise environments, demonstrating real-world system administration capabilities and security best practices.

---

*Linux Challenges Index v1.1 | Last Updated: 20-02-2026*