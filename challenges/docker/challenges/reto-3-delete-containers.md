# 🐳 Docker Challenge Reto 3: Delete Docker Container

**Fecha**: 30-01-2026  
**Categoría**: #docker #contenedores #limpieza  
**Dificultad**: ⭐⭐
**Estado**: ✅ Completado

---

## 🎯 Objetivo

Eliminar el contenedor Docker llamado `kke-container` en App Server 3 (stapp03) que fue creado por un desarrollador del proyecto Nautilus solo con propósitos de prueba. El contenedor necesita ser eliminado para liberar recursos y mantener el sistema limpio.

---

## 🏗️ Detalles de Infraestructura

- **Servidor Objetivo**: stapp03.stratos.xfusioncorp.com
- **IP**: 172.16.238.12
- **Usuario**: banner
- **Contraseña**: BigGr33n
- **Acceso**: Via jump_host (thor@jump_host.stratos.xfusioncorp.com)
- **Docker Version**: 26.1.3
- **Contenedor a Eliminar**: kke-container (imagen: busybox)

---

## 🔧 Proceso de Solución

### Fase 1: Conexión a los Servidores

#### Paso 1: Conectarse al Jump Host

```bash
ssh thor@jump_host.stratos.xfusioncorp.com
# Contraseña: mjolnir123
```

**Resultado esperado:**
```
Last login: Fri Jan 30 04:28:39 2026
thor@jumphost ~$
```

#### Paso 2: Conectarse a stapp03

```bash
ssh banner@stapp03.stratos.xfusioncorp.com
# Contraseña: BigGr33n
```

**Resultado esperado:**
```
[banner@stapp03 ~]$
```

### Fase 2: Verificación del Entorno Docker

#### Paso 3: Verificar Instalación de Docker

```bash
docker --version
```

**Resultado esperado:**
```
Docker version 26.1.3, build b72abbb
```

### Fase 3: Identificación del Contenedor

#### Paso 4: Listar Todos los Contenedores

```bash
docker ps -a
```

**Resultado esperado:**
```
CONTAINER ID   IMAGE     COMMAND               CREATED              STATUS              PORTS     NAMES
c7f1445197d7   busybox   "tail -f /dev/null"   About a minute ago   Up About a minute             kke-container
```

#### Paso 5: Verificar Contenedores en Ejecución

```bash
docker ps
```

**Resultado:**
```
CONTAINER ID   IMAGE     COMMAND               CREATED              STATUS              PORTS     NAMES
c7f1445197d7   busybox   "tail -f /dev/null"   About a minute ago   Up About a minute             kke-container
```

**Análisis**: El contenedor `kke-container` está en estado "Up" (en ejecución), basado en la imagen `busybox`.

### Fase 4: Eliminación del Contenedor

#### Paso 6: Intento Inicial de Eliminación

```bash
docker rm kke-container
```

**Resultado esperado (error):**
```
Error response from daemon: cannot remove container "/kke-container": 
container is running: stop the container before removing or force remove
```

**Análisis**: Como el contenedor está en ejecución, no se puede eliminar directamente. Hay dos opciones:
1. Detener el contenedor primero y luego eliminarlo
2. Forzar la eliminación con `docker rm -f`

Se eligió la opción 1 por ser más segura.

#### Paso 7: Detener el Contenedor

```bash
docker stop kke-container
```

**Resultado esperado:**
```
kke-container
```

**Nota**: La salida del comando `docker stop` es simplemente el nombre del contenedor confirmando que fue detenido.

#### Paso 8: Eliminar el Contenedor (Detenido)

```bash
docker rm kke-container
```

**Resultado esperado:**
```
kke-container
```

**Nota**: Similar al comando anterior, la salida confirma que el contenedor fue eliminado.

### Fase 5: Verificación de Eliminación

#### Paso 9: Verificar que el Contenedor fue Eliminado

```bash
docker ps -a
```

**Resultado esperado:**
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

(Lista vacía - sin contenedores)

#### Paso 10: Búsqueda Específica del Contenedor

```bash
docker ps -a | grep kke-container
```

**Resultado esperado:**
```
(Sin resultados - línea vacía)
```

**Análisis**: El contenedor `kke-container` ya no existe en el sistema.

