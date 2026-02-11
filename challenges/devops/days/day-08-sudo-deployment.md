---
title: "Configuración de Permisos Sudo para Usuario"
category: devops
day: 8
difficulty: 2
tags:
  - devops
  - linux
  - sudo
  - permisos
date: 2026-02-05
status: ready
---

# 🎓 Día 8: Permisos Sudo y Privilege Escalation

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "El principio de mínimo privilegio no significa 'sin privilegios' - significa 'solo los privilegios necesarios, cuando se necesitan, sin fricción innecesaria'. Un sudo bien configurado es el puente entre seguridad y productividad."

Hoy configuramos permisos sudo granulares - un componente crítico para pipelines CI/CD y operaciones seguras. Este es el fundamento del privilege escalation controlado.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-3**: Usuarios creados, SSH hardening
- **Día 7**: Ansible instalado
- **Hoy**: Configurar escalación de privilegios para automatización

### Progresión hacia el Pipeline CI/CD

Esta configuración permite:

- **CI/CD Runners**: Ejecutar comandos privilegiados sin contraseña
- **Deploy Scripts**: Automatización sin intervención humana
- **Ansible**: Escalación automática con `become: yes`

### Escenario Empresarial

El equipo necesita un usuario `deploy` que pueda:

1. Ejecutar `git` para actualizar código
2. Ejecutar `docker` para desplegar contenedores
3. **Sin contraseña** (para automatización)
4. **Sin acceso root completo** (seguridad)

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Sudo granulado facilita:

- **Desarrolladores**: Despliegues automáticos sin exponer credenciales root
- **Operaciones**: Control sobre qué comandos pueden ejecutarse
- **Seguridad**: Auditoría completa de quién ejecutó qué

### Automatización

```bash
# Antes (interactivo, propenso a errores):
ssh server
sudo comando
# Ingresar contraseña manualmente

# Después (automatizado):
ssh deploy@server
sudo /usr/bin/git pull  # Sin contraseña, solo comandos permitidos
```

### Métricas y Seguridad

- **Sudo Usage**: Frecuencia de uso de comandos sudo
- **Failed Attempts**: Intentos de ejecutar comandos no autorizados
- **Audit Trail**: Logs completos en `/var/log/secure`

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Crear Usuario Deploy

```bash
# Conectar al servidor
ssh tony@stapp01.xfusioncorp.com

# Crear usuario dedicado para despliegues
sudo useradd -m deploy
sudo passwd deploy
```

**Análisis DevOps**:

- Usuario dedicado separa responsabilidades
- `-m` crea directorio home (útil para claves SSH y configuraciones)
- No es root, pero tendrá permisos específicos

### Paso 2: Configurar Sudoers Granular

```bash
# Crear archivo de configuración dedicado
echo "deploy ALL=(ALL) NOPASSWD: /usr/bin/git, /usr/bin/docker" | sudo tee /etc/sudoers.d/deploy
```

**Sintaxis explicada**:

```
deploy    ALL=(ALL)    NOPASSWD: /usr/bin/git, /usr/bin/docker
   │         │            │            └─ Comandos permitidos
   │         │            └─ Sin pedir contraseña
   │         └─ Como cualquier usuario
   └─ Usuario
```

**Análisis DevOps**:

- `NOPASSWD`: Esencial para automatización
- Paths absolutos: `/usr/bin/git` en lugar de `git` (seguridad)
- Archivo separado: `/etc/sudoers.d/deploy` (mejor que editar sudoers principal)

### Paso 3: Validar Configuración

```bash
# Verificar sintaxis correcta
sudo visudo -c
```

**Salida esperada**: `/etc/sudoers: parsed OK`

**⚠️ Crítico**: Un error en sudoers puede bloquear acceso sudo a todos los usuarios.

### Paso 4: Verificar Permisos

```bash
# Listar qué puede hacer el usuario deploy
sudo -l -U deploy
```

**Salida esperada**:

```
User deploy may run the following commands on stapp01:
    (ALL) NOPASSWD: /usr/bin/git
    (ALL) NOPASSWD: /usr/bin/docker
```

### Paso 5: Testing de Automatización

```bash
# Simular ejecución como usuario deploy
sudo -u deploy -i

# Probar comandos permitidos (sin contraseña)
sudo /usr/bin/git --version
sudo /usr/bin/docker --version

# Intentar comando no permitido (debe fallar)
sudo /bin/cat /etc/shadow
# Resultado: Sorry, user deploy is not allowed to execute '/bin/cat /etc/shadow' as root on stapp01
```

---

## ✅ Criterios de Éxito

- [x] Usuario `deploy` creado con directorio home
- [x] Configuración sudo granulada aplicada
- [x] Validación de sintaxis exitosa (`visudo -c`)
- [x] Verificación de permisos con `sudo -l`
- [x] Testing exitoso de comandos permitidos sin contraseña
- [x] Comandos no autorizados correctamente bloqueados
- [x] Archivo de configuración en `/etc/sudoers.d/` (mejor práctica)

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Principle of Least Privilege**: Solo los permisos necesarios, nada más.

2. **Separation of Concerns**: Usuarios dedicados para tareas específicas.

3. **Auditability**: Cada comando sudo se loggea automáticamente.

### 🚨 Troubleshooting DevOps

**Problema**: `sudo: command not found` o comando no reconocido

- **Causa**: Usando nombre corto en lugar de path absoluto
- **Solución**: Usar `/usr/bin/git` en lugar de `git`

**Problema**: Aún pide contraseña

- **Causa**: Sintaxis incorrecta o archivo en ubicación equivocada
- **Diagnóstico**: `sudo -l -U deploy` muestra qué tiene permitido

**Problema**: `visudo` reporta error de sintaxis

- **Causa**: Archivo sudoers corrupto
- **Solución**: `pkexec visudo` o recovery desde consola física/serial

### 💡 Mejores Prácticas

1. **Always Use visudo**: Nunca editar sudoers directamente con vi/vim

   ```bash
   sudo visudo -f /etc/sudoers.d/deploy
   ```

2. **Paths Absolutos**: Siempre paths completos por seguridad

   ```bash
   which git  # Obtener path completo
   ```

3. **Logging**: Monitorear uso de sudo

   ```bash
   sudo grep "deploy" /var/log/secure
   ```

4. **Ansible Integration**:
   ```yaml
   - name: Configure deploy sudo permissions
     copy:
       content: "deploy ALL=(ALL) NOPASSWD: /usr/bin/git, /usr/bin/docker"
       dest: /etc/sudoers.d/deploy
       validate: "visudo -cf %s"
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 9** configura Git - la herramienta que el usuario `deploy` usará con sus privilegios sudo.

**Conexión**: Usuario deploy + sudo para git + configuración git = Pipeline de despliegue básico.

**Preparación**: Piensa en cómo este usuario se integrará en tu pipeline CI/CD para hacer `git pull` automáticamente.

---

## 📚 Recursos DevOps

- [Sudoers Manual](https://www.sudo.ws/man/sudoers.man.html)
- [Ansible Become](https://docs.ansible.com/ansible/latest/user_guide/become.html)
- [Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege)

---

## 📊 Seguimiento de Progreso

- **Día**: 8 de 100
- **Bloque**: Seguridad y Autorización
- **Progresión**: 1-7 → 8 → 9 (Infraestructura → Permisos → Git)
- **Habilidad**: Escalación de privilegios controlada

**¡Perfecto! Ahora tu automatización puede operar con los privilegios necesarios, de forma segura.** 🔐
