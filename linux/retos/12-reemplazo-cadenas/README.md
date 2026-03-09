---
title: "Reto 12: String Replacement - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - backup
  - text-processing
date: 2025-01-25
status: blocked
---

# Reto 12: String Replacement - xFusionCorp Industries

## Edición de Configuraciones: Precisión, Backup y Validación

---

## 🎓 Del Instructor

Bienvenido a tu duodécimo desafío como SysAdmin Senior en xFusionCorp. Hoy enfrentamos una de las tareas más delicadas de la administración de sistemas: **la modificación de archivos de configuración en producción**.

> 💭 **Mentalidad de SysAdmin**: "Editar un archivo de configuración en producción sin backup es como caminar sobre cuerdas flojas sin red. Un solo error de sintaxis puede detener servicios críticos. Siempre hay que medir diez veces y cortar una."

Los cambios de configuración son inevitables, pero deben hacerse con metodología, herramientas apropiadas y siempre con plan de reversión.

---

## 🎭 Escenario Real: Migración de Servidor en Nautilus App 2

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Migración de Infraestructura  
**Servidor**: App Server 2 (stapp02)  
**Tu rol**: Senior System Administrator - Cambios Controlados

### La Problemática

El equipo de infraestructura de xFusionCorp está migrando la aplicación crítica del servidor `old_server.local` al nuevo servidor `new_server.production`. La aplicación tiene múltiples referencias al servidor antiguo en su archivo de configuración principal:

- URLs de conexión a base de datos
- Endpoints de servicios externos
- Referencias a recursos compartidos
- Configuraciones de caché

**El archivo afectado**: `/etc/app/config.properties`

**El requerimiento del equipo de Migración**:

> "Perform string replacement in configuration files."

### Contexto de Riesgo

Un error en este cambio podría:

- Conectar la aplicación al servidor incorrecto
- Exponer datos en el entorno equivocado
- Causar downtime de servicios críticos
- Corromper la configuración si se rompe la sintaxis

### Infraestructura Objetivo

| Servidor | IP            | Hostname                        | Usuario Acceso | Contraseña | Propósito       |
| -------- | ------------- | ------------------------------- | -------------- | ---------- | --------------- |
| stapp02  | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve          | Am3ric@    | Text Processing |

### Requisitos Técnicos

- **Archivo objetivo**: `/etc/app/config.properties`
- **String a buscar**: `old_server.local`
- **String de reemplazo**: `new_server.production`
- **Método**: `sed` con backup
- **Verificación**: Validar cambios sin romper sintaxis
- **Respaldo**: Archivo backup antes de cambios

---

## 🧠 La Arquitectura: Edición de Archivos de Configuración

### El Desafío de la Edición en Producción

```
┌─────────────────────────────────────────────────────────────────┐
│              RIESGOS DE EDICIÓN EN PRODUCCIÓN                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⚠️  RIESGOS IDENTIFICADOS:                                      │
│                                                                  │
│  1. PÉRDIDA DE DATOS                                             │
│     • Sobrescribir configuración sin backup                     │
│     • No poder revertir si algo falla                           │
│                                                                  │
│  2. CORRUPCIÓN DE SINTAXIS                                       │
│     • Caracteres especiales no escapados                        │
│     • Expresiones regulares incorrectas                         │
│     • Encoding dañado                                           │
│                                                                  │
│  3. REEMPLAZOS INDESeados                                        │
│     • Reemplazar strings dentro de comentarios                  │
│     • Modificar strings parciales (substring matches)           │
│     • Afectar líneas que no debían cambiar                      │
│                                                                  │
│  4. SERVICIO NO FUNCIONAL                                        │
│     • Configuración inválida después del cambio                 │
│     • Aplicación no inicia                                      │
│     • Downtime no planificado                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Herramientas de Reemplazo de Texto

| Herramienta  | Uso                         | Ventajas          | Desventajas              |
| ------------ | --------------------------- | ----------------- | ------------------------ |
| **sed**      | Reemplazo en línea, scripts | Potente, estándar | Sintaxis compleja        |
| **awk**      | Procesamiento estructurado  | Flexible          | Verboso para simples     |
| **perl -pi** | Reemplazo avanzado          | Regex complejas   | No siempre disponible    |
| **vi/vim**   | Edición interactiva         | Control total     | Manual, no automatizable |

### Opciones Críticas de sed

```bash
# Sintaxis básica
sed 's/patrón/reemplazo/flags'

