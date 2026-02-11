---
title: "Docker Challenge 1: Fundamentos de Contenedores en Producción"
category: docker
difficulty: 3
tags:
  - docker
  - linux
  - instalación
  - contenedores
  - devops
  - infraestructura
date: 25-01-2026
status: completado
---

# 🐳 Docker Challenge 1: Fundamentos de Contenedores en Producción

## Pensando como un Ingeniero de Plataforma/DevOps

---

👨‍🏫 **Del Instructor**: Bienvenido a tu primera clase de contenedores en producción. Soy tu instructor y te voy a enseñar a pensar como un **Platform Engineer** - alguien que diseña, construye y opera infraestructura a escala usando contenedores.

> 🎯 **Mentalidad DevOps/Platform**: Un ingeniero de plataforma no solo "instala Docker". Diseña sistemas que escalan, automatizan y se recuperan solos. Piensa en: "¿Cómo esto funciona cuando tengo 100 servidores? ¿1000? ¿Cómo automatizo esto? ¿Cómo lo monitoreo?"

---

## 🎭 Escenario Real: El Lanzamiento de Nautilus DevOps

**Contexto Empresarial**:
Eres el nuevo **Platform Engineer** contratado por **Stratos Datacenter** para modernizar su infraestructura. La empresa está migrando de servidores tradicionales a arquitectura de microservicios contenerizados.

Tu jefe (CTO) te dice:

> _"Necesitamos preparar el servidor stapp01 para ejecutar contenedores. El equipo de desarrollo quiere desplegar su primera aplicación Dockerizada la próxima semana. Tienes el servidor stapp01 - instala Docker, configúralo correctamente, y asegúrate de que sea seguro y escalable. El usuario 'tony' será quien gestione los contenedores."_

**Tu reacción como Platform Engineer:**

🛑 **PARA Y PIENSA**. Un profesional no solo "instala Docker". Pregunta:

1. **¿Qué tipo de cargas ejecutaremos?** → Define requisitos de recursos
2. **¿Quién necesita acceso?** → Seguridad y permisos
3. **¿Cómo monitoreamos esto?** → Observabilidad desde el día 1
4. **¿Qué pasa si falla?** → Resiliencia y recuperación
5. **¿Cómo automatizamos?** → Infrastructure as Code

Esta mentalidad de **"diseño antes de implementación"** es la diferencia entre un "instalador" y un "ingeniero de plataforma".

---

## 🧠 Arquitectura de Contenedores: Entendiendo el Stack

Antes de tocar el servidor, entendamos QUÉ estamos construyendo:

### ¿Por Qué Docker? La Revolución de los Contenedores

Imagina que eres una empresa de logística. Antes de los contenedores estándar:

- Cada carga necesitaba empaque especial
- No sabías si cabía en el camión/barco
- Descargar era un caos (cada caja diferente)

**Los contenedores estándar cambiaron todo**: Caja uniforme, apilable, transportable.

Docker hace lo mismo para software:

- **Empaqueta** tu aplicación + dependencias
- **Estandariza** el formato (imagen Docker)
- **Aísla** del sistema host
- **Transporta** fácilmente entre ambientes

> 💡 **Insight de Platform Engineer**: Docker no es solo "facilitar despliegues". Es habilitar:
>
> - Microservicios (decenas de apps pequeñas)
> - CI/CD rápido (builds consistentes)
> - Escalado horizontal (más instancias fácilmente)
> - Portabilidad cloud (AWS, Azure, GCP - mismo container)

### Componentes del Stack Docker

```
┌─────────────────────────────────────────┐
│  TU APLICACIÓN CONTENERIZADA           │
│  (Nginx, Node.js, Python, etc.)        │
├─────────────────────────────────────────┤
│  CONTAINER RUNTIME (containerd)        │
│  - Gestiona ciclos de vida             │
│  - Aislamiento (namespaces, cgroups)   │
├─────────────────────────────────────────┤
│  DOCKER ENGINE                         │
│  - API REST                            │
│  - Docker Daemon                       │
├─────────────────────────────────────────┤
│  DOCKER CLI                            │
│  - Comandos que escribes               │
└─────────────────────────────────────────┘
```

