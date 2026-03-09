---
title: "Reto 06: Temporary User Setup with Expiry - Usuario anita"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - permissions
  - text-processing
date: 2025-01-25
status: completed
---

# Reto 06: Temporary User Setup with Expiry - Usuario anita

## Gestión Precisa de Accesos Temporales: Fechas Exactas y Cumplimiento

---

## 🎓 Del Instructor

Bienvenido a tu sexto desafío como SysAdmin Senior en xFusionCorp. Este reto es una evolución del concepto de usuarios temporales: en lugar de una duración relativa ("7 días"), trabajaremos con **fechas exactas** de expiración.

> 💭 **Mentalidad de SysAdmin**: "En entornos empresariales, los accesos temporales se alinean con hitos de proyecto, no con duraciones arbitrarias. 'Expira el 7 de diciembre' es más preciso que 'expira en 90 días'."

Este tipo de gestión es crítico para:

- Contratos con fechas de término definidas
- Cumplimiento normativo (SOX, HIPAA, GDPR)
- Auditorías que requieren trazabilidad exacta
- Integración con sistemas de gestión de proyectos

---

## 🎭 Escenario Real: Desarrolladora Anita - Proyecto Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Desarrollo de Nueva Funcionalidad  
**Servidor**: App Server 2 (stapp02)  
**Tu rol**: Senior System Administrator - Gestión de Identidades

### La Problemática

Anita es una desarrolladora externa contratada específicamente para implementar un módulo crítico del proyecto Nautilus. Según el contrato firmado:

- **Inicio**: 25 de enero de 2026
- **Término**: 7 de diciembre de 2026
- **Duración**: Aproximadamente 11 meses
- **Entregable final**: 7 de diciembre de 2026

**El requerimiento del Project Manager**:

> "Create a temporary user account with expiry date for time-limited access."

### Contexto de Seguridad y Cumplimiento

Según políticas de xFusionCorp:

- El acceso debe terminar exactamente el día del fin de contrato
- No se permiten extensiones sin autorización formal
- El nombre de usuario debe seguir estándar en minúsculas
- La expiración debe ser documentable para auditorías

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito      |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | -------------- |
| stapp02  | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve          | Am3ric@    | Nautilus App 2 |

### Requisitos Técnicos Específicos

- **Usuario**: `anita` (minúsculas, estándar corporativo)
- **Expiración exacta**: 2026-12-07 (7 de diciembre de 2026)
- **Shell**: `/bin/bash` (desarrollo interactivo)
- **Directorio home**: Sí, para workspace de desarrollo
- **Servidor**: App Server 2 (stapp02)
- **Propósito**: Desarrollo temporal asignado al proyecto Nautilus

---

## 🧠 La Arquitectura: Fechas Exactas vs. Duraciones Relativas

### Comparativa de Enfoques

| Enfoque      | Uso                       | Ejemplo               | Precisión |
| ------------ | ------------------------- | --------------------- | --------- |
| **Relativo** | Accesos cortos, flexibles | "+7 días", "+30 días" | Media     |
| **Absoluto** | Contratos, proyectos      | "2026-12-07"          | Alta      |

### Ventajas de Fechas Exactas

1. **Cumplimiento Normativo**: Los auditores prefieren fechas específicas sobre cálculos relativos
2. **Sincronización con Contratos**: Fecha de expiración = Fecha de término del contrato
3. **Sin Ambigüedad**: No hay confusiones con "días hábiles" vs. "días calendario"
4. **Documentación Clara**: "Expira el 7 de diciembre" es inequívoco

### Formato de Fechas en Linux

Linux utiliza el formato **ISO 8601** (YYYY-MM-DD) para consistencia internacional:

```bash
# Formato ISO 8601 (recomendado)
2026-12-07
# ││││││└─ Día (01-31)
# │││││└── Mes (01-12)
# │││└───┴─ Año (YYYY)

# Otros formatos aceptados (según locale)
07/12/2026    # DD/MM/YYYY (Europa)
12/07/2026    # MM/DD/YYYY (USA) - ¡Evitar, ambiguo!
Dec 07 2026   # Formato legible
```

