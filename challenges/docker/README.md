# 🐳 Docker Challenge Memories

## 📋 Overview

Repository containing Docker containerization challenges and solutions, demonstrating practical skills in container management, deployment, and troubleshooting.

---

## 📚 Challenges Index

### ✅ Completed Challenges (3/5)

| # | Challenge | Status | Difficulty | Skills | XP |
|---|-----------|--------|------------|-------|----|
| 1 | [Install Docker Packages](challenges/reto-1-install-docker.md) | ✅ | ⭐⭐⭐ | Docker Installation | 60 |
| 2 | [Deploy Nginx Container](challenges/reto-2-deploy-nginx.md) | ✅ | ⭐⭐ | Container Deployment | 60 |
| 3 | [Delete Docker Container](challenges/reto-3-delete-containers.md) | ✅ | ⭐⭐ | Container Cleanup | 60 |

### ⏳ Ready to Start (2/5)

| # | Challenge | Status | Difficulty | Focus Area | XP |
|---|-----------|--------|------------|------------|-----|
| 4 | [Copy File to Container](challenges/reto-4-copy-files.md) | ⏳ | ⭐⭐ | File Management | 60 |
| 5 | [Troubleshoot Container](challenges/reto-5-troubleshoot.md) | ⏳ | ⭐⭐⭐ | Debugging | 60 |

---

## 📊 Progress Statistics

### 🎯 Completion Metrics
- **Total Challenges**: 5
- **Completed**: 3 ✅ (60%)
- **Failed**: 0 ❌ (0%)
- **Remaining**: 2 ⏳ (40%)
- **Total XP Earned**: 180/300 (60%)

### 📈 Skill Development
- **Docker Installation**: 100% ✅
- **Container Management**: 100% ✅
- **Container Operations**: 60% 🔄
- **Troubleshooting**: 0% ⏳

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
- [ ] Understand Docker networking
- [ ] Use Docker volumes

### 🚀 Docker Advanced Badge
- [ ] Build custom images
- [ ] Use Docker Compose
- [ ] Implement multi-container apps
- [ ] Optimize image size
- [ ] Debug container issues

---

## 📈 Skill Roadmap

### 🌱 Beginner Level (Current)
- **Docker Installation** ✅
- **Basic Container Operations**
- **Image Management**
- **Simple Networking**

### 🚀 Intermediate Level (Next Steps)
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

### 🚀 Immediate Goal
Complete **Challenge 4 - Copy File to Container** to master file operations in Docker containers.

### 📋 Recommended Sequence
1. **Challenge 4**: Learn container file operations
2. **Challenge 5**: Develop troubleshooting skills
3. **Reto 6+**: Advanced Docker topics (Dockerfile, Docker Compose)

---

> **Note**: Docker skills are essential for modern DevOps practices. These challenges build foundational knowledge for containerized application deployment and microservices architecture.

---

*Docker Challenge Memories v1.0 | Last Updated: 30-01-2026 | Challenges Completed: 3/5