**Como Platform Engineer**, sabes que:

- `docker run` llama al Docker Daemon
- El Daemon habla con containerd
- containerd ejecuta runc (runtime real)
- Todo esto usa Linux kernel features: **namespaces** (aislamiento) + **cgroups** (límites de recursos)

---

## 🛠️ Implementación Profesional: Paso a Paso

### Paso 0: Inteligencia y Planificación

Antes de ejecutar comandos, **recopila información**:

```bash
# ¿Qué sistema operativo tenemos?
ssh tony@172.16.238.10
cat /etc/os-release
```

**Resultado:** CentOS Stream 9

**Decisión técnica**:

- CentOS es RHEL-based → usa `yum`/`dnf`, no `apt`
- Necesitamos el repositorio oficial de Docker
- SELinux está probablemente habilitado (considerar contextos)

> 🎓 **Lección de Plataforma**: Siempre identifica el SO primero. Instalar Docker en Ubuntu vs CentOS vs Alpine es diferente. Un playbook de Ansible/Puppet/Chef maneja estas diferencias automáticamente.

### Paso 1: Preparación del Sistema

```bash
# Actualizamos el sistema (buena práctica)
sudo yum update -y

# Instalamos herramientas necesarias
sudo yum install -y yum-utils
```

**¿Por qué `yum-utils`?**

- Proporciona `yum-config-manager`
- Permite agregar repositorios externos
- Herramienta estándar para gestión de repos en RHEL/CentOS

### Paso 2: Configuración del Repositorio

```bash
# Agregamos el repositorio OFICIAL de Docker
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

**Análisis de Platform Engineer:**

- Usamos el repo **oficial** (download.docker.com), no el de la distribución
- El repo oficial tiene versiones más recientes y actualizaciones de seguridad
- Esto se automatiza en producción con:
  - Ansible: `yum_repository` module
  - Puppet: `yumrepo` type
  - Chef: `yum_repository` resource
  - Terraform: `yum_repository` en cloud-init

> 🔐 **Seguridad**: Siempre usa repositorios oficiales o firmados. Repositorios de terceros pueden contener malware.

### Paso 3: Instalación del Stack Docker

```bash
# Instalamos el stack completo
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

**¿Qué instalamos exactamente?**

| Paquete         | Función                       | Por qué importa                    |
| --------------- | ----------------------------- | ---------------------------------- |
| `docker-ce`     | Docker Community Edition      | El motor principal                 |
| `docker-ce-cli` | Interfaz de línea de comandos | Cómo interactúas con Docker        |
| `containerd.io` | Container runtime             | Ejecuta realmente los contenedores |

> 🧠 **Arquitectura Profunda**:
>
> - Docker CE es el daemon que recibe tus comandos
> - Docker CLI es el cliente que habla con el daemon
> - containerd es el runtime "industrial" (usado también por Kubernetes)
> - runc (incluido) es el runtime de bajo nivel que habla con el kernel

**Verificación de instalación:**

```bash
# Verificamos versiones
docker --version
# Docker version 24.0.7, build afdd53b

containerd --version
# containerd containerd.io 1.6.24
```

### Paso 4: Gestión del Servicio

```bash
# Iniciamos el servicio ahora
sudo systemctl start docker

# Habilitamos inicio automático
sudo systemctl enable docker

# Verificamos estado
sudo systemctl status docker
```

**Análisis DevOps:**

- `start`: Activa el servicio inmediatamente
- `enable`: Crea symlinks para que systemd inicie Docker en boot
- **Por qué ambos**: `start` sin `enable` = Docker se apaga al reiniciar. `enable` sin `start` = Docker inicia en el próximo boot, pero no ahora.