> ⚠️ **Recomendación**: Siempre usar formato YYYY-MM-DD para evitar confusiones internacionales.

### Almacenamiento Interno en /etc/shadow

```bash
# Ejemplo de entrada en /etc/shadow para anita
anita:$6$...:19800:0:99999:7::20143:
#                                     │
#                                     └── Días desde 1970-01-01 hasta 2026-12-07

# Cálculo:
# 2026-12-07 = 20,143 días desde epoch (1970-01-01)
```

### Analogía: Fecha de Vencimiento en Pasaporte

- **Acceso relativo (7 días)**: "Tu pasaporte expira una semana después de que lo recibas"
- **Acceso absoluto (2026-12-07)**: "Tu pasaporte expira el 7 de diciembre de 2026"

La fecha absoluta es:

- Más fácil de recordar
- No depende de cuándo se emitió
- Coincide con documentación oficial
- Facilita la planificación

---

## 🛠️ Implementación Profesional

### Fase 1: Verificación Pre-Implementación

#### 1.1 Acceso al Sistema

```bash
# Conexión al servidor objetivo
ssh steve@172.16.238.11
sudo su -
```

#### 1.2 Verificar Estado Actual

```bash
# ¿Existe el usuario anita?
id anita
echo "Exit code: $?"  # 1 = no existe

# Verificar formato de fecha del sistema
date +%Y-%m-%d
# Salida: 2026-01-29 (ejemplo)

# Calcular días hasta expiración
echo $(( ($(date -d "2026-12-07" +%s) - $(date +%s)) / 86400 ))
# Salida: ~312 días
```

> ⚠️ **Advertencia**: Verifica que la fecha 2026-12-07 sea futura comparada con la fecha actual del sistema.

### Fase 2: Creación del Usuario anita

#### 2.1 Crear Usuario Estándar

```bash
# Crear usuario en minúsculas (estándar corporativo)
useradd -m -s /bin/bash anita

# Verificación inmediata
id anita
# Salida esperada: uid=1002(anita) gid=1002(anita) groups=1002(anita)

# Verificar creación correcta
grep anita /etc/passwd
# Salida: anita:x:1002:1002::/home/anita:/bin/bash
```

> 💡 **Nota técnica**: El protocolo de xFusionCorp requiere nombres de usuario en minúsculas para consistencia y compatibilidad con sistemas case-sensitive.

#### 2.2 Verificar Directorio Home

```bash
# Confirmar directorio creado
ls -la /home/anita
# Debe mostrar: drwxr-x--- 2 anita anita 4096 ... /home/anita

# Verificar permisos iniciales
ls -la /home/anita/
# Total 12
# drwxr-x--- 2 anita anita 4096 ... .
# drwxr-xr-x 4 root  root  4096 ... ..
# -rw-r--r-- 1 anita anita  220 ... .bash_logout
# -rw-r--r-- 1 anita anita 3771 ... .bashrc
# -rw-r--r-- 1 anita anita  807 ... .profile
```

### Fase 3: Configuración de Expiración Exacta

#### 3.1 Configurar Fecha Específica con chage

```bash
# Configurar expiración exacta: 7 de diciembre de 2026
chage -E 2026-12-07 anita

# Análisis del comando:
# chage     → Cambiar aging de contraseña
# -E        → Establecer fecha de expiración
# 2026-12-07 → Fecha exacta en formato ISO 8601
# anita     → Usuario objetivo

# Alternativa usando expansión de comando (si fecha es dinámica)
# chage -E $(date -d "2026-12-07" +%Y-%m-%d) anita
```

#### 3.2 Verificación Inmediata

```bash
# Verificar configuración con chage
chage -l anita

# Salida esperada:
# Last password change                    : Jan 29, 2026
# Password expires                        : never
# Password inactive                       : never
# Account expires                         : Dec 07, 2026  ← ¡VERIFICAR!
# Minimum number of days between password change      : 0
# Maximum number of days between password change      : 99999
# Number of days of warning before password expires   : 7
```