#### Paso 11: Verificar Limpieza de Recursos

```bash
docker system df
```

**Resultado esperado:**
```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          1         0         4.425MB   4.425MB (100%)
Containers      0         0         0B        0B
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B
```

**Análisis**:
- **Images**: 1 imagen total (probablemente busybox), 0 activas, 4.425 MB total, todo es reclaimable
- **Containers**: 0 contenedores (confirmado - kke-container fue eliminado exitosamente)
- **Local Volumes**: 0 volúmenes
- **Build Cache**: 0

---

## ✅ Verificación Final

- [x] Contenedor `kke-container` localizado en stapp03
- [x] Contenedor estaba en estado "Up" (en ejecución)
- [x] Contenedor fue detenido exitosamente
- [x] Contenedor fue eliminado exitosamente
- [x] Verificación confirma que el contenedor no existe en `docker ps -a`
- [x] Búsqueda específica no retorna resultados
- [x] Sistema Docker limpio (0 contenedores)
- [x] Espacio liberado confirmado en `docker system df`

---

## 🐛 Solución de Problemas

### Problema 1: No se puede eliminar contenedor en ejecución

**Descripción**: Intentar ejecutar `docker rm kke-container` cuando el contenedor está en estado "Up"

**Causa**: Docker no permite eliminar contenedores que están en ejecución como medida de seguridad.

**Error Exacto**:
```
Error response from daemon: cannot remove container "/kke-container": 
container is running: stop the container before removing or force remove
```

**Solución 1 (Recomendado)**: 
```bash
docker stop kke-container
docker rm kke-container
```

**Solución 2 (Fuerza)**: 
```bash
docker rm -f kke-container
```

**Diferencia**: La Solución 1 detiene el contenedor gracefully primero. La Solución 2 fuerza la eliminación inmediata (puede causar pérdida de datos si el contenedor tiene datos en memoria).

### Problema 2: Verificar si el contenedor existe aún

**Descripción**: Asegurarse de que el contenedor fue completamente eliminado.

**Solución**:
```bash
# Opción 1: Listar todos
docker ps -a

# Opción 2: Búsqueda específica
docker ps -a | grep kke-container

# Opción 3: Intentar parar/eliminar (debería fallar)
docker stop kke-container  # → Error: No such container
```

---

## 📚 Aprendizajes Clave

### 1. **Estados de Contenedores Docker**
- **Up**: Contenedor en ejecución
- **Exited**: Contenedor detenido
- **Paused**: Contenedor pausado
- No se pueden eliminar contenedores en estado "Up" sin opciones especiales

### 2. **Ciclo de Vida de Contenedores**
```
Crear → Ejecutar → Detener → Eliminar
(run)  (running)  (stop)   (rm)
```

### 3. **Diferencia entre `docker stop` y `docker rm`**
- **`docker stop`**: Detiene la ejecución del contenedor (lo mantiene en el sistema)
- **`docker rm`**: Elimina completamente el contenedor del sistema (requiere que esté detenido)

### 4. **Opciones Útiles para `docker rm`**
```bash
docker rm container-name           # Eliminar contenedor detenido
docker rm -f container-name        # Forzar eliminación (incluso si está en ejecución)
docker rm container1 container2    # Eliminar múltiples contenedores
docker rm $(docker ps -aq)         # Eliminar todos los contenedores
```

### 5. **Monitoreo de Recursos Docker**
- `docker system df`: Muestra uso de espacio por Images, Containers, Volumes, Build Cache
- Útil para identificar qué es reclaimable y liberar espacio

### 6. **Limpieza de Sistema Docker**
```bash
docker system prune -f             # Limpiar todo (contenedores, imágenes, volúmenes)
docker image prune -a -f           # Limpiar todas las imágenes no usadas
docker container prune -f          # Limpiar todos los contenedores detenidos
docker volume prune -f             # Limpiar volúmenes no usados
```

---

## 🔗 Comandos Relacionados

