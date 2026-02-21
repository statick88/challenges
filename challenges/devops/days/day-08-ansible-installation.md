---
title: "Day 8: Install Ansible"
category: devops
day: 8
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

# Day 8: Install Ansible

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "La verdadera infraestructura inmutable no se configura manualmente. Ansible es tu 'documentación ejecutable' - defines el estado deseado y la herramienta lo hace realidad, idempotentemente, en 1 o 1000 servidores."

Hoy instalamos **Ansible** - la herramienta que transformará cómo gestionas infraestructura. Hiciste deployments manuales en los días anteriores; ahora aprenderás a hacerlos con código.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-6**: Configuración manual en múltiples servidores (tedioso, propenso a errores)
- **Hoy**: Instalamos la herramienta de automatización
- **Días 8-15**: Usaremos Ansible para automatizar todo lo aprendido

### Progresión hacia el Pipeline CI/CD

Ansible es el puente entre:

- **Configuración manual** (lo que hiciste hasta ahora)
- **Infrastructure as Code** (definición declarativa)
- **CI/CD Integration** (playbooks en pipelines GitLab/Jenkins)

### Escenario Empresarial

xFusionCorp necesita:

1. Gestión centralizada de configuración
2. Despliegues repetibles y auditables
3. Capacidad de escalar a cientos de servidores

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Ansible como **Single Source of Truth**:

- **Desarrolladores**: Ven exactamente cómo está configurada la infraestructura
- **Operaciones**: No más configuración manual propensa a errores
- **Management**: Auditoría completa de cambios (con Git)

### Automatización

```yaml
# Antes (manual, 3 servidores):
# Conectar a cada servidor, instalar, configurar, verificar
# Tiempo: 30 minutos, riesgo de inconsistencias

# Con Ansible (código, N servidores):
ansible-playbook deploy.yml
# Tiempo: 2 minutos, 100% consistente
```

### Métricas y Calidad

- **Playbook Success Rate**: % de ejecuciones exitosas
- **Idempotency**: ¿Se puede ejecutar múltiples veces sin cambios adicionales?
- **Execution Time**: Cuánto tarda aplicar configuración

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Conectar al Jump Host

```bash
ssh thor@jump_host.stratos.xfusioncorp.com
```

**Análisis DevOps**: El jump host se convierte en nuestro **Ansible Control Node** - desde aquí orquestaremos toda la infraestructura.

### Paso 2: Verificar Prerrequisitos

```bash
# Verificar Python
python3 --version
# Python 3.9.18

# Verificar pip
pip3 --version
# pip 24.0
```

**Requisitos DevOps**:

- Python 3.8+ (Ansible 4.x requiere Python 3)
- pip3 para gestión de paquetes Python
- Conectividad SSH a nodos destino (ya configurada)

### Paso 3: Instalar Ansible 4.9.0

```bash
pip3 install ansible==4.9.0
```

**Salida esperada**:

```
Successfully installed ansible-4.9.0 ansible-core-2.11.12
```

**Por qué versión específica**:

- **Reproducibilidad**: Misma versión en todos los entornos
- **Compatibilidad**: Evitar breaking changes
- **Compliance**: Versiones auditadas y aprobadas

**En Pipeline CI/CD**:

```yaml
# requirements.txt
ansible==4.9.0

# Instalación
pip install -r requirements.txt
```

### Paso 4: Instalación Global (Todos los Usuarios)

```bash
sudo pip3 install ansible==4.9.0
```

**Análisis DevOps**: Instalación global asegura que:

- Todos los usuarios del sistema puedan usar Ansible
- Los scripts de automatización funcionen sin importar quién los ejecute
- Los playbooks CI/CD tengan acceso al binario

### Paso 5: Configurar secure_path

```bash
sudo visudo

# Modificar o agregar:
Defaults    secure_path="/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin"
```

**Problema resuelto**: `sudo: ansible: command not found`

**Análisis DevOps**: El PATH de sudo es diferente al del usuario normal. Esta configuración asegura que Ansible esté disponible incluso cuando usamos sudo.

### Paso 6: Verificación

```bash
# Verificar versión
ansible --version

# Verificar acceso global
sudo -u root ansible --version
```

**Salida esperada**:

```
ansible 4.9.0
  config file = None
  python version = 3.9.18
  ...
```

---

## ✅ Criterios de Éxito

- [x] Ansible 4.9.0 instalado correctamente
- [x] Binario disponible en `/usr/local/bin/ansible`
- [x] Root puede ejecutar Ansible vía sudo
- [x] Python 3.9.18 configurado y funcionando
- [x] secure_path configurado para acceso global
- [x] Verificación exitosa de versión

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Control Node vs Managed Nodes**:
   - **Control Node**: Donde instalas Ansible (jump host)
   - **Managed Nodes**: Servidores que Ansible configura (stapp01, stapp02, stapp03)

2. **Agentless Architecture**: Ansible no requiere agentes en los nodos destino - usa SSH existente.

3. **Idempotencia**: Ejecutar un playbook múltiples veces produce el mismo resultado (no duplica configuraciones).

### 🚨 Troubleshooting DevOps

**Problema**: `ansible: command not found` con sudo

- **Causa**: secure_path no incluye `/usr/local/bin`
- **Solución**: Editar `/etc/sudoers` con `visudo`

**Problema**: Versiones incompatibles

- **Causa**: Ansible 5+ requiere Python 3.9+
- **Solución**: Usar versiones específicas en requirements.txt

### 💡 Mejores Prácticas

1. **Pin Versions**: Siempre especificar versión exacta

   ```bash
   pip install ansible==4.9.0
   ```

2. **Virtual Environments**: Para proyectos aislados

   ```bash
   python3 -m venv ansible-env
   source ansible-env/bin/activate
   pip install ansible==4.9.0
   ```

3. **Inventory File**: Crear archivo de inventario
   ```ini
   # /etc/ansible/hosts
   [appservers]
   stapp01 ansible_host=172.16.238.10
   stapp02 ansible_host=172.16.238.11
   stapp03 ansible_host=172.16.238.12
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 8** usa Ansible para configurar permisos sudo. Verás inmediatamente el valor de la automatización:

```yaml
# Lo que hiciste manualmente en Días 1-6, ahora lo harás así:
- name: Configure sudo permissions
  lineinfile:
    path: /etc/sudoers
    line: "deploy ALL=(ALL) NOPASSWD: /usr/bin/git"
```

**Preparación**: Familiarízate con la sintaxis YAML y conceptos de playbooks.

---

## 📚 Recursos DevOps

- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)
- [Ansible Galaxy](https://galaxy.ansible.com/) - Roles pre-construidos

---

## 📊 Seguimiento de Progreso

- **Día**: 7 de 100
- **Bloque**: Configuration Management
- **Progresión**: 1-6 → 7 → 8-15 (Manual → Ansible → Automatización Total)
- **Herramienta**: Ansible 4.9.0 instalado y listo

**¡Emocionante! Ahora tienes el superpoder de automatizar todo lo aprendido.** 🎭
