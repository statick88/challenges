# ⚙️ 100 Days of DevOps Challenge

## 📋 Overview

Comprehensive 100-day DevOps learning journey covering Linux administration, Docker containerization, CI/CD pipelines, infrastructure as code, and cloud technologies. Each day presents a new practical challenge to build systematic DevOps expertise.

---

## 📅 Daily Progress

### ✅ Completed Days (8/100)

| Day | Challenge                                                   | Status | Category                     | Skills                   | Date       |
| --- | ----------------------------------------------------------- | ------ | ---------------------------- | ------------------------ | ---------- |
| 1   | [Linux User Setup](days/day-01-linux-user-setup.md)         | ✅     | #linux #usuarios #shell      | User Management          | 25-01-2026 |
| 2   | [Temporary User](days/day-02-temporary-user.md)             | ✅     | #linux #usuarios #seguridad  | User Expiry              | 25-01-2026 |
| 3   | [Disable Root SSH](days/day-03-disable-root-ssh.md)         | ✅     | #linux #ssh #seguridad       | SSH Security             | 25-01-2026 |
| 4   | [Script Permissions](days/day-04-script-permissions.md)     | ✅     | #linux #scripts #permisos    | Script Management        | 25-01-2026 |
| 5   | [SELinux Installation](days/day-05-selinux-installation.md) | ✅     | #linux #seguridad #selinux   | Security Framework       | 29-01-2026 |
| 6   | [Cron Job Deployment](days/day-06-cron-job-deployment.md)   | ✅     | #linux #automatizacion #cron | Task Scheduling          | 30-01-2026 |
| 7   | [Ansible Installation](days/day-07-ansible-installation.md) | ✅     | #devops #ansible #automation | Configuration Management | 04-02-2026 |
| 8   | [MariaDB Service Troubleshooting](days/day-08-mariadb-troubleshooting.md) | ✅ | #devops #database #troubleshooting | Database Service | 20-02-2026 |

### 📅 Upcoming Challenges (9-100)

| Day | Planned Challenge        | Category               | Focus Area        |
| --- | ------------------------ | ---------------------- | ----------------- |
| 9   | Linux SSH Authentication | #linux #ssh #seguridad | SSH Keys          |
| 10  | File System Management   | #linux #filesystem     | Disk Management   |
| 11  | Process Management       | #linux #procesos       | System Monitoring |
| 12  | Network Configuration    | #linux #redes          | Network Services  |
| ... | ...                      | ...                    | ...               |

---

## 📊 Progress Statistics

### 🎯 Completion Metrics

- **Total Days**: 100
- **Completed**: 8 ✅ (8%)
- **In Progress**: 0 🔄 (0%)
- **Remaining**: 92 ⏳ (92%)
- **Success Rate**: 100% (8/8 completed)
- **Streak**: 8 days 🔥

### 📈 Skill Coverage

- **Linux Administration**: 70% (7/10 planned days)
- **SSH & Security**: 40% (4/10 planned days)
- **Scripting & Automation**: 20% (2/10 planned days)
- **Database Troubleshooting**: 100% ✅
- **Docker & Containers**: 0% ⏳ (0/15 planned days)
- **CI/CD & Jenkins**: 0% ⏳ (0/20 planned days)
- **Infrastructure as Code**: 4% (1/25 planned days)
- **Cloud & Monitoring**: 0% ⏳ (0/20 planned days)

---

## 🗓️ Curriculum Roadmap

### 🐧 Phase 1: Linux Foundation (Days 1-25)

**Focus**: System administration, user management, security, networking

#### 📅 Weeks 1-2: Core Linux Skills (Days 1-14)

- ✅ **Week 1**: User management, shells, SSH security, SELinux (Days 1-5)
- 🔄 **Week 2**: Cron automation, file systems, permissions, process management (Days 6-14)

#### 📅 Weeks 3-4: Advanced Linux (Days 15-25)

- System services, cron jobs, backup strategies
- Network configuration, firewall rules, monitoring

### 🐳 Phase 2: Container Technologies (Days 26-40)

**Focus**: Docker, Docker Compose, container orchestration basics

#### 📅 Weeks 5-6: Docker Fundamentals (Days 26-35)

- Container creation, management, networking, volumes

#### 📅 Week 7-8: Advanced Containers (Days 36-40)

- Docker Compose, multi-container applications, security

### ⚙️ Phase 3: CI/CD & Automation (Days 41-60)

**Focus**: Jenkins, Git pipelines, testing automation, deployment

### 🏗️ Phase 4: Infrastructure as Code (Days 61-85)

**Focus**: Ansible, Terraform, configuration management

### ☁️ Phase 5: Cloud & Monitoring (Days 86-100)

**Focus**: AWS/GCP, monitoring tools, cloud security, scaling

---

## 🏗️ DevOps Environment

### 🌐 Training Infrastructure

| Component             | Platform               | Purpose                 |
| --------------------- | ---------------------- | ----------------------- |
| **Linux Servers**     | KodeKloud Engine       | Hands-on Linux practice |
| **Docker Host**       | Local/Cloud            | Container experiments   |
| **CI/CD Pipeline**    | Jenkins/GitHub Actions | Automation workflows    |
| **Cloud Environment** | AWS/GCP Free Tier      | Cloud infrastructure    |
| **Monitoring Stack**  | Prometheus/Grafana     | System observability    |

### 📋 Development Tools

