---
title: "SELinux Installation and Configuration"
category: devops
day: 5
difficulty: 3
tags:
  - devops
  - linux
  - seguridad
  - selinux
  - dnf
date: 2026-01-29
status: completed
---

# 🎓 Día 5: Security-Enhanced Linux (SELinux)

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "La seguridad no debe ser un obstáculo para la velocidad. SELinux es como un firewall avanzado para tus procesos - cuando lo entiendes, te protege sin frenarte. La clave es integrarlo en tu pipeline desde el diseño."

Hoy nos adentramos en **SELinux**, uno de los frameworks de seguridad más poderosos pero menos comprendidos de Linux. Es esencial para entornos enterprise y compliance (HIPAA, PCI-DSS, SOC 2).

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-4**: Usuarios, SSH, permisos - control de acceso tradicional
- **Hoy**: Añadimos **Mandatory Access Control (MAC)** - seguridad a nivel de kernel
- **Día 6**: Cron jobs - los servicios automatizados deben respetar SELinux

### Progresión hacia el Pipeline CI/CD

SELinux afecta directamente:

- **Contenedores Docker**: Políticas de seguridad para containers
- **CI/CD Runners**: Permisos para ejecutar builds
- **Kubernetes**: Security contexts y SELinux labels

### Escenario Empresarial

xFusionCorp Industries requiere SELinux instalado pero deshabilitado temporalmente para:

1. Evaluación de aplicaciones legacy
2. Migración gradual de políticas
3. Cumplimiento de auditoría (tenerlo instalado)

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

SELinux frena la fricción entre:

- **Desarrolladores**: "Mi aplicación no funciona en producción"
- **Operaciones**: "El servidor está configurado igual"
- **Seguridad**: "Necesitamos controles de acceso"

**SELinux como Common Language**: Cuando todos entienden los contextos de seguridad, las conversaciones son más productivas.

### Automatización

```bash
# En un pipeline CI/CD, necesitas:
- Verificar modo SELinux antes del deploy
- Configurar contextos correctos para archivos
- Asegurar que los servicios pueden ejecutarse
```

### Métricas y Compliance

- **SELinux Denials**: Eventos de seguridad bloqueados
- **Audit Logs**: Trazabilidad completa de accesos
- **Compliance Score**: Cumplimiento de frameworks de seguridad

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Conexión y Reconocimiento

```bash
ssh tony@172.16.238.10

# Identificar tipo de sistema
which dnf || which yum || which apt
# Confirmado: DNF disponible (CentOS/RHEL moderno)
```

**Análisis DevOps**: DNF es el package manager moderno para RHEL/CentOS 8+. Reemplaza a YUM con mejor resolución de dependencias.

### Paso 2: Verificación Inicial

```bash
# Verificar estado SELinux
sestatus 2>/dev/null || echo "SELinux packages not installed"
getenforce 2>/dev/null || echo "getenforce not available"

# Ver paquetes existentes
rpm -qa | grep selinux
# Salida: libselinux-3.6-3.el9.x86_64 (biblioteca base)
```

**Análisis DevOps**: La biblioteca base está instalada, pero faltan las herramientas de gestión (`policycoreutils`, políticas, etc.)

### Paso 3: Instalación de Paquetes SELinux

```bash
sudo dnf install -y policycoreutils selinux-policy-targeted selinux-policy-devel
```

**Salida esperada**:

```
Installed:
  policycoreutils-3.6-4.el9.x86_64
  selinux-policy-targeted-38.1.72-1.el9.noarch
  selinux-policy-devel-38.1.72-1.el9.noarch
  + 16 dependencias
Complete!
```

**Componentes instalados**:

- `policycoreutils`: Herramientas de gestión (semanage, restorecon)
- `selinux-policy-targeted`: Política por defecto (targeted)
- `selinux-policy-devel`: Herramientas de desarrollo de políticas

### Paso 4: Configuración Permanente

