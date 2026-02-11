---
title: "Deshabilitar Acceso SSH Root Directo"
category: devops
day: 3
difficulty: 2
tags:
  - devops
  - linux
  - ssh
  - seguridad
  - auditoria
date: 2026-01-26
status: completed
---

# 🎓 Día 3: Hardening de SSH y Seguridad en Capas

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "La seguridad es una responsabilidad compartida, no un departamento aparte. Cada cambio de configuración que hacemos es una oportunidad para fortalecer nuestro pipeline de entrega."

Hoy implementamos una de las prácticas de seguridad más críticas en cualquier infraestructura: **eliminar el acceso root directo**. Esto no es solo "buena práctica" - es fundamental para la cultura DevOps de trazabilidad y responsabilidad compartida.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Día 1-2**: Creaste usuarios regulares y temporales - ahora les darás un propósito crítico
- **Hoy**: Esos usuarios se convierten en la **única vía de acceso** a producción
- **Día 10**: SSH sin contraseña entre servidores (automatización segura)

### Progresión hacia el Pipeline CI/CD

Este patrón es la base de:

- **Bastion Hosts**: Saltos seguros entre redes
- **Audit Trails**: Saber QUIÉN hizo QUÉ y CUÁNDO
- **Privileged Access Management (PAM)**: Control de accesos privilegiados

### Escenario Empresarial

Simulamos una auditoría de seguridad post-incidente. Tu equipo debe:

1. Aplicar cambios en múltiples servidores
2. Documentar cada cambio
3. Verificar la aplicación correcta
4. Mantener la disponibilidad del servicio

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Al eliminar el acceso root directo:

- **Desarrolladores** deben usar cuentas nominales (trackeables)
- **Operaciones** tienen visibilidad de quién accede a qué
- **Seguridad** obtiene audit trails completos

### Automatización

Este cambio fuerza la automatización:

```bash
# Ya no puedes: ssh root@server
# Debes usar: ssh user@server + sudo comando
# O mejor aún: ansible-playbook (Día 7)
```

### Métricas y Observabilidad

- **SSH Login Events**: Logs claros de quién se conecta
- **Sudo Usage**: Trazabilidad de comandos privilegiados
- **Failed Root Attempts**: Detección de intentos de ataque

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Conexión Multi-Servidor

```bash
# Conectarse a stapp01
ssh tony@172.16.238.10

# Conectarse a stapp02
ssh steve@172.16.238.11

# Conectarse a stapp03
ssh banner@172.16.238.12
```

**Análisis DevOps**: Estamos aplicando **Infrastructure as Code** manualmente hoy, pero esto se convertirá en un playbook de Ansible automatizado.

### Paso 2: Verificar configuración SSH actual

```bash
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
```

**Análisis DevOps**: Siempre verificar el estado actual antes de modificar - principio fundamental del cambio seguro en producción.

### Paso 3: Backup y Edición de Configuración

```bash
# Backup del archivo crítico
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d)

# Editar configuración
sudo vi /etc/ssh/sshd_config

# Cambiar:
PermitRootLogin no
```

**Mejores Prácticas DevOps**:

- **Backup automático** con timestamp
- **Versionado** implícito del archivo
- **Rollback** posible si hay problemas

### Paso 4: Reiniciar servicio SSH

```bash
sudo systemctl restart sshd
```

**Análisis DevOps**: El servicio se reinicia sin interrumpir conexiones existentes (graceful restart).

### Paso 5: Verificación cruzada

```bash
# Método 1: Ver configuración en archivo
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config

# Método 2: Ver configuración activa
sudo sshd -T | grep -i "permitrootlogin"

# Método 3: Intentar conexión root (debe fallar)
ssh root@172.16.238.10
# Resultado esperado: Permission denied
```

---

## ✅ Criterios de Éxito

- [x] Acceso SSH root deshabilitado en stapp01, stapp02, stapp03
- [x] Backups de configuración creados antes de modificar
- [x] Servicios SSH reiniciados sin downtime
- [x] Verificación exitosa con `sshd -T`
- [x] Conexiones de usuarios regulares funcionan correctamente
- [x] Documentación del cambio completada

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Defense in Depth**: La seguridad por capas - múltiples controles de seguridad.

2. **Least Privilege**: Usuarios solo tienen los permisos mínimos necesarios.

3. **Auditability**: Cada acción debe ser trazable a un individuo.

### 🚨 Troubleshooting DevOps

**Problema**: Temor a quedar "bloqueado" fuera del servidor

**Mitigación**:

```bash
# 1. Mantener sesión SSH actual abierta
# 2. Abrir nueva terminal y probar conexión
# 3. Si falla, usar sesión original para revertir
sudo cp /etc/ssh/sshd_config.backup.20260126 /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### 💡 Patrones Avanzados

**1. Ansible Playbook (Preview Día 7)**:

```yaml
- name: Disable root SSH
  lineinfile:
    path: /etc/ssh/sshd_config
    regexp: "^PermitRootLogin"
    line: "PermitRootLogin no"
  notify: restart sshd
```

**2. Monitoreo de Intentos**:

```bash
# Ver intentos fallidos de root
sudo grep "Failed password for root" /var/log/secure
```

---

## 🚀 Día Siguiente: Preparación

**Día 4** trabaja con permisos de scripts - una habilidad esencial porque:

- Los usuarios no-root necesitan ejecutar scripts de despliegue
- Los permisos correctos son críticos para CI/CD runners
- Preparación para `chmod`, `chown`, y gestión de archivos

**Conexión**: Usuario sin root SSH + permisos correctos = Acceso seguro y funcional

---

## 📚 Recursos DevOps

- [CIS Benchmarks for SSH](https://www.cisecurity.org/cis-benchmarks)
- [Ansible SSH Hardening Role](https://github.com/dev-sec/ansible-ssh-hardening)
- [NIST Guidelines on SSH](https://csrc.nist.gov/publications/detail/white-paper/2015/10/23/security-of-interactive-and-automated-access-management-using-secure-shell-ssh/final)

---

## 📊 Seguimiento de Progreso

- **Día**: 3 de 100
- **Bloque**: Seguridad y Hardening
- **Progresión**: 1 → 2 → 3 → 4 (Usuarios → Expiración → SSH → Permisos)
- **Impacto**: Seguridad enterprise-grade aplicada

**¡Crítico completado! Tu infraestructura ahora tiene controles de seguridad de nivel empresarial.** 🛡️
