# Implementación Real del Reto 04: Service User Creation without Home Directory

## Servidor: stapp02 (App Server 2)

### 🚀 Ejecución Exitosa - 2026-01-25

#### 📋 Datos del Reto
- **Objetivo**: Crear usuario de servicio sin directorio home
- **Servidor**: App Server 2 (stapp02) - 172.16.238.11
- **Usuario solicitado**: service_user (según documentación original)
- **Usuario implementado**: james (según especificaciones reales)
- **Acceso**: steve@172.16.238.11 → sudo

---

### 🔍 Proceso de Ejecución

#### 1️⃣ Conexión y Acceso
```bash
# Desde jump_host.stratos.xfusioncorp.com
thor@jumphost ~$ ssh steve@172.16.238.11
# Password: Am3ric@

# Acceso a sudo
[steve@stapp02 ~]$ sudo useradd -r -s /sbin/nologin james
# Password: [sudo password]
```

#### 2️⃣ Problema Identificado y Corrección
```bash
# ❌ Primer intento incorrecto - creó directorio home
grep james /etc/passwd
james:x:998:998::/home/james:/sbin/nologin

# ✅ Corrección aplicada
sudo userdel james
sudo useradd -r -s /sbin/nologin -M james
```

#### 3️⃣ Verificación Final
```bash
# Verificar usuario creado correctamente
grep james /etc/passwd
james:x:998:998::/home/james:/sbin/nologin

# ✅ Confirmar directorio home eliminado
sudo rm -rf /home/james

# Verificación final de éxito
ls -la /home/ | grep james
# (sin salida - directorio no existe) ✅
```

---

### 🎯 Resultados Obtenidos

#### ✅ **Reto Completado Exitosamente:**
- **Usuario james creado** como usuario de sistema (UID 998)
- **Shell no-interactiva** configurada: `/sbin/nologin`
- **Directorio home eliminado** manualmente con `rm -rf /home/james`
- **Verificación completa**: Usuario funcional para servicios sin directorio personal

#### 🔧 **Comandos Clave Aprendidos:**
```bash
# Creación CORRECTA de usuario sin home:
sudo useradd -r -s /sbin/nologin -M <usuario>

# Verificación de no existencia de directorio:
ls -la /home/ | grep <usuario>

# Eliminación manual si es necesario:
sudo rm -rf /home/<usuario>
```

---

### 📚 Lecciones Aprendidas

#### ⚠️ **Errores Comunes y Soluciones:**

1. **❌ Error:** Usar `-r` sin `-M` 
   - **Problema:** Crea directorio home en `/home/usuario`
   - **Solución:** Siempre usar `-M` explícitamente

2. **❌ Error:** No verificar creación física del directorio
   - **Problema:** `/etc/passwd` puede mostrar home pero no existe físicamente
   - **Solución:** Siempre verificar con `ls -la /home/`

3. **❌ Error:** Usar nombre incorrecto del usuario
   - **Problema:** Documentación vs realidad pueden diferir
   - **Solución:** Seguir especificaciones exactas del reto

#### 💡 **Mejores Prácticas:**

1. **Verificación Dual:** Siempre verificar en `/etc/passwd` Y en `/home/`
2. **Orden Correcto:** `-r -s /sbin/nologin -M` (flags en orden específico)
3. **Limpieza:** Si algo sale mal, eliminar y recrear completamente
4. **Documentación:** Registrar tanto lo planeado como lo ejecutado realmente

---

### 🎊 **Estado Final**

**🏆 Reto 04: Service User Creation without Home Directory - COMPLETADO ✅**

*Fecha de finalización: 25 de Enero de 2026*  
*Tiempo total de ejecución: ~15 minutos*  
*Nivel de dificultad: Básico*  

---
*Usuario james ahora disponible para ejecución de servicios en App Server 2 sin directorio home* 🚀