# 📅 Día 2: Configuración de Usuario Temporal con Expiración
**Fecha**: 25-01-2026  
**Categoría**: #linux #ssh #usuarios #seguridad  
**Dificultad**: ⭐⭐  
**Estado**: ✅ Completado

---

## 🎯 Objetivo
Crear un usuario temporal llamado `yousuf` en el App Server 1 con fecha de expiración establecida al 2027-03-28 para acceso de duración limitada como parte de la asignación del proyecto Nautilus.

## 🏗️ Detalles de Infraestructura
- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Contraseña**: Ir0nM@n
- **Usuario Objetivo**: yousuf (minúsculas)
- **Fecha de Expiración**: 2027-03-28

---

## 🔧 Proceso de Solución

### Paso 1: Conectarse al App Server 1
```bash
ssh tony@172.16.238.10
```
Conexión exitosa después de verificación de clave SSH.

### Paso 2: Crear usuario temporal con fecha de expiración
```bash
sudo useradd -e 2027-03-28 yousuf
```
Usuario `yousuf` creado exitosamente con fecha de expiración.

### Paso 3: Verificar creación del usuario
```bash
id yousuf
```
Salida: `uid=1002(yousuf) gid=1002(yousuf) groups=1002(yousuf)`

### Paso 4: Verificar detalles de expiración de la cuenta
```bash
sudo chage -l yousuf
```
La salida muestra:
- **Account expires**: Mar 28, 2027 ✅
- **Password expires**: never
- **Account created successfully**

---

## ✅ Verificación
- Usuario `yousuf` existe con uid=1002, gid=1002
- Expiración de cuenta establecida correctamente al 28 Mar 2027
- Nombre de usuario en minúsculas según requerimiento
- Todos los requisitos cumplidos

## 🐛 Solución de Problemas
El intento inicial de `chage -l yousuf` falló con "Permission denied" porque no se usó sudo. Resuelto agregando el prefijo `sudo`: `sudo chage -l yousuf`.

## 📚 Aprendizajes Clave
- `useradd -e AAAA-MM-DD` establece fecha de expiración de cuenta
- `sudo chage -l nombre_usuario` muestra información de la cuenta de usuario
- Siempre verificar permisos cuando los comandos administrativos fallan
- Gestión de usuarios temporales para acceso basado en proyectos

## 🔗 Comandos Relacionados
- `useradd -e` - Crear usuario con fecha de expiración
- `chage -l` - Listar información de envejecimiento de usuario
- `id` - Mostrar identidad de usuario
- `sudo` - Ejecutar comandos con privilegios de superusuario

## 📖 Recursos
- Manual de administración de usuarios Linux
- Documentación del proyecto Nautilus

---

## 📊 Seguimiento de Tiempo
- **Hora de Inicio**: 14:30
- **Hora de Finalización**: 14:45
- **Duración Total**: 15 minutos

## 🏆 Criterios de Éxito Cumplidos
- [x] Usuario llamado 'yousuf' creado (minúsculas)
- [x] Fecha de expiración establecida al 2027-03-28
- [x] Cuenta creada en App Server 1 (stapp01)
- [x] Verificación completada exitosamente

## 🌐 Contexto Adicional
Este reto es parte del programa "100 Days of DevOps" y simula un escenario real donde se necesita proporcionar acceso temporal a un desarrollador (yousuf) para el proyecto Nautilus, demostrando habilidades en gestión de usuarios Linux y control de acceso basado en tiempo.