> ✅ **Confirmación**: La línea "Account expires" debe mostrar exactamente "Dec 07, 2026"

### Fase 4: Configuración Adicional

#### 4.1 Establecer Contraseña

```bash
# Establecer contraseña inicial segura
passwd anita

# Sistema solicitará:
# Changing password for user anita.
# New password: [Ingresar contraseña segura]
# Retype new password: [Confirmar]
# passwd: all authentication tokens updated successfully.
```

#### 4.2 Agregar Descripción (Opcional pero Recomendado)

```bash
# Documentar propósito en GECOS
usermod -c "Temporary Developer - Project Nautilus - Expires 2026-12-07" anita

# Verificar
grep anita /etc/passwd
# Ahora muestra: anita:x:1002:1002:Temporary Developer - Project Nautilus - Expires 2026-12-07:/home/anita:/bin/bash
```

### Fase 5: Verificación Exhaustiva

#### 5.1 Verificación Completa con múltiples métodos

```bash
# Método 1: chage -l
echo "=== Verificación con chage ==="
chage -l anita | grep "Account expires"

# Método 2: getent passwd
echo ""
echo "=== Verificación en /etc/passwd ==="
getent passwd anita

# Método 3: id
echo ""
echo "=== Verificación con id ==="
id anita

# Método 4: Verificar directorio
echo ""
echo "=== Verificación directorio home ==="
ls -la /home/anita

# Método 5: Verificar en /etc/shadow
echo ""
echo "=== Verificación en /etc/shadow ==="
grep anita /etc/shadow
```

#### 5.2 Prueba de Acceso

```bash
# Probar login como anita
su - anita

# Dentro de la sesión:
whoami        # Debe mostrar: anita
id            # Debe mostrar UID/GID
pwd           # Debe mostrar: /home/anita
date          # Verificar fecha del sistema

# Salir
exit
```

### Resumen de Comandos

