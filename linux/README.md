# 🐧 Linux Level 1 - xFusionCorp Industries

## 📋 Overview

Linux administration challenges from KodeKloud Level 1 certification path. These challenges demonstrate practical system administration skills in enterprise environments.

---

## 📚 Challenges Index

### ✅ Completed Challenges (7/18)

| # | Challenge | Status | Server | Skills | Date |
|---|-----------|--------|---------|-------|------|
| 1 | [Custom Apache User Setup](retos/01-creacion-usuarios/README.md) | ✅ | stapp02 | User Management | 25-01-2026 |
| 2 | [Group Creation and User Assignment](retos/02-gestion-grupos-xfusioncorp/README.md) | ✅ | All Servers | Group Management | 25-01-2026 |
| 3 | [Linux User Setup with Non-Interactive Shell](retos/03-usuario-no-interactivo-xfusioncorp/README.md) | ✅ | stapp02 | Shell Configuration | 25-01-2026 |
| 4 | [Service User Creation without Home Directory](retos/04-usuario-sin-home/README.md) | ✅ | stapp01 | Service Users | 26-01-2026 |
| 5 | [Temporary User Setup with Expiry](retos/05-usuario-temporal/README.md) | ✅ | stapp02 | User Expiry | 29-01-2026 |
| 6 | [Linux User Data Transfer](retos/06-transferencia-datos/README.md) | ✅ | stapp01→stapp03 | Data Migration | 20-02-2026 |
| 7 | [Secure Root SSH Access](retos/20-disable-root-ssh-login/README.md) | ✅ | All App Servers | SSH Security | 21-02-2026 |

### 🔒 Locked Challenges (11/18)

| # | Challenge | Status | Server | Skills |
|---|-----------|--------|---------|-------|
| 8 | Data Backup for Developer | 🔒 | stapp02 | Backup Automation |
| 9 | Script Execution Permissions | 🔒 | stapp03 | Script Management |
| 10 | File Permission Correction | 🔒 | stapp01 | Permission Management |
| 11 | String Replacement | 🔒 | stapp02 | Text Processing |
| 12 | Secure Data Transfer | 🔒 | stapp01→stapp03 | Secure Copy |
| 13 | Restrict Cron Access | 🔒 | stapp03 | Cron Management |
| 14 | Default GUI Boot Configuration | 🔒 | stapp01 | System Configuration |
| 15 | Timezone Alignment | 🔒 | All Servers | Time Management |
| 16 | Firewall Configuration | 🔒 | stapp01 | Security Hardening |
| 17 | Process Limit Adjustment | 🔒 | stapp02 | System Tuning |
| 18 | SELinux Installation and Configuration | 🔒 | stapp03 | Security Framework |

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
- **SSH Security** - Disable root login, hardening configurations

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
- **Total Challenges**: 18
- **Completed**: 7 ✅ (39%)
- **Locked**: 11 🔒 (61%)
- **Success Rate**: 100% (7/7 completed)

### 📈 Skill Coverage
- **User Administration**: 100% ✅
- **Group Management**: 100% ✅
- **Account Expiry Management**: 100% ✅
- **Data Migration**: 100% ✅
- **SSH Security**: 50% 🔄
- **Backup Automation**: 0% ⏳
- **File Management**: 0% ⏳
- **Permission Management**: 0% ⏳
- **System Administration**: 0% ⏳

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
- 🏅 **Linux User Management** - Challenges 1-4
- 🏅 **Account Expiry Specialist** - Challenge 5
- 🏅 **Multi-server Administration** - Challenge 2
- 🏅 **Data Migration Expert** - Challenge 6
- 🏅 **SSH Security Fundamentals** - Challenge 7

### 🚀 Upcoming Milestones
- 🎖️ **Backup Automation Specialist** - Challenge 8
- 🎖️ **Script Permissions Master** - Challenge 9
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

*Linux Level 1 Index v1.2 | Last Updated: 21-02-2026*