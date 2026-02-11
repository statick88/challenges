---
title: "Resolución de Problemas de Servicio"
category: devops
day: 13
difficulty: 2
tags:
  - devops
  - troubleshooting
  - systemctl
  - logs
date: 2026-02-05
status: ready
---

# 🎓 Día 13: Troubleshooting y Debugging de Servicios

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "En producción, no evitas problemas - los detectas rápido y los resuelves más rápido. El troubleshooting no es un don místico, es una metodología sistemática que convierte caos en información accionable."

Hoy aprendemos a **diagnosticar y resolver problemas de servicios**. Esta es una de las habilidades más valiosas en DevOps - cuando algo falla en producción, debes saber exactamente qué hacer.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Día 12**: Desplegamos Nginx exitosamente
- **Hoy**: Aprendemos qué hacer cuando un servicio falla
- **Días 14-15**: Aplicaremos troubleshooting a backups y configuraciones

### Progresión hacia el Pipeline CI/CD

Troubleshooting es esencial para:

- **Incident Response**: MTTR (Mean Time To Recovery)
- **CI/CD Debugging**: Por qué falló el pipeline
- **Monitoring**: Alertas que llevan a acción correctiva
- **Post-Mortems**: Entender qué pasó y prevenirlo

### Escenario Empresarial

El servicio Nginx del Día 12 ha dejado de funcionar. Como ingeniero DevOps, debes:

1. Identificar rápidamente el problema
2. Recopilar información relevante
3. Aplicar la solución
4. Verificar el fix
5. Documentar para prevenir recurrencia

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Debugging efectivo requiere:

- **Observabilidad**: Logs, métricas, trazas
- **Documentación**: Runbooks para problemas comunes
- **Comunicación**: Actualizar stakeholders durante incidentes

### Automatización

```bash
# Script de health check automatizado
#!/bin/bash
if ! systemctl is-active --quiet nginx; then
  echo "Nginx down, attempting restart..."
  systemctl restart nginx
  # Alertar a Slack/PagerDuty
fi
```

### Métricas y Mejora Continua

- **MTTR**: Tiempo promedio de recuperación
- **Incident Frequency**: Cuán a menudo ocurren problemas
- **False Positives**: Alertas que no son problemas reales

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Verificar Estado del Servicio

```bash
# Verificar si el servicio está activo
sudo systemctl status nginx
```

**Posibles estados**:

- `active (running)` ✅
- `inactive (dead)` ❌
- `failed` ❌
- `activating` ⏳

**Análisis DevOps**: Primer punto de información - ¿está corriendo o no?

### Paso 2: Revisar Logs del Sistema

```bash
# Ver logs del servicio específico
sudo journalctl -u nginx --no-pager

# Ver últimas 50 líneas
sudo journalctl -u nginx -n 50 --no-pager

# Seguir logs en tiempo real (como tail -f)
sudo journalctl -u nginx -f
```

**Análisis DevOps**: `journalctl` es tu mejor amigo en sistemas systemd. Muestra stdout/stderr del servicio.

### Paso 3: Verificar Configuración

```bash
# Probar sintaxis de configuración
sudo nginx -t
```

**Salidas posibles**:

```bash
# Éxito:
nginx: configuration file /etc/nginx/nginx.conf test is successful

# Error:
nginx: [emerg] unknown directive "erro" in /etc/nginx/nginx.conf:12
```

**Análisis DevOps**: Muchos fallos son por configuración inválida. Este comando detecta problemas sin afectar el servicio.

### Paso 4: Verificar Recursos del Sistema

```bash
# Verificar puertos en uso
sudo netstat -tulpn | grep :80
# o
sudo ss -tulpn | grep :80

# Verificar espacio en disco
df -h

# Verificar uso de memoria
free -h
```

**Problemas comunes**:

- Puerto 80 ocupado por otro proceso
- Sin espacio en disco (logs crecidos)
- Memoria agotada

### Paso 5: Revisar Logs de Error Específicos

```bash
# Logs de error de Nginx
sudo tail -f /var/log/nginx/error.log

# Logs de acceso (útil para ver si hay tráfico)
sudo tail -f /var/log/nginx/access.log
```

### Paso 6: Proceso de Recuperación

```bash
# Si la configuración es válida pero el servicio no inicia:

# 1. Intentar reiniciar
sudo systemctl restart nginx

# 2. Si falla, ver logs recientes
sudo journalctl -u nginx -n 20

# 3. Si hay error de puerto ocupado, identificar proceso
sudo lsof -i :80

# 4. Corregir y reiniciar
sudo systemctl restart nginx
```

### Paso 7: Verificación Final

