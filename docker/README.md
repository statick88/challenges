# 🐳 Docker Challenge Memories

## 📋 Overview

Repository containing Docker containerization challenges and solutions, demonstrating practical skills in container management, deployment, and troubleshooting.

---

## 📚 Challenges Index

### ✅ Completed Challenges (6/6)

| # | Challenge | Status | Difficulty | Skills | XP |
|---|-----------|--------|------------|-------|----|
| 1 | [Install Docker Packages](challenges/reto-1-install-docker.md) | ✅ | ⭐⭐⭐ | Docker Installation | 60 |
| 2 | [Deploy Nginx Container](challenges/reto-2-deploy-nginx.md) | ✅ | ⭐⭐ | Container Deployment | 60 |
| 3 | [Delete Docker Container](challenges/reto-3-delete-containers.md) | ✅ | ⭐⭐ | Container Cleanup | 60 |
| 4 | [Copy File to Container](challenges/reto-4-copy-files.md) | ✅ | ⭐⭐ | File Management | 60 |
| 5 | [Troubleshoot Container](challenges/reto-5-troubleshoot.md) | ✅ | ⭐⭐⭐ | Debugging | 60 |
| 6 | [Troubleshoot Volume & Port](challenges/reto-6-troubleshoot-volume-port.md) | ✅ | ⭐⭐⭐ | Volumes & Ports | 60 |

---

## 🏆 KodeKloud Certification

### ✅ Certification Completed (9/9)

| # | Challenge | Status | Weight | Skills |
|---|-----------|--------|--------|--------|
| 1 | Deploy Nginx Container | ✅ | 10 | Container Creation |
| 2 | Create Debug Container (Custom CMD) | ✅ | 10 | CMD Override |
| 3 | Copy File Container → Host | ✅ | 10 | docker cp |
| 4 | Copy File Host → Container | ✅ | 10 | docker cp + mkdir |
| 5 | Pull Docker Images | ✅ | 10 | docker pull |
| 6 | Save Image as Tar | ✅ | 20 | docker save |
| 7 | Delete Docker Network | ✅ | 10 | docker network rm |
| 8 | Create Custom Network | ✅ | 10 | docker network create |
| 9 | Troubleshoot Volume & Port | ✅ | 10 | Diagnostics |

📄 **[View Full Certification](certification-docker-kodekloud.md)** | **Score: 100/100** 🎉

