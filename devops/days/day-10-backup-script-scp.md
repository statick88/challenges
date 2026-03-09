---
title: "Linux Bash Scripts - Website Backup Automation"
category: devops
day: 10
difficulty: 2
tags:
  - devops
  - backup
  - shell-script
  - scp
  - ssh
  - automation
date: 2026-02-21
status: completed
---

# Day 10: Linux Bash Scripts - Backup con SCP

## Automatización de Backups con Copia Remota

---

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "Un backup en un solo lugar es como no tener backup. La regla 3-2-1 dice: 3 copias, 2 medios diferentes, 1 copia offsite. Hoy implementamos la copia offsite automatizada."

---

## 🎭 Escenario Empresarial

**Empresa**: xFusionCorp Industries  
**Proyecto**: Stratos Datacenter - Backup Automation  
**Servidor Origen**: stapp02 (App Server 2)  
**Servidor Destino**: stbkp01 (Nautilus Backup Server)

### Requerimiento

Crear un script `blog_backup.sh` que:

1. Cree archivo zip de `/var/www/html/blog`
2. Guarde en `/backup/` local
3. Copie a servidor de backup sin pedir contraseña
4. No use sudo dentro del script

### Infraestructura

| Servidor | IP | Usuario | Password | Rol |
|----------|------|---------|----------|-----|
| stapp02 | 172.16.238.11 | steve | Am3ric@ | App Server 2 |
| stbkp01 | 172.16.238.16 | clint | H@wk3y3 | Backup Server |

---

## 🛠️ Implementación Ejecutada

### Paso 1: Instalar zip

```bash
ssh steve@stapp02
# Password: Am3ric@

sudo yum install -y zip
```

### Paso 2: Crear Directorios

```bash
sudo mkdir -p /scripts /backup
sudo chown steve:steve /backup
```

### Paso 3: Configurar SSH sin Contraseña

```bash
# Generar clave SSH
ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa

# Copiar clave al backup server
ssh-copy-id clint@stbkp01
# Password: H@wk3y3

# Verificar conexión
ssh clint@stbkp01 "hostname"
# Salida: stbkp01.stratos.xfusioncorp.com
```

### Paso 4: Crear Script

```bash
cat > /scripts/blog_backup.sh << 'EOF'
#!/bin/bash

# Crear directorio backup si no existe
mkdir -p /backup

# Crear archivo zip del blog
zip -r /backup/xfusioncorp_blog.zip /var/www/html/blog

# Copiar al backup server
scp /backup/xfusioncorp_blog.zip clint@stbkp01:/backup/
EOF

chmod +x /scripts/blog_backup.sh
```

### Paso 5: Ejecutar y Verificar

```bash
/scripts/blog_backup.sh

# Verificar local
ls -la /backup/

# Verificar remoto
ssh clint@stbkp01 "ls -la /backup/"
```

---

## 📋 Archivo Final: /scripts/blog_backup.sh

```bash
#!/bin/bash

# Crear directorio backup si no existe
mkdir -p /backup

# Crear archivo zip del blog
zip -r /backup/xfusioncorp_blog.zip /var/www/html/blog

# Copiar al backup server
scp /backup/xfusioncorp_blog.zip clint@stbkp01:/backup/
```

---

## ✅ Verificación

| Ubicación | Archivo | Tamaño |
|-----------|---------|--------|
| stapp02:/backup/ | xfusioncorp_blog.zip | 588 bytes |
| stbkp01:/backup/ | xfusioncorp_blog.zip | 588 bytes |

---

## 🎓 Lecciones Aprendidas

### Conceptos Clave

1. **SSH Key Authentication**: Permite automatización sin prompts de contraseña
2. **zip -r**: Crea archivo recursivo de directorio
3. **scp**: Secure Copy Protocol para transferencia entre servidores
4. **mkdir -p**: Crea directorios sin error si existen

### Comandos Utilizados

| Comando | Propósito |
|---------|-----------|
| `zip -r archivo.zip directorio/` | Crear archivo zip recursivo |
| `scp archivo user@host:/ruta/` | Copiar archivo vía SSH |
| `ssh-keygen -t rsa -N ""` | Generar clave sin passphrase |
| `ssh-copy-id user@host` | Instalar clave pública |

---

## ✅ Estado del Reto

**COMPLETADO** ✅

- 📅 Fecha: 2026-02-21
- ⏱️ Tiempo: 15 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidores: stapp02, stbkp01
