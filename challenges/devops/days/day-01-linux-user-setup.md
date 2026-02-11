---
title: "Configuración de Usuario Linux con Shell No Interactiva"
category: devops
day: 1
difficulty: 2
tags:
  - devops
  - linux
  - usuarios
  - shell
date: 2026-01-25
status: completed
---

# 🎓 Día 1: Fundamentos de Usuarios de Sistema

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "Infrastructure as Code comienza con la comprensión profunda de los fundamentos. Cada usuario que creamos es un componente de nuestra infraestructura, no solo una cuenta más."

Bienvenido al programa **100 Days of DevOps**. Hoy establecemos las bases de la gestión de identidades en Linux, un pilar fundamental para cualquier pipeline de CI/CD seguro y automatizado.

---

## 🎭 Contexto del Día

Este es el **punto de partida** de tu transformación DevOps. Estás construyendo los cimientos sobre los cuales se apoyarán:

- **Días 2-3**: Gestión avanzada de usuarios y seguridad SSH
- **Días 6-7**: Automatización con cron y Ansible
- **Pipeline CI/CD**: Usuarios de servicio para ejecución automatizada

En un pipeline de CI/CD moderno, los usuarios de sistema (service accounts) son esenciales para ejecutar procesos sin interacción humana, manteniendo la seguridad y trazabilidad.

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

La gestión de usuarios no es solo tarea de SysAdmin; es un **contrato entre equipos** de desarrollo y operaciones. Los usuarios de servicio permiten que las aplicaciones se comuniquen con la infraestructura sin exponer credenciales personales.

### Automatización

Los usuarios con shell no interactiva (`/sbin/nologin`) son perfectos para:

- Ejecutar procesos de CI/CD automatizados
- Correr contenedores y servicios
- Realizar backups programados

### Métricas y Observabilidad

Cada cuenta de usuario es un **punto de auditoría**. Con usuarios de servicio bien definidos, puedes:

- Trazar qué proceso realizó qué acción
- Generar métricas de uso por servicio
- Cumplir con requisitos de compliance

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Conectarse al App Server 1

```bash
ssh tony@172.16.238.10
```

**Análisis DevOps**: Establecemos conexión segura al servidor de aplicaciones. En un pipeline CI/CD, esta conexión sería realizada por un runner automatizado usando SSH keys.

### Paso 2: Crear usuario con shell no interactiva

```bash
sudo useradd -s /sbin/nologin newuser
```

**Análisis DevOps**:

- `-s /sbin/nologin`: Previene login interactivo, ideal para usuarios de servicio
- Este tipo de usuario es estándar en contenedores Docker y pods Kubernetes
- No puede ser comprometido vía SSH, reduciendo la superficie de ataque

### Paso 3: Verificar creación del usuario

```bash
id newuser
cat /etc/passwd | grep newuser
```

**Integración CI/CD**: En un pipeline, verificaríamos esto con:

```bash
id newuser && echo "✓ Usuario creado" || exit 1
```

---

## ✅ Criterios de Éxito

- [x] Usuario existe en `/etc/passwd` con shell `/sbin/nologin`
- [x] No puede iniciar sesión interactivamente (seguridad reforzada)
- [x] Cuenta lista para ser usada en procesos automatizados
- [x] Verificación automatizable mediante scripting

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Service Accounts**: En DevOps, los usuarios de sistema son como "identidades de máquina" que permiten la automatización segura.

2. **Principle of Least Privilege**: `/sbin/nologin` aplica el principio de mínimo privilegio - el usuario solo puede ejecutar procesos, no interactuar.

3. **Infrastructure as Code**: Este comando será parte de tus playbooks de Ansible o scripts de Terraform en el futuro.

### 🚀 Aplicación en CI/CD

```yaml
# Ejemplo en un pipeline GitLab CI
deploy:
  script:
    - useradd -s /sbin/nologin deploy-user
    - su -s /bin/bash deploy-user -c "./deploy-script.sh"
```

---

## 🚀 Día Siguiente: Preparación

**Día 2** introducirá la gestión de usuarios temporales con expiración automática. Este concepto es crucial para:

- Acceso temporal de consultores externos
- Rotación de credenciales en pipelines
- Compliance y auditoría de accesos

**Preparación**: Investiga cómo los usuarios temporales se integran en políticas de seguridad Zero Trust.

---

## 📚 Recursos DevOps

- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Infrastructure as Code with Terraform](https://www.terraform.io/intro)
- [GitLab CI/CD Runners](https://docs.gitlab.com/runner/)

---

## 📊 Seguimiento de Progreso

- **Día**: 1 de 100
- **Bloque**: Fundamentos Linux para DevOps
- **Próximo**: Gestión de accesos temporales
- **Meta**: 100 días → Pipeline CI/CD completo

**¡Felicidades! Has dado el primer paso hacia la automatización profesional.** 🎯
