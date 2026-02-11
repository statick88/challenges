---
title: "Reto 06: Linux User Data Transfer - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - permissions
  - backup
date: 2025-01-25
status: in-progress
---

# Reto 06: Linux User Data Transfer - xFusionCorp Industries

## Migración de Datos entre Sistemas: Preservación y Verificación

---

## 🎓 Del Instructor

Bienvenido a tu séptimo desafío como SysAdmin Senior en xFusionCorp. Hoy enfrentamos uno de los escenarios más comunes en administración de sistemas: **la migración de datos de usuario entre servidores**.

> 💭 **Mentalidad de SysAdmin**: "La migración de datos no es solo copiar archivos; es preservar integridad, permisos, ownership y estructura. Un archivo copiado con permisos incorrectos es un archivo potencialmente inutilizable o inseguro."

En entornos empresariales, las migraciones son inevitables: actualizaciones de hardware, consolidación de servidores, reestructuraciones de proyectos. La diferencia entre un SysAdmin junior y uno senior está en cómo se ejecuta la migración.

---

## 🎭 Escenario Real: Migración de Proyecto Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Consolidación de Infraestructura  
**Infraestructura**: stapp01 (origen) → stapp03 (destino)  
**Tu rol**: Senior System Administrator - Migración de Datos

### La Problemática

El equipo de operaciones de xFusionCorp está consolidando servidores para optimizar recursos. El proyecto Nautilus ha sido reestructurado:

- **Servidor origen**: stapp01 (será descomisionado)
- **Servidor destino**: stapp03 (recibirá los datos)
- **Usuario afectado**: old_user → new_user
- **Datos críticos**: Directorio home completo con configuraciones, scripts y documentación

**El requerimiento del equipo de Arquitectura**:

> "Transfer user data between different systems and user accounts."

### Contexto de Migración

La migración debe cumplir con:

- **Integridad**: Todos los archivos deben transferirse completamente
- **Preservación**: Permisos, timestamps y ownership deben mantenerse
- **Verificación**: Confirmar que los datos son idénticos en origen y destino
- **Minimización de downtime**: El usuario debe poder trabajar lo antes posible

### Infraestructura Objetivo

| Rol     | Servidor | IP            | Usuario Acceso | Contraseña | Propósito          |
| ------- | -------- | ------------- | -------------- | ---------- | ------------------ |
| Origen  | stapp01  | 172.16.238.10 | tony           | Ir0nM@n    | Source server      |
| Destino | stapp03  | 172.16.238.12 | banner         | BigGr33n   | Destination server |

### Requisitos Técnicos

- **Origen**: Directorio `/home/old_user` en stapp01
- **Destino**: `/home/new_user` en stapp03
- **Método**: `rsync` o `scp` con preservación de permisos
- **Preservar**: Permisos, timestamps, ownership
- **Verificación**: Integridad de datos transferidos
- **Cuentas**: old_user en origen, new_user en destino

---

## 🧠 La Arquitectura: Migración de Datos en Linux

### Desafíos de la Migración

Cuando migras datos entre sistemas, enfrentas varios desafíos:

```bash
# Problema 1: Permisos
# En origen: -rw-rw---- old_user:old_user
# En destino: -rw-rw---- 1001:1001 (UID/GID sin resolver)

# Problema 2: Timestamps
# Los tiempos de modificación deben preservarse para auditoría

# Problema 3: Enlaces simbólicos
# Pueden romperse si las rutas absolutas cambian

# Problema 4: Atributos extendidos
# SELinux contexts, ACLs, etc.
```

### Herramientas de Migración

| Herramienta   | Caso de Uso                        | Ventajas                              | Desventajas                   |
| ------------- | ---------------------------------- | ------------------------------------- | ----------------------------- |
| **rsync**     | Migración completa, sincronización | Preserva todo, reanudable, compresión | Más complejo                  |
| **scp**       | Transferencia simple, única        | Simple, universal                     | No reanudable, menos opciones |
| **tar + scp** | Backup + transferencia             | Compresión, preservación              | Dos pasos                     |
| **dd**        | Imagen bit-a-bit                   | Exacto                                | Ineficiente para archivos     |

### Opciones Críticas de Preservación

