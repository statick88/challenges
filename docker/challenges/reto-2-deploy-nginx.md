# 🐳 Docker Challenge Reto 2: Deploy Nginx Container on Application Server
**Fecha**: 25-01-2026  
**Categoría**: #docker #contenedores #nginx #despliegue  
**Dificultad**: ⭐⭐  
**Estado**: ❌ Fallido

---

## 🎯 Objetivo
Desplegar un contenedor Nginx en el servidor de aplicaciones para servir contenido web estático y demostrar habilidades básicas de despliegue de contenedores.

## 🏗️ Detalles de Infraestructura
- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Contraseña**: Ir0nM@n
- **Requisitos**: Contenedor Nginx corriendo en puerto 80 con respuesta HTTP 200

---

## 🔧 Proceso de Solución

### Paso 1: Verificar Docker Disponible
```bash
docker --version
docker ps
```

### Paso 2: Descargar Imagen Nginx
```bash
docker pull nginx:latest
```

### Paso 3: Desplegar Contenedor Nginx
```bash
docker run -d --name nginx-server -p 80:80 nginx:latest
```

### Paso 4: Verificar Despliegue
```bash
docker ps
curl localhost:80
curl -I localhost:80
```

---

## ✅ Verificación
- [ ] Contenedor Nginx corriendo
- [ ] Puerto 80 accesible localmente
- [ ] Respuesta HTTP 200 OK
- [ ] Página Nginx por defecto visible

## 🐛 Solución de Problemas
**Problema**: Reto no completado según aclaración
**Causa**: Malentendido del objetivo - solo se instaló Docker sin desplegar Nginx
**Lección**: Verificar siempre el estado real del reto vs lo reportado

## 📚 Aprendizajes Clave
- `docker run -d` crea contenedores en modo detached
- `-p 80:80` mapea puerto host:contenedor
- `docker ps` muestra solo contenedores activos por defecto
- `docker ps -a` muestra todos los contenedores (activos e inactivos)
- El orden correcto es: verificar > desplegar > probar

## 🔗 Comandos Relacionados
- `docker pull` - Descargar imágenes desde registry
- `docker run` - Crear nuevo contenedor
- `docker ps` - Listar contenedores activos
- `docker logs` - Ver logs de contenedor específico
- `curl` - Herramienta para probar conexiones HTTP

## 📖 Recursos
- Docker Documentation - Nginx Deployment
- Nginx Official Documentation
- Nautilus Project Documentation

---

## 📊 Seguimiento de Tiempo
- **Hora de Inicio**: 14:30
- **Hora de Finalización**: 14:45
- **Duración Total**: 15 minutos

## 🏆 Criterios de Éxito Cumplidos
- [ ] Contenedor Nginx corriendo
- [ ] Respuesta HTTP 200 OK
- [ ] Página Nginx por defecto visible
- [ ] Logs sin errores críticos

## 🌐 Contexto Adicional
Segundo reto donde se practicaron habilidades de despliegue de contenedores web, aunque no se completó exitosamente el objetivo principal de desplegar Nginx.