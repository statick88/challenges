---
title: "Instalación y Configuración de Nginx"
category: devops
day: 12
difficulty: 3
tags:
  - devops
  - nginx
  - web-server
  - reverse-proxy
date: 2026-02-05
status: ready
---

# 🎓 Día 12: Despliegue de Servicios con Nginx

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "Un servidor web no es solo software - es el punto de encuentro entre tu infraestructura y tus usuarios. Nginx es tu embajador: rápido, confiable y capaz de escalar desde un servidor hasta miles con la misma configuración."

Hoy desplegamos **Nginx** - uno de los servidores web más populares en DevOps. Este es tu primer servicio real, conectando todo lo aprendido hasta ahora.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-11**: Infraestructura, usuarios, SSH, Git, variables configuradas
- **Hoy**: Desplegamos nuestro primer servicio productivo
- **Días 13-15**: Monitoreo, troubleshooting y automatización

### Progresión hacia el Pipeline CI/CD

Nginx es fundamental para:

- **Load Balancing**: Distribuir tráfico entre múltiples servidores
- **Reverse Proxy**: Conectar frontend y backend
- **Static Content**: Servir archivos estáticos eficientemente
- **SSL Termination**: Manejar HTTPS

### Escenario Empresarial

El equipo Nautilus necesita:

1. Servidor web en producción
2. Escuchando en puerto 80 (HTTP)
3. Serviendo contenido desde `/var/www/html`
4. Firewall configurado correctamente

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Nginx como punto común:

- **Desarrolladores**: Entregan aplicación, Nginx la expone
- **Operaciones**: Monitorean y escalan Nginx
- **Seguridad**: SSL y rate limiting en el edge

### Automatización

```yaml
# Pipeline CI/CD despliega Nginx:
1. Install nginx package
2. Start and enable service
3. Configure firewall
4. Deploy static content
5. Health check on port 80
```

### Métricas y Observabilidad

- **Request Rate**: Peticiones por segundo
- **Response Time**: Latencia de respuesta
- **Error Rate**: % de respuestas 4xx/5xx
- **Uptime**: Disponibilidad del servicio

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Conectar al Servidor

```bash
ssh tony@stapp01.xfusioncorp.com
```

### Paso 2: Actualizar Repositorios e Instalar

```bash
# Actualizar índice de paquetes
sudo apt update

# Instalar Nginx
sudo apt install nginx -y
```

**Análisis DevOps**:

- `apt update`: Asegura obtener últimas versiones
- `-y`: Respuesta automática "yes" para no interrumpir automatización
- Nginx instala también dependencias necesarias

### Paso 3: Iniciar y Habilitar Servicio

```bash
# Iniciar servicio ahora
sudo systemctl start nginx

# Habilitar inicio automático en boot
sudo systemctl enable nginx
```

**Verificación**:

```bash
sudo systemctl status nginx
```

**Salida esperada**:

```
● nginx.service - A high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
   Active: active (running)
```

### Paso 4: Configurar Firewall

```bash
# Permitir tráfico HTTP (puerto 80)
sudo ufw allow 'Nginx HTTP'

# O específicamente:
sudo ufw allow 80/tcp

# Verificar reglas
sudo ufw status
```

**Análisis DevOps**:

- `ufw` (Uncomplicated Firewall): Frontend simple para iptables
- Solo puerto 80 por ahora (HTTP)
- Puerto 443 (HTTPS) se habilitará cuando configuremos SSL

### Paso 5: Verificar Instalación

```bash
# Test local
curl http://localhost
```

**Salida esperada**:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to nginx!</title>
    ...
  </head>
</html>
```

**Verificación externa** (desde tu máquina):

```bash
curl http://172.16.238.10
```

### Paso 6: Explorar Estructura de Archivos

```bash
# Archivos de configuración
ls /etc/nginx/

# Sitio por defecto
ls /etc/nginx/sites-enabled/