```bash
# Información y Listado
docker --version                    # Ver versión de Docker
docker info                         # Información completa del sistema
docker ps                           # Listar contenedores en ejecución
docker ps -a                        # Listar todos los contenedores
docker ps -aq                       # Listar IDs de todos los contenedores

# Gestión de Contenedores
docker run                          # Crear y ejecutar contenedor
docker stop container-name          # Detener contenedor
docker start container-name         # Iniciar contenedor detenido
docker restart container-name       # Reiniciar contenedor
docker rm container-name            # Eliminar contenedor
docker rm -f container-name         # Forzar eliminación

# Sistema
docker system df                    # Uso de espacio por tipo
docker system prune -f              # Limpiar recursos no usados
docker images                       # Listar imágenes
docker rmi image-name               # Eliminar imagen
```

---

## 📖 Recursos

- [Docker Container Documentation](https://docs.docker.com/engine/reference/commandline/container/)
- [Docker rm Command Reference](https://docs.docker.com/engine/reference/commandline/rm/)
- [Docker ps Documentation](https://docs.docker.com/engine/reference/commandline/ps/)
- [Docker System Prune](https://docs.docker.com/engine/reference/commandline/system_prune/)

---

## 📊 Seguimiento de Tiempo

- **Hora de Inicio**: 04:30 (30-01-2026)
- **Hora de Finalización**: 04:35 (30-01-2026)
- **Duración Total**: 5 minutos

---

## 🏆 Criterios de Éxito Cumplidos

- [x] Contenedor `kke-container` identificado en stapp03
- [x] Contenedor fue detenido correctamente
- [x] Contenedor fue eliminado del sistema
- [x] Verificación confirma eliminación completa
- [x] No hay errores en la ejecución
- [x] Sistema Docker limpio y optimizado
- [x] Espacio liberado confirmado

---

## 🌐 Contexto Adicional y Importancia del Reto

Este reto es importante en un contexto DevOps por varias razones:

### 1. **Gestión de Recursos**
- Los contenedores que no se usan consumen espacio en disco y pueden fragmentar el sistema
- La limpieza regular es esencial en entornos de producción

### 2. **Operaciones Cotidianas**
- Los administradores de sistemas regularmente necesitan eliminar contenedores de prueba
- Comprender el ciclo de vida completo de contenedores es fundamental

### 3. **Automatización**
- Este conocimiento es base para scripts de limpieza automática
- Esencial para CI/CD pipelines que crean y destruyen contenedores constantemente

### 4. **Troubleshooting**
- Saber que no se pueden eliminar contenedores en ejecución es crítico para resolver problemas
- Comprender estados de contenedores ayuda en debugging

### 5. **Seguridad y Mantenimiento**
- Contenedores desusados pueden ser riesgos de seguridad
- Limpieza regular reduce la superficie de ataque

### 6. **Casos de Uso Empresariales**
- **Testing**: Eliminar contenedores de prueba después de tests
- **Desarrollo**: Limpiar entorno de desarrollo local
- **Staging**: Limpiar recursos de staging antes de producción
- **Disaster Recovery**: Recuperación rápida requiere limpieza de recursos antiguos
- **Cost Optimization**: Reducir costos de infraestructura eliminando recursos sin usar

---

## 🔗 Conexión con Otros Retos

Este reto se construye sobre:
- **Reto 1**: Docker Installation - Docker debe estar instalado
- **Reto 2**: Deploy Nginx Container - Entiende cómo los contenedores se crean

Este reto prepara para:
- **Reto 4**: Copy Files to Container - Operaciones más complejas
- **Reto 5**: Troubleshoot Container - Debugging de contenedores problemáticos

---

## 🚀 Próximos Pasos

1. **Reto 4**: Aprender a copiar archivos a/desde contenedores
2. **Reto 5**: Desarrollar habilidades de troubleshooting
3. **Docker Compose**: Orquestación de múltiples contenedores
4. **Imagen Personalizada**: Crear Dockerfiles y construir imágenes personalizadas

---

## 📝 Conclusión

Completar este reto demuestra comprensión fundamental del ciclo de vida de contenedores Docker. La capacidad de gestionar contenedores (crear, ejecutar, detener y eliminar) es esencial para cualquier profesional DevOps trabajando con Docker en entornos empresariales.

La ejecución fue limpia y exitosa, con solo un error educativo (intento de eliminar contenedor en ejecución) que fue rápidamente resuelto usando mejores prácticas (detener primero, luego eliminar).