```bash
sudo vi /etc/selinux/config

# Configuración aplicada:
SELINUX=disabled
SELINUXTYPE=targeted
```

**Modos de SELinux**:

- `enforcing`: Políticas aplicadas activamente (producción segura)
- `permissive`: Solo registra violaciones (modo debugging)
- `disabled`: Deshabilitado completamente

**Análisis DevOps**: En un pipeline maduro, usarías `permissive` temporalmente para identificar problemas sin bloquear el servicio.

### Paso 5: Verificación Final

```bash
# Ver configuración en archivo
cat /etc/selinux/config | grep SELINUX=
# Salida: SELINUX=disabled

# Ver estado actual
sestatus
# Salida: SELinux status: disabled

getenforce
# Salida: Disabled
```

---

## ✅ Criterios de Éxito

- [x] 19 paquetes SELinux instalados exitosamente
- [x] Configuración permanente establecida en `/etc/selinux/config`
- [x] Estado verificado como `disabled` con `sestatus`
- [x] Sistema identificado correctamente (RPM-based con DNF)
- [x] Uso de DNF moderno en lugar de YUM legacy
- [x] Sin errores durante instalación

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **MAC vs DAC**:
   - **DAC** (Discretionary): Permisos tradicionales (chmod, chown)
   - **MAC** (Mandatory): SELinux impone controles independientemente del usuario

2. **Contextos de Seguridad**:

   ```bash
   ls -Z /tmp/xfusioncorp.sh
   # system_u:object_r:usr_t:s0 /tmp/xfusioncorp.sh
   #    ↑           ↑       ↑
   # Usuario     Tipo    Nivel
   ```

3. **Política Targeted**: Solo protege procesos específicos (sshd, httpd, etc.), dejando el resto sin restricciones.

### 🚨 Troubleshooting DevOps

**Problema**: Script funciona como root pero falla como usuario

- **Posible causa**: SELinux context incorrecto
- **Diagnóstico**: `ausearch -m avc -ts recent`
- **Solución**: `restorecon -v /path/to/script`

**Problema**: Servicio no inicia después de mover archivos

- **Causa**: `mv` preserva contextos; `cp` hereda del destino
- **Solución**: `restorecon -Rv /var/www/html`

### 💡 Mejores Prácticas

1. **Pipeline Check**:

   ```bash
   if [ $(getenforce) == "Enforcing" ]; then
     echo "⚠️ SELinux activo - verificar contextos"
   fi
   ```

2. **Debugging**:

   ```bash
   # Ver denials recientes
   ausearch -m avc -ts recent

   # Ver sugerencias de solución
   sealert -a /var/log/audit/audit.log
   ```

3. **Contextos para CI/CD**:
   ```bash
   # Asegurar contexto correcto para scripts
   semanage fcontext -a -t bin_t "/opt/ci-scripts(/.*)?"
   restorecon -Rv /opt/ci-scripts
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 6** introduce **Cron Jobs** - automatización programada. La conexión con SELinux es crítica:

- Los cron jobs ejecutan en contextos específicos de SELinux
- Scripts que funcionan manualmente pueden fallar en cron
- Necesitas entender `crond_t` (tipo de dominio de cron)

**Preparación**: Investiga cómo SELinux afecta procesos ejecutados por cron.

---

## 📚 Recursos DevOps

- [SELinux Project Wiki](https://selinuxproject.org/)
- [Red Hat SELinux Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/using_selinux/index)
- [Docker SELinux](https://docs.docker.com/engine/security/selinux/)

---

## 📊 Seguimiento de Progreso

- **Día**: 5 de 100
- **Bloque**: Seguridad Enterprise
- **Progresión**: 1-4 → 5 → 6 (Básico → SELinux → Automatización)
- **Habilidad**: Seguridad a nivel de kernel y compliance

**¡Excelente! Ahora entiendes por qué las aplicaciones a veces 'misteriosamente' fallan en producción.** 🔒