> 📊 **Monitoreo**: En producción, configura alerting si `docker.service` no está `active`. Usa Prometheus + Node Exporter o Datadog/New Relic.

### Paso 5: Seguridad - Gestión de Accesos

**PROBLEMA**: Docker requiere root por defecto. Dar root a desarrolladores es peligroso.

**SOLUCIÓN PROFESIONAL**: Grupo `docker`

```bash
# Agregamos al usuario tony al grupo docker
sudo usermod -aG docker tony

# Aplicamos cambios sin logout
newgrp docker
```

**Análisis de Seguridad:**

🔐 **Nivel 1 - Grupo Docker**:

- Miembros del grupo `docker` pueden ejecutar `docker` sin sudo
- PERO: Docker con acceso = root (puedes montar / en un contenedor)
- **Riesgo**: Un contenedor comprometido = host comprometido

🔐 **Nivel 2 - Rootless Mode (Producción)**:

```bash
# Modo avanzado: Docker sin root
dockerd-rootless-setuptool.sh install
```

- Ejecuta daemon como usuario no-privilegiado
- Mejor aislamiento de seguridad
- Usado en entornos enterprise/multitenant

🔐 **Nivel 3 - Docker Bench Security**:

```bash
# Auditoría de seguridad
docker run -it --net host --pid host --userns host \
  -v /etc:/etc:ro -v /var/run/docker.sock:/var/run/docker.sock \
  docker/docker-bench-security
```

> 🎓 **Mejor Práctica de Platform Engineer**: En producción enterprise, nunca uses Docker directo. Usa:
>
> - **Kubernetes** con RBAC (control granular)
> - **Pod Security Standards** (políticas de seguridad)
> - **Network Policies** (segmentación)
> - **Security Contexts** (runAsNonRoot, readOnlyRootFilesystem)

### Paso 6: Verificación de Integridad

Como Platform Engineer, verificas TODO:

```bash
# Test 1: Docker daemon responde
docker info

# Test 2: Podemos ejecutar contenedores
docker run hello-world

# Test 3: El usuario tony tiene acceso (sin sudo)
docker ps

# Test 4: Networking funciona
docker network ls

# Test 5: Volumenes disponibles
docker volume ls
```

**Output esperado de `docker info`:**

```
Server:
 Containers: 1
  Running: 0
  Paused: 0
  Stopped: 1
 Images: 1
 Server Version: 24.0.7
 Storage Driver: overlay2
  Backing Filesystem: xfs
 Logging Driver: json-file
 Cgroup Driver: systemd
```

> 📈 **Observabilidad**: En producción, estos métricos van a dashboards (Grafana, DataDog). Alertas si:
>
> - Containers en estado `Dead` o `Restarting` constantemente
> - Uso de disco de imágenes > 80%
> - Tiempo de respuesta del daemon > 1s

---

## 🚀 Conceptos Avanzados de Plataforma

### 1. Docker Storage Drivers

CentOS usa **XFS**, entonces Docker usa **overlay2** (el mejor para producción):

```bash
# Verificar storage driver
docker info | grep "Storage Driver"
# Storage Driver: overlay2
```

**¿Por qué importa?**

- `overlay2`: Rápido, eficiente, standard
- `devicemapper`: Obsoleto, lento
- `btrfs`: Experimental
- `zfs`: Si usas ZFS (Solaris/FreeBSD heritage)

> 💾 **Capacidad**: Cada capa de imagen ocupa espacio. En producción:
>
> - Limpia imágenes viejas: `docker system prune -a`
> - Monitorea uso: `docker system df`
> - Alerta si > 80% del disco

### 2. Networking en Docker

```bash
# Ver redes disponibles
docker network ls

# Por defecto tienes:
# bridge: Red privada con NAT (default)
# host: Comparte network stack del host (rápido, menos seguro)
# none: Sin network (muy seguro, muy limitado)
```