# Opciones importantes:
-i                 # Editar en el archivo (in-place)
-i.bak            # Editar y crear backup con extensión .bak
's/old/new/g'     # Reemplazo global (todas las ocurrencias por línea)
's/old/new/'      # Reemplazo por línea (solo primera ocurrencia)
-n + p            # Modo silencioso, imprimir solo matches
```

### Flujo Seguro de Modificación

```
┌─────────────────────────────────────────────────────────────────┐
│            FLUJO SEGURO DE MODIFICACIÓN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INSPECCIÓN                                                   │
│     │                                                            │
│     ├── Leer archivo de configuración                           │
│     ├── Identificar strings a reemplazar                        │
│     └── Contar ocurrencias                                      │
│     │                                                            │
│     ▼                                                            │
│  2. BACKUP                                                       │
│     │                                                            │
│     ├── Copia del archivo original                              │
│     ├── Verificación de backup                                  │
│     └── Documentar estado inicial                               │
│     │                                                            │
│     ▼                                                            │
│  3. PRUEBA                                                       │
│     │                                                            │
│     ├── Ejecutar sed sin modificar (-i)                         │
│     ├── Verificar salida esperada                               │
│     └── Validar sintaxis                                        │
│     │                                                            │
│     ▼                                                            │
│  4. EJECUCIÓN                                                    │
│     │                                                            │
│     ├── Ejecutar sed con backup                                 │
│     ├── Verificar archivo modificado                            │
│     └── Comparar con original                                   │
│     │                                                            │
│     ▼                                                            │
│  5. VALIDACIÓN                                                   │
│     │                                                            │
│     ├── Verificar sintaxis del archivo                          │
│     ├── Probar aplicación/servicio                              │
│     └── Confirmar funcionamiento                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Analogía: Cirugía de Precisión

- **El archivo de configuración**: El paciente en operación
- **El backup**: La sangre y tejido del paciente preservados para transfusiones
- **sed**: El bisturí quirúrgico
- **El patrón de búsqueda**: El mapa de la anatomía
- **La validación**: Las pruebas post-operatorias
- **El plan de rollback**: El equipo de reanimación listo

Un buen cirujano nunca opera sin:

1. Haber estudiado la anatomía (inspección)
2. Tener sangre compatible disponible (backup)
3. Hacer una incisión de prueba (dry run)
4. Verificar después de cada paso (validación)

---

## 🛠️ Implementación Profesional

### Fase 1: Inspección y Análisis

#### 1.1 Acceso al Sistema

```bash
# Conexión al servidor
ssh steve@172.16.238.11
sudo su -
```

#### 1.2 Verificar Existencia del Archivo

```bash
# Verificar que el archivo existe
ls -la /etc/app/config.properties

# Ver permisos actuales
stat /etc/app/config.properties

# Verificar que es editable por root
```

> ⚠️ **Advertencia**: Si no tienes permisos de escritura, necesitarás `sudo` o cambiar permisos temporalmente.

#### 1.3 Inspeccionar Contenido

```bash
# Ver contenido del archivo
cat /etc/app/config.properties

# Buscar ocurrencias del string objetivo
grep -n "old_server.local" /etc/app/config.properties

# Contar total de ocurrencias
grep -c "old_server.local" /etc/app/config.properties

# Ver contexto (líneas alrededor)
grep -n -B2 -A2 "old_server.local" /etc/app/config.properties
```

### Fase 2: Backup de Seguridad

#### 2.1 Crear Backup con Timestamp

```bash
# Crear backup con fecha y hora
BACKUP_FILE="/etc/app/config.properties.backup.$(date +%Y%m%d_%H%M%S)"
cp /etc/app/config.properties "$BACKUP_FILE"

# Verificar backup creado
ls -la "$BACKUP_FILE"
echo "Backup creado: $BACKUP_FILE"

# Comparar con original
diff /etc/app/config.properties "$BACKUP_FILE"
# No debe haber diferencias
```

#### 2.2 Documentar Estado Inicial

