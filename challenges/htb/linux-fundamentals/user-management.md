---
title: "Linux Fundamentals - User Management"
category: htb
difficulty: easy
tags: [linux, user-management, sudo, useradd, usermod, su]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 15
---

# Linux Fundamentals - User Management

## Objetivo

Aprender a gestionar usuarios en Linux: crear, modificar, eliminar cuentas de usuario, y ejecutar comandos con diferentes privilegios usando sudo y su.

---

## Conexión al Target

```bash
ssh htb-student@10.129.2.219
# Password: HTB_@cademy_stdnt!
```

---

## Preguntas y Soluciones

### Question 1: Crear Home Directory

**Pregunta:** Which option needs to be set to create a home directory for a new user using "useradd" command?

**Solución:**
```bash
useradd --help | grep -i home
```

**Output:**
```
  -m, --create-home             create the user's home directory
```

**Respuesta:** `-m`

**Explicación:**
- `-m` es la forma corta
- `--create-home` es la forma larga
- Sin esta opción, useradd crea el usuario pero no su directorio home

---

### Question 2: Lock User Account

**Pregunta:** Which option needs to be set to lock a user account using the "usermod" command? (long version of the option)

**Solución:**
```bash
usermod --help | grep -i lock
```

**Output:**
```
  -L, --lock                    lock the user account
```

**Respuesta:** `--lock`

**Explicación:**
- `--lock` bloquea la cuenta del usuario
- `-L` es la forma corta
- Bloquea la cuenta añadiendo `!` al hash de contraseña en `/etc/shadow`

---

### Question 3: Execute Command as Different User

**Pregunta:** Which option needs to be set to execute a command as a different user using "su" command? (long version of the option)

**Solución:**
```bash
su --help | grep -i command
```

**Output:**
```
  -c, --command COMMAND         pass a single COMMAND to the shell with -c
```

**Respuesta:** `--command`

**Explicación:**
- `--command` permite ejecutar un comando específico como otro usuario
- `-c` es la forma corta
- Ejemplo: `su -c "whoami" root`

---

## Conceptos Clave

### Comandos de Gestión de Usuarios

| Comando | Descripción |
|---------|-------------|
| `useradd` | Crear nuevo usuario |
| `userdel` | Eliminar usuario |
| `usermod` | Modificar usuario |
| `passwd` | Cambiar contraseña |
| `addgroup` | Crear grupo |
| `delgroup` | Eliminar grupo |
| `su` | Cambiar de usuario |
| `sudo` | Ejecutar como otro usuario |

### Opciones de useradd

| Opción | Descripción |
|--------|-------------|
| `-m, --create-home` | Crear directorio home |
| `-d, --home-dir` | Especificar directorio home |
| `-s, --shell` | Especificar shell |
| `-G, --groups` | Añadir a grupos secundarios |
| `-u, --uid` | Especificar UID |
| `-g, --gid` | Especificar GID principal |

### Opciones de usermod

| Opción | Descripción |
|--------|-------------|
| `-L, --lock` | Bloquear cuenta |
| `-U, --unlock` | Desbloquear cuenta |
| `-aG` | Añadir a grupos (append) |
| `-l` | Cambiar nombre de usuario |
| `-d` | Cambiar directorio home |
| `-s` | Cambiar shell |

### Opciones de su

| Opción | Descripción |
|--------|-------------|
| `-c, --command` | Ejecutar comando |
| `-l, --login` | Shell de login |
| `-s, --shell` | Especificar shell |
| `-` | Cargar entorno del usuario |

---

## Ejemplos Prácticos

### Crear Usuario Completo
```bash
# Crear usuario con home y shell específico
sudo useradd -m -s /bin/bash nuevo_usuario

# Establecer contraseña
sudo passwd nuevo_usuario

# Añadir a grupos
sudo usermod -aG sudo,docker nuevo_usuario
```

### Gestionar Cuentas
```bash
# Bloquear cuenta
sudo usermod --lock usuario

# Desbloquear cuenta
sudo usermod --unlock usuario

# Eliminar usuario
sudo userdel -r usuario  # -r elimina también el home
```

### Ejecutar como Otro Usuario
```bash
# Cambiar a root
su -

# Ejecutar un solo comando
su -c "cat /etc/shadow" root

# Con sudo
sudo cat /etc/shadow
sudo -u postgres psql
```

---

## Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `/etc/passwd` | Información de usuarios |
| `/etc/shadow` | Contraseñas hasheadas |
| `/etc/group` | Información de grupos |
| `/etc/gshadow` | Contraseñas de grupos |
| `/etc/skel/` | Plantilla para nuevos homes |

---

## Lecciones Aprendidas

1. **useradd -m:** Necesario para crear el directorio home
2. **usermod --lock:** Bloquea cuentas sin eliminarlas
3. **su --command:** Ejecuta comandos específicos como otro usuario
4. **sudo:** Preferido sobre su para tareas administrativas
5. **/etc/shadow:** Contiene los hashes de contraseñas (solo root puede leer)

---

## Referencias

- [useradd(8) - Linux manual](https://man7.org/linux/man-pages/man8/useradd.8.html)
- [usermod(8) - Linux manual](https://man7.org/linux/man-pages/man8/usermod.8.html)
- [su(1) - Linux manual](https://man7.org/linux/man-pages/man1/su.1.html)
- [sudo(8) - Linux manual](https://man7.org/linux/man-pages/man8/sudo.8.html)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 15 - User Management
- Respuestas correctas: 3/3