### 📜 Certificate Files
- **Verification URL**: [Verify Certificate](https://engineer.kodekloud.com/certificate-verification/86476a89-ea7b-4e3a-a901-85cec28a00ca)
- **Certificate ID**: `86476a89-ea7b-4e3a-a901-85cec28a00ca`
- **Files**: [PNG](certificates/kodekloud-docker-certificate.png) | [PDF](certificates/kodekloud-docker-certificate.pdf)

---

## 📊 Progress Statistics

### 🎯 Completion Metrics
- **Total Challenges**: 6
- **Completed**: 6 ✅ (100%)
- **Failed**: 0 ❌ (0%)
- **Total XP Earned**: 360/360 (100%)
- **KodeKloud Certification**: 100/100 ✅

### 📈 Skill Development
- **Docker Installation**: 100% ✅
- **Container Management**: 100% ✅
- **Volume Configuration**: 100% ✅
- **Port Mapping**: 100% ✅
- **Container Operations**: 100% ✅
- **Troubleshooting**: 100% ✅
- **Image Management**: 100% ✅
- **Docker Networking**: 100% ✅

---

## 🏗️ Docker Environment

### 🌐 Target Infrastructure
| Component | Version | Purpose |
|-----------|---------|---------|
| **Host OS** | CentOS Stream 9 | Container Host |
| **Docker Engine** | 29.2.0 | Container Runtime |
| **Docker Compose** | TBD | Multi-container |
| **Registry** | Docker Hub | Image Repository |
| **Platform** | KodeKloud Engine | Training Environment |

### 📋 Server Configuration
| Server | IP | Hostname | User | Password | Role |
|--------|----|----------|------|----------|------|
| stapp01 | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony | Ir0nM@n | Docker Host |

---

## 🛠️ Docker Command Reference

### 📦 Installation Commands
```bash
# Install Docker on CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker tony
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

### 🐋 Container Management
```bash
# List containers
docker ps -a

# Run container
docker run -d --name container-name image:tag

# Stop container
docker stop container-name

# Remove container
docker rm container-name

# Copy files to/from container
docker cp source-file container:/destination
docker cp container:source-file destination
```

### 📊 System Management
```bash
# System information
docker info
docker system df
docker system events

# Resource monitoring
docker stats
docker top container-name
```

---

## 🐛 Common Issues & Solutions

### ⚠️ Package Manager Issues
**Problem**: Using `apt` on CentOS systems  
**Solution**: Use `yum` for RHEL/CentOS, `apt` for Debian/Ubuntu  
**Verification**: `cat /etc/os-release`

### 🔐 Permission Issues
**Problem**: Docker daemon permission denied  
**Solution**: Add user to docker group and restart session  
**Commands**: `sudo usermod -aG docker $USER`

### 🌐 Network Issues
**Problem**: Port conflicts during deployment  
**Solution**: Check port usage with `netstat -tulpn` or `ss -tulpn`

---

## 📚 Learning Resources

### 📖 Official Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Docker Get Started](https://docs.docker.com/get-started/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### 🎓 Training Platforms
- [KodeKloud Docker Course](https://kodekloud.com/courses/docker/)
- [Docker Captain's Blog](https://blog.docker.com/)

### 🛠️ Practical Guides
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

---

## 🏆 Achievement Milestones

### 🎯 Docker Fundamentals Badge
- [x] Install Docker Engine
- [x] Create and deploy containers
- [x] Manage container lifecycle
- [x] Understand Docker networking (port mapping)
- [x] Use Docker volumes (bind mounts)
- [x] Image management (pull, save)
- [x] Docker networking (create, delete, custom subnet)

### 🚀 Docker Advanced Badge
- [ ] Build custom images
- [ ] Use Docker Compose
- [ ] Implement multi-container apps
- [ ] Optimize image size
- [ ] Debug container issues

---

## 📈 Skill Roadmap

### 🌱 Beginner Level ✅ COMPLETED
- **Docker Installation** ✅
- **Basic Container Operations** ✅
- **Image Management** ✅
- **Simple Networking** ✅

### 🚀 Intermediate Level (Current Goal)
- **Docker Compose**
- **Multi-container Applications**
- **Volume Management**
- **Custom Networks**

### 🏆 Advanced Level (Future Goals)
- **Dockerfile Optimization**
- **Multi-stage Builds**
- **Security Best Practices**
- **Performance Tuning**

---

## 🔗 Quick Navigation

### 📋 Challenge Categories
- [🔧 Installation & Setup](#-completed-challenges-15) - Challenge 1
- [🐋 Container Operations](#-prepared-challenges-35) - Challenges 2-5
- [🔍 Troubleshooting](#-prepared-challenges-35) - Challenge 5

### 📊 Progress Tracking
- [📈 Statistics](#-progress-statistics)
- [🎯 Skill Development](#-skill-roadmap)
- [🏆 Achievements](#-achievement-milestones)

---

## 🎯 Next Steps

### 🎉 All Challenges Completed!
All 6 Docker challenges and KodeKloud Certification (9/9) have been successfully completed.

### 📋 Recommended Next Topics
1. **Dockerfile Creation**: Build custom images with Dockerfile
2. **Docker Compose**: Orchestrate multi-container applications
3. **Docker Swarm**: Container orchestration at scale
4. **Kubernetes**: Advanced container orchestration

---

> **Note**: Docker skills are essential for modern DevOps practices. These challenges build foundational knowledge for containerized application deployment and microservices architecture.

---

*Docker Challenge Memories v1.1 | Last Updated: 18-02-2026 | Challenges Completed: 6/6 | Certification: 100/100 ✅ | Certificate ID: 86476a89-ea7b-4e3a-a901-85cec28a00ca*