**Arquitectura de Red Profesional**:

```
┌─────────────────────────────────────────┐
│           HOST (stapp01)                │
│  ┌─────────────────────────────────┐   │
│  │   CONTAINER A (Nginx)           │   │
│  │   IP: 172.17.0.2:80             │   │
│  └──────────┬──────────────────────┘   │
│             │ bridge network            │
│  ┌──────────┴──────────────────────┐   │
│  │   CONTAINER B (App)             │   │
│  │   IP: 172.17.0.3:3000           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PORT MAPPING: 0.0.0.0:80 → 172.17.0.2:80
└─────────────────────────────────────────┘
```

### 3. Resource Management

```bash
# Limitar recursos (producción)
docker run -d \
  --memory="512m" \
  --memory-swap="1g" \
  --cpus="1.5" \
  --name limited-app \
  nginx
```

**Por qué limitar:**

- **cgroups** controla CPU/memoria
- Previene que un container use todo el host
- Garantiza QoS para otros servicios

### 4. Docker Compose (Multi-Container)

Aunque este es el reto 1, como Platform Engineer piensas ya en orquestación:

```yaml
# docker-compose.yml (próximos retos)
version: "3.8"
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

> 🎯 **Roadmap**: Este reto es el fundamento. Próximos pasos:
>
> 1. Docker Compose (multi-container local)
> 2. Docker Swarm (orquestación simple)
> 3. Kubernetes (orquestación enterprise)
> 4. Helm (gestión de paquetes K8s)

---

## 🔧 Troubleshooting Profesional

### Escenario 1: "Cannot connect to Docker daemon"

**Síntomas:**

```bash
docker ps
# Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Diagnóstico sistemático:**

```bash
# 1. ¿El servicio está corriendo?
sudo systemctl status docker

# 2. ¿El socket existe?
ls -la /var/run/docker.sock

# 3. ¿Permisos correctos?
sudo chmod 666 /var/run/docker.sock  # Temporal, no en prod!

# 4. ¿Usuario en grupo docker?
groups $USER
```

### Escenario 2: "Permission denied" al ejecutar docker

**Causa:** El cambio de grupo requiere nueva sesión

**Soluciones:**

```bash
# Opción A: Nueva sesión (mejor)
exit
ssh tony@172.16.238.10

# Opción B: Aplicar inmediatamente
newgrp docker

# Opción C: Forzar recarga
docker ps  # Fallará, pero refresca grupos
```

### Escenario 3: SELinux bloquea Docker

**Síntoma:** Contenedores no pueden acceder a volúmenes

**Solución profesional (no deshabilitar SELinux!):**

```bash
# Verificar contextos SELinux
ls -Z /path/to/volume

# Configurar contexto correcto
chcon -Rt svirt_sandbox_file_t /path/to/volume

# O usar :Z al montar
docker run -v /path:/container:Z nginx
```

> ⚠️ **Anti-patrón**: `setenforce 0` (deshabilitar SELinux) es como quitar la cerradura de tu casa porque "es más fácil entrar".

---

## 📊 Checklist de Producción

Antes de declarar "Docker está listo", verifica:

### ✅ Funcionalidad Básica

- [ ] Docker CE instalado (última versión estable)
- [ ] Containerd instalado y funcionando
- [ ] Servicio Docker activo (`systemctl is-active docker`)
- [ ] Inicio automático habilitado (`systemctl is-enabled docker`)
- [ ] Usuario tony en grupo docker
- [ ] `docker run hello-world` ejecuta sin errores

### ✅ Seguridad

- [ ] No estás ejecutando todo como root
- [ ] Grupo docker tiene solo usuarios autorizados
- [ ] Firewall configurado (puertos expuestos intencionalmente)
- [ ] Considerar Docker Bench Security scan

### ✅ Operaciones

