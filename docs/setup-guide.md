# 📖 Setup Guide

## 🚀 Quick Start Guide

This guide helps you set up the unified technical challenges repository for optimal learning experience across Linux, Docker, and DevOps challenges.

---

## 📋 Prerequisites

### 🔧 System Requirements
- **Operating System**: Linux/macOS/Windows with WSL2
- **Terminal**: Modern terminal with SSH support
- **Text Editor**: VS Code (recommended) or similar
- **Version Control**: Git installed and configured
- **Internet Access**: For documentation and external resources

### 🌐 Platform Access
- **KodeKloud Engine**: Access to Linux training environment
- **Docker Hub**: Account for container image management
- **GitHub**: Account for version control and collaboration

---

## 🛠️ Environment Setup

### 📦 Software Installation

#### Git Configuration
```bash
# Configure Git identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure default editor
git config --global core.editor "code --wait"

# Configure line endings (Windows)
git config --global core.autocrlf true
```

#### VS Code Setup
```bash
# Install recommended extensions
code --install-extension ms-vscode.vscode-markdown
code --install-extension ms-vscode.vscode-yaml
code --install-extension ms-vscode.remote-ssh
code --install-extension ms-azuretools.vscode-docker
```

#### Terminal Enhancements
```bash
# Install Oh My Zsh (Linux/macOS)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install useful plugins
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
```

---

## 🗂️ Repository Structure

### 📁 Understanding the Layout

```
technical-challenges/
├── README.md                    # Main repository overview
├── progress/                    # Progress tracking system
│   ├── overview.md             # Global progress summary
│   ├── linux-progress.md       # Linux-specific progress
│   ├── docker-progress.md      # Docker-specific progress
│   └── devops-progress.md      # DevOps 100-days progress
├── challenges/                  # All challenge content
│   ├── linux/                   # Linux challenges
│   │   ├── README.md           # Linux index and overview
│   │   └── retos/              # Individual Linux challenges
│   ├── docker/                  # Docker challenges
│   │   ├── README.md           # Docker index and overview
│   │   └── challenges/         # Individual Docker challenges
│   └── devops/                  # DevOps challenges
│       ├── README.md           # DevOps index and overview
│       └── days/               # Daily DevOps challenges
├── templates/                   # Reusable templates
│   ├── challenge-template.md   # Universal challenge template
│   ├── linux-challenge.md      # Linux-specific template
│   ├── docker-challenge.md     # Docker-specific template
│   └── command-reference.md    # Command cheat sheet
├── assets/                      # Shared resources
│   ├── images/                 # Screenshots and diagrams
│   ├── scripts/                # Automation scripts
│   └── configs/                # Configuration files
└── docs/                       # Additional documentation
    ├── setup-guide.md          # This file
    ├── best-practices.md       # Learning best practices
    └── troubleshooting.md      # Common issues and solutions
```

---

## 🎯 Workflow Setup

### 📚 Daily Learning Routine

#### 🌅 Morning Preparation (5 minutes)
1. **Review Previous Day**: Check yesterday's completed challenge
2. **Identify Today's Goal**: Select today's challenge from progress tracker
3. **Prepare Environment**: Ensure necessary tools and access

#### 📝 Challenge Execution (15-30 minutes)
1. **Read Requirements**: Understand challenge objectives
2. **Execute Solution**: Follow step-by-step implementation
3. **Verify Results**: Confirm successful completion
4. **Document Learning**: Update challenge documentation

#### 🌆 Evening Reflection (5 minutes)
1. **Update Progress**: Mark challenge as completed
2. **Review Learnings**: Identify key takeaways
3. **Plan Tomorrow**: Select next day's challenge

### 🔄 Documentation Workflow

#### Creating New Challenges
```bash
# 1. Choose appropriate template
cp templates/linux-challenge.md challenges/linux/retos/new-challenge.md

# 2. Customize challenge content
# Edit the new challenge file with specific details

# 3. Update progress trackers
# Update relevant progress files in progress/

# 4. Commit changes
git add .
git commit -m "feat: Add Linux Challenge XX - Title"
```

#### Updating Progress
```bash
# Update progress files
vim progress/linux-progress.md    # For Linux challenges
vim progress/docker-progress.md   # For Docker challenges
vim progress/devops-progress.md   # For DevOps challenges
vim progress/overview.md          # For global overview
```

---

## 🔧 Tool Configuration

### 🐧 Linux Environment Setup

#### SSH Key Management
```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy to remote servers
ssh-copy-id user@server

# Test connection
ssh user@server
```

#### Essential Linux Tools
```bash
# Install useful tools
sudo apt update && sudo apt install -y \
    htop tree curl wget vim git \
    tmux screen ncdu \
    net-tools dnsutils

# Or for RHEL/CentOS
sudo yum update && sudo yum install -y \
    htop tree curl wget vim git \
    tmux screen ncdu \
    net-tools bind-utils
```

### 🐳 Docker Environment Setup

