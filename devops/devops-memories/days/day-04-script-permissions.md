# 📅 Día 4: Permisos de Ejecución de Scripts
**Fecha**: 27-01-2026  
**Categoría**: #linux #scripts #permisos #bash  
**Dificultad**: ⭐⭐  
**Estado**: ✅ Completado

---

## 🎯 Objetivo
Dar permisos de ejecución al script `/tmp/xfusioncorp.sh` en App Server 1 (stapp01) y asegurar que todos los usuarios puedan ejecutarlo.

## 🏗️ Detalles de Infraestructura
- **Servidor objetivo**: stapp01 (172.16.238.10)
- **Usuario**: tony (Ir0nM@n)
- **Script target**: `/tmp/xfusioncorp.sh`
- **Propietario del script**: root:root
- **Requisito**: Todos los usuarios deben poder ejecutar el script

---

## 🔧 Proceso de Solución

### Paso 1: Conectarse al servidor destino
```bash
ssh tony@172.16.238.10
# Password: Ir0nM@n
```

### Paso 2: Verificar permisos actuales del script
```bash
ls -l /tmp/xfusioncorp.sh
```
Salida inicial: `---------- 1 root root 40 Jan 28 03:34 /tmp/xfusioncorp.sh`
*(Sin permisos de lectura ni ejecución)*

### Paso 3: Intentar cambiar permisos sin sudo (falla esperada)
```bash
chmod +x /tmp/xfusioncorp.sh
# Salida: chmod: changing permissions of '/tmp/xfusioncorp.sh': Operation not permitted
```

### Paso 4: Verificar capacidades de sudo
```bash
sudo -l
# Confirmado: User tony may run the following commands on stapp01: (ALL) ALL
```

### Paso 5: Cambiar permisos con sudo
```bash
sudo chmod a+rx /tmp/xfusioncorp.sh
# O alternativamente:
sudo chmod 755 /tmp/xfusioncorp.sh
```

### Paso 6: Verificar nuevos permisos
```bash
ls -l /tmp/xfusioncorp.sh
```
Salida final: `-rwxr-xr-x 1 root root 40 Jan 28 03:34 /tmp/xfusioncorp.sh`

### Paso 7: Probar ejecución del script
```bash
/tmp/xfusioncorp.sh
# Salida: Welcome To KodeKloud
```

### Paso 8: Verificar ejecución múltiple
```bash
/tmp/xfusioncorp.sh
# Salida: Welcome To KodeKloud
```

---

## ✅ Verificación Final
- Script encontrado en `/tmp/xfusioncorp.sh` ✅
- Permisos de ejecución agregados con sudo ✅
- Permisos de lectura agregados para permitir ejecución ✅
- Script ejecuta correctamente ✅
- Todos los usuarios tienen capacidad de ejecución (`755`) ✅

## 🐛 Problemas Encontrados y Soluciones

### Problema 1: Script sin permisos de lectura ni ejecución
**Error inicial**: `---------- 1 root root 40 Jan 28 03:34 /tmp/xfusioncorp.sh`
**Solución**: Usar `sudo chmod a+rx` para dar permisos de lectura y ejecución

### Problema 2: Usuario tony sin permisos para modificar archivo de root
**Error**: `chmod: changing permissions of '/tmp/xfusioncorp.sh': Operation not permitted`
**Solución**: Verificar capacidades de sudo con `sudo -l` y usar `sudo chmod`

### Problema 3: Script con solo permisos de ejecución pero sin lectura
**Error**: `---x--x--x` permitía ejecución pero bash fallaba con "Permission denied"
**Solución**: Agregar permisos de lectura con `a+rx` en lugar de solo `+x`

### Problema 4: Contraseña de sudo incorrecta
**Error**: `Sorry, try again.` al intentar sudo
**Solución**: Usar la contraseña correcta del usuario tony (Ir0nM@n)

## 📚 Aprendizajes Clave
- Los scripts necesitan permisos de lectura (`r`) además de ejecución (`x`) para funcionar correctamente
- `sudo chmod a+rx` da permisos de lectura y ejecución para todos los usuarios
- `chmod 755` establece permisos estándar para scripts ejecutables públicos
- `sudo -l` permite verificar qué comandos puede ejecutar un usuario con sudo
- Los archivos propiedad de root requieren sudo para modificar permisos
- La notación `a+rx` es más explícita que `+x` para dar permisos a todos

## 🔗 Comandos Relacionados
- `touch script.sh` - Crear archivo de script
- `chmod +x script.sh` - Agregar permisos de ejecución
- `chmod 755 script.sh` - Permisos completos de ejecución
- `ls -la script.sh` - Verificar permisos detallados
- `./script.sh` - Ejecutar script en directorio actual
- `bash -n script.sh` - Verificar sintaxis sin ejecutar

## 📖 Recursos
- Guía de permisos Linux
- Documentación de bash scripting
- Best practices para scripts ejecutables

---

## 📊 Seguimiento de Tiempo
- **Hora de Inicio**: 15:30
- **Hora de Finalización**: 16:15
- **Duración Total**: 45 minutos

## 🏆 Criterios de Éxito Cumplidos
- [x] Script encontrado en ruta especificada
- [x] Permisos de ejecución configurados para todos los usuarios
- [x] Script ejecuta correctamente sin errores
- [x] Verificación de funcionalidad completada
- [x] Uso correcto de sudo para modificar archivos de root

## 🌐 Contexto Adicional
Este reto simula un escenario real donde el equipo de sysadmin de xFusionCorp Industries distribuyó un script de backup a todos los servidores, pero olvidó darle permisos de ejecución. La solución demuestra la importancia de verificar permisos después de despliegues y el uso adecuado de sudo para tareas administrativas que requieren modificar archivos propiedad de root.