# 🐳 Docker Challenge Reto 1: Install Docker Packages and Start Docker Service
**Fecha**: 25-01-2026  
**Categoría**: #docker #linux #instalación  
**Dificultad**: ⭐⭐⭐  
**Estado**: ✅ Completado

---

## 🎯 Objetivo
Instalar paquetes Docker e iniciar el servicio Docker en el servidor stapp01 para preparar el entorno de contenerización.

## 🏗️ Detalles de Infraestructura
- **Servidor**: stapp01.stratos.xfusioncorp.com
- **IP**: 172.16.238.10
- **Usuario**: tony
- **Contraseña**: Ir0nM@n
- **Sistema**: CentOS Stream 9
- **Requisitos**: Docker CE + Docker Compose + grupo Docker para usuario

---

## 🔧 Proceso de Solución

### Paso 1: Identificar Sistema Operativo
```bash
cat /etc/os-release
# NAME="CentOS Stream"
# VERSION="9"
# ID="centos"
```

### Paso 2: Instalar Docker con YUM
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

### Paso 3: Iniciar y Habilitar Servicio Docker
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Paso 4: Configurar Grupo Docker
```bash
sudo usermod -aG docker tony
newgrp docker
```

### Paso 5: Verificar Instalación
```bash
docker --version
systemctl status docker
docker run hello-world
```

---

## ✅ Verificación
- [x] Docker versión 29.2.0 instalada correctamente
- [x] Servicio Docker activo y habilitado
- [x] Usuario tony agregado al grupo docker
- [x] Comando hello-world ejecutado exitosamente

## 🐛 Solución de Problemas
**Problema**: Intento inicial con `apt` falló por ser sistema CentOS
**Causa**: CentOS usa gestor de paquetes `yum` no `apt`
**Solución**: Identificar sistema operativo con `cat /etc/os-release` y usar comandos apropiados

## 📚 Aprendizajes Clave
- En sistemas RHEL/CentOS se usa `yum` en lugar de `apt` para gestión de paquetes
- El script oficial `get.docker.com` funciona como alternativa universal
- Importante reiniciar sesión después de modificar grupos de usuarios
- `systemctl enable docker` asegura que el servicio inicie automáticamente

## 🔗 Comandos Relacionados
- `yum` - Gestor de paquetes para sistemas RHEL/CentOS
- `yum-config-manager` - Configurar repositorios YUM
- `systemctl` - Gestión de servicios systemd
- `usermod` - Modificar atributos de usuario
- `newgrp` - Cambiar grupo primario del usuario

## 📖 Recursos
- Docker Documentation - CentOS Installation
- Red Hat Documentation - Docker on RHEL
- Nautilus Project Documentation

---

## 📊 Seguimiento de Tiempo
- **Hora de Inicio**: 10:00
- **Hora de Finalización**: 10:15
- **Duración Total**: 15 minutos

## 🏆 Criterios de Éxito Cumplidos
- [x] Docker CE instalado correctamente
- [x] Servicio Docker iniciado y habilitado
- [x] Usuario configurado en grupo Docker
- [x] Instalación verificada con hello-world

## 🌐 Contexto Adicional
Primer reto del programa Docker Challenge completado exitosamente en servidor CentOS Stream 9, estableciendo las bases para contenerización de aplicaciones en el entorno Nautilus DevOps.