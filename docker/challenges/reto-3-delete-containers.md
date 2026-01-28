# 🐳 Docker Challenge Reto 3: Delete Docker Container
**Fecha**: DD-MM-YYYY  
**Categoría**: #docker #contenedores #limpieza  
**Dificultad**: ⭐⭐  
**Estado**: ⏳ Preparado

---

## 🎯 Objetivo
Eliminar contenedores Docker específicos y limpiar recursos del sistema siguiendo las especificaciones del entorno Nautilus para optimizar el uso de recursos.

## 🏗️ Detalles de Infraestructura
- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Contraseña**: Ir0nM@n
- **Requisitos**: Sistema Docker limpio de contenedores no utilizados

---

## 🔧 Proceso de Solución

### Paso 1: Conexión al Servidor
```bash
ssh tony@172.16.238.10
# Password: Ir0nM@n
```

### Paso 2: Listar Contenedores Existentes
```bash
# Ver todos los contenedores (activos e inactivos)
docker ps -a

# Ver solo contenedores activos
docker ps
```

### Paso 3: Eliminar Contenedor Específico
```bash
# Eliminar contenedor por nombre
docker rm nombre_del_contenedor

# Eliminar contenedor por ID
docker rm container_id

# Forzar eliminación si está corriendo
docker rm -f nombre_del_contenedor

# Eliminar múltiples contenedores
docker rm container1 container2 container3
```

### Paso 4: Limpiar Imágenes no Utilizadas
```bash
# Listar todas las imágenes
docker images -a

# Eliminar imágenes huérfanas
docker rmi $(docker images -f "dangling=true" -q)

# Eliminar imágenes específicas
docker rmi nginx:alpine
```

### Paso 5: Verificación de Limpieza
```bash
# Verificar que no hay contenedores corriendo
docker ps

# Verificar espacio liberado
docker system df

# Listar imágenes restantes
docker images
```

### Paso 6: Limpieza Avanzada (Opcional)
```bash
# Limpiar sistema de Docker completamente
docker system prune -f

# Limpiar solo volúmenes no utilizados
docker volume prune -f

# Limpiar redes no utilizadas
docker network prune -f
```

---

## ✅ Verificación
- [ ] Contenedores especificados eliminados
- [ ] Sistema Docker limpio de recursos no utilizados
- [ ] Espacio en disco liberado correctamente
- [ ] Comandos ejecutados sin errores

## 🐛 Solución de Problemas
{Problemas encontrados y soluciones aplicadas}

## 📚 Aprendizajes Clave
- Uso correcto de `docker ps -a` para ver todos los contenedores
- `docker rm -f` para eliminar contenedores corriendo forzadamente
- `docker system prune` para limpieza completa del sistema
- Diferencia entre `docker rmi` (imágenes) y `docker rm` (contenedores)

## 🔗 Comandos Relacionados
- `docker ps -a` - Listar todos los contenedores (activos e inactivos)
- `docker rm` - Eliminar contenedores
- `docker rmi` - Eliminar imágenes Docker
- `docker system prune` - Limpiar sistema Docker
- `docker volume prune` - Limpiar volúmenes no utilizados
- `docker images -f "dangling=true"` - Filtrar imágenes huérfanas

## 📖 Recursos
- Docker Documentation - Container Management
- Nautilus Project Documentation

---

## 📊 Seguimiento de Tiempo
- **Hora de Inicio**: HH:MM
- **Hora de Finalización**: HH:MM
- **Duración Total**: XX minutos

## 🏆 Criterios de Éxito Cumplidos
- [x] Contenedores objetivo eliminados
- [x] Recursos Docker limpiados
- [x] Sistema optimizado
- [x] Verificación completada

## 🌐 Contexto Adicional
Reto parte del programa Docker Challenge donde se requiere limpieza de contenedores anteriores y optimización de recursos en el servidor stapp01 para preparar el entorno para nuevos despliegues.