---
title: "Instalación de Ansible 4.9.0 en Jump Host"
category: devops
day: 7
difficulty: 2
tags:
  - devops
  - ansible
  - automation
  - pip3
  - configuration-management
date: 2026-02-04
status: completed
---

## 🎯 Objetivo

Instalar Ansible versión 4.9.0 usando pip3 en el Jump Host, garantizando que el binario esté disponible globalmente para todos los usuarios del sistema.

## 🏗️ Detalles de Infraestructura

- **Servidor**: jump_host.stratos.xfusioncorp.com
- **IP**: 172.16.238.3
- **Usuario**: thor
- **Contraseña**: mjolnir123
- **Propósito**: Ansible Controller para gestión de servidores

## 🔧 Proceso de Solución

### Paso 1: Conectar al Jump Host

```bash
ssh thor@jump_host.stratos.xfusioncorp.com
```

### Paso 2: Verificar prerrequisitos

```bash
python3 --version
# Python 3.9.18

pip3 --version
# pip 24.0 from /usr/local/lib/python3.9/site-packages/pip (python 3.9)
```

### Paso 3: Instalar Ansible 4.9.0

```bash
pip3 install ansible==4.9.0
# Successfully installed ansible-4.9.0 ansible-core-2.11.12
```

### Paso 4: Instalar globalmente para todos los usuarios

```bash
# Como root, instalar en /usr/local/bin
sudo pip3 install ansible==4.9.0
```

### Paso 5: Configurar secure_path en sudoers

```bash
sudo visudo
# Modificar secure_path para incluir /usr/local/bin
Defaults    secure_path="/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin"
```

### Paso 6: Verificar acceso global

```bash
sudo -u root ansible --version
```

## ✅ Verificación

- Ansible 4.9.0 instalado correctamente
- Binario en `/usr/local/bin/ansible`
- Root puede ejecutar ansible via sudo
- Python 3.9.18 configurado

## 🐛 Solución de Problemas

**Problema**: `sudo: ansible: command not found`

**Causa**: El secure_path de sudo no incluía `/usr/local/bin`

**Solución**: Editar `/etc/sudoers` y agregar `/usr/local/bin` al secure_path

## 📚 Aprendizajes Clave

- Instalación de paquetes Python con pip3
- Gestión de binarios globales en Linux
- Configuración de PATH para sudo
- Ansible como herramienta de configuration management

## ⏱️ Seguimiento de Tiempo

- **Hora de Inicio**: 11:22
- **Hora de Finalización**: 11:32
- **Duración Total**: 10 minutos

## 🔗 Recursos

- [Documentación oficial de Ansible](https://docs.ansible.com/)
- [Instalación via pip](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-with-pip)
