---
title: "Cron Job Deployment Across Multiple Servers"
category: devops
day: 6
difficulty: 3
tags:
  - devops
  - linux
  - automatizacion
  - cron
  - scheduling
date: 2026-01-30
status: completed
---

# 🎓 Día 6: Automatización Programada con Cron

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "La verdadera automatización no requiere tu presencia. Un cron job bien diseñado es tu 'yo' automatizado trabajando 24/7, ejecutando tareas repetitivas para que tú puedas enfocarte en mejorar el sistema."

Hoy implementamos **cron jobs** en múltiples servidores - la base de la automatización en Linux. Este es el precursor de pipelines CI/CD y orquestadores modernos.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-5**: Usuarios, SSH, permisos, SELinux - infraestructura segura
- **Hoy**: Añadimos **automatización temporal** - tareas que se ejecutan solas
- **Día 7**: Ansible - automatización a escala con código

### Progresión hacia el Pipeline CI/CD

Cron es el ancestro de:

- **GitLab CI Scheduled Pipelines**: Jobs que corren cada X tiempo
- **Kubernetes CronJobs**: Pods que se ejecutan periódicamente
- **Lambda/EventBridge**: Funciones serverless programadas

### Escenario Empresarial

El equipo Nautilus necesita:

1. Monitoreo automático cada 5 minutos en 3 servidores
2. Sincronización de logs horaria
3. Health checks automatizados

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

Cron jobs facilitan:

- **Desarrolladores**: Logs de aplicación rotados automáticamente
- **Operaciones**: Backups sin intervención humana
- **QA**: Reportes de testing generados nightly

### Automatización

```bash
# Sin cron (manual, propenso a errores):
# "Recuerda hacer backup cada día a las 2 AM"

# Con cron (automático, confiable):
0 2 * * * /usr/local/bin/backup.sh
```

### Métricas y Observabilidad

- **Cron Success Rate**: % de jobs que completan exitosamente
- **Execution Time**: Duración de cada job
- **Resource Usage**: CPU/memoria consumida por tareas programadas

---

## 🛠️ Implementación Paso a Paso

### Fase 1: Conexión al Jump Host

```bash
ssh thor@jump_host.stratos.xfusioncorp.com
```

**Análisis DevOps**: El jump host es nuestro "bastión" de administración - patrón de seguridad enterprise.

### Fase 2: Instalación en stapp01

#### Paso 1: Conexión y Elevación

```bash
ssh tony@stapp01.stratos.xfusioncorp.com
sudo su -
```

**Análisis DevOps**: `sudo su -` nos da shell root completo, necesario para gestión de servicios.

#### Paso 2: Instalar Cronie

```bash
yum install -y cronie
```

**Paquetes instalados**:

- `cronie`: Demonio cron moderno (reemplaza vixie-cron)
- `cronie-anacron`: Soporte para anacron (ejecución de jobs perdidos)
- `crontabs`: Archivos de configuración base

#### Paso 3: Iniciar y Habilitar Servicio

```bash
systemctl start crond
systemctl enable crond
```

**Análisis DevOps**:

- `start`: Inicia el servicio ahora
- `enable`: Configura arranque automático en boot
- En CI/CD: equivalente a `systemctl restart` después de deploy

#### Paso 4: Crear Cron Job

```bash
crontab -e

# Agregar línea:
*/5 * * * * echo hello > /tmp/cron_text
```

**Sintaxis Cron Explained**:

```
*/5 * * * *  comando
│   │ │ │ │
│   │ │ │ └─── Día de semana (0-7, 0=domingo)
│   │ │ └───── Mes (1-12)
│   │ └─────── Día del mes (1-31)
│   └───────── Hora (0-23)
└───────────── Minuto (0-59)

*/5 = cada 5 minutos
```

#### Paso 5: Verificar

```bash
crontab -l
# Muestra: */5 * * * * echo hello > /tmp/cron_text
```

### Fase 3: Replicar en stapp02 y stapp03

