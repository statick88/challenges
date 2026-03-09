---
title: "Reto 14: Restrict Cron Access - xFusionCorp Industries"
category: linux
difficulty: hard
tags:
  - linux
  - ssh
  - user-management
  - security
  - permissions
date: 2025-01-25
status: blocked
---

# Reto 14: Restrict Cron Access - xFusionCorp Industries

## Control de Acceso a Cron: Previniendo Abuso del Programador de Tareas

---

## 🎓 Del Instructor

Bienvenido a tu decimocuarto desafío como SysAdmin Senior en xFusionCorp. Hoy implementamos control de acceso a **cron**, una de las herramientas más poderosas y potencialmente peligrosas del sistema.

> 💭 **Mentalidad de SysAdmin**: "Cron es como tener un sysadmin invisible que trabaja 24/7. Si cualquiera puede programar tareas, cualquiera puede instalar backdoors, miners de criptomonedas, o exfiltrar datos automáticamente."

En entornos empresariales, el acceso a cron debe ser privilegio, no derecho.

---

## 🎭 Escenario Real: Control de Tareas Programadas en Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Hardening de Sistema  
**Servidor**: App Server 3 (stapp03)  
**Tu rol**: Senior System Administrator - Control de Acceso

### La Problemática

El equipo de Seguridad de xFusionCorp identificó que múltiples usuarios tienen acceso a cron en stapp03, incluyendo:

- Usuarios de servicio con shell no-interactivo
- Cuentas compartidas
- Usuarios temporales que ya no deberían tener acceso

Riesgos identificados:

- Tareas maliciosas programadas para ejecutarse en horarios de poco tráfico
- Consumo de recursos por procesos no autorizados
- Dificultad para auditar quién programa qué

**El requerimiento del CISO**:

> "Restrict cron access to specific users per security policy."

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña |
| -------- | ------------- | ------------------------------- | -------------- | ---------- |
| stapp03  | 172.16.238.12 | stapp03.stratos.xfusioncorp.com | banner         | BigGr33n   |

### Requisitos Técnicos

- **Archivos de control**: `/etc/cron.allow` y `/etc/cron.deny`
- **Usuarios permitidos**: root, admin, backup_user
- **Usuarios denegados**: Todos los demás
- **Verificación**: Usuarios no permitidos no pueden crear cron jobs
- **Logging**: Monitorear intentos de acceso no autorizado

---

## 🧠 La Arquitectura: Control de Acceso a Cron

### Archivos de Control de Cron

```
/etc/cron.allow    # Lista blanca: usuarios explícitamente permitidos
/etc/cron.deny     # Lista negra: usuarios explícitamente denegados

Prioridad:
1. Si existe cron.allow: SOLO usuarios listados pueden usar cron
2. Si NO existe cron.allow pero existe cron.deny: Todos excepto los denegados
3. Si NO existe ninguno: Solo root puede usar cron (depende de configuración)
```

### Flujo de Decisión de Acceso

```
Usuario intenta ejecutar crontab -e
            │
            ▼
    ¿Existe /etc/cron.allow?
            │
    ┌───────┴───────┐
    │ Sí            │ No
    ▼               ▼
¿Está en lista?  ¿Existe /etc/cron.deny?
    │               │
┌───┴───┐      ┌────┴────┐
│Sí  No │      │Sí       │No
▼     ▼        ▼         ▼
✅   ❌     ¿Está en    ✅
PERMITIDO DENEGADO lista?
               │
          ┌────┴────┐
          │Sí      No│
          ▼         ▼
         ❌        ✅
       DENEGADO PERMITIDO
```

---

## 🛠️ Implementación Profesional

### Fase 1: Verificación Actual

```bash
# Conexión al servidor
ssh banner@172.16.238.12
sudo su -

# Verificar archivos de control existentes
ls -la /etc/cron.allow /etc/cron.deny 2>/dev/null

# Verificar qué usuarios tienen cron jobs actualmente
for user in $(cut -d: -f1 /etc/passwd); do
    crontab -u $user -l 2>/dev/null | grep -v "^#" | grep -v "^$" > /dev/null && echo "$user tiene cron jobs"
done
```

### Fase 2: Configurar Control de Acceso

```bash
# Crear archivo cron.allow
cat > /etc/cron.allow << 'EOF'
root
admin
backup_user
EOF

# Crear/actualizar archivo cron.deny (opcional si usamos allow)
cat > /etc/cron.deny << 'EOF'
# Denegar todos los demás usuarios
# Se pueden agregar usuarios específicos si es necesario
EOF

# Establecer permisos seguros
chmod 644 /etc/cron.allow
chmod 644 /etc/cron.deny
chown root:root /etc/cron.allow /etc/cron.deny
```

### Fase 3: Aplicar Cambios

```bash
# Reiniciar servicio cron
systemctl restart crond

# O en algunos sistemas
# systemctl restart cron

# Verificar estado
systemctl status crond
```

### Fase 4: Verificación

```bash
# Probar como usuario permitido
su - backup_user -c "crontab -l"
# Debe funcionar (puede mostrar vacío o jobs existentes)

# Probar como usuario NO permitido
su - regularuser -c "crontab -e"
# Debe mostrar: "You (regularuser) are not allowed to use this program"
```

### Resumen de Comandos

```bash
# Crear cron.allow
cat > /etc/cron.allow << 'EOF'
root
admin
backup_user
EOF

# Configurar permisos
chmod 644 /etc/cron.allow
chown root:root /etc/cron.allow

# Reiniciar cron
systemctl restart crond

# Verificar
su - backup_user -c "crontab -l"  # Debe funcionar
su - otheruser -c "crontab -e"     # Debe fallar
```

---

## 🎯 Análisis Post-Implementación

### Arquitectura de Control

```
┌─────────────────────────────────────────────────────────────────────────┐
│              CONTROL DE ACCESO A CRON IMPLEMENTADO                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  /etc/cron.allow                                                         │
│  ├── root              ◄── Permitido                                    │
│  ├── admin             ◄── Permitido                                    │
│  └── backup_user       ◄── Permitido                                    │
│                                                                          │
│  /etc/cron.deny                                                          │
│  └── (vacío o comentarios)                                              │
│                                                                          │
│  ACCESO RESULTANTE:                                                      │
│  ✅ root        → Puede usar cron                                       │
│  ✅ admin       → Puede usar cron                                       │
│  ✅ backup_user → Puede usar cron                                       │
│  ❌ other_user  → DENEGADO                                              │
│  ❌ any_user    → DENEGADO (si no está en allow)                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Reflexión Final

### El Principio del Menor Privilegio

> "No todos necesitan programar tareas. Solo quienes tienen una necesidad legítima."

Lecciones clave:

- cron.allow es más seguro que cron.deny (lista blanca > lista negra)
- Solo root debería poder editar los archivos de control
- Monitorear regularmente quién tiene acceso
- Auditar cron jobs existentes periódicamente

---

## 🚀 Siguientes Pasos

- Implementar auditoría de cron jobs existentes
- Configurar alertas para intentos de acceso no autorizado
- Establecer políticas de retención de logs de cron

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 20 minutos
- 🎯 Dificultad: Difícil

### Criterios de Éxito

- ✅ Solo usuarios especificados pueden usar cron
- ✅ Usuarios no autorizados bloqueados correctamente
- ✅ Servicios cron funcionando para usuarios permitidos
- ✅ Logs de acceso monitoreados

---

_Documentación creada siguiendo estándares de SysAdmin - Control de Acceso_
