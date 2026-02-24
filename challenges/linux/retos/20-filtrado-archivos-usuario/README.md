---
title: "Reto 20: Filtrado y Copia de Archivos de Usuario - Nautilus App Server 2"
category: linux
difficulty: medium
tags:
  - linux
  - ssh
  - file-management
  - find
  - user-management
  - data-recovery
date: 2026-02-20
status: completed
---

# Reto 20: Filtrado y Copia de Archivos de Usuario - Nautilus App Server 2

## Gestión de Datos de Usuarios en Servidores de Producción

---

## 🎓 Del Instructor

Bienvenido a tu décimonoveno desafío como SysAdmin en xFusionCorp. Este es un escenario común en entornos de producción: **la recuperación y filtrado de datos de usuarios** después de un incidente de configuración.

> 💭 **Mentalidad de SysAdmin**: "En producción, los datos son oro. Un comando mal ejecutado puede significar pérdida de información crítica. Antes de mover o copiar archivos, siempre verifica qué estás moviendo y por qué."

Este reto simula un problema real: datos de usuarios mezclados accidentalmente que deben ser separados y organizados correctamente.

---

## 🎭 Escenario Real: Mezcla de Datos en Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Corrección de Datos  
**Servidor**: App Server 2 (stapp02)  
**Tu rol**: System Administrator - Recuperación de Datos

### La Problemática

El equipo de soporte de Nautilus en Stratos DC cometió un error durante una migración:

> "Due to an accidental data mix-up, user data was unintentionally mingled on Nautilus App Server 2 at the /home/usersdata location."

Los datos de diferentes usuarios están mezclados en el directorio `/home/usersdata`. Tu trabajo es:
1. Identificar los archivos del usuario **mariyam**
2. Copiarlos manteniendo la estructura de directorios
3. Ubicarlos en `/media` para su posterior procesamiento

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña |
| -------- | ------------- | ------------------------------- | -------------- | ---------- |
| stapp02  | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve          | Am3ric@    |

### Requisitos Técnicos

- **Directorio origen**: `/home/usersdata`
- **Usuario objetivo**: mariyam
- **Tipo de archivos**: Solo archivos (excluir directorias)
- **Directorio destino**: `/media`
- **Condición**: Preservar estructura de directorios

---

## 🧠 La Arquitectura: Sistema de Archivos Linux

### El Comando `find`: Tu Herramienta de Búsqueda

`find` es el comando más poderoso para buscar archivos en Linux:

```bash
find [ruta] [opciones] [acción]
```

### Opciones Clave para Este Reto

| Opción | Descripción | Uso en Este Reto |
|--------|-------------|------------------|
| `-type f` | Busca solo archivos | Excluir directorias |
| `-type d` | Busca solo directorios | Alternativa |
| `-user USUARIO` | Archivos propiedad de USUARIO | Filtrar por mariyam |
| `-exec COMANDO` | Ejecutar comando por cada resultado | Copiar archivos |

### Preservando Estructura de Directorios

El desafío principal es mantener la estructura de directorios al copiar. Hay varias formas:

**Método 1: cp con --parents**
```bash
find /origen -type f -user USUARIO -exec cp --parents {} /destino/ \;
```

**Método 2: rsync (más eficiente)**
```bash
rsync -av --include='*/' --include='*' --exclude='*' --owner USUARIO /origen/ /destino/
```

**Método 3: find + cpio**
```bash
find /origen -type f -user USUARIO | cpio -pdm /destino/
```

---

## 🛠️ Implementación: Paso a Paso

### Paso 1: Conexión al Servidor

```bash
ssh steve@172.16.238.11
```

**Análisis del comando:**
- `ssh`: Protocolo de conexión segura
- `steve`: Usuario con acceso al servidor
- `172.16.238.11`: IP del servidor stapp02

### Paso 2: Acceso Root

```bash
sudo su -
```

**Nota de seguridad**: Necesitas privilegios de root para:
- Acceder a archivos de otros usuarios
- Escribir en `/media`

### Paso 3: Verificar Estructura de Origen

```bash
ls -la /home/usersdata/
```

Deberías ver una estructura típica de aplicación web (posiblemente WordPress).

### Paso 4: Identificar Archivos de mariyam

```bash
find /home/usersdata -type f -user mariyam
```

