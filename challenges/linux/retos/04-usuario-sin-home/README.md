---
title: "🏆 Reto 04: Service User Creation without Home Directory - xFusionCorp Industries ✅"
category: linux
difficulty: medium
tags:
  - linux
  - ssh
  - user-management
  - security
  - text-processing
date: 2025-01-25
status: completed
---

# 🏆 Reto 04: Service User Creation without Home Directory - xFusionCorp Industries ✅

## 🎯 Objetivo del Reto

Crear un usuario de servicio sin directorio home según especificaciones de seguridad:

**Create a service user without a home directory for application service management.**

## 🖥️ Servidor Objetivo (Actualizado)

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| **stapp02** | **172.16.238.11** | **stapp02.stratos.xfusioncorp.com** | **steve** | **Am3ric@** | **Nautilus App 2** |

## 📋 Requisitos Técnicos (Actualizados)

- **Usuario**: **james** (especificaciones reales del reto)
- **Directorio home**: No crear (/dev/null o especificar -M)
- **Shell**: /sbin/nologin (no-interactivo)
- **Servidor**: App Server 2 (stapp02)
- **Propósito**: Usuario para ejecución de servicios del sistema
- **UID**: 998 (asignado automáticamente)

## 🚀 Estrategia de Implementación Exitosa

### ✅ Comandos Clave Correctos

```bash
# 1. Conexión al servidor
ssh thor@jump_host.stratos.xfusioncorp.com
ssh steve@172.16.238.11

# 2. Creación CORRECTA del usuario sin directorio home
sudo useradd -r -s /sbin/nologin -M james

# 3. Verificación crítica del directorio home
ls -la /home/ | grep james  # Debe mostrar vacío

# 4. Si existe directorio home, eliminar manualmente
sudo rm -rf /home/james

# 5. Verificación final
grep james /etc/passwd
# james:x:998:998::/home/james:/sbin/nologin
```

### ⚠️ Errores Comunes y Soluciones

| Error | Problema | Solución ✅ |
|-------|----------|-------------|
| `useradd -r -s` sin `-M` | Crea directorio home en `/home/usuario` | **Siempre usar `-M` explícitamente** |
| No verificar `/home/` físicamente | `/etc/passwd` puede mostrar home pero no existe | **Verificar doble: `/etc/passwd` + `ls -la /home/`** |
| Orden incorrecta de flags | Algunos sistemas requieren orden específica | **Usar: `-r -s /sbin/nologin -M`** |

## 🎯 Resultados Obtenidos

- ✅ Usuario james creado sin directorio home
- ✅ Shell configurada como /sbin/nologin
- ✅ Login interactivo bloqueado correctamente
- ✅ Usuario disponible para ejecución de servicios

## 🏅 Estado del Reto

**✅ COMPLETADO CON ÉXITO** - Usuario james creado en App Server 2

*Fecha de finalización: 25 de Enero de 2026*  
*Tiempo de ejecución: ~15 minutos*  
*Dificultad: Básica*  

### 📚 Lecciones Clave

1. **🔍 Verificación Dual**: Siempre verificar `/etc/passwd` Y `/home/`
2. **🛠️ Orden de Flags**: `-r -s /sbin/nologin -M` (orden específico)
3. **🧹 Limpieza Manual**: Si algo falla, eliminar y recrear completamente
4. **📝 Documentación Real**: Registrar tanto lo planeado como lo ejecutado

---

**🔗 Implementación completa:** [[stapp02-james-implementacion|Ver ejecución detallada]]