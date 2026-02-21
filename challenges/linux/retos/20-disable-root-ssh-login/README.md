---
title: "Reto 20: Disable Direct Root SSH Login - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - security
  - hardening
date: 2026-02-21
status: completed
---

# Reto 20: Disable Direct Root SSH Login - xFusionCorp Industries

## Hardening SSH: Bloqueando el Acceso Directo de Root

---

## 🎓 Del Instructor

El equipo de seguridad de xFusionCorp ha implementado nuevos protocolos que incluyen la **restricción del login SSH directo de root** en todos los servidores.

> 💭 **Mentalidad de SysAdmin**: "El usuario root es la llave maestra del sistema. Permitir acceso SSH directo es como dejar la llave bajo el felpudo. Los atacantes saben esto y es el primer objetivo de ataques de fuerza bruta."

---

## 🎭 Escenario Real

**Empresa**: xFusionCorp Industries  
**Proyecto**: Stratos Datacenter - Hardening SSH  

### Requerimiento

> "Disable direct SSH root login on all app servers within the Stratos Datacenter."

### Infraestructura Objetivo

| Servidor | IP            | Usuario | Password  |
|----------|---------------|---------|-----------|
| stapp01  | 172.16.238.10 | tony    | Ir0nM@n   |
| stapp02  | 172.16.238.11 | steve   | Am3ric@   |
| stapp03  | 172.16.238.12 | banner  | BigGr33n  |

---

## 🛠️ Implementación Ejecutada

### Comandos por Servidor

```bash
# ============ stapp01 ============
ssh tony@stapp01
sudo sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
echo "PermitRootLogin no" | sudo tee -a /etc/ssh/sshd_config
sudo sshd -t && sudo systemctl restart sshd
exit

# ============ stapp02 ============
ssh steve@stapp02
sudo sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
echo "PermitRootLogin no" | sudo tee -a /etc/ssh/sshd_config
sudo sshd -t && sudo systemctl restart sshd
exit

# ============ stapp03 ============
ssh banner@stapp03
sudo sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
echo "PermitRootLogin no" | sudo tee -a /etc/ssh/sshd_config
sudo sshd -t && sudo systemctl restart sshd
exit
```

### Explicación de Comandos

| Comando | Propósito |
|---------|-----------|
| `sed -i '/PermitRootLogin/d'` | Elimina TODAS las líneas con PermitRootLogin (evita duplicados) |
| `echo "PermitRootLogin no" \| tee -a` | Agrega configuración correcta al final |
| `sshd -t` | Valida sintaxis antes de reiniciar |
| `systemctl restart sshd` | Aplica cambios |

---

## 🧠 Problema Encontrado y Solución

### Problema

Al ejecutar `sed` múltiples veces, se crearon líneas duplicadas:

```
PermitRootLogin yes
PermitRootLogin no
PermitRootLogin no
```

SSH usa la **primera coincidencia**, por lo que `yes` tomaba precedencia.

### Solución

Eliminar TODAS las líneas que contengan `PermitRootLogin` (comentadas o no) y agregar una sola línea correcta:

```bash
sudo sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
echo "PermitRootLogin no" | sudo tee -a /etc/ssh/sshd_config
```

---

## ✅ Verificación Final

```bash
thor@jumphost ~$ ssh root@stapp01
root@stapp01's password: 
Permission denied, please try again.
root@stapp01: Permission denied (publickey,gssapi-keyex,gssapi-with-mic,password).

thor@jumphost ~$ ssh root@stapp02
root@stapp02's password: 
Permission denied, please try again.
root@stapp02: Permission denied (publickey,gssapi-keyex,gssapi-with-mic,password).

thor@jumphost ~$ ssh root@stapp03
root@stapp03's password: 
Permission denied, please try again.
root@stapp03: Permission denied (publickey,gssapi-keyex,gssapi-with-mic,password).
```

### Resultado

| Servidor | `ssh root@server` | Estado |
|----------|-------------------|--------|
| stapp01 | `Permission denied` | ✅ OK |
| stapp02 | `Permission denied` | ✅ OK |
| stapp03 | `Permission denied` | ✅ OK |

---

## 🎓 Lecciones Aprendidas

1. **Configuraciones duplicadas**: SSH usa la primera coincidencia. Eliminar todas las líneas antes de agregar.

2. **Verificar antes de confiar**: `grep PermitRootLogin` debe mostrar UNA sola línea.

3. **Reiniciar el servicio**: Los cambios no aplican hasta `systemctl restart sshd`.

---

## ✅ Estado del Reto

**COMPLETADO** ✅

- 📅 Fecha: 2026-02-21
- ⏱️ Tiempo: 20 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidores: stapp01, stapp02, stapp03
