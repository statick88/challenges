# AGENTS.md - Guidelines for AI Coding Agents

This file provides comprehensive guidelines for AI agents working in the technical challenges repository - a unified DevOps learning platform containing Linux, Docker, and DevOps challenges.

---

## 🏗️ Repository Overview

### **Project Type**: Technical Documentation & Learning Platform
- **Primary Content**: Markdown files with DevOps challenges and solutions
- **Structure**: Unified repository with three main programs (Linux, Docker, DevOps)
- **Purpose**: Learning progress tracking and knowledge base for technical challenges
- **Target Audience**: DevOps learners and system administrators

### **Directory Structure**:
```
technical-challenges/
├── challenges/          # Challenge content organized by program
│   ├── linux/          # Linux system administration challenges
│   ├── docker/         # Docker containerization challenges
│   └── devops/        # 100 Days DevOps challenges
├── progress/           # Unified progress tracking system
├── templates/          # Reusable documentation templates
├── docs/              # Setup guides and best practices
├── assets/             # Shared resources (images, scripts, configs)
└── README.md           # Main repository portal
```

---

## 🛠️ Build/Lint/Test Commands

### **Markdown Quality Assurance**
```bash
# Validate markdown syntax and links
npm install -g markdownlint-cli2
markdownlint-cli2 "challenges/**/*.md" "docs/**/*.md" "progress/**/*.md"

# Check for broken links
npm install -g markdown-link-check
find . -name "*.md" -exec markdown-link-check {} \;

# Validate front matter consistency
npm install -g front-matter-cli
find challenges/ -name "*.md" -exec front-matter -i {} \;
```

### **Documentation Testing**
```bash
# Test template adherence
python3 -c "
import os, re, json
# Validate challenge template structure
template_keys = ['Objective', 'Infrastructure Details', 'Solution Process', 'Verification']
# Add validation logic here
"

# Verify progress tracking consistency
python3 scripts/validate-progress.py

# Check file naming conventions
find challenges/ -name "*.md" | grep -E "^[a-z0-9-]+\.md$" || echo "Invalid file names found"
```

### **Single Challenge Testing**
```bash
# Test specific challenge file
challenge_file="challenges/linux/retos/01-creacion-usuarios/README.md"
markdownlint-cli2 "$challenge_file"
markdown-link-check "$challenge_file"

# Validate challenge structure
python3 -c "
import re
content = open('$challenge_file').read()
required_sections = ['Objective', 'Implementation', 'Verification']
for section in required_sections:
    if section not in content:
        print(f'Missing required section: {section}')
"
```

### **Repository Health Checks**
```bash
# Check progress synchronization
python3 -c "
import os, re
# Validate progress totals match challenge counts
# Validate completion percentages
"

# Verify template consistency
for template in templates/*.md; do
    markdownlint-cli2 "$template"
done
```

---

## 📋 Code Style Guidelines

### **File Naming Conventions**
- **Kebab-case only**: `day-01-linux-user-setup.md` (not `Day_01_Linux.md`)
- **Descriptive names**: Include challenge type and number
- **Consistent prefixes**:
  - Linux challenges: `XX-challenge-description.md`
  - Docker challenges: `reto-XX-description.md`
  - DevOps challenges: `day-XX-description.md`

### **Markdown Formatting Standards**
- **Headers**: Use `#`, `##`, `###` hierarchy (no HTML headers)
- **Code blocks**: Always specify language: ````bash`, ````yaml`, ````markdown
- **Emojis**: Use strategically for categorization:
  - 🐧 Linux challenges
  - 🐳 Docker challenges  
  - ⚙️ DevOps challenges
  - ✅ Completed, 🔓 Unlocked, 🔒 Locked, ⏳ Ready

### **Front Matter Metadata**
Each challenge file must include standardized metadata:
```yaml
---
title: Challenge Title
date: DD-MM-YYYY
category: #linux #docker #devops #subtopic
difficulty: ⭐⭐⭐ (1-5)
status: ✅ Completed | 🔓 Unlocked | 🔒 Locked | ⏳ Ready | ❌ Failed
duration: XX minutes
---
```

### **Content Structure Requirements**
Every challenge must follow this exact structure:
1. **Objective** - Clear, measurable goal
2. **Infrastructure Details** - Server IP, credentials, environment
3. **Solution Process** - Step-by-step implementation
4. **Verification** - Commands to validate success
5. **Troubleshooting** - Issues encountered and solutions
6. **Key Learnings** - Concepts mastered
7. **Time Tracking** - Start/end times and duration

---

## 🔧 Import and Formatting Rules

### **Markdown Imports**
- **No file imports** using `{{ include }}` or similar syntax
- **Relative links only**: Use `../templates/command-reference.md`
- **No absolute URLs** for internal links
- **Image paths**: Use relative paths `assets/images/screenshot.png`

