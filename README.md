# 📚 Cursos - Learning Repository

## 🎯 Overview

Unified learning repository containing hands-on challenges, course notes, and documentation for DevOps, Linux, Docker, and Cybersecurity training.

---

## 📊 Current Progress

| Program | Platform | Progress | Status |
|---------|----------|----------|--------|
| **100 Days of DevOps** | KodeKloud | 10/100 (10%) | 🔄 In Progress |
| **Linux Level 1** | KodeKloud | 7/18 (39%) | 🔄 In Progress |
| **Docker Certification** | KodeKloud | 6/6 (100%) | ✅ Completed |
| **FFUF Module** | HTB Academy | 12/12 (100%) | ✅ Completed |
| **Web Requests** | HTB Academy | 8/8 (100%) | ✅ Completed |
| **Linux Fundamentals** | HTB Academy | 18/18 (100%) | ✅ Completed |
| **Network Enumeration** | HTB Academy | 7/7 (100%) | ✅ Completed |
| **CTF Challenges** | picoCTF | 8/8 (100%) | ✅ Completed |

---

## 📁 Repository Structure

```
cursos/
├── challenges/                    # Hands-on challenges
│   ├── linux/                     # Linux Level 1 (7/18)
│   ├── devops/                    # 100 Days of DevOps (10/100)
│   ├── docker/                    # Docker challenges (6/6) ✅
│   ├── htb/                       # HTB Academy modules
│   └── ctf/                       # CTF writeups (8/8) ✅
│
├── learning-journey/              # Course notes & documentation
│   ├── security/                  # Security courses
│   │   └── ffuf-course/           # FFUF module notes ✅
│   ├── foundations/               # Foundation topics
│   ├── containers/                # Container technologies
│   └── devops-practices/          # DevOps methodologies
│
├── landing-page/                  # Astro frontend dashboard
│   ├── src/                       # Source code
│   └── dist/                      # Build output
│
└── progress/                      # Progress tracking
```

---

## 🏆 Certifications & Achievements

### ✅ Completed

| Certification | Platform | Date | Certificate |
|--------------|----------|------|-------------|
| Docker Fundamentals | KodeKloud | Feb 2026 | [Verify](https://engineer.kodekloud.com/certificate-verification/86476a89-ea7b-4e3a-a901-85cec28a00ca) |
| FFUF Web Fuzzing | HTB Academy | Feb 2026 | [Achievement](https://academy.hackthebox.com/achievement/2300153/54) |
| Web Requests | HTB Academy | Feb 2026 | [Achievement](https://academy.hackthebox.com/achievement/2300153/35) |
| Linux Fundamentals | HTB Academy | Feb 2026 | 18 modules completed |
| Network Enumeration | HTB Academy | Feb 2026 | 7 modules completed |

---

## 📈 Learning Paths

### 🐧 Linux System Administration

| Source | Progress | Focus |
|--------|----------|-------|
| KodeKloud Level 1 | 7/18 (39%) | User management, SSH, Permissions |
| HTB Linux Fundamentals | 18/18 (100%) | Complete Linux basics |

### ⚙️ DevOps Practices

| Source | Progress | Focus |
|--------|----------|-------|
| KodeKloud 100 Days | 10/100 (10%) | Linux, Ansible, Git, Docker, K8s, Jenkins |

### 🐳 Docker & Containers

| Source | Progress | Focus |
|--------|----------|-------|
| KodeKloud Docker | 6/6 (100%) | Installation, Containers, Volumes, Networks |

### 🔒 Cybersecurity

| Source | Progress | Focus |
|--------|----------|-------|
| HTB Academy | 25+ modules | Network enum, Web fuzzing, Linux |
| picoCTF | 8 challenges | Forensics, Crypto, Web, Pwn |

---

## 🔗 Quick Links

### Dashboards
- [Landing Page](./landing-page/) - Interactive progress dashboard (source)
- [Learning Journey](./learning-journey/) - Quarto documentation site

### Course Notes
- [FFUF Course](./learning-journey/security/ffuf-course/) - Web fuzzing techniques
- [Web Requests](./learning-journey/security/web-requests/) - HTTP fundamentals & cURL

### Challenge Repositories
- [Linux Challenges](./challenges/linux/) - KodeKloud Level 1
- [DevOps Challenges](./challenges/devops/) - 100 Days of DevOps
- [Docker Challenges](./challenges/docker/) - Container fundamentals
- [CTF Writeups](./challenges/ctf/) - Security challenges
- [HTB Academy](./challenges/htb/) - Hack The Box modules

---

## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| **Frontend** | Astro, Tailwind CSS |
| **Documentation** | Quarto, Markdown |
| **Learning Platforms** | KodeKloud, HTB Academy, picoCTF |
| **Infrastructure** | Docker, Linux (CentOS/RHEL) |
| **Security** | ffuf, nmap, steghide, exiftool |

---

## 📅 Recent Activity

| Date | Activity | Status |
|------|----------|--------|
| 2026-02-21 | HTB Web Requests Module | ✅ Completed |
| 2026-02-21 | Linux Bash Scripts (Day 10) | ✅ Completed |
| 2026-02-21 | Disable Root SSH Login | ✅ Completed |
| 2026-02-20 | MariaDB Troubleshooting (Day 9) | ✅ Completed |

---

## 🎯 Next Steps

### Immediate Goals
- [ ] Complete Linux Level 1 (11 challenges remaining)
- [ ] Continue 100 Days of DevOps (Day 11: Tomcat Server)
- [ ] Start next HTB Academy module (JavaScript Deobfuscation or SQL Injection Fundamentals)

### Upcoming Modules
- Day 11: Install and Configure Tomcat Server
- Linux Challenge 8: Data Backup for Developer
- HTB: JavaScript Deobfuscation / SQL Injection Fundamentals

---

## 📝 Notes

- All challenges are documented with step-by-step solutions
- Course notes are maintained in Quarto format for easy reading
- Landing page provides real-time progress visualization
- Certifications are verified and documented

---

## Validation

Run quality checks before committing:

```bash
npm run validate              # Structure validation (naming patterns)
npm run validate:frontmatter  # Front matter validation (YAML schema)
npm run validate:consistency  # Cross-file consistency checks
npm run validate:health       # Health report summary
npm run validate:all          # Run all validators
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | No errors (warnings may exist) |
| 1 | Errors found |
| 2 | Fatal system error |

### JSON Output

All validators support `--json` flag for machine-readable output:

```bash
npm run validate -- --json
```

---

*Repository Version: 2.0 | Last Updated: 2026-02-24*