```bash
# Opciones de rsync para preservación completa:
-a, --archive       # Modo archivo (equivale a -rlptgoD)
-r, --recursive     # Directorios recursivamente
-l, --links         # Copiar symlinks como symlinks
-p, --perms         # Preservar permisos
-t, --times         # Preservar tiempos de modificación
-g, --group         # Preservar grupo
-o, --owner         # Preservar owner (requiere root)
-D, --devices       # Preservar dispositivos (root)
-v, --verbose       # Modo verbose
-z, --compress      # Comprimir durante transferencia
```

### Flujo de Trabajo de Migración

```
┌────────────────────────────────────────────────────────────────┐
│                     PROCESO DE MIGRACIÓN                        │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐              │
│  │  FASE 1  │      │  FASE 2  │      │  FASE 3  │              │
│  │Preparación│─────→│ Transfer │─────→│ Verificación│           │
│  └──────────┘      └──────────┘      └──────────┘              │
│        │                │                 │                     │
│        ▼                ▼                 ▼                     │
│  • Backup datos    • rsync/scp      • Comparar checksums       │
│  • Verificar       • Preservar      • Verificar permisos        │
│    integridad        metadatos      • Validar funcionamiento    │
│  • Notificar       • Monitorear     • Documentar                │
│    usuarios          progreso                                     │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

### Analogía: Mudanza de Oficina Profesional

- **Migración amateur**: Meter todo en cajas sin etiquetar, transportar, y descubrir que no sabes qué va dónde
- **Migración profesional**:
  - Inventario antes de mover (backup/verificación)
  - Cajas etiquetadas con contenido y dueño (preservación de permisos)
  - Transporte cuidadoso (rsync con opciones apropiadas)
  - Verificación al llegar (checksums/comparación)
  - Todo funciona en la nueva ubicación (validación)

---

## 🛠️ Implementación Profesional

### Fase 1: Preparación en Servidor Origen (stapp01)

#### 1.1 Acceso y Verificación

```bash
# Conexión al servidor origen
ssh tony@172.16.238.10
sudo su -

# Verificar datos a migrar
ls -la /home/old_user
# Revisar tamaño
du -sh /home/old_user

# Verificar permisos actuales
find /home/old_user -type f | head -10
ls -la /home/old_user/
```

> ⚠️ **Advertencia**: Siempre verifica el espacio disponible en destino antes de iniciar transferencias grandes.

#### 1.2 Crear Backup de Seguridad

```bash
# Crear directorio de backup
mkdir -p /tmp/migration_backup

# Crear tarball comprimido con preservación completa
cd /home
tar -czpf /tmp/migration_backup/old_user_backup_$(date +%Y%m%d_%H%M%S).tar.gz old_user/

# Flags:
# -c = create
# -z = gzip compression
# -p = preserve permissions
# -f = file

# Verificar backup creado
ls -lh /tmp/migration_backup/
tar -tzf /tmp/migration_backup/old_user_backup_*.tar.gz | head -20
```

#### 1.3 Generar Checksums para Verificación

```bash
# Generar checksums de todos los archivos en origen
find /home/old_user -type f -exec md5sum {} \; > /tmp/source_checksums.txt

# Contar archivos
wc -l /tmp/source_checksums.txt

# Verificar algunos checksums
head -10 /tmp/source_checksums.txt
```

### Fase 2: Transferencia de Datos

#### 2.1 Método 1: rsync Directo (Recomendado)

```bash
# Desde stapp01, transferir directamente a stapp03 usando rsync

# Primero, asegurar que new_user existe en destino
# (esto se ejecuta en stapp03 primero)

# Luego, desde stapp01:
rsync -avz --progress /home/old_user/ banner@172.16.238.12:/tmp/old_user_data/

# Flags:
# -a = archive (preserva todo)
# -v = verbose
# -z = compress during transfer
# --progress = mostrar progreso
# Nota: La barra final en /home/old_user/ es importante (copia contenido, no directorio)
```

> 💡 **Nota técnica**: La barra al final del directorio origen (`/home/old_user/`) indica a rsync que copie el contenido, no el directorio completo.

#### 2.2 Método 2: Tar + SCP (Alternativa)

```bash
# Desde stapp01, crear tarball y transferir

# Crear tarball
 tar -czf /tmp/user_data_backup.tar.gz /home/old_user

# Transferir a stapp03 usando scp
scp -C /tmp/user_data_backup.tar.gz banner@172.16.238.12:/tmp/

