---
title: "Reto 17: Firewall Configuration - xFusionCorp Industries"
category: linux
difficulty: hard
tags:
  - linux
  - ssh
  - user-management
  - firewall
  - security
date: 2025-01-25
status: blocked
---

# Reto 17: Firewall Configuration - xFusionCorp Industries

## Configuración de Firewall: El Perímetro de Defensa del Sistema

---

## 🎓 Del Instructor

Bienvenido a tu decimoséptimo desafío como SysAdmin Senior en xFusionCorp. Hoy configuramos el **firewall**, la primera línea de defensa contra accesos no autorizados.

> 💭 **Mentalidad de SysAdmin**: "Un servidor sin firewall es como una casa sin puertas. Puede ser la más segura del mundo, pero cualquiera puede entrar. El firewall no es opcional; es obligatorio."

En entornos empresariales, el firewall es obligatorio y debe seguir el principio de **mínimo privilegio**: denegar todo por defecto, permitir solo lo necesario.

---

## 🎭 Escenario Real: Hardening de Perímetro en Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Seguridad de Perímetro  
**Servidor**: App Server 1 (stapp01)  
**Tu rol**: Senior System Administrator - Seguridad de Red

### La Problemática

El servidor stapp01 aloja servicios críticos pero actualmente:

- No tiene firewall activo
- Todos los puertos están expuestos
- No hay política de denegación por defecto
- Cualquier servicio puede ser accedido desde cualquier lugar

**Servicios requeridos**:

- SSH (administración remota)
- HTTP (servicio web)
- HTTPS (servicio web seguro)

**El requerimiento del CISO**:

> "Configure firewall according to corporate security policies."

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña |
| -------- | ------------- | ------------------------------- | -------------- | ---------- |
| stapp01  | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony           | Ir0nM@n    |

### Requisitos Técnicos

- **Firewall**: iptables o firewalld
- **Reglas entrantes**: SSH (22), HTTP (80), HTTPS (443)
- **Reglas salientes**: Permitir todo
- **Política**: DROP por defecto para entrante
- **Persistencia**: Reglas que sobreviven reboot
- **Logging**: Conexiones denegadas

---

## 🧠 La Arquitectura: Firewall en Linux

### Cadenas de iptables

```
┌─────────────────────────────────────────────────────────────────┐
│              CADENAS DE IPTABLES                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PAQUETE ENTRANTE                                                │
│       │                                                          │
│       ▼                                                          │
│  ┌────────────┐                                                 │
│  │   PREROUTING │  (NAT, redirección)                           │
│  └──────┬───────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌────────────┐    ┌────────────┐                                │
│  │    INPUT    │◄───│  FORWARD   │                               │
│  │             │    │  (rutado)   │                               │
│  └──────┬──────┘    └────────────┘                                │
│         │                                                        │
│         ▼                                                        │
│    PROCESO LOCAL                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌────────────┐    ┌────────────┐                                │
│  │   OUTPUT    │───►│ POSTROUTING │                               │
│  │             │    │   (NAT)     │                               │
│  └────────────┘    └────────────┘                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Firewalld vs Iptables

| Característica     | Firewalld        | Iptables         |
| ------------------ | ---------------- | ---------------- |
| **Configuración**  | Zonas, servicios | Reglas directas  |
| **Persistencia**   | Automática       | Requiere guardar |
| **Facilidad**      | Más fácil        | Más flexible     |
| **RHEL/CentOS 7+** | Default          | Disponible       |
| **Debian/Ubuntu**  | Opcional         | Default          |

---

## 🛠️ Implementación Profesional

### Opción A: Configuración con Firewalld

```bash
# Conexión al servidor
ssh tony@172.16.238.10
sudo su -

# Iniciar y habilitar firewalld
systemctl start firewalld
systemctl enable firewalld

# Verificar estado
firewall-cmd --state

# Configurar servicios permitidos
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# Establecer zona por defecto
firewall-cmd --permanent --set-default-zone=public

# Recargar configuración
firewall-cmd --reload

# Verificar reglas
firewall-cmd --list-all
```

### Opción B: Configuración con Iptables

```bash
# Limpiar reglas existentes
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# Política por defecto
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Permitir loopback
iptables -A INPUT -i lo -j ACCEPT

# Permitir conexiones establecidas
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Permitir SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Permitir HTTP
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Permitir HTTPS
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Guardar reglas (CentOS/RHEL)
service iptables save

# O en Debian/Ubuntu
iptables-save > /etc/iptables/rules.v4

# Verificar reglas
iptables -L -n -v
```

### Resumen de Comandos

```bash
# CON FIREWALLD:
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
firewall-cmd --list-all

# CON IPTABLES:
iptables -P INPUT DROP
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
service iptables save
```

---

## 🎯 Análisis Post-Implementación

```
┌─────────────────────────────────────────────────────────────────────────┐
│              FIREWALL CONFIGURADO - stapp01                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  POLÍTICA POR DEFECTO:                                                   │
│  ├── INPUT: DROP                                                        │
│  ├── FORWARD: DROP                                                      │
│  └── OUTPUT: ACCEPT                                                     │
│                                                                          │
│  REGLAS PERMITIDAS:                                                      │
│  ├── Puerto 22 (SSH)     ◄── Administración remota                      │
│  ├── Puerto 80 (HTTP)    ◄── Servicio web                               │
│  └── Puerto 443 (HTTPS)  ◄── Servicio web seguro                        │
│                                                                          │
│  REGLAS IMPLÍCITAS:                                                      │
│  ├── Loopback (lo) permitido                                            │
│  ├── Conexiones establecidas permitidas                                 │
│  └── Todo lo demás DENEGADO                                             │
│                                                                          │
│  ✅ SEGURIDAD IMPLEMENTADA:                                              │
│     • Política restrictiva por defecto                                  │
│     • Solo servicios necesarios expuestos                               │
│     • Reglas persistentes                                               │
│     • Superficie de ataque minimizada                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Reflexión Final

### El Principio del Mínimo Privilegio

> "Denegar todo, permitir solo lo necesario."

Lecciones clave:

- DROP por defecto es la única política segura
- Cada puerto abierto es un riesgo
- Documentar por qué cada puerto está abierto
- Revisar reglas periódicamente

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 30 minutos
- 🎯 Dificultad: Difícil

### Criterios de Éxito

- ✅ Firewall activo con políticas configuradas
- ✅ Solo puertos necesarios abiertos (22,80,443)
- ✅ Política DROP por defecto
- ✅ Reglas persistentes
- ✅ Logs de conexiones

---

_Documentación creada siguiendo estándares de SysAdmin - Seguridad de Red_