```bash
# En stapp02
ssh steve@stapp02.stratos.xfusioncorp.com
sudo su -
yum install -y cronie
systemctl start crond
systemctl enable crond
crontab -e
# Agregar: */5 * * * * echo hello > /tmp/cron_text

# En stapp03
ssh banner@stapp03.stratos.xfusioncorp.com
sudo su -
# ... repetir pasos
```

**Análisis DevOps**: Patrón **multi-server deployment manual** - preparación para Ansible (Día 7).

### Fase 4: Verificación de Ejecución

```bash
# Esperar 5 minutos...
cat /tmp/cron_text
# Salida: hello
```

**Diagnóstico**:

```bash
# Ver logs de cron
tail -f /var/log/cron

# Ver si el job se ejecutó
grep CRON /var/log/secure
```

---

## ✅ Criterios de Éxito

- [x] Cronie instalado en stapp01, stapp02, stapp03
- [x] Servicio crond iniciado y habilitado en los 3 servidores
- [x] Cron job configurado: `*/5 * * * * echo hello > /tmp/cron_text`
- [x] Cron job ejecutándose exitosamente (archivo contiene "hello")
- [x] Verificación mediante logs y archivo de salida
- [x] Patrón de despliegue multi-servidor demostrado

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Cronie vs Cron**: Cronie es la implementación moderna con mejor logging y soporte SELinux.

2. **Environment**: Cron jobs ejecutan con mínimo environment:

   ```bash
   # Solución: Usar paths absolutos
   */5 * * * * /usr/bin/echo hello > /tmp/cron_text
   ```

3. **Redirección**: `>` sobrescribe, `>>` append:
   ```bash
   # Para mantener historia:
   */5 * * * * echo "$(date): hello" >> /tmp/cron_text
   ```

### 🚨 Troubleshooting DevOps

**Problema 1**: Archivo no existe inmediatamente

- **Causa**: Cron ejecuta en intervalos, no inmediatamente
- **Solución**: Esperar el intervalo completo (5 minutos)

**Problema 2**: Comando no encontrado

- **Causa**: PATH mínimo en cron
- **Solución**: Usar paths absolutos o definir PATH al inicio del crontab

**Problema 3**: SELinux bloquea ejecución

- **Diagnóstico**: `ausearch -m avc -ts recent`
- **Solución**: Configurar contexto correcto o usar `unconfined` (temporal)

### 💡 Mejores Prácticas

1. **Logging**: Siempre redirigir output:

   ```bash
   */5 * * * * /script.sh >> /var/log/script.log 2>&1
   ```

2. **Locking**: Prevenir ejecuciones solapadas:

   ```bash
   */5 * * * * flock -n /var/lock/script.lock -c /script.sh
   ```

3. **Testing**: Probar comandos manualmente antes de agregarlos a cron

4. **Documentación**: Comentar crontab:
   ```bash
   # Health check cada 5 minutos
   */5 * * * * /usr/local/bin/health-check.sh
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 7** introduce **Ansible** - automatización declarativa. Hiciste el trabajo manual hoy para entender:

- Qué es un multi-server deployment
- Por qué es tedioso hacerlo manualmente
- Por qué necesitamos herramientas de configuration management

**Conexión**: Cron manual → Ansible playbook → GitLab CI pipeline

---

## 📚 Recursos DevOps

- [Cron Wikipedia](https://en.wikipedia.org/wiki/Cron)
- [Crontab Guru](https://crontab.guru/) - Editor visual de cron
- [Ansible Cron Module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/cron_module.html)
- [Kubernetes CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)

---

## 📊 Seguimiento de Progreso

- **Día**: 6 de 100
- **Bloque**: Automatización y Scheduling
- **Progresión**: 1-5 → 6 → 7 (Fundamentos → Cron → Ansible)
- **Habilidad**: Tareas automatizadas multi-servidor

**¡Genial! Ahora tienes "minions" automatizados trabajando por ti 24/7.** 🤖
