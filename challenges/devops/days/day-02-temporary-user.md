---
title: "Configuración de Usuario Temporal con Expiración"
category: devops
day: 2
difficulty: 2
tags:
  - devops
  - linux
  - ssh
  - usuarios
  - seguridad
date: 2026-01-25
status: completed
---

# 🎓 Día 2: Gestión de Accesos Temporales y Lifecycle

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "La seguridad no es un estado, es un proceso continuo. Los accesos temporales son la expresión perfecta de la cultura DevOps: automatizar la seguridad y eliminar la deuda técnica de permisos obsoletos."

Hoy avanzamos desde la creación básica de usuarios hacia la **gestión del ciclo de vida de identidades** - un componente crítico en cualquier organización que practique DevOps.

---

## 🎭 Contexto del Día

### Conexión con el Día 1

En el Día 1 aprendiste a crear usuarios de sistema con shells no interactivas. Hoy añadimos una dimensión temporal: **los usuarios tienen fecha de caducidad**, igual que las credenciales en un pipeline CI/CD.

### Progresión hacia el Futuro

- **Día 3**: Seguridad SSH y hardening de accesos
- **Día 8**: Configuración de permisos sudo avanzados
- **Pipeline CI/CD**: Tokens de acceso temporal para runners

### Relevancia en CI/CD

Los usuarios temporales son el modelo perfecto para:

- **Tokens de despliegue** con expiración automática
- **Acceso de emergencia** que se auto-revoca
- **Auditoría simplificada** (sabemos exactamente cuándo expiró un acceso)

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

La gestión de accesos temporales facilita la colaboración segura con:

- Consultores externos
- Equipos de soporte
- Developers en rotación on-call

### Automatización

```bash
# En un pipeline CI/CD, la expiración automática significa:
- No más "limpieza manual" de usuarios
- Cumplimiento de políticas de seguridad sin intervención humana
- Reducción del riesgo de permisos olvidados (permission creep)
```

### Métricas y Compliance

- **Mean Time to Revoke**: Tiempo promedio para revocar accesos
- **Expired Accounts**: Métrica de cuentas que expiraron según lo planeado
- **Audit Trail**: Registro completo de cuándo se creó y expiró cada acceso

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Conectarse al App Server 1

```bash
ssh tony@172.16.238.10
```

**Análisis DevOps**: Conexión segura establecida. En producción, esto sería ejecutado por un bastión o jump host.

### Paso 2: Crear usuario temporal con fecha de expiración

```bash
sudo useradd -e 2027-03-28 yousuf
```

**Análisis DevOps**:

- `-e 2027-03-28`: Establece expiración el 28 de marzo de 2027
- Equivalente a un **token de CI/CD con TTL** (Time To Live)
- Automatiza la revocación - no requiere intervención manual

**Pipeline Equivalent**:

```yaml
deploy_token:
  expires_at: "2027-03-28T00:00:00Z"
  user: yousuf
```

### Paso 3: Verificar creación del usuario

```bash
id yousuf
```

**Salida**: `uid=1002(yousuf) gid=1002(yousuf) groups=1002(yousuf)`

**Verificación CI/CD**:

```bash
id yousuf >/dev/null 2>&1 && echo "✓ Usuario existe" || exit 1
```

### Paso 4: Verificar detalles de expiración

```bash
sudo chage -l yousuf
```

**Salida esperada**:

- **Account expires**: Mar 28, 2027 ✅
- **Password expires**: never

**Análisis DevOps**: `chage` (change age) es tu herramienta de auditoría. Proporciona el estado completo del ciclo de vida de la cuenta.

---

## ✅ Criterios de Éxito

- [x] Usuario `yousuf` creado con uid=1002, gid=1002
- [x] Expiración de cuenta establecida correctamente al 28 Mar 2027
- [x] Nombre de usuario en minúsculas según estándar
- [x] Verificación del ciclo de vida completada con `chage`
- [x] Capacidad de auditoría demostrada

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Lifecycle Management**: Los usuarios, como los recursos cloud, deben tener ciclo de vida definido desde su creación.

2. **Just-in-Time Access**: El principio de otorgar acceso solo cuando se necesita y por el tiempo mínimo necesario.

3. **Automated Compliance**: La expiración automática elimina la necesidad de procesos manuales de revocación.

### 🚨 Troubleshooting DevOps

**Problema**: `chage -l yousuf` falló con "Permission denied"

**Causa Root**: Comandos administrativos requieren privilegios elevados

**Solución DevOps**: Siempre incluir verificación de permisos en pipelines:

```bash
if sudo -n chage -l yousuf 2>/dev/null; then
    echo "✓ Acceso de auditoría confirmado"
else
    echo "✗ Falta permiso sudo para auditoría"
    exit 1
fi
```

### 💡 Mejores Prácticas

1. **Fechas Explícitas**: Usar formato ISO (YYYY-MM-DD) para evitar ambigüedades
2. **Documentación**: Registrar por qué se creó el acceso temporal
3. **Revisión Periódica**: Auditar usuarios próximos a expirar antes de que lo hagan

---

## 🚀 Día Siguiente: Preparación

**Día 3** aborda el hardening de SSH - deshabilitar acceso root directo. Esto combina perfectamente con lo aprendido hoy:

- Usuarios temporales + SSH seguro = Infraestructura enterprise-grade
- Preparación para el modelo de "bastion hosts" y acceso privilegiado
- Fundamentos para implementar **Zero Trust** en tu pipeline

**Preparación**: Investiga cómo las grandes empresas gestionan acceso temporal (e.g., AWS IAM Temporary Credentials, HashiCorp Vault).

---

## 📚 Recursos DevOps

- [HashiCorp Vault: Temporary Credentials](https://www.vaultproject.io/docs/concepts/tokens)
- [AWS STS Temporary Credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)
- [Zero Trust Security Model](https://www.nist.gov/publications/zero-trust-architecture)

---

## 📊 Seguimiento de Progreso

- **Día**: 2 de 100
- **Bloque**: Seguridad y Gestión de Identidades
- **Progresión**: 1 → 2 → 3 (Usuarios → Expiración → SSH Hardening)
- **Meta**: Pipeline CI/CD seguro y compliant

**¡Excelente! Ahora entiendes que la seguridad en DevOps es proactiva, no reactiva.** 🔐