```bash
# Guardar resumen del estado inicial
echo "=== Estado Inicial ===" > /tmp/config_change_log.txt
echo "Fecha: $(date)" >> /tmp/config_change_log.txt
echo "Archivo: /etc/app/config.properties" >> /tmp/config_change_log.txt
echo "Ocurrencias de old_server.local: $(grep -c 'old_server.local' /etc/app/config.properties)" >> /tmp/config_change_log.txt
echo "" >> /tmp/config_change_log.txt
echo "Líneas con old_server.local:" >> /tmp/config_change_log.txt
grep -n "old_server.local" /etc/app/config.properties >> /tmp/config_change_log.txt

cat /tmp/config_change_log.txt
```

### Fase 3: Prueba (Dry Run)

#### 3.1 Ejecutar sin Modificar Archivo

```bash
# Ejecutar sed sin -i para ver resultado en stdout
sed 's/old_server.local/new_server.production/g' /etc/app/config.properties | head -30

# Flags:
# s = sustitución
# g = global (todas las ocurrencias por línea)
```

#### 3.2 Verificar Reemplazos Específicos

```bash
# Contar cuántas ocurrencias serían reemplazadas
sed 's/old_server.local/new_server.production/g' /etc/app/config.properties | grep -c "new_server.production"

# Debe coincidir con el conteo original
grep -c "old_server.local" /etc/app/config.properties
```

#### 3.3 Verificar que No Hay Falsos Positivos

```bash
# Buscar old_server.local en resultado (debe estar vacío)
sed 's/old_server.local/new_server.production/g' /etc/app/config.properties | grep "old_server.local"
# No debe mostrar nada

# Verificar que new_server.production aparece
sed 's/old_server.local/new_server.production/g' /etc/app/config.properties | grep "new_server.production" | head -5
```

### Fase 4: Ejecución con Backup

#### 4.1 Ejecutar Reemplazo con Backup

```bash
# Ejecutar sed con backup automático
sed -i.backup 's/old_server.local/new_server.production/g' /etc/app/config.properties

# Flags:
# -i.backup = editar in-place y crear archivo .backup

# Verificar que se creó backup
ls -la /etc/app/config.properties*
```

#### 4.2 Verificar Cambio Aplicado

```bash
# Verificar que old_server.local ya no existe
grep "old_server.local" /etc/app/config.properties
echo "Exit code: $?"  # Debe ser 1 (no encontrado)

# Verificar que new_server.production existe
grep "new_server.production" /etc/app/config.properties
grep -c "new_server.production" /etc/app/config.properties
```

#### 4.3 Comparar Archivos

```bash
# Comparar backup con archivo modificado
diff /etc/app/config.properties.backup /etc/app/config.properties

# O usando colordiff si está disponible
colordiff /etc/app/config.properties.backup /etc/app/config.properties 2>/dev/null || diff /etc/app/config.properties.backup /etc/app/config.properties

# La salida debe mostrar solo las líneas cambiadas
```

### Fase 5: Validación

#### 5.1 Verificar Sintaxis

```bash
# Método 1: Verificar que el archivo es legible
cat /etc/app/config.properties > /dev/null && echo "Archivo legible: OK"

# Método 2: Si es archivo .properties, verificar formato
# Las líneas deben ser: clave=valor o comentarios #
grep -v "^#" /etc/app/config.properties | grep -v "^$" | grep -v "=" && echo "Líneas sin formato = encontradas"
# No debe mostrar nada (o solo mostrar líneas malformadas)

# Método 3: Usar herramienta específica si existe
# java -jar /path/to/properties-validator.jar /etc/app/config.properties 2>/dev/null || echo "Validador no disponible"
```

#### 5.2 Verificar Funcionamiento (Si aplica)

```bash
# Si hay un servicio que usa esta configuración:
# systemctl restart app-service
# systemctl status app-service

# O verificar que la aplicación puede leer la configuración
# su - appuser -c "cat /etc/app/config.properties" > /dev/null && echo "Aplicación puede leer config: OK"
```

### Fase 6: Documentación

#### 6.1 Actualizar Log de Cambios

```bash
# Agregar información del cambio al log
echo "" >> /tmp/config_change_log.txt
echo "=== Estado Final ===" >> /tmp/config_change_log.txt
echo "Fecha de cambio: $(date)" >> /tmp/config_change_log.txt
echo "Backup creado: /etc/app/config.properties.backup" >> /tmp/config_change_log.txt
echo "Ocurrencias de new_server.production: $(grep -c 'new_server.production' /etc/app/config.properties)" >> /tmp/config_change_log.txt
echo "Ocurrencias restantes de old_server.local: $(grep -c 'old_server.local' /etc/app/config.properties || echo 0)" >> /tmp/config_change_log.txt

cat /tmp/config_change_log.txt
```

