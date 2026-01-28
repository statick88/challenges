# 🐳 Docker Challenge Reto 4: Copy File to Docker Container
**Fecha**: DD-MM-YYYY  
**Categoría**: #docker #contenedores #archivos #gestión  
**Dificultad**: ⭐⭐⭐  
**Estado**: ⏳ Preparado

---

## 🎯 Objetivo
Transferir archivos entre el host y contenedores Docker usando comandos `docker cp` para demostrar habilidades de gestión de archivos en entornos contenerizados.

## 🏗️ Detalles de Infraestructura
- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Contraseña**: Ir0nM@n
- **Requisitos**: Archivos transferidos exitosamente entre host y contenedor

---

## 🔧 Proceso de Solución

### Paso 1: Crear Archivo de Prueba
```bash
# Crear archivo en el host
echo "Hello from host!" > test-file.txt

# Crear archivo con contenido más complejo
cat > index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Test desde Docker Host</h1>
    <p>Archivos transferidos exitosamente</p>
</body>
</html>
EOF
```

### Paso 2: Desplegar Contenedor de Prueba
```bash
# Desplegar contenedor para pruebas
docker run -d --name test-container nginx:latest
```

### Paso 3: Copiar Archivos al Contenedor
```bash
# Copiar archivo del host al contenedor
docker cp test-file.txt test-container:/usr/share/nginx/html/

# Copiar múltiples archivos
docker cp *.html test-container:/usr/share/nginx/html/

# Copiar desde contenedor al host
docker cp test-container:/etc/nginx/nginx.conf ./nginx-backup.conf
```

### Paso 4: Verificar Transferencia
```bash
# Acceder al contenedor para verificar archivos
docker exec -it test-container ls /usr/share/nginx/html/

# Verificar contenido del archivo
docker exec -it test-container cat /usr/share/nginx/html/test-file.txt
```

### Paso 5: Probar Web Server
```bash
# Obtener IP del contenedor
docker inspect test-container | grep IPAddress

# Probar conexión HTTP
curl http://<container_ip>/test-file.txt

# Verificar página web
curl http://<container_ip>/
```

### Paso 6: Sincronización Bidireccional
```bash
# Copiar directorio completo
docker cp -r ./web-files test-container:/usr/share/nginx/html/

# Extraer archivos modificados
docker cp test-container:/var/log/nginx/ ./logs-nginx/
```

---

## ✅ Verificación
- [ ] Archivos creados en host correctamente
- [ ] Archivos copiados al contenedor exitosamente
- [ ] Contenido verificado dentro del contenedor
- [ ] Servidor web sirviendo archivos transferidos

## 🐛 Solución de Problemas
{Problemas encontrados y soluciones aplicadas}

## 📚 Aprendizajes Clave
- `docker cp` copia archivos entre host y contenedor en ambas direcciones
- `docker cp -r` permite copiar directorios recursivamente
- `docker exec` permite ejecutar comandos dentro de contenedores en ejecución
- Las rutas dentro de contenedores siguen siendo rutas Linux absolutas
- Importante verificar permisos de archivos después de transferencia

## 🔗 Comandos Relacionados
- `docker cp` - Copiar archivos entre host y contenedor
- `docker cp -r` - Copiar directorios recursivamente
- `docker exec` - Ejecutar comandos en contenedor corriendo
- `docker inspect` - Obtener información detallada del contenedor
- `docker run -it` - Iniciar contenedor interactivo

## 📖 Recursos
- Docker Documentation - File Management
- Nginx Documentation - File Serving

---

## 📊 Seguimiento de Tiempo
- **Hora de Inicio**: HH:MM
- **Hora de Finalización**: HH:MM
- **Duración Total**: XX minutos

## 🏆 Criterios de Éxito Cumplidos
- [x] Archivos creados en host
- [x] Archivos transferidos al contenedor
- [x] Contenido verificado dentro del contenedor
- [x] Servidor web funcionando con archivos transferidos

## 🌐 Contexto Adicional
Reto fundamental para demostrar habilidades de gestión de archivos en entornos Docker, esencial para desarrollo de aplicaciones contenerizadas donde se necesita transferir configuraciones, código y recursos estáticos.