---
title: "Permisos de Ejecución de Scripts"
category: devops
day: 4
difficulty: 2
tags:
  - devops
  - linux
  - scripts
  - permisos
  - bash
date: 2026-01-27
status: completed
---

# 🎓 Día 4: Gestión de Permisos y Deploy de Scripts

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "Un script sin permisos es como código no desplegado. En DevOps, no solo escribimos scripts - los hacemos ejecutables, testeables y parte de un pipeline automatizado."

Hoy abordamos una de las tareas más comunes pero críticas: **hacer ejecutables los scripts de despliegue**. Este es el puente entre escribir código y ejecutarlo en producción.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-3**: Usuarios creados y acceso SSH asegurado
- **Hoy**: Esos usuarios necesitan **ejecutar scripts** de automatización
- **Día 6**: Automatización con cron jobs

### Progresión hacia el Pipeline CI/CD

Este conocimiento es esencial para:

- **Deploy Scripts**: Scripts que despliegan aplicaciones
- **CI/CD Runners**: Permisos para ejecutar pipelines
- **Infrastructure as Code**: Terraform, Ansible scripts ejecutables

### Escenario Empresarial

El equipo de desarrollo entregó un script de backup, pero olvidó configurar permisos. Tu misión: hacerlo ejecutable sin comprometer la seguridad.

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Los permisos adecuados permiten:

- **Desarrolladores** ejecutar scripts de prueba
- **Operaciones** mantener control de scripts críticos
- **CI/CD** automatizar sin credenciales de root

### Automatización

```bash
# Pipeline CI/CD necesita:
chmod +x deploy.sh        # Hacer ejecutable
./deploy.sh               # Ejecutar
```

### Métricas y Calidad

- **Script Execution Time**: Cuánto tarda el script
- **Permission Denied Errors**: Errores de permisos
- **Successful Deploys**: Tasa de éxito de despliegues

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Conexión y Verificación

```bash
ssh tony@172.16.238.10

# Verificar permisos actuales
ls -l /tmp/xfusioncorp.sh
```

**Salida inicial**: `---------- 1 root root 40 Jan 28 03:34 /tmp/xfusioncorp.sh`

**Análisis DevOps**: El script tiene **cero permisos** - no puede ser leído, escrito ni ejecutado por nadie.

### Paso 2: Diagnóstico del Problema

```bash
# Intentar ejecutar sin cambiar permisos
/tmp/xfusioncorp.sh
# Resultado: Permission denied

# Intentar cambiar permisos sin sudo
chmod +x /tmp/xfusioncorp.sh
# Resultado: Operation not permitted
```

**Lección**: Los archivos de root requieren `sudo` para modificarlos.

### Paso 3: Verificar Capacidades Sudo

```bash
sudo -l
```

**Salida**: `User tony may run the following commands on stapp01: (ALL) ALL`

**Análisis DevOps**: El usuario tiene capacidades de sudo - puede elevar privilegios cuando sea necesario (principio de least privilege con escalación controlada).

### Paso 4: Aplicar Permisos Correctos

```bash
sudo chmod a+rx /tmp/xfusioncorp.sh
# o
sudo chmod 755 /tmp/xfusioncorp.sh
```

**Análisis DevOps**:

- `755` = `rwxr-xr-x` (owner puede todo, grupo y otros pueden leer/ejecutar)
- `a+rx` = Añadir read y execute para all (todos)
- Para scripts de CI/CD, 755 es el estándar de facto

**En Pipeline**:

```yaml
script:
  - chmod +x deploy.sh
  - ./deploy.sh
```

### Paso 5: Verificación y Testing

```bash
# Verificar nuevos permisos
ls -l /tmp/xfusioncorp.sh
# Resultado: -rwxr-xr-x

# Ejecutar el script
/tmp/xfusioncorp.sh
# Resultado: Welcome To KodeKloud
```

**Testing Automatizado**:

```bash
if /tmp/xfusioncorp.sh | grep -q "Welcome"; then
    echo "✓ Script ejecuta correctamente"
else
    echo "✗ Script falló"
    exit 1
fi
```

---

## ✅ Criterios de Éxito

- [x] Script localizado en ruta especificada
- [x] Permisos cambiados de `----------` a `-rwxr-xr-x`
- [x] Todos los usuarios pueden ejecutar (permiso `x` para todos)
- [x] Script ejecuta sin errores y produce output esperado
- [x] Uso correcto de sudo para modificar archivos de root
- [x] Verificación manual y automatizable completada

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Permisos en Linux**: `r` (read), `w` (write), `x` (execute)
2. **Notación Octal**: 7=rwx, 5=r-x, 0=---
3. **Scripts necesitan**: Lectura (`r`) + Ejecución (`x`)

### 🚨 Troubleshooting DevOps

**Problema 1**: Script con solo permisos de ejecución (`--x--x--x`)

- **Síntoma**: "Permission denied" al ejecutar
- **Causa**: Bash necesita leer el archivo para interpretarlo
- **Solución**: Usar `a+rx` en lugar de solo `+x`

**Problema 2**: Permisos denegados al cambiar

- **Solución**: Verificar `sudo -l` y usar `sudo chmod`

### 💡 Mejores Prácticas DevOps

1. **Git + Permisos**: Git preserva permisos ejecutables

   ```bash
   git update-index --chmod=+x script.sh
   ```

2. **CI/CD Pattern**:

   ```yaml
   before_script:
     - chmod +x scripts/*.sh
   script:
     - ./scripts/deploy.sh
   ```

3. **Principle of Least Privilege**: Solo dar permisos necesarios
   - `700` para scripts sensibles
   - `755` para scripts públicos
   - `644` para archivos de configuración

---

## 🚀 Día Siguiente: Preparación

**Día 5** introduce SELinux - un framework de seguridad que puede **bloquear** scripts incluso con permisos correctos. Esto es crítico porque:

- Los entornos enterprise usan SELinux/AppArmor
- Los scripts funcionan en desarrollo pero fallan en producción
- Necesitas entender MAC (Mandatory Access Control)

**Conexión**: Permisos correctos + SELinux configurado = Scripts seguros y funcionales

---

## 📚 Recursos DevOps

- [Linux File Permissions Guide](https://linuxfoundation.org/blog/classic-sysadmin-understanding-linux-file-permissions/)
- [Git File Permissions](https://git-scm.com/book/en/v2/Customizing-Git-Git-Attributes)
- [Chmod Calculator](https://chmod-calculator.com/)

---

## 📊 Seguimiento de Progreso

- **Día**: 4 de 100
- **Bloque**: Gestión de Archivos y Permisos
- **Progresión**: 1-3 → 4 → 5-6 (Usuarios/SSH → Permisos → SELinux/Cron)
- **Habilidad**: Scripts ejecutables y desplegables

**¡Perfecto! Ahora tus scripts están listos para ser parte de un pipeline CI/CD.** 🚀
