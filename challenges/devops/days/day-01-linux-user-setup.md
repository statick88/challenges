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

## 🎯 Objetivo
Crear un usuario Linux con configuración de shell no interactiva como parte de las tareas de administración del sistema.

## 🏗️ Detalles de Infraestructura
- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Contraseña**: Ir0nM@n

---

## 🔧 Proceso de Solución

### Paso 1: Conectarse al App Server 1
```bash
ssh tony@172.16.238.10
```
Conexión exitosa al servidor stapp01.

### Paso 2: Crear usuario con shell no interactiva
```bash
sudo useradd -s /sbin/nologin newuser
```
Usuario creado con shell `/sbin/nologin` para prevenir login interactivo.

### Paso 3: Verificar creación del usuario
```bash
id newuser
cat /etc/passwd | grep newuser
```
Usuario creado exitosamente con shell no interactiva.

---

## ✅ Verificación
- Usuario existe en `/etc/passwd` con shell `/sbin/nologin`
- No puede iniciar sesión interactivamente (según requerimiento)
- Cuenta de usuario configurada correctamente

## 🐛 Solución de Problemas
No se encontraron problemas durante este reto.

## 📚 Aprendizajes Clave
- Las shells no interactivas (`/sbin/nologin`) previenen el login del usuario pero permiten ejecutar procesos
- El flag `useradd -s` especifica el shell de login
- Importante para cuentas de servicio y usuarios del sistema

## 🔗 Comandos Relacionados
- `useradd` - Crear nueva cuenta de usuario
- `usermod` - Modificar usuario existente
- `/sbin/nologin` - Shell no interactiva

## 📖 Recursos
- Documentación de administración de usuarios Linux
- Man pages para useradd y nologin

---

## 📊 Seguimiento de Tiempo
- **Hora de Inicio**: 10:00
- **Hora de Finalización**: 10:15
- **Duración Total**: 15 minutos

## 🏆 Criterios de Éxito Cumplidos
- [x] Usuario creado exitosamente
- [x] Shell no interactiva configurada
- [x] Usuario no puede iniciar sesión interactivamente

## 🌐 Contexto Adicional
Este reto forma parte del programa "100 Days of DevOps" diseñado para construir habilidades fundamentales de administración de sistemas Linux, preparando la base para retos más complejos de DevOps.