**Análisis:**
- `find`: Comando de búsqueda
- `/home/usersdata`: Directorio donde buscar
- `-type f`: Solo archivos (excluir directorias)
- `-user mariyam`: Solo archivos propiedad de mariyam

### Paso 5: Copiar Archivos con Estructura

```bash
cd /home/usersdata
find . -type f -user mariyam -exec cp --parents {} /media/ \;
```

**Análisis:**
- `cd /home/usersdata`: Cambiamos al directorio para rutas relativas
- `find .`: Buscar en directorio actual
- `-type f`: Solo archivos
- `-user mariyam`: Propietario mariyam
- `-exec cp --parents {} /media/ \;`: Copiar cada archivo, preservando ruta relativa

**La opción `--parents`**:
- Mantiene la estructura de directorios relativa
- Si el archivo es `./wp-includes/functions.php`, lo copia a `/media/wp-includes/functions.php`

### Paso 6: Verificar Copia

```bash
ls -la /media/
ls -la /media/wp-includes/ | head -20
ls -la /media/wp-admin/ | head -10
```

Deberías ver:
- `/media/` con estructura de directorios
- `/media/wp-includes/`
- `/media/wp-admin/`
- `/media/wp-content/`

---

## ✅ Verificación del Reto

### Checklist de Éxito

- [ ] Archivos de mariyam identificados con `find`
- [ ] Solo archivos copiados (no directorias)
- [ ] Estructura de directorios preservada en `/media`
- [ ] Todos los archivos visibles en `/media/`

### Comando de Verificación Final

```bash
# Contar archivos copiados
find /media -type f | wc -l

# Verificar estructura
ls -la /media/
tree -L 2 /media/ 2>/dev/null || find /media -maxdepth 2 -type d
```

---

## 🎯 Análisis Post-Implementación

### ¿Qué acabas de aprender?

1. **Búsqueda avanzada con find**: Filtrar por usuario, tipo de archivo
2. **Preservación de estructura**: Usar `--parents` o rsync
3. **Gestión de permisos**: Trabajar con archivos de otros usuarios
4. **Verificación**: Confirmar que la operación fue exitosa

### Escenarios del Mundo Real

Este tipo de tarea es común en:
- **Migraciones de servidores**: Separar datos de usuarios
- **Recuperación de desastres**: Extraer datos específicos
- **Auditorías**: Aislar archivos de usuarios específicos
- **Limpieza de servidores**: Separar datos mezclados

---

## 🛠️ Comandos de Referencia

### Find Avanzado

```bash
# Archivos de un usuario específico
find /ruta -type f -user USUARIO

# Archivos modificados en los últimos 7 días
find /ruta -type f -mtime -7

# Archivos mayores a 1MB
find /ruta -type f -size +1M

# Buscar y copiar con preserve
find /origen -type f -user USUARIO -exec cp -a {} /destino/ \;

# Usar rsync para mejor rendimiento
rsync -av --files-from=<(find /origen -type f -user USUARIO) / /destino/
```

### Permisos y Propietarios

```bash
# Ver propietario de archivos
ls -la /ruta

# Cambiar propietario
chown USUARIO:GRUPO /ruta

# Verificar propietario con find
find /ruta -type f -user USUARIO -ls
```

---

## 🚀 Próximos Pasos

Con este reto has completado:
- ✅ Gestión de usuarios
- ✅ Permisos y propiedad
- ✅ Búsqueda y filtrado de archivos
- ✅ Recuperación de datos

### Siguiente Nivel
- Automatización con scripts
- Programación de tareas de mantenimiento
- Backup automatizado de datos de usuarios

---

## 📚 Recursos

- `man find`: Documentación completa de find
- `man cp`: Opciones de cp incluyendo --parents
- `man rsync`: Sincronización eficiente de archivos

---

## ✅ Estado del Laboratorio

**COMPLETADO EXITOSAMENTE** 🎉

- 📅 Fecha de ejecución: 2026-02-20
- ⏱️ Tiempo dedicado: 10-15 minutos
- 🎯 Nivel: Medio - Gestión de Archivos
- 💼 Habilidades: find, cp, permisos, estructura de directorios

---

> **Nota del Instructor**: "La gestión de archivos es una habilidad fundamental. Un SysAdmin pasa más tiempo moviendo, copiando y organizando archivos que creando usuarios. Domina find y tus tareas de administración serán mucho más eficientes."

**¿Listo para tu próxima misión, SysAdmin?**