# Flags:
# -C = compression during transfer
```

#### 2.3 Método 3: Transferencia con Preservación de Ownership (Si usuarios existen en destino)

```bash
# Si new_user ya existe en stapp03 con el mismo UID/GID:
# En stapp01:
rsync -avz --rsync-path="sudo rsync" /home/old_user/ banner@172.16.238.12:/home/new_user/

# Si los UIDs son diferentes, necesitarás ajustar ownership después
```

### Fase 3: Restauración en Servidor Destino (stapp03)

#### 3.1 Preparación en stapp03

```bash
# Conexión al servidor destino
ssh banner@172.16.238.12
sudo su -

# Crear usuario new_user si no existe
id new_user || useradd -m -s /bin/bash new_user

# Verificar directorio home creado
ls -la /home/new_user
```

#### 3.2 Extraer y Restaurar Datos (Método Tar)

```bash
# Si usaste el método tar + scp:
cd /home/

# Extraer tarball
 tar -xzpf /tmp/user_data_backup.tar.gz

# Mover datos al directorio correcto (si es necesario)
# mv /home/old_user/* /home/new_user/
# O si el tarball contenía la estructura correcta:
# Los datos ya están en /home/old_user/
```

#### 3.3 Ajustar Ownership

```bash
# Ajustar ownership de los datos transferidos al nuevo usuario
chown -R new_user:new_user /home/new_user

# Verificar cambio
ls -la /home/new_user
```

### Fase 4: Verificación de Integridad

#### 4.1 Verificación de Archivos

```bash
# Generar checksums en destino
find /home/new_user -type f -exec md5sum {} \; > /tmp/destination_checksums.txt

# Comparar número de archivos
echo "Archivos en origen: $(wc -l < /tmp/source_checksums.txt)"
echo "Archivos en destino: $(wc -l < /tmp/destination_checksums.txt)"

# Comparar checksums (requiere transferir source_checksums.txt a destino)
# En stapp01:
scp /tmp/source_checksums.txt banner@172.16.238.12:/tmp/

# En stapp03:
diff /tmp/source_checksums.txt /tmp/destination_checksums.txt
# Si no hay salida, los archivos son idénticos
```

#### 4.2 Verificación de Permisos

```bash
# Comparar permisos entre origen y destino
# En stapp01:
ls -laR /home/old_user > /tmp/source_permissions.txt

# En stapp03:
ls -laR /home/new_user > /tmp/dest_permissions.txt

# Comparar (después de transferir source_permissions.txt)
diff /tmp/source_permissions.txt /tmp/dest_permissions.txt
```

#### 4.3 Verificación de Tamaño

```bash
# Comparar tamaño total
echo "Tamaño en origen (stapp01):"
du -sh /home/old_user

echo "Tamaño en destino (stapp03):"
du -sh /home/new_user

# Deben ser idénticos (o muy cercanos)
```

### Resumen de Comandos Completo

```bash
# EN SERVIDOR ORIGEN (stapp01):
# =============================

# 1. Conexión y preparación
ssh tony@172.16.238.10
sudo su -

# 2. Verificar datos
ls -la /home/old_user
du -sh /home/old_user

# 3. Crear backup
tar -czf /tmp/user_data_backup.tar.gz /home/old_user

# 4. Generar checksums
find /home/old_user -type f -exec md5sum {} \; > /tmp/source_checksums.txt

# 5. Transferir a destino
scp /tmp/user_data_backup.tar.gz banner@172.16.238.12:/tmp/
scp /tmp/source_checksums.txt banner@172.16.238.12:/tmp/

# EN SERVIDOR DESTINO (stapp03):
# =============================

# 1. Conexión y preparación
ssh banner@172.16.238.12
sudo su -

# 2. Crear usuario destino
useradd -m -s /bin/bash new_user

# 3. Extraer datos
cd /home/
 tar -xzf /tmp/user_data_backup.tar.gz

# 4. Ajustar ownership
chown -R new_user:new_user /home/new_user

# 5. Verificación
find /home/new_user -type f -exec md5sum {} \; > /tmp/destination_checksums.txt
diff /tmp/source_checksums.txt /tmp/destination_checksums.txt