#### Docker Installation Verification
```bash
# Check Docker installation
docker --version
docker info

# Test Docker functionality
docker run hello-world

# Set up Docker group (if needed)
sudo usermod -aG docker $USER
newgrp docker
```

#### Docker Configuration
```bash
# Configure Docker daemon
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Restart Docker
sudo systemctl restart docker
```

---

## 📊 Progress Tracking Setup

### 📈 Metrics Configuration

#### Setting Up Personal Goals
```yaml
# ~/.technical-challenges/config.yml
goals:
  daily:
    challenges_per_day: 2
    time_per_challenge: 20
  
  weekly:
    challenges_per_week: 10
    review_sessions: 2
  
  monthly:
    skill_reviews: 1
    milestone_checks: 4

preferences:
  preferred_order:
    - linux
    - docker  
    - devops
  
  difficulty_progression: true
  documentation_level: detailed
```

#### Progress Monitoring Script
```bash
#!/bin/bash
# assets/scripts/progress-check.sh

echo "📊 Technical Challenges Progress Report"
echo "======================================"

# Check completed challenges
completed_linux=$(grep -r "✅ Completed" challenges/linux/ | wc -l)
completed_docker=$(grep -r "✅ Completed" challenges/docker/ | wc -l)
completed_devops=$(grep -r "✅ Completed" challenges/devops/ | wc -l)

echo "🐧 Linux: $completed_linux completed"
echo "🐳 Docker: $completed_docker completed"
echo "⚙️ DevOps: $completed_devops completed"
echo "🎯 Total: $(($completed_linux + $completed_docker + $completed_devops)) completed"
```

---

## 🔗 External Services Setup

### 🌐 KodeKloud Engine Access
1. **Account Setup**: Create KodeKloud account
2. **Lab Access**: Enroll in relevant courses
3. **SSH Keys**: Upload SSH public key for lab access
4. **Bookmark Labs**: Save frequently used lab URLs

### 📋 GitHub Integration
```bash
# Clone repository
git clone https://github.com/yourusername/technical-challenges.git
cd technical-challenges

# Set up remote tracking
git remote add origin https://github.com/yourusername/technical-challenges.git

# Configure GitHub Pages (optional)
git checkout -b gh-pages
git push origin gh-pages
```

### 🐳 Docker Hub Setup
1. **Create Account**: Sign up at [Docker Hub](https://hub.docker.com)
2. **Configure CLI**: Login to Docker Hub locally
   ```bash
   docker login
   ```
3. **Create Repositories**: Set up image repositories for future projects

---

## 🎯 Best Practices

### 📚 Documentation Standards
- **Consistent Format**: Use provided templates for all challenges
- **Detailed Commands**: Include exact commands and outputs
- **Troubleshooting Notes**: Document issues and solutions
- **Learning Reflections**: Capture key takeaways from each challenge

### 🔒 Security Practices
- **SSH Key Management**: Use SSH keys instead of passwords
- **Password Security**: Use password managers for credentials
- **System Isolation**: Use containers or VMs for experiments
- **Backup Regularly**: Commit changes frequently to Git

### ⚡ Efficiency Tips
- **Keyboard Shortcuts**: Learn terminal and editor shortcuts
- **Command History**: Use `Ctrl+R` for command search
- **Tab Completion**: Enable and use tab completion
- **Alias Creation**: Create aliases for frequently used commands

---

## 🐛 Common Setup Issues

### 🔧 SSH Connection Problems
**Issue**: Permission denied when connecting to servers  
**Solution**: Check SSH key permissions and server configuration
```bash
# Fix SSH key permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 700 ~/.ssh
```

### 🐳 Docker Permission Issues
**Issue**: Docker commands require sudo  
**Solution**: Add user to docker group and restart session
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 📦 Package Manager Issues
**Issue**: Package not found errors  
**Solution**: Update package lists and check OS compatibility
```bash
# For Debian/Ubuntu
sudo apt update && sudo apt upgrade

# For RHEL/CentOS  
sudo yum update && sudo yum upgrade
```

---

## 📞 Support and Resources

### 🆘 Getting Help
- **Documentation**: Check `docs/` directory for detailed guides
- **Command Reference**: Use `templates/command-reference.md`
- **Community Forums**: Join relevant DevOps communities
- **Issue Tracking**: Use GitHub issues for repository-specific problems

### 📚 Learning Resources
- **Official Documentation**: Link to official tool documentation
- **Video Tutorials**: Curated list of helpful video content
- **Practice Platforms**: Additional platforms for hands-on practice
- **Books**: Recommended reading for deeper understanding

---

## 🎉 Next Steps

After completing setup:

1. **[ ]** Review repository structure and understand navigation
2. **[ ]** Set up development environment with all required tools
3. **[ ]** Configure progress tracking system
4. **[ ]** Start with your first challenge
5. **[ ]** Establish daily learning routine

> **A well-organized learning environment is the foundation for consistent skill development. Invest time in proper setup to maximize learning efficiency.** 🚀

---

*Setup Guide v1.0 | Last Updated: 27-01-2026 | Repository: Technical Challenges*