### **Code Block Standards**
- **Always specify language**: ````bash``, ````yaml``, etc.
- **Include comments** explaining complex commands:
  ```bash
  # Create user with custom UID and home directory
  useradd -u 1467 -d /var/www/javed -m javed
  ```
- **Real outputs**: Show actual command outputs when helpful
- **Error examples**: Include common errors and solutions

### **Table Formatting**
- **Pipe tables** for structured data
- **Consistent alignment**: Left-align text, right-align numbers
- **Markdown compatibility**: Ensure proper table syntax

---

## 🏷️ Naming Conventions

### **Directory Names**
- **Lowercase only**: `challenges/`, `progress/`, `templates/`
- **Single words**: Avoid spaces, use hyphens if needed
- **Descriptive names**: `assets/`, `docs/`, `templates/`

### **Variable and Function Names**
In scripts and automation files:
- **snake_case**: `user_creation_script.py`, `progress_tracker.py`
- **Descriptive names**: `validate_challenge_structure.py`
- **Consistent patterns**: `check_`, `validate_`, `update_` prefixes

### **Git Branch Names**
- **kebab-case**: `feature/new-challenge-template`
- **Descriptive**: `fix/progress-calculation-bug`
- **Program prefixes**: `linux/add-challenge-05`, `docker/update-reto-2`

---

## ⚠️ Error Handling Guidelines

### **Validation Requirements**
- **Always validate** user input in scripts
- **Check file existence** before operations:
  ```python
  if not os.path.exists(challenge_file):
      raise FileNotFoundError(f"Challenge file not found: {challenge_file}")
  ```
- **Graceful failures**: Provide helpful error messages
- **Logging**: Use structured logging for debugging

### **Common Error Patterns**
- **Missing sections**: Validate required challenge sections exist
- **Broken links**: Check all internal links before commit
- **Invalid metadata**: Validate front matter fields
- **Inconsistent formatting**: Use markdownlint for validation

### **Error Recovery**
- **Backup before changes**: Always create backups before modifications
- **Rollback capability**: Maintain git history for easy reverts
- **Incremental validation**: Check each change individually

---

## 📊 Quality Assurance Process

### **Pre-commit Checklist**
- [ ] Markdown syntax validation with markdownlint
- [ ] Link checking with markdown-link-check
- [ ] Template structure validation
- [ ] File naming convention compliance
- [ ] Progress file synchronization
- [ ] Metadata consistency check

### **Automated Validation**
```bash
# Run full validation suite
./scripts/validate-all.sh

# Quick validation for single file
./scripts/validate-challenge.sh challenges/linux/new-challenge.md
```

### **Manual Review Points**
- **Content accuracy**: Technical commands are correct
- **Clarity**: Instructions are clear and unambiguous
- **Completeness**: All required sections present
- **Consistency**: Formatting matches repository standards

---

## 🔒 Security Guidelines

### **Sensitive Data Handling**
- **Never commit**: SSH keys, passwords, personal tokens
- **Training credentials**: OK to include (learning purpose)
- **Use .gitignore**: Exclude sensitive files and patterns
- **Environment variables**: Use for secret management in scripts

### **Training Environment Safety**
- **Isolated labs**: Use dedicated training environments
- **Non-production**: Never use production credentials
- **Clear documentation**: Mark all training credentials clearly
- **Regular rotation**: Update training credentials periodically

---

## 📝 Documentation Updates

### **Progress Tracking**
- **Always update**: progress/ files when completing challenges
- **Consistent metrics**: Use same format across all progress files
- **Synchronization**: Keep overview.md in sync with individual progress files
- **Accuracy**: Double-check completion percentages

### **Template Maintenance**
- **Version control**: Tag template versions for reproducibility
- **Consistency**: Apply template updates to existing challenges
- **Documentation**: Update template documentation when making changes
- **Testing**: Validate template changes before applying broadly

---

## 🤝 Collaboration Guidelines

### **Contribution Standards**
- **Follow templates**: Use existing templates for new content
- **Maintain consistency**: Preserve established patterns
- **Documentation updates**: Update related files when making changes
- **Quality first**: Ensure all contributions meet quality standards

### **Code Review Checklist**
- [ ] Template adherence
- [ ] Markdown syntax validity
- [ ] Link integrity
- [ ] Progress file updates
- [ ] Security compliance
- [ ] Documentation completeness

---

## 🚀 Performance Guidelines

### **Repository Optimization**
- **File size limits**: Keep individual markdown files under 200KB
- **Image optimization**: Compress images in assets/
- **Link depth**: Avoid deeply nested directory structures
- **Search efficiency**: Use descriptive filenames for easy discovery

### **Automation Best Practices**
- **Idempotent operations**: Scripts should be safe to run multiple times
- **Atomic changes**: Make related changes in single commits
- **Validation first**: Check preconditions before making changes
- **Rollback ready**: Ensure changes can be easily reverted

---

*AGENTS.md v1.0 | Last Updated: 2026-01-28 | Repository: Technical Challenges*