```bash
# SECUENCIA COMPLETA

# 1. Verificación inicial
id anita
getent passwd anita
chage -l anita

# 2. Creación del usuario
useradd -m -s /bin/bash anita

# 3. Configurar fecha de expiración específica
chage -E 2026-12-07 anita

# 4. Establecer contraseña
passwd anita

# 5. Agregar descripción
usermod -c "Temporary Developer - Project Nautilus" anita

# 6. Verificación final
chage -l anita | grep "Account expires"
getent passwd anita
id anita
ls -la /home/anita
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              stapp02                                     │
│                    Nautilus App Server 2                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Proyecto: Nautilus                                                      │
│  Desarrolladora: anita                                                   │
│  Timeline: 2026-01-29 hasta 2026-12-07                                   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      Usuario: anita                               │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │                                                                   │   │
│  │  📅 Timeline de Acceso:                                           │   │
│  │                                                                   │   │
│  │  Ene 2026  ████████████████████████████████████████████████████  │   │
│  │  Feb 2026  ████████████████████████████████████████████████████  │   │
│  │  Mar 2026  ████████████████████████████████████████████████████  │   │
│  │  ...                                                                    │
│  │  Nov 2026  ████████████████████████████████████████████████████  │   │
│  │  Dic 01-06 ████████████████████████████████████████████████████  │   │
│  │  Dic 07    ████████████████████████████████████████████████████  │   │
│  │  Dic 08+   ❌ ACCESO BLOQUEADO AUTOMÁTICAMENTE                    │   │
│  │                                                                   │   │
│  │  🎯 Fecha Exacta de Expiración: 2026-12-07                        │   │
│  │     • Formato ISO: YYYY-MM-DD                                     │   │
│  │     • Formato legible: Dec 07, 2026                              │   │
│  │     • Epoch: 20,143 días desde 1970-01-01                        │   │
│  │                                                                   │   │
│  │  📊 Características:                                              │   │
│  │     • UID: 1002                                                   │   │
│  │     • GID: 1002                                                   │   │
│  │     • Shell: /bin/bash (desarrollo interactivo)                  │   │
│  │     • Home: /home/anita (workspace de desarrollo)                │   │
│  │     • Expiración: Automática, no requiere intervención           │   │
│  │                                                                   │   │
│  │  ✅ Configuración:                                                │   │
│  │     /etc/shadow: anita:...:20143                                 │   │
│  │     chage -l: Account expires: Dec 07, 2026                      │   │
│  │                                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Comparativa: Acceso Temporal Relativo vs. Absoluto

| Característica   | Reto 05 (Relativo)       | Reto 06 (Absoluto)    |
| ---------------- | ------------------------ | --------------------- |
| **Definición**   | +7 días desde creación   | 2026-12-07 específico |
| **Cálculo**      | Automático con `date -d` | Fecha hardcodeada     |
| **Uso típico**   | Accesos de soporte breve | Contratos, proyectos  |
| **Auditoría**    | Requiere cálculo         | Fecha inequívoca      |
| **Flexibilidad** | Alta                     | Fija                  |
| **Cumplimiento** | Buena                    | Excelente             |

### Checklist de Verificación

- [x] Usuario `anita` creado en minúsculas (estándar)
- [x] Directorio home `/home/anita` creado con permisos
- [x] Shell interactivo `/bin/bash` configurado
- [x] Expiración exacta configurada: **Dec 07, 2026**
- [x] UID/GID 1002:1002 asignado correctamente
- [x] Verificación con `chage -l` exitosa
- [x] Prueba de login funcional
- [x] Documentación GECOS agregada

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### Precisión en la Gestión de Accesos

> "En auditorías, 'aproximadamente' no existe. Las fechas exactas demuestran control y gobernanza."

Este reto refuerza:

- **Formato ISO 8601**: Estándar internacional sin ambigüedad
- **Documentación del Propósito**: El campo GECOS conecta el usuario con el proyecto
- **Verificación Múltiple**: `chage`, `getent`, `id`, y `/etc/shadow` deben coincidir
- **Consistencia de Estándares**: Minúsculas para nombres de usuario

### Lecciones Clave

1. **Fechas Exactas para Contratos**: Cuando hay un contrato con fecha de término, la cuenta debe expirar exactamente esa fecha.

2. **Formato ISO 8601**: YYYY-MM-DD elimina confusiones entre DD/MM/YYYY y MM/DD/YYYY.

3. **Verificación Inmediata**: Siempre validar con `chage -l` inmediatamente después de configurar.

4. **Documentación del Contexto**: El campo GECOS documenta no solo quién es, sino cuándo expira y por qué.

### Gestión de Fechas en Producción

```bash
# Convertir fechas para cálculos
expiry_epoch=$(date -d "2026-12-07" +%s)
today_epoch=$(date +%s)
days_remaining=$(( (expiry_epoch - today_epoch) / 86400 ))
echo "Días restantes: $days_remaining"

# Extender fecha de expiración (con autorización)
chage -E 2026-12-31 anita  # Nueva fecha de término

# Verificar todas las cuentas con expiración futura
for user in $(awk -F: '$8 > 0 {print $1}' /etc/shadow); do
  expiry_date=$(chage -l $user 2>/dev/null | grep "Account expires" | awk -F: '{print $2}' | xargs)
  if [ ! -z "$expiry_date" ] && [ "$expiry_date" != "never" ]; then
    echo "$user expira el: $expiry_date"
  fi
done
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 05**: Usuario Temporal con Expiración Relativa - Fundamentos
- **Reto 13**: Restricción de Cron - Control de programación
- **Reto 09**: Permisos de Scripts - Seguridad adicional

### Escenarios de Expansión

1. **Integración con Proyecto**:

   ```bash
   # Crear estructura de proyecto
   mkdir -p /home/anita/project-nautilus
   chown anita:anita /home/anita/project-nautilus

   # Configurar git
   su - anita -c "git config --global user.name 'Anita Developer'"
   su - anita -c "git config --global user.email 'anita@xfusioncorp.com'"
   ```

2. **Backup de Trabajo**:

   ```bash
   # Backup diario del trabajo de anita
   # En crontab de root
   0 23 * * * tar -czf /backup/anita/$(date +\%Y\%m\%d)_anita.tar.gz /home/anita/
   ```