- [ ] Logs de Docker persistentes (`/var/log/docker.log`)
- [ ] Monitoreo configurado (Prometheus/Datadog)
- [ ] Backup strategy (para volúmenes)
- [ ] Plan de actualización (cómo actualizar Docker sin downtime)

### ✅ Performance

- [ ] Storage driver es overlay2 (no devicemapper)
- [ ] Disco tiene >20% libre
- [ ] Swap está configurado (emergencias)
- [ ] Límites de recursos definidos (para containers futuros)

---

## 🎓 Reflexión Final: De Instalador a Platform Engineer

Después de este reto, has hecho más que instalar Docker. Has:

1. **Pensado en Arquitectura**: Entendido el stack completo
2. **Aplicado Seguridad**: No solo "funciona", es "seguro"
3. **Planificado Escalabilidad**: Pensado en 1, 10, 100 servidores
4. **Automatizado Mentalmente**: Considerado Ansible/Puppet/Terraform
5. **Considerado Observabilidad**: Monitoreo desde el diseño

> 🏆 **Sabiduría de un Platform Engineer**: _"Instalar Docker es el 5% del trabajo. El 95% es diseñar cómo ese Docker funcionará cuando tengas 50 microservicios, 10 desarrolladores haciendo deploys diarios, y todo debe funcionar 99.9% del tiempo. Eso requiere pensamiento sistémico, no solo comandos."_

---

## 🚀 Siguientes Pasos en tu Carrera DevOps

### Roadmap de Aprendizaje

**Nivel 1 - Fundamentos** (Este reto):

- ✅ Instalación y configuración básica
- ✅ Gestión de usuarios y permisos
- ✅ Verificación y troubleshooting

**Nivel 2 - Docker Avanzado** (Próximos retos):

- Imágenes y Dockerfiles
- Multi-container con Docker Compose
- Networking y volúmenes
- Docker Swarm (orquestación básica)

**Nivel 3 - Kubernetes** (Futuro):

- Pods, Services, Deployments
- Helm charts
- CI/CD pipelines
- GitOps (ArgoCD/Flux)

**Nivel 4 - Platform Engineering** (Experto):

- Infrastructure as Code (Terraform/Pulumi)
- Service Mesh (Istio/Linkerd)
- Observability (Prometheus, Grafana, Jaeger)
- Chaos Engineering

---

## 📚 Recursos para Continuar

### Documentación Oficial

- **Docker Docs**: https://docs.docker.com/
- **Dockerfile Best Practices**: Optimización de imágenes
- **Docker Security**: Seguridad en contenedores

### Herramientas Complementarias

- **Portainer**: GUI para gestión Docker
- **ctop**: Top para contenedores
- **dive**: Analiza capas de imágenes
- **lazydocker**: TUI para Docker

### Comunidades

- **Docker Community Forums**
- **Reddit r/docker**
- **CNCF** (Cloud Native Computing Foundation)
- **Local DevOps meetups**

---

## ✅ Estado del Proyecto

**INFRAESTRUCTURA LISTA PARA PRODUCCIÓN** 🐳✅

- 📅 Fecha de implementación: 25-01-2026
- ⏱️ Tiempo total: ~15 minutos
- 🎯 Nivel: Fundamentos de Containerización
- 🏢 Entorno: CentOS Stream 9
- 👤 Usuario configurado: tony
- 🐳 Versión: Docker CE 24.0.7

**Métricas del Sistema**:

- Estado del servicio: ✅ Active
- Inicio automático: ✅ Enabled
- Acceso usuario: ✅ Configurado
- Test de integridad: ✅ Passed

**Listo para**: Desplegar primera aplicación contenerizada

---

_Recuerda: Un Platform Engineer no dice "instalé Docker". Dice "construí una plataforma que permite a los equipos desplegar software de forma rápida, segura y escalable." Esa es la diferencia entre un técnico y un ingeniero._ 🏗️🚀

**¿Listo para orquestar tu primer despliegue multi-contenedor, futuro arquitecto de plataformas?**
