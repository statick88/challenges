---
title: "Reto 18: Process Limit Adjustment - xFusionCorp Industries"
category: linux
difficulty: hard
tags:
  - linux
  - ssh
  - user-management
  - security
  - backup
date: 2025-01-25
status: blocked
---

# Reto 18: Process Limit Adjustment - xFusionCorp Industries

## Control de Recursos del Sistema: Previniendo Agotamiento

---

## 🎓 Del Instructor

Bienvenido a tu decimoctavo desafío como SysAdmin Senior en xFusionCorp. Hoy configuramos **límites de procesos**, un mecanismo crítico para prevenir que usuarios o aplicaciones agoten recursos del sistema.

> 💭 **Mentalidad de SysAdmin**: "Sin límites de recursos, un solo usuario o proceso malicioso puede tumbar todo el servidor. Los límites son como las reglas de tráfico: impiden que alguien ocupe todas las calles."

En entornos empresariales, especialmente en servidores compartidos, los límites de recursos son esenciales para:

- Prevenir fork bombs
- Limitar consumo de memoria
- Garantizar recursos para procesos críticos
- Mitigar ataques de denegación de servicio

---

## 🎭 Escenario Real: Control de Recursos en Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Control de Recursos  
**Servidor**: App Server 2 (stapp02)  
**Tu rol**: Senior System Administrator - Performance y Seguridad

### La Problemática

El servidor stapp02 ejecuta múltiples aplicaciones:

- **app_user**: Aplicación principal de negocio
- **web_user**: Servidor web y aplicaciones dinámicas
- **default**: Resto de usuarios del sistema

Sin límites configurados:

- Un bug en app_user podría crear miles de procesos
- web_user podría agotar file descriptors
- Usuarios maliciosos podrían ejecutar fork bombs

**El requerimiento del equipo de Arquitectura**:

> "Adjust process limits for users and system services."

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña |
| -------- | ------------- | ------------------------------- | -------------- | ---------- |
| stapp02  | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve          | Am3ric@    |

### Requisitos Técnicos

- **Archivos**: `/etc/security/limits.conf` y `/etc/security/limits.d/`
- **Límites específicos**:
  - app_user: soft nproc 1024, hard nproc 2048
  - web_user: soft nofile 4096, hard nofile 8192
  - \*: soft nproc 1024 (default)
- **Aplicación**: Inmediata y persistente
- **Verificación**: `ulimit -a` como usuario específico

---

## 🧠 La Arquitectura: Límites de Recursos

### Archivos de Configuración

```
/etc/security/limits.conf          # Configuración principal
/etc/security/limits.d/*.conf      # Configuraciones adicionales
/etc/systemd/system.conf.d/        # Límites para servicios systemd
/proc/sys/kernel/                  # Límites del kernel
```

### Tipos de Límites

| Límite      | Descripción               | Ejemplo                     |
| ----------- | ------------------------- | --------------------------- |
| **nproc**   | Número de procesos        | Máximo procesos por usuario |
| **nofile**  | File descriptors abiertos | Máximo archivos abiertos    |
| **memlock** | Memoria bloqueada         | Máximo para bloqueo en RAM  |
| **stack**   | Tamaño de stack           | Máximo stack por proceso    |
| **cpu**     | Tiempo de CPU             | Límite de uso de CPU        |

### Soft vs Hard Limits

```
Soft Limit (Actual):    El límite que se aplica ahora
                        Puede ser incrementado hasta Hard Limit

Hard Limit (Máximo):    El límite absoluto máximo
                        Solo root puede modificar

Ejemplo:
app_user soft nproc 1024    ← Puede usar hasta 1024 procesos
app_user hard nproc 2048    ← Puede incrementar hasta 2048
```

---

## 🛠️ Implementación Profesional

### Fase 1: Verificar Límites Actuales

```bash
# Conexión al servidor
ssh steve@172.16.238.11
sudo su -

# Verificar límites actuales del sistema
ulimit -a

# Ver archivo limits.conf actual
cat /etc/security/limits.conf
```

### Fase 2: Configurar Límites Específicos