# 6. Verificación final
ls -la /home/new_user
du -sh /home/new_user
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       MIGRACIÓN DE DATOS COMPLETADA                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ORIGEN: stapp01 (172.16.238.10)                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  /home/old_user/                                                  │   │
│  │  ├── Documentos/                                                  │   │
│  │  ├── Scripts/                                                     │   │
│  │  ├── Configuraciones/                                             │   │
│  │  └── .bashrc, .profile                                            │   │
│  │                                                                   │   │
│  │  Permisos: old_user:old_user                                     │   │
│  │  UID/GID: 1001:1001                                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              ▼                                           │
│  Transferencia: rsync/scp con preservación                              │
│  • Permisos preservados                                                 │
│  • Timestamps mantenidos                                                │
│  • Ownership transferido                                                │
│  • Verificación por checksums                                           │
│                              │                                           │
│                              ▼                                           │
│  DESTINO: stapp03 (172.16.238.12)                                       │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  /home/new_user/                                                  │   │
│  │  ├── Documentos/  ◄── Datos idénticos                            │   │
│  │  ├── Scripts/     ◄── Permisos preservados                       │   │
│  │  ├── Configuraciones/  ◄── Timestamps intactos                   │   │
│  │  └── .bashrc, .profile  ◄── Todo funcional                        │   │
│  │                                                                   │   │
│  │  Permisos: new_user:new_user                                     │   │
│  │  UID/GID: 1002:1002                                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ✅ INTEGRIDAD VERIFICADA: Checksums idénticos                          │
│  ✅ PERMISOS PRESERVADOS: Acceso correcto                               │
│  ✅ FUNCIONALIDAD: Usuario puede trabajar inmediatamente                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Beneficios de la Migración Profesional

| Aspecto           | Migración Amateur          | Migración Profesional   |
| ----------------- | -------------------------- | ----------------------- |
| **Integridad**    | Copia simple               | Backup + verificación   |
| **Permisos**      | Se pierden                 | Preservados con tar -p  |
| **Ownership**     | Manual, propenso a errores | Automático con chown -R |
| **Verificación**  | "Parece que funcionó"      | Checksums comparados    |
| **Rollback**      | Difícil                    | Backup disponible       |
| **Documentación** | Ninguna                    | Logs de migración       |

### Checklist de Verificación

- [x] Backup creado en servidor origen
- [x] Checksums generados antes de transferencia
- [x] Datos transferidos completamente
- [x] Usuario new_user creado en destino
- [x] Datos extraídos en directorio correcto
- [x] Ownership ajustado a new_user:new_user
- [x] Checksums en destino generados
- [x] Comparación de checksums exitosa (sin diferencias)
- [x] Tamaño de datos coincide
- [x] Permisos preservados correctamente

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### La Migración como Proceso, No como Evento

> "Una migración exitosa no se mide por que 'funcione ahora', sino por que 'siga funcionando mañana' sin sorpresas."

Este reto enseña:

- **Backup primero**: Nunca modifiques datos sin backup de seguridad
- **Verificación continua**: Cada paso debe ser verificado antes del siguiente
- **Preservación de metadatos**: Los permisos y timestamps son tan importantes como el contenido
- **Documentación**: Los checksums son prueba de integridad

### Lecciones Clave

1. **rsync vs. scp**: rsync es superior para migraciones porque reanuda transferencias interrumpidas y tiene mejor manejo de permisos.

2. **Preservación con tar**: El flag `-p` (preserve) es crítico para mantener permisos.

3. **Verificación con checksums**: md5sum o sha256sum proporcionan garantía matemática de integridad.

4. **Ajuste de ownership**: Los UIDs/GIDs pueden diferir entre sistemas; el ownership debe ajustarse en destino.

### Errores Comunes y Prevención

#### Error #1: Olvidar la barra final en rsync

```bash
# ❌ INCORRECTO - Copia el directorio old_user dentro de new_user
rsync -avz /home/old_user banner@dest:/home/new_user/
# Resultado: /home/new_user/old_user/...

# ✅ CORRECTO - Copia el contenido de old_user a new_user
rsync -avz /home/old_user/ banner@dest:/home/new_user/
# Resultado: /home/new_user/...
```

#### Error #2: No verificar integridad

```bash
# ❌ INSUFICIENTE - Solo verificar que existan archivos
ls -la /home/new_user

# ✅ COMPLETO - Verificar checksums
diff /tmp/source_checksums.txt /tmp/destination_checksums.txt
```

#### Error #3: No ajustar ownership