```bash
# Verificar estado
sudo systemctl status nginx

# Probar conexión
curl http://localhost

# Verificar que sigue funcionando después de unos minutos
watch -n 5 'systemctl is-active nginx && echo "✓ Running" || echo "✗ Failed"'
```

---

## ✅ Criterios de Éxito

- [x] Servicio nginx identificado como fallando (o simulado)
- [x] Diagnóstico completado usando `systemctl status`
- [x] Logs revisados con `journalctl`
- [x] Configuración validada con `nginx -t`
- [x] Recursos verificados (puertos, disco, memoria)
- [x] Problema identificado y corregido
- [x] Servicio reiniciado y funcionando
- [x] Verificación post-fix exitosa

---

## 🎓 Lecciones Aprendidas

### 🔑 Metodología de Troubleshooting

**1. Collect → Analyze → Fix → Verify**

```
Recopilar información → Analizar logs → Aplicar fix → Verificar solución
```

**2. Common Patterns**:

- **Config Error** → `nginx -t` lo detecta
- **Port Conflict** → `netstat` o `lsof` identifican proceso
- **Permission Denied** → Revisar `chmod` y ownership
- **Resource Exhaustion** → `df -h`, `free -h`

**3. Systemd Commands**:

```bash
# Información completa del servicio
systemctl status nginx

# Logs del servicio
journalctl -u nginx

# Dependencias del servicio
systemctl list-dependencies nginx

# Último inicio/fallo
systemctl show nginx --property=ActiveEnterTimestamp
```

### 🚨 Troubleshooting Guide

**Problema**: "Failed to start nginx.service"

**Checklist**:

1. ✅ `systemctl status nginx` - ¿Qué dice?
2. ✅ `journalctl -u nginx` - ¿Error específico?
3. ✅ `nginx -t` - ¿Configuración válida?
4. ✅ `netstat -tulpn | grep :80` - ¿Puerto ocupado?
5. ✅ `tail /var/log/nginx/error.log` - ¿Error de aplicación?

**Soluciones comunes**:

```bash
# Configuración inválida
sudo nginx -t  # Identificar línea errónea
sudo vim /etc/nginx/nginx.conf  # Corregir
sudo systemctl restart nginx

# Puerto ocupado
sudo lsof -i :80  # Identificar proceso
sudo systemctl stop <other-service>
sudo systemctl restart nginx

# Permisos incorrectos
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo systemctl restart nginx
```

### 💡 Mejores Prácticas

1. **Documentation**: Crear runbooks

   ```markdown
   ## Nginx Down

   1. Check status: `systemctl status nginx`
   2. Check logs: `journalctl -u nginx -n 50`
   3. Test config: `nginx -t`
   4. If config error: Fix and restart
   5. If port conflict: Identify and stop other service
   ```

2. **Monitoring**: Prevenir es mejor que curar

   ```bash
   # Health check script para cron
   #!/bin/bash
   if ! curl -f http://localhost > /dev/null 2>&1; then
     echo "$(date): Nginx health check failed" >> /var/log/nginx-health.log
     systemctl restart nginx
   fi
   ```

3. **Ansible para Recovery**:

   ```yaml
   - name: Ensure nginx is running
     service:
       name: nginx
       state: started
       enabled: yes
     register: nginx_status

   - name: Debug if nginx failed
     debug:
       msg: "Nginx status: {{ nginx_status }}"
     when: nginx_status.failed
   ```

4. **Post-Incident Review**:
   - ¿Qué falló?
   - ¿Por qué no lo detectamos antes?
   - ¿Cómo prevenimos recurrencia?
   - ¿Mejoras en monitoreo/documentación?

---

## 🚀 Día Siguiente: Preparación

**Día 14** configura backups automatizados - aplicaremos troubleshooting para asegurar que los backups funcionan correctamente.

**Conexión**: Servicio saludable + Backups automatizados = Infraestructura resiliente.

**Preparación**: Investiga estrategias de backup (full, incremental, diferencial) y herramientas como `tar`, `rsync`, `restic`.

---

## 📚 Recursos DevOps

- [Systemd Troubleshooting](https://www.freedesktop.org/software/systemd/man/systemd.html)
- [Linux Performance Analysis](http://www.brendangregg.com/linuxperf.html)
- [Google SRE Book - Troubleshooting](https://sre.google/sre-book/troubleshooting/)

---

## 📊 Seguimiento de Progreso

- **Día**: 13 de 100
- **Bloque**: Troubleshooting y Operaciones
- **Progresión**: 1-12 → 13 → 14 (Servicios → Debugging → Backups)
- **Habilidad**: Debugging sistemático de servicios Linux

**¡Crítico! Ahora puedes resolver problemas en producción con confianza.** 🔧