### Resumen de Comandos

```bash
# SECUENCIA COMPLETA Y SEGURA

# 1. Verificación inicial
grep -n "old_server.local" /etc/app/config.properties

# 2. Crear backup
cp /etc/app/config.properties /etc/app/config.properties.backup

# 3. Prueba (dry run)
sed 's/old_server.local/new_server.production/g' /etc/app/config.properties | grep "new_server.production"

# 4. Ejecutar con backup
sed -i.backup 's/old_server.local/new_server.production/g' /etc/app/config.properties

# 5. Verificar cambio
grep "new_server.production" /etc/app/config.properties
grep "old_server.local" /etc/app/config.properties  # Debe estar vacío

# 6. Verificación de sintaxis
cat /etc/app/config.properties > /dev/null && echo "OK"

# 7. Comparar
diff /etc/app/config.properties.backup /etc/app/config.properties
```

---

## 🎯 Análisis Post-Implementación: Lo Que Acabas de Construir

### Arquitectura del Cambio

```
┌─────────────────────────────────────────────────────────────────────────┐
│              REEMPLAZO DE STRINGS COMPLETADO - stapp02                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Archivo: /etc/app/config.properties                                     │
│                                                                          │
│  ANTES (Backup): config.properties.backup                                │
│  ├── db.url=jdbc:mysql://old_server.local:3306/myapp                    │
│  ├── api.endpoint=http://old_server.local/api/v1                        │
│  ├── cache.server=old_server.local:11211                                │
│  └── # Conexión a old_server.local - Producción                         │
│                                                                          │
│  DESPUÉS (Actual): config.properties                                     │
│  ├── db.url=jdbc:mysql://new_server.production:3306/myapp   ◄── Cambiado │
│  ├── api.endpoint=http://new_server.production/api/v1       ◄── Cambiado │
│  ├── cache.server=new_server.production:11211               ◄── Cambiado │
│  └── # Conexión a new_server.production - Producción        ◄── Cambiado │
│                                                                          │
│  ✅ CARACTERÍSTICAS DEL CAMBIO:                                          │
│     • Backup automático creado                                          │
│     • Reemplazo global de todas las ocurrencias                         │
│     • Sintaxis preservada                                               │
│     • Documentación del cambio                                          │
│     • Plan de rollback disponible                                       │
│                                                                          │
│  🔒 SEGURIDAD:                                                           │
│     • Verificación antes de modificar                                   │
│     • Backup inmutable                                                   │
│     • Validación post-cambio                                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Checklist de Verificación

- [x] Backup creado antes de modificaciones
- [x] Prueba (dry run) ejecutada exitosamente
- [x] Reemplazo ejecutado con `sed -i.backup`
- [x] Validación de cambios: todas las ocurrencias reemplazadas
- [x] Validación: `old_server.local` ya no existe en archivo
- [x] Sintaxis del archivo preservada
- [x] Servicio/aplicación funcionando (si aplica)
- [x] Documentación del cambio completada

---

## 🎓 Reflexión Final: Mentalidad Desarrollada

### La Regla del Backup

> "Nunca toques un archivo de producción sin tener una forma de volver atrás."

Este reto enseña:

- **Backup primero**: Siempre antes de cualquier modificación
- **Dry run**: Verificar antes de aplicar
- **Validación**: Confirmar después de cambiar
- **Documentación**: Registrar qué se hizo y cuándo

### Lecciones Clave

1. **sed -i es Peligroso**: Siempre usa `-i.backup` o crea backup manual antes.

2. **Dry Run**: Ejecuta sin `-i` primero para ver qué cambiaría.

3. **grep es tu Amigo**: Usa `grep -c` para contar ocurrencias antes y después.

4. **diff Confirma**: Compara backup con archivo modificado para ver exactamente qué cambió.

### Escenarios Avanzados con sed

```bash
# Reemplazo con caracteres especiales (escapar /)
sed 's/http:\/\/old_server/http:\/\/new_server/g' file