3. **Auditoría Pre-Expiración**:
   ```bash
   # Alerta 30 días antes de expiración
   # Script para ejecutar diariamente
   days_to_expiry=$(( ($(date -d "2026-12-07" +%s) - $(date +%s)) / 86400 ))
   if [ $days_to_expiry -eq 30 ]; then
     echo "ALERTA: Usuario anita expira en 30 días" | mail -s "Expiración Próxima" admin@xfusioncorp.com
   fi
   ```

### Comandos para Profundizar

```bash
# Verificar todas las cuentas que expiran en 2026
awk -F: '$8 > 0 {
  cmd = "date -d \"1970-01-01 " $8 " days\" +%Y-%m-%d"
  cmd | getline expiry
  close(cmd)
  if (expiry ~ /^2026/) print $1 " expires " expiry
}' /etc/shadow

# Estadísticas de cuentas temporales
echo "Cuentas con expiración configurada:"
grep -v ':never:' /etc/shadow | awk -F: '$8 > 0 {count++} END {print count}'

# Fecha de expiración en formato legible desde shadow
epoch_days=$(grep "^anita:" /etc/shadow | cut -d: -f9)
date -d "1970-01-01 +$epoch_days days" +"%B %d, %Y"
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Linux Password Aging - Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_managing-users-and-groups_configuring-basic-system-settings)
- [Chage Manual](https://man7.org/linux/man-pages/man1/chage.1.html)
- [ISO 8601 Date Format](https://www.iso.org/iso-8601-date-and-time-format.html)

### Troubleshooting Común

| Síntoma                    | Causa Probable         | Solución                                  |
| -------------------------- | ---------------------- | ----------------------------------------- |
| "chage: invalid date"      | Formato incorrecto     | Usar YYYY-MM-DD exclusivamente            |
| Fecha en chage no coincide | Zona horaria           | Verificar `timedatectl`                   |
| "Account expires: never"   | No se aplicó cambio    | Reejecutar `chage -E`                     |
| Usuario con mayúsculas     | No siguió estándar     | Recrear con minúsculas                    |
| Epoch incorrecto en shadow | Cálculo manual erróneo | Dejar que `chage` calcule automáticamente |

### Mejores Prácticas

```bash
# ✅ HACER:
# Usar formato ISO 8601 siempre
chage -E 2026-12-07 anita

# Documentar contexto en GECOS
usermod -c "Project X - Expires 2026-12-07 - Manager: John Smith" anita

# Verificar inmediatamente después de configurar
chage -l anita | grep "Account expires"

# ❌ EVITAR:
# Formatos ambiguos
chage -E 12/07/2026 anita  # ¿Es julio o diciembre?

# Olvidar establecer contraseña
useradd -m anita && chage -E 2026-12-07 anita
# Falta: passwd anita

# Fechas en el pasado
chage -E 2020-01-01 anita  # ¡Expira inmediatamente!
```

---

## ✅ Estado del Reto

**✅ COMPLETADO EXITOSAMENTE** - 2026-01-29

- 📅 Fecha de ejecución: 2026-01-29
- ⏱️ Tiempo de ejecución: ~15 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidor objetivo: stapp02 (172.16.238.11)
- 👤 Usuario creado: anita
- 📅 Fecha de expiración: 2026-12-07

### Métricas de Éxito

✅ Usuario `anita` existe en `/etc/passwd`  
✅ Directorio home `/home/anita` creado con permisos  
✅ Shell interactivo `/bin/bash` configurado  
✅ Expiración exacta: **Dec 07, 2026**  
✅ UID/GID 1002:1002 asignado correctamente  
✅ Todos los requisitos cumplidos

### Lecciones Aprendidas

1. **Precisión en fechas**: Formato YYYY-MM-DD es crítico
2. **Consistencia de servidores**: Verificar servidor exacto en requisito
3. **Validación completa**: No omitir pasos de verificación
4. **Comandos de expiración**: `chage -E` es fundamental para usuarios temporales

---

_Documentación creada siguiendo estándares de SysAdmin - Precisión y Cumplimiento_