```bash
# Backup del archivo original
cp /etc/security/limits.conf /etc/security/limits.conf.backup

# Configurar límites en limits.conf
cat >> /etc/security/limits.conf << 'EOF'

# Application user limits
app_user soft nproc 1024
app_user hard nproc 2048

# Web user limits
web_user soft nofile 4096
web_user hard nofile 8192

# Default limits for all users
* soft nproc 1024
* hard nproc 2048
EOF
```

### Fase 3: Configurar Límites en Directorio limits.d (Alternativa)

```bash
# Crear archivo específico
cat > /etc/security/limits.d/99-app-limits.conf << 'EOF'
app_user soft nproc 1024
app_user hard nproc 2048
web_user soft nofile 4096
web_user hard nofile 8192
EOF
```

### Fase 4: Configurar Límites para Servicios Systemd

```bash
# Crear configuración para servicios systemd
mkdir -p /etc/systemd/system.conf.d

cat > /etc/systemd/system.conf.d/limits.conf << 'EOF'
[Manager]
DefaultLimitNOFILE=65536
DefaultLimitNPROC=32768
EOF

# Recargar configuración systemd
systemctl daemon-reload
```

### Fase 5: Verificación

```bash
# Verificar límites de app_user
su - app_user -c "ulimit -u"
# Debe mostrar: 1024

# Verificar límites de web_user
su - web_user -c "ulimit -n"
# Debe mostrar: 4096

# Verificar configuración aplicada
grep -E "(app_user|web_user)" /etc/security/limits.conf
```

### Resumen de Comandos

```bash
# Backup
cp /etc/security/limits.conf /etc/security/limits.conf.backup

# Configurar límites
cat >> /etc/security/limits.conf << 'EOF'
app_user soft nproc 1024
app_user hard nproc 2048
web_user soft nofile 4096
web_user hard nofile 8192
* soft nproc 1024
* hard nproc 2048
EOF

# Configurar systemd
mkdir -p /etc/systemd/system.conf.d
cat > /etc/systemd/system.conf.d/limits.conf << 'EOF'
[Manager]
DefaultLimitNOFILE=65536
DefaultLimitNPROC=32768
EOF
systemctl daemon-reload

# Verificar
su - app_user -c "ulimit -u"
su - web_user -c "ulimit -n"
```

---

## 🎯 Análisis Post-Implementación

```
┌─────────────────────────────────────────────────────────────────────────┐
│              LÍMITES DE PROCESOS CONFIGURADOS - stapp02                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  CONFIGURACIÓN:                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ /etc/security/limits.conf                                         │   │
│  │                                                                   │   │
│  │ app_user soft nproc 1024                                         │   │
│  │ app_user hard nproc 2048                                         │   │
│  │                                                                   │   │
│  │ web_user soft nofile 4096                                        │   │
│  │ web_user hard nofile 8192                                        │   │
│  │                                                                   │   │
│  │ * soft nproc 1024                                                │   │
│  │ * hard nproc 2048                                                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  RESULTADOS:                                                             │
│  ├── app_user:  max 1024 procesos (incrementable hasta 2048)            │
│  ├── web_user:  max 4096 file descriptors (incrementable hasta 8192)    │
│  └── default:   max 1024 procesos para todos los demás usuarios         │
│                                                                          │
│  ✅ PROTECCIÓN IMPLEMENTADA:                                             │
│     • Prevención de fork bombs                                          │
│     • Control de recursos por usuario                                   │
│     • Límites específicos según necesidad                               │
│     • Persistencia después de reboot                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Reflexión Final

### Control de Recursos es Seguridad

> "Un sistema sin límites es un sistema vulnerable."

Lecciones clave:

- Siempre configurar límites en servidores compartidos
- Ajustar límites según necesidad del servicio
- Hard limits protegen contra escalada
- Systemd requiere configuración adicional

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 25 minutos
- 🎯 Dificultad: Difícil

### Criterios de Éxito

- ✅ Límites configurados correctamente para usuarios específicos
- ✅ Aplicación inmediata de nuevos límites
- ✅ Persistencia después de reboot
- ✅ Verificación exitosa de límites por usuario

---

_Documentación creada siguiendo estándares de SysAdmin - Control de Recursos_