- **Version Control**: Git + GitHub
- **IDE/Editor**: VS Code
- **Terminal**: iTerm2 + Oh My Zsh
- **Documentation**: Markdown + GitBook
- **Collaboration**: Slack + Discord

---

## 🛠️ DevOps Command Reference

### 👤 Linux User Management

```bash
# User creation with shell
sudo useradd -s /sbin/nologin username

# Set password expiry
sudo chage -E YYYY-MM-DD username

# SSH key management
ssh-keygen -t rsa -b 4096
ssh-copy-id user@server
```

### 🔒 SSH Security

```bash
# Disable root SSH login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Restart SSH service
sudo systemctl restart sshd

# Change SSH port
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
```

### 📜 Script Permissions

```bash
# Set execute permissions
chmod +x script.sh

# Set SUID for privilege escalation
chmod u+s script.sh

# Add to sudoers for passwordless execution
echo "username ALL=(ALL) NOPASSWD: /path/to/script" | sudo tee /etc/sudoers.d/username
```

### ⏰ Cron Job Management

```bash
# Install cronie package
sudo yum install -y cronie

# Start and enable cron daemon
sudo systemctl start crond
sudo systemctl enable crond

# Edit cron jobs
crontab -e

# List cron jobs
crontab -l

# Cron syntax
# */5 * * * * [command] = Every 5 minutes
# 0 * * * * [command] = Every hour
# 0 0 * * * [command] = Every day
# 0 0 * * 0 [command] = Every Sunday

# View cron logs
tail -f /var/log/cron
journalctl -u crond -f
```

---

## 🎯 Achievement Milestones

### 🏅 Linux Administration Badge (Days 1-25)

- ✅ **User Management Specialist** (Days 1-4)
- ✅ **Security Framework Foundation** (Day 5)
- 🔄 **Task Scheduling & Automation Expert** (Days 6-10)
- ⏳ **Network Services Administrator** (Days 11-15)
- ⏳ **System Monitoring Specialist** (Days 16-20)
- ⏳ **Backup & Recovery Expert** (Days 21-25)

### 🐳 Container Mastery Badge (Days 26-40)

- ⏳ **Docker Fundamentals** (Days 26-30)
- ⏳ **Container Orchestration** (Days 31-35)
- ⏳ **Docker Security** (Days 36-40)

### ⚙️ CI/CD Pipeline Badge (Days 41-60)

- ⏳ **Build Automation** (Days 41-45)
- ⏳ **Testing Integration** (Days 46-50)
- ⏳ **Deployment Strategies** (Days 51-55)
- ⏳ **Pipeline Optimization** (Days 56-60)

---

## 📈 Learning Strategy

### 🎯 Daily Routine

- **Morning**: Review previous day's concepts
- **Daytime**: Complete challenge and document solution
- **Evening**: Reflect on learnings and plan next day

### 📚 Documentation Approach

- **Problem Statement**: Clear understanding of requirements
- **Solution Process**: Step-by-step implementation
- **Troubleshooting**: Issues encountered and solutions
- **Key Learnings**: Concepts and commands mastered
- **Future Applications**: How skills apply to real scenarios

### 🔗 Knowledge Integration

- Connect concepts across different domains
- Build on previous days' learning
- Create mental models for complex systems
- Develop problem-solving patterns

---

## 🎓 Success Metrics

### 📊 Technical Skills

- **Command Proficiency**: Speed and accuracy with CLI tools
- **System Understanding**: Deep knowledge of Linux internals
- **Security Practices**: Implementation of security best practices
- **Automation Skills**: Scripting and workflow automation

### 🚀 Soft Skills

- **Problem Solving**: Analytical thinking and debugging
- **Documentation**: Clear and comprehensive documentation
- **Continuous Learning**: Ability to learn new technologies quickly
- **System Thinking**: Understanding complex system interactions

---

## 🔗 Quick Navigation

### 📅 Daily Challenges

- [✅ Days 1-7: Completed](#-completed-days-7100)
- [📅 Days 8-25: Linux Foundation](#-phase-1-linux-foundation-days-1-25)
- [🐳 Days 26-40: Container Technologies](#-phase-2-container-technologies-days-26-40)
- [⚙️ Days 41-60: CI/CD & Automation](#-phase--automation-days-3-cicd41-60)

### 📊 Progress & Analytics

- [📈 Progress Statistics](#-progress-statistics)
- [🎯 Achievement Milestones](#-achievement-milestones)
- [📈 Learning Strategy](#-learning-strategy)

---

## 🎯 Next 7 Days Plan

### 📅 Immediate Focus

1. **Day 6**: ✅ Cron job creation and management
2. **Day 7**: ✅ Ansible installation and configuration
3. **Day 8**: SSH key-based authentication
4. **Day 9**: File system management and partitioning
5. **Day 10**: Process monitoring and management
6. **Day 11**: Network configuration basics
7. **Day 12**: Firewall setup and security rules

### 🎯 Weekly Goals

- ✅ Complete Linux security foundations
- ✅ Master system automation and cron jobs
- ✅ Begin Infrastructure as Code with Ansible
- 🔄 Understand network configuration
- ⏳ Build monitoring and observability foundation

---

> **The journey of 100 days begins with a single command.** Each completed challenge builds the foundation for DevOps mastery and opens new opportunities in the world of modern infrastructure.

---

_100 Days of DevOps v1.0 | Started: 25-01-2026 | Current Day: 7 | Estimated Completion: 05-05-2026_
