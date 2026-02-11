---
title: "Configuración de Variables de Entorno"
category: devops
day: 11
difficulty: 1
tags:
  - devops
  - entorno
  - variables
  - bashrc
date: 2026-02-05
status: ready
---

# 🎓 Día 11: Variables de Entorno y Configuración de Aplicaciones

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "La configuración no debe estar en el código - debe estar en el entorno. Las variables de entorno son el contrato entre tu infraestructura y tu aplicación, permitiendo el mismo código funcionar en desarrollo, staging y producción."

Hoy configuramos **variables de entorno** - el mecanismo estándar para separar configuración de código. Este es el principio fundamental de las aplicaciones 12-Factor.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-10**: Infraestructura, usuarios, SSH, Git configurados
- **Hoy**: Preparamos el entorno para aplicaciones
- **Días 12-15**: Desplegaremos servicios que usan estas variables

### Progresión hacia el Pipeline CI/CD

Variables de entorno son esenciales para:

- **12-Factor Apps**: Configuración en el entorno, no en el código
- **CI/CD Pipelines**: Diferentes valores por ambiente (dev/staging/prod)
- **Secrets Management**: Separar credenciales del código
- **Container Orchestration**: Docker, Kubernetes dependen de esto

### Escenario Empresarial

La aplicación Nautilus necesita:

- `APP_ENV=production` (identificar ambiente)
- `APP_PORT=8080` (puerto de escucha)
- `LOG_LEVEL=info` (nivel de logging)

Estos valores deben persistir entre sesiones y estar disponibles para el usuario `deploy`.

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Variables de entorno facilitan:

- **Desarrolladores**: Mismo código, diferente configuración
- **Operaciones**: Cambiar comportamiento sin modificar código
- **DevOps**: Automatización de despliegues por ambiente

### Automatización

```bash
# Sin variables (código hardcodeado):
# const dbHost = "localhost";  // No funciona en producción

# Con variables (configurable):
# const dbHost = process.env.DB_HOST;
# DB_HOST=db.production.com npm start
```

### Métricas y Calidad

- **Configuration Drift**: Diferencias de configuración entre ambientes
- **Deployment Time**: Qué tan rápido se configura un nuevo ambiente
- **Environment Parity**: Qué tan similares son dev y prod

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Conectar como Usuario Deploy

```bash
ssh tony@stapp01.xfusioncorp.com
sudo su - deploy
```

**Análisis DevOps**: Configuramos variables para el usuario específico que ejecutará la aplicación (principio de separación de responsabilidades).

### Paso 2: Crear Archivo de Variables

```bash
# Crear archivo .env con variables
cat > ~/.env <<EOF
APP_ENV=production
APP_PORT=8080
LOG_LEVEL=info
EOF
```

**Análisis DevOps**:

- Archivo separado para mejor organización
- Formato `KEY=VALUE` estándar
- Fácil de versionar o replicar en otros servidores

### Paso 3: Integrar con Shell

```bash
# Agregar source al .bashrc para carga automática
echo 'source ~/.env' >> ~/.bashrc
```

**Análisis DevOps**:

- `~/.bashrc`: Se ejecuta en cada nueva shell interactiva
- `source`: Carga variables en el shell actual (no en subshell)
- Persistente: Disponible en todas las sesiones futuras

### Paso 4: Verificar Carga Automática

```bash
# Recargar configuración
source ~/.bashrc

# Verificar variables disponibles
env | grep -E "^(APP_|LOG_)"
```

**Salida esperada**:

```
APP_ENV=production
APP_PORT=8080
LOG_LEVEL=info
```

**Verificación individual**:

```bash
echo $APP_ENV
echo $APP_PORT
echo $LOG_LEVEL
```

### Paso 5: Testing en Nueva Sesión

```bash
# Abrir nueva sesión SSH o terminal
ssh deploy@stapp01

# Verificar variables persisten
echo $APP_ENV  # Debe mostrar: production
```

---

## ✅ Criterios de Éxito

- [x] Archivo `.env` creado con variables requeridas
- [x] Variables cargadas en `.bashrc` para persistencia
- [x] Verificación con `env` muestra todas las variables
- [x] Testing individual de cada variable exitoso
- [x] Persistencia verificada en nueva sesión
- [x] Formato correcto KEY=VALUE

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **12-Factor App Methodology**:
   - **Factor III**: Configuración en el entorno
   - Código es el mismo en todos los ambientes
   - Configuración cambia entre ambientes

2. **Scopes de Variables**:

   ```bash
   export VAR=value    # Disponible en shell actual y subshells
   VAR=value           # Solo shell actual
   ```

3. **Archivos de Configuración**:
   - `/etc/profile`: Global para todos los usuarios
   - `~/.bashrc`: Usuario específico, shell interactivo
   - `~/.profile`: Usuario específico, login shell
   - `~/.env`: Convención común para aplicaciones

### 🚨 Troubleshooting DevOps

**Problema 1**: Variables no disponibles en scripts cron

- **Causa**: Cron ejecuta con mínimo environment
- **Solución**: Cargar explícitamente el archivo
  ```bash
  * * * * * source ~/.env && /usr/local/bin/app
  ```

**Problema 2**: Variables con espacios

- **Solución**: Usar comillas
  ```bash
  APP_NAME="My Application"
  ```

**Problema 3**: Variables no persisten

- **Causa**: Olvidar `export` en algunos shells
- **Solución**: Asegurar `export VAR=value` en el archivo

### 💡 Mejores Prácticas

1. **Secrets Management**: NUNCA commits de secrets

   ```bash
   # .gitignore
   .env
   .env.local
   ```

2. **Documentación**:

   ```bash
   # Crear .env.example con valores dummy
   APP_ENV=development
   APP_PORT=3000
   LOG_LEVEL=debug
   ```

3. **Hierarquía de Configuración**:

   ```
   1. Variables de entorno (producción)
   2. Archivo .env (desarrollo local)
   3. Defaults en código (fallback)
   ```

4. **Ansible Automation**:

   ```yaml
   - name: Configure environment variables
     lineinfile:
       path: /home/deploy/.env
       line: "{{ item }}"
     loop:
       - "APP_ENV=production"
       - "APP_PORT=8080"
       - "LOG_LEVEL=info"
   ```

5. **Docker Integration**:

   ```dockerfile
   # Dockerfile
   ENV APP_ENV=production
   ENV APP_PORT=8080
   ```

   ```yaml
   # docker-compose.yml
   environment:
     - APP_ENV=production
     - APP_PORT=8080
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 12** instala Nginx - un servidor web que usará estas variables:

- `APP_PORT=8080` podría ser el backend que Nginx proxya
- `APP_ENV=production` cambia comportamiento de logs de Nginx
- Separación de responsabilidades: Nginx (proxy) + App (backend)

**Preparación**: Investiga cómo Nginx puede leer variables de entorno y usarlas en su configuración.

---

## 📚 Recursos DevOps

- [12-Factor App Methodology](https://12factor.net/)
- [The Twelve-Factor App - Config](https://12factor.net/config)
- [Docker Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [Kubernetes ConfigMaps and Secrets](https://kubernetes.io/docs/concepts/configuration/)

---

## 📊 Seguimiento de Progreso

- **Día**: 11 de 100
- **Bloque**: Configuración de Aplicaciones
- **Progresión**: 1-10 → 11 → 12 (Infraestructura/SSH → Variables → Servicios)
- **Habilidad**: Separación de configuración y código

**¡Perfecto! Ahora tu aplicación puede ser configurada desde el entorno, siguiendo las mejores prácticas de DevOps.** ⚙️