# Directorio web raíz
ls /var/www/html/
```

**Archivos importantes**:

- `/etc/nginx/nginx.conf`: Configuración principal
- `/etc/nginx/sites-available/`: Configuraciones de sitios
- `/var/www/html/`: Contenido web servido
- `/var/log/nginx/`: Logs de acceso y errores

---

## ✅ Criterios de Éxito

- [x] Nginx instalado exitosamente
- [x] Servicio iniciado y corriendo (`systemctl status nginx`)
- [x] Servicio habilitado para inicio automático
- [x] Firewall configurado (puerto 80 permitido)
- [x] Verificación local con `curl localhost` exitosa
- [x] Página por defecto de Nginx visible
- [x] Logs accesibles en `/var/log/nginx/`

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Systemd Services**:

   ```bash
   systemctl start nginx    # Iniciar ahora
   systemctl enable nginx   # Iniciar en boot
   systemctl restart nginx  # Reiniciar
   systemctl reload nginx   # Recargar config (sin downtime)
   ```

2. **Configuration Structure**:

   ```
   /etc/nginx/
   ├── nginx.conf          # Configuración global
   ├── sites-available/    # Sitios configurados
   ├── sites-enabled/      # Sitios activos (symlinks)
   └── conf.d/             # Configuraciones adicionales
   ```

3. **Reverse Proxy Pattern**:
   ```nginx
   server {
       listen 80;
       location / {
           proxy_pass http://localhost:8080;
       }
   }
   ```

### 🚨 Troubleshooting DevOps

**Problema 1**: Puerto 80 ya en uso

- **Diagnóstico**: `sudo netstat -tulpn | grep :80`
- **Solución**: Detener otro servicio o cambiar puerto de Nginx

**Problema 2**: Acceso denegado desde exterior

- **Causas**:
  - Firewall bloqueando
  - SELinux/AppArmor
  - Nginx escuchando solo en localhost
- **Solución**:
  ```bash
  sudo ufw allow 80/tcp
  sudo nginx -t  # Verificar configuración
  ```

**Problema 3**: Cambios de configuración no aplican

- **Solución**: Recargar Nginx (no reiniciar)
  ```bash
  sudo nginx -t           # Test configuración
  sudo systemctl reload nginx  # Sin downtime
  ```

### 💡 Mejores Prácticas

1. **Configuration Validation**:

   ```bash
   sudo nginx -t
   # nginx: configuration file /etc/nginx/nginx.conf test is successful
   ```

2. **Backup Before Changes**:

   ```bash
   sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d)
   ```

3. **Logs Monitoring**:

   ```bash
   # Ver errores en tiempo real
   sudo tail -f /var/log/nginx/error.log

   # Ver accesos
   sudo tail -f /var/log/nginx/access.log
   ```

4. **Ansible Playbook**:

   ```yaml
   - name: Install and configure Nginx
     hosts: webservers
     tasks:
       - name: Install nginx
         apt:
           name: nginx
           state: present

       - name: Start nginx
         service:
           name: nginx
           state: started
           enabled: yes

       - name: Configure firewall
         ufw:
           rule: allow
           name: "Nginx HTTP"
   ```

5. **Health Checks**:
   ```bash
   # Script de health check
   #!/bin/bash
   if curl -f http://localhost > /dev/null 2>&1; then
       echo "✓ Nginx is healthy"
       exit 0
   else
       echo "✗ Nginx is down"
       exit 1
   fi
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 13** introduce troubleshooting de servicios - cuando Nginx (o cualquier servicio) falla, necesitas saber diagnosticar.

**Conexión**: Servicio desplegado + Troubleshooting = Operaciones profesionales.

**Preparación**: Familiarízate con `journalctl`, `systemctl logs`, y técnicas de debugging de servicios Linux.

---

## 📚 Recursos DevOps

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [DigitalOcean Nginx Tutorials](https://www.digitalocean.com/community/tutorials?q=nginx)

---

## 📊 Seguimiento de Progreso

- **Día**: 12 de 100
- **Bloque**: Servicios y Despliegue
- **Progresión**: 1-11 → 12 → 13 (Infraestructura/Variables → Servicio → Troubleshooting)
- **Habilidad**: Despliegue de servicios productivos

**¡Excelente! Tu primera aplicación está en producción, sirviendo tráfico.** 🌐