# Usar delimitador diferente para evitar escapado
sed 's|http://old_server|http://new_server|g' file

# Reemplazo solo en líneas que contienen patrón
sed '/pattern/s/old/new/g' file

# Reemplazo excepto en líneas que contienen patrón
sed '/pattern/!s/old/new/g' file

# Reemplazo con captura de grupos
sed 's/old_\(server\)/new_\1/g' file

# Múltiples reemplazos en un comando
sed -e 's/old1/new1/g' -e 's/old2/new2/g' file
```

---

## 🚀 Siguientes Pasos

### Retos Relacionados

- **Reto 06**: Transferencia de Datos - Mover configuraciones entre servidores
- **Reto 08**: Backup Automatizado - Proteger configuraciones
- **Reto 16**: Firewall - Seguridad de red

### Mejoras y Automatización

```bash
# Script de reemplazo seguro
cat > /usr/local/bin/safe_replace.sh << 'EOF'
#!/bin/bash
FILE=$1
OLD=$2
NEW=$3

if [ -z "$FILE" ] || [ -z "$OLD" ] || [ -z "$NEW" ]; then
    echo "Uso: $0 <archivo> <string_viejo> <string_nuevo>"
    exit 1
fi

# Backup
cp "$FILE" "$FILE.backup.$(date +%Y%m%d_%H%M%S)"

# Reemplazo
sed -i "s/$OLD/$NEW/g" "$FILE"

# Verificación
if grep -q "$NEW" "$FILE"; then
    echo "✓ Reemplazo exitoso"
else
    echo "✗ Error en reemplazo"
    exit 1
fi
EOF
chmod +x /usr/local/bin/safe_replace.sh
```

### Comandos Útiles

```bash
# Ver todos los backups de config
ls -la /etc/app/config.properties.backup*

# Restaurar desde backup
 cp /etc/app/config.properties.backup /etc/app/config.properties

# Reemplazo inverso (rollback)
sed -i 's/new_server.production/old_server.local/g' /etc/app/config.properties

# Ver historial de cambios
diff /etc/app/config.properties.backup* 2>/dev/null | less
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- [Sed Manual](https://www.gnu.org/software/sed/manual/sed.html)
- [Linux Text Processing](https://tldp.org/LDP/abs/html/textproc.html)
- [Regular Expressions - GNU](https://www.gnu.org/software/sed/manual/html_node/Regular-Expressions.html)

### Troubleshooting

| Síntoma                 | Causa                     | Solución                             |
| ----------------------- | ------------------------- | ------------------------------------ |
| "sed: -e expression #1" | Caracteres especiales     | Escapar o usar delimitador diferente |
| "Permission denied"     | Sin permisos de escritura | Usar `sudo` o cambiar permisos       |
| Reemplazos parciales    | Sin flag `g`              | Agregar `/g` al final                |
| Backup no creado        | Sintaxis incorrecta       | Usar `-i.backup` (con punto)         |
| "No such file"          | Ruta incorrecta           | Verificar con `ls` primero           |

### Mejores Prácticas

```bash
# ✅ SIEMPRE:
# - Crear backup
# - Hacer dry run
# - Verificar conteos antes/después
# - Validar sintaxis
# - Documentar cambios

# ❌ NUNCA:
# - Usar sed -i sin backup
# - Reemplazar sin verificar primero
# - Olvidar validar después
# - Modificar sin plan de rollback
```

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 20 minutos
- 🎯 Dificultad: Fácil
- 🖥️ Servidor objetivo: stapp02 (172.16.238.11)

### Plan de Implementación

1. Verificar archivo existe y localizar strings
2. Crear backup con timestamp
3. Ejecutar sed en modo dry-run (sin -i)
4. Verificar salida esperada
5. Ejecutar sed con backup (-i.backup)
6. Confirmar reemplazo exitoso
7. Validar sintaxis del archivo
8. Documentar cambio

### Criterios de Éxito

- ✅ Todas las ocurrencias de `old_server.local` reemplazadas por `new_server.production`
- ✅ Backup creado antes de modificaciones
- ✅ Sintaxis del archivo preservada
- ✅ Servicio funcionando con nueva configuración
- ✅ Documentación del cambio completa

---

_Documentación creada siguiendo estándares de SysAdmin - Cambios Controlados_