```bash
# ❌ PROBLEMA - Archivos con ownership incorrecto
ls -la /home/new_user
# -rw-r--r-- 1 1001 1001 documento.txt  (UID/GID no resueltos)

# ✅ SOLUCIÓN - Ajustar ownership
chown -R new_user:new_user /home/new_user
# -rw-r--r-- 1 new_user new_user documento.txt
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 12**: Transferencia Segura - Encriptación y métodos avanzados
- **Reto 08**: Backup Automatizado - Programación de respaldos
- **Reto 10**: Corrección de Permisos - Ajuste fino de permisos

### Escenarios de Expansión

1. **Migración Masiva**:

   ```bash
   # Migrar múltiples usuarios
   for user in user1 user2 user3; do
     tar -czf /tmp/${user}_backup.tar.gz /home/$user
     scp /tmp/${user}_backup.tar.gz dest:/tmp/
   done
   ```

2. **Sincronización Continua**:

   ```bash
   # rsync para mantener sincronizado durante transición
   rsync -avz --delete /home/old_user/ banner@dest:/home/new_user/
   # Ejecutar periódicamente durante período de transición
   ```

3. **Migración con SELinux**:
   ```bash
   # Preservar contexts SELinux
   rsync -avz --xattrs /home/old_user/ banner@dest:/home/new_user/
   restorecon -R /home/new_user
   ```

### Comandos Avanzados

```bash
# Migración con barra de progreso
rsync -avz --progress --stats /home/old_user/ banner@dest:/home/new_user/

# Excluir archivos temporales
rsync -avz --exclude='*.tmp' --exclude='.cache/' /home/old_user/ banner@dest:/home/new_user/

# Migración con compresión máxima
tar -cjf - /home/old_user | ssh banner@dest "tar -xjf - -C /home/"

# Verificación profunda con find
find /home/old_user -type f -printf "%p %s %t\n" | sort > /tmp/source_files.txt
find /home/new_user -type f -printf "%p %s %t\n" | sort > /tmp/dest_files.txt
diff /tmp/source_files.txt /tmp/dest_files.txt
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Rsync Documentation](https://rsync.samba.org/documentation.html)
- [SCP Manual](https://man7.org/linux/man-pages/man1/scp.1.html)
- [Tar Manual](https://man7.org/linux/man-pages/man1/tar.1.html)
- [Linux File Permissions](https://www.linux.com/training-tutorials/understanding-linux-file-permissions/)

### Troubleshooting

| Síntoma                                   | Causa                                      | Solución                                         |
| ----------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| "Permission denied" durante transferencia | Sin acceso root                            | Usar sudo o ajustar permisos                     |
| Checksums no coinciden                    | Archivos modificados durante transferencia | Detener servicios, reintentar                    |
| Ownership muestra números                 | UID/GID no existen en destino              | Crear usuarios con mismos UID/GID o usar chown   |
| Enlaces simbólicos rotos                  | Rutas absolutas                            | Usar enlaces relativos o ajustar manualmente     |
| Transferencia muy lenta                   | Sin compresión                             | Usar -z en rsync/scp o comprimir con tar primero |

### Mejores Prácticas

```bash
# ✅ HACER:
# Siempre crear backup antes de migrar
tar -czf /tmp/backup_$(date +%Y%m%d).tar.gz /home/usuario

# Usar rsync para migraciones grandes
rsync -avz --progress /home/old_user/ dest:/home/new_user/

# Verificar con checksums después de migrar
find /home/new_user -type f -exec md5sum {} \; | diff - /tmp/source_checksums.txt

# ❌ EVITAR:
# Copiar sin preservar permisos
cp -r /home/old_user /home/new_user  # Pierde permisos!

# Omitir verificación
# "Parece que funcionó" no es suficiente

# Migrar sin plan de rollback
# Siempre tener forma de revertir cambios
```

---

## ✅ Estado del Reto

🔓 **POR DESBLOQUEAR** - Requiere completar retos 1-3

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 25 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidores involucrados: stapp01 → stapp03

### Plan de Implementación

1. Preparar servidor origen (stapp01) con backup y checksums
2. Transferir datos a destino (stapp03) usando rsync o scp
3. Crear usuario new_user en stapp03
4. Extraer y restaurar datos
5. Ajustar ownership
6. Verificar integridad con checksums
7. Validar funcionamiento

### Criterios de Éxito

- ✅ Datos transferidos completamente entre sistemas
- ✅ Permisos y ownership preservados
- ✅ Integridad de datos verificada (checksums coinciden)
- ✅ Funcionalidad completa en destino
- ✅ Usuario puede acceder y trabajar con sus datos

---

_Documentación creada siguiendo estándares de SysAdmin - Migración Profesional de Datos_
