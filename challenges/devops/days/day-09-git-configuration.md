---
title: "Configuración de Git Global y Usuario"
category: devops
day: 9
difficulty: 1
tags:
  - devops
  - git
  - configuracion
date: 2026-02-05
status: ready
---

# 🎓 Día 9: Fundamentos de Git para DevOps

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "Git no es solo control de versiones - es el sistema de verdad única de tu organización. Cada commit es un paso auditable hacia el estado deseado de tu infraestructura y aplicaciones."

Hoy configuramos Git - la herramienta fundamental que conecta todo en DevOps. Es el puente entre el código y la infraestructura, entre desarrollo y operaciones.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Día 8**: Usuario `deploy` con permisos sudo para git
- **Hoy**: Configuramos Git para que ese usuario pueda operar
- **Día 10**: SSH sin contraseña para conectar con repositorios

### Progresión hacia el Pipeline CI/CD

Git es el corazón de:

- **Source Control**: Todo código e infraestructura versionada
- **CI/CD Triggers**: Pipelines que se ejecutan en cada commit
- **GitOps**: La infraestructura como código vive en Git

### Escenario Empresarial

El usuario `deploy` necesita:

1. Identidad clara para commits (auditoría)
2. Configuración consistente en todos los servidores
3. Integración con el pipeline de CI/CD

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Git como **Single Source of Truth**:

- **Desarrolladores**: Commitean código, crean pull requests
- **Operaciones**: Revisan cambios de infraestructura
- **Todos**: Tienen visibilidad del historial y cambios

### Automatización

```bash
# Sin Git (caos):
# - Script_en_producción_v3_final_REAL.sh
# - "Funcionaba ayer, ¿qué cambió?"

# Con Git (trazabilidad):
git log --oneline --all
# abc1234 Fix database connection
# def5678 Update nginx configuration
```

### Métricas y Calidad

- **Commit Frequency**: Qué tan activo es el desarrollo
- **Lead Time**: Tiempo desde commit hasta producción
- **Rollback Time**: Tiempo para revertir un cambio problemático

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Verificar Instalación de Git

```bash
# Conectar al servidor
ssh tony@stapp01.xfusioncorp.com

# Verificar git instalado
git --version
```

**Análisis DevOps**: Git suele venir pre-instalado en servidores modernos. Si no:

```bash
sudo yum install -y git  # RHEL/CentOS
sudo apt install -y git  # Debian/Ubuntu
```

### Paso 2: Configurar Identidad Global

```bash
# Configurar nombre (aparece en commits)
git config --global user.name "Deploy User"

# Configurar email (identificación única)
git config --global user.email "deploy@xfusioncorp.com"
```

**Análisis DevOps**:

- **Auditoría**: Cada commit tiene autor identificable
- **Diferenciación**: Distinguir commits humanos vs. automatizados
- **Comunicación**: Email para notificaciones de CI/CD

### Paso 3: Configurar Editor por Defecto

```bash
# Configurar editor para mensajes de commit interactivos
git config --global core.editor nano

# Alternativas comunes:
# git config --global core.editor vim
# git config --global core.editor "code --wait"  # VS Code
```

**Análisis DevOps**: El editor afecta experiencia en:

- `git commit` (sin mensaje, abre editor)
- `git rebase -i` (rebase interactivo)
- `git add -p` (staging parcial)

### Paso 4: Configuraciones Adicionales Recomendadas

```bash
# Colores en output (mejor legibilidad)
git config --global color.ui auto

# Branch principal por defecto
git config --global init.defaultBranch main

# Aliases útiles (opcional pero productivo)
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

**Análisis DevOps**: Pequeñas mejoras en productividad se acumulan:

- `git st` en lugar de `git status`
- `git co feature-branch` más rápido

### Paso 5: Verificación Completa

```bash
# Listar toda la configuración
git config --list

# Salida esperado:
# user.name=Deploy User
# user.email=deploy@xfusioncorp.com
# core.editor=nano
# color.ui=auto
```

**Verificación específica**:

```bash
# Verificar configuración individual
git config user.name
git config user.email
```

---

## ✅ Criterios de Éxito

- [x] Git instalado y funcionando
- [x] `user.name` configurado globalmente
- [x] `user.email` configurado globalmente
- [x] `core.editor` configurado
- [x] Configuración verificada con `git config --list`
- [x] Identidad clara para auditoría de commits

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Global vs Local Config**:
   - `--global`: Aplica a todos los repositorios del usuario (`~/.gitconfig`)
   - `--local`: Solo para repositorio específico (`.git/config`)
   - `--system`: Para todos los usuarios del sistema

2. **Git Identity in CI/CD**:

   ```bash
   # En pipelines, configurar identidad antes de commits automáticos
   git config user.name "CI/CD Pipeline"
   git config user.email "ci@company.com"
   ```

3. **Configuration Files**:
   - Sistema: `/etc/gitconfig`
   - Global: `~/.gitconfig`
   - Local: `.git/config`

### 🚨 Troubleshooting DevOps

**Problema**: Commits aparecen como "Unknown"

- **Causa**: `user.name` o `user.email` no configurados
- **Solución**: Configurar antes de hacer commits

**Problema**: Editor no se abre

- **Causa**: Editor configurado no instalado
- **Solución**: Verificar instalación o cambiar editor

### 💡 Mejores Prácticas

1. **Emails Corporativos**: Usar email de la organización

   ```bash
   git config --global user.email "nombre.apellido@company.com"
   ```

2. **Identidad Consistente**: Misma identidad en todos los servidores

   ```bash
   # Script de setup
   git config --global user.name "$DEPLOY_USER_NAME"
   git config --global user.email "$DEPLOY_USER_EMAIL"
   ```

3. **SSH vs HTTPS**: Para CI/CD, SSH es preferible (Día 10)

4. **Ansible Automation**:
   ```yaml
   - name: Configure git global settings
     git_config:
       name: user.name
       value: "Deploy User"
       scope: global
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 10** configura SSH sin contraseña - esencial para:

- Clonar repositorios privados automáticamente
- Pull/push sin intervención humana
- CI/CD pipelines que acceden a múltiples repos

**Conexión**: Git configurado + SSH sin contraseña = Autenticación completa para automatización.

---

## 📚 Recursos DevOps

- [Pro Git Book](https://git-scm.com/book/en/v2)
- [Git Configuration Documentation](https://git-scm.com/docs/git-config)
- [GitHub Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

## 📊 Seguimiento de Progreso

- **Día**: 9 de 100
- **Bloque**: Control de Versiones
- **Progresión**: 1-8 → 9 → 10 (Infraestructura → Git → SSH)
- **Habilidad**: Configuración de identidad para commits

**¡Listo! Tu infraestructura ahora tiene identidad en el sistema de control de versiones.** 📚
