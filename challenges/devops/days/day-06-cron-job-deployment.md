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

## 🎯 Objetivo

Instalar el paquete cronie en todos los servidores de aplicación de Nautilus y crear un cron job automático que se ejecute cada 5 minutos, escribiendo "hello" en un archivo de prueba. Este reto prepara la infraestructura para el despliegue de scripts de automatización en horarios específicos.

---

## 🏗️ Detalles de Infraestructura

### Servidores Objetivo

| Servidor | IP | Usuario | Contraseña | Propósito |
|----------|----|---------|-----------|----|
| stapp01 | 172.16.238.10 | tony | Ir0nM@n | Nautilus App 1 |
| stapp02 | 172.16.238.11 | steve | Am3ric@ | Nautilus App 2 |
| stapp03 | 172.16.238.12 | banner | BigGr33n | Nautilus App 3 |

### Acceso

- **Jump Host**: thor@jump_host.stratos.xfusioncorp.com (Contraseña: mjolnir123)
- **Sistema Operativo**: CentOS Stream 9 (RPM-based)
- **Package Manager**: YUM

---

## 🔧 Proceso de Solución

### Fase 1: Conexión al Jump Host

```bash
ssh thor@jump_host.stratos.xfusioncorp.com
# Contraseña: mjolnir123
```

### Fase 2: Instalación de Cronie en stapp01

#### Paso 1: Conectarse a stapp01
```bash
ssh tony@stapp01.stratos.xfusioncorp.com
# Contraseña: Ir0nM@n
```

#### Paso 2: Elevar privilegios
```bash
sudo su -
# Contraseña: Ir0nM@n
```

#### Paso 3: Instalar cronie
```bash
yum install -y cronie

# Salida esperada:
# Installed:
#   cronie-1.5.7-14.el9.x86_64
#   cronie-anacron-1.5.7-14.el9.x86_64
#   crontabs-1.11-26.20190603git.el9.noarch
# Complete!
```

#### Paso 4: Iniciar y habilitar servicio crond
```bash
systemctl start crond
systemctl enable crond
```

#### Paso 5: Agregar cron job
```bash
crontab -e
# En el editor, agregar la siguiente línea:
# */5 * * * * echo hello > /tmp/cron_text
```

#### Paso 6: Verificar configuración
```bash
crontab -l
# Salida: */5 * * * * echo hello > /tmp/cron_text
```

### Fase 3: Instalación de Cronie en stapp02

```bash
# Desde stapp01 root shell
ssh steve@stapp02.stratos.xfusioncorp.com
# Contraseña: Am3ric@

sudo su -
# Contraseña: Am3ric@

# Repetir pasos 3-6 de stapp01
yum install -y cronie
systemctl start crond
systemctl enable crond
crontab -e
# Agregar: */5 * * * * echo hello > /tmp/cron_text

crontab -l
# Salida: */5 * * * * echo hello > /tmp/cron_text
```

### Fase 4: Instalación de Cronie en stapp03

```bash
# Desde stapp02 root shell
ssh banner@stapp03.stratos.xfusioncorp.com
# Contraseña: BigGr33n

sudo su -
# Contraseña: BigGr33n

# Repetir pasos 3-6
yum install -y cronie
systemctl start crond
systemctl enable crond
crontab -e
# Agregar: */5 * * * * echo hello > /tmp/cron_text

crontab -l
# Salida: */5 * * * * echo hello > /tmp/cron_text
```

### Fase 5: Verificación de Ejecución

```bash
# En stapp03, esperar 5 minutos y verificar
cat /tmp/cron_text
# Salida: hello

# Verificar en otros servidores
cat /tmp/cron_text  # En stapp02
cat /tmp/cron_text  # En stapp01
```

---

## ✅ Verificación Final

- ✅ Cronie instalado en stapp01 (versión 1.5.7-14.el9)
- ✅ Cronie instalado en stapp02 (versión 1.5.7-14.el9)
- ✅ Cronie instalado en stapp03 (versión 1.5.7-14.el9)
- ✅ Servicio crond iniciado en los 3 servidores
- ✅ Servicio crond habilitado para arranque automático en los 3 servidores
- ✅ Cron job configurado correctamente: `*/5 * * * * echo hello > /tmp/cron_text`
- ✅ Cron job ejecutándose exitosamente (archivo `/tmp/cron_text` contiene "hello")

---

## 🐛 Solución de Problemas

### Problema 1: Comando "cronie" no encontrado
**Descripción**: Después de instalar cronie, el comando `cronie --version` no funciona.

**Causa**: "cronie" no es un comando ejecutable; es el nombre del paquete. El demonio real es "crond".

**Solución**: Usar `systemctl status crond` para verificar el servicio en lugar de buscar un ejecutable "cronie".

### Problema 2: Archivo `/tmp/cron_text` no existe inmediatamente
**Descripción**: Al intentar ejecutar `cat /tmp/cron_text` inmediatamente después de crear el cron job, el archivo no existe.

**Causa**: Los cron jobs se ejecutan en intervalos especificados. El job está configurado para ejecutarse cada 5 minutos, no inmediatamente.

**Solución**: Esperar al menos 5 minutos después de configurar el cron job antes de verificar el archivo.

### Problema 3: Problemas de autenticación SSH
**Descripción**: Falla de autenticación con "Permission denied" al intentar conectarse entre servidores como root.

**Causa**: SSH no permite conexión directa como root en muchos entornos por razones de seguridad.

**Solución**: Conectarse como usuario regular (steve, tony, banner) y luego elevar privilegios con `sudo su -`.

---

## 📚 Aprendizajes Clave

### 1. **Sintaxis de Cron**
```
*/5 * * * * [comando]
│   │ │ │ │
│   │ │ │ └─ Día de la semana (0-7, 0 y 7 = domingo)
│   │ │ └─── Mes (1-12)
│   │ └───── Día del mes (1-31)
│   └─────── Hora (0-23)
└─────────── Minuto (0-59)

*/5 = cada 5 minutos
*   = cualquier valor para ese campo
```

### 2. **Gestión de Cron con crontab**
- `crontab -e`: Editar crontab del usuario actual (root en nuestro caso)
- `crontab -l`: Listar cron jobs activos
- `crontab -r`: Eliminar crontab completo
- Los cambios se aplican inmediatamente (no requiere reinicio)

### 3. **Servicio crond en systemd**
```bash
systemctl start crond      # Iniciar el servicio
systemctl stop crond       # Detener el servicio
systemctl restart crond    # Reiniciar el servicio
systemctl status crond     # Ver estado
systemctl enable crond     # Habilitar en arranque
systemctl disable crond    # Deshabilitar en arranque
```

### 4. **Logs y Debugging de Cron**
```bash
# Ver logs de cron
tail -f /var/log/cron
journalctl -u crond -f

# Ver si el job se ejecutó
grep CRON /var/log/secure
```

### 5. **Redirección en Cron**
- `>` redirige stdout al archivo (sobrescribe)
- `>>` append (añade al final)
- `2>&1` redirige stderr a stdout
- En cron jobs sin terminal, STDOUT y STDERR se envían por email por defecto

### 6. **Multi-Server Deployment Pattern**
- Conectar a jump host primero
- Encadenar conexiones SSH a servidores individuales
- Aplicar configuración idéntica en cada servidor
- Verificar después de cada implementación

---

## 🔗 Comandos Relacionados

```bash
# Instalación
yum install -y cronie           # Instalar paquete cronie

# Gestión de servicios
systemctl start crond           # Iniciar demonio cron
systemctl enable crond          # Habilitar en arranque
systemctl status crond          # Ver estado

# Gestión de cron jobs
crontab -e                      # Editar cron jobs de root
crontab -l                      # Listar cron jobs
crontab -u username -e          # Editar cron jobs de otro usuario

# Verificación
cat /tmp/cron_text              # Verificar salida del cron job
tail -f /tmp/cron_text          # Monitorear en tiempo real
grep CRON /var/log/secure       # Ver logs de ejecución

# Diagnóstico
which yum                       # Verificar package manager
systemctl list-units --type=service # Ver todos los servicios
ps aux | grep crond             # Verificar si crond está corriendo
```

---

## 📖 Recursos

- [Cron Wikipedia](https://en.wikipedia.org/wiki/Cron)
- [Linux cron Manual](https://linux.die.net/man/5/crontab)
- [CentOS cronie Package](https://centos.pkgs.org/9-stream/centos-baseos-x86_64/cronie-1.5.7-14.el9.x86_64.rpm.html)
- [Systemd Service Management](https://www.freedesktop.org/software/systemd/man/systemctl.html)
- [RHEL 9 Cron Documentation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/configuring_basic_system_settings/using-cron_configuring-basic-system-settings#scheduling-recurring-tasks-with-cron_using-cron)

---

## 📊 Seguimiento de Tiempo

- **Hora de Inicio**: 04:05 (30-01-2026)
- **Hora de Finalización**: 04:25 (30-01-2026)
- **Duración Total**: 20 minutos
- **Tiempo por Servidor**: ~6-7 minutos

---

## 🏆 Criterios de Éxito Cumplidos

- [x] Cronie instalado en stapp01
- [x] Cronie instalado en stapp02
- [x] Cronie instalado en stapp03
- [x] Servicio crond iniciado en los 3 servidores
- [x] Servicio crond habilitado para arranque automático
- [x] Cron job agregado a root crontab en los 3 servidores
- [x] Sintaxis cron correcta: `*/5 * * * * echo hello > /tmp/cron_text`
- [x] Cron job ejecutándose y generando salida correcta
- [x] Verificación exitosa en al menos stapp03

---

## 🌐 Contexto Adicional y Importancia del Reto

Este reto es fundamental para el programa "100 Days of DevOps" porque:

### 1. **Automatización de Tareas (Scheduling)**
- Los cron jobs son la base de la automatización en Linux
- Esencial para tareas administrativas recurrentes (backups, rotación de logs, limpieza)
- Alternativa ligera a orquestadores más complejos

### 2. **Operaciones Multi-Servidor**
- Demuestra cómo desplegar configuración idéntica en múltiples servidores
- Patrón fundamental en DevOps y SRE
- Preparación para herramientas de configuración (Ansible, Chef, Puppet)

### 3. **Servicios Systemd**
- Comprensión de cómo el sistema maneja servicios
- Diferencia entre "iniciar" un servicio y "habilitarlo"
- Importancia de la persistencia (enable/disable)

### 4. **Troubleshooting y Debugging**
- Identificación de problemas comunes (timing, permisos, redirección)
- Uso de logs para verificar ejecución
- Monitoreo de procesos en segundo plano

### 5. **Preparación para DevOps Avanzado**
- Fundamento para CI/CD pipelines que usan cron
- Base para entender orquestación de contenedores
- Patrón de despliegue repetible

### 6. **Casos de Uso Empresariales Reales**
- Backups automáticos cada hora
- Reportes diarios
- Limpieza de archivos temporales
- Sincronización de datos
- Health checks automáticos
- Rotación de logs
- Actualizaciones de seguridad programadas

---

## 🎓 Conexión con Retos Anteriores

Este reto se construye sobre conocimientos de días anteriores:

- **Day 1-2**: User Management - El cron job se ejecuta bajo el usuario "root"
- **Day 3**: SSH Security - Se utilizó SSH para acceder a múltiples servidores
- **Day 4**: Script Permissions - Los cron jobs requieren permisos correctos para ejecutar comandos
- **Day 5**: Security Frameworks - SELinux podría afectar la ejecución de cron jobs en entornos hardened

---

## 🚀 Próximos Pasos Recomendados

1. **Day 7**: Crear scripts más complejos para ejecutar vía cron
2. **Day 8**: Implementar notificaciones por email para fallos de cron
3. **Day 9**: Usar cron para tareas de backup automático
4. **Day 10**: Orquestación con Ansible en lugar de SSH manual

---

## 📝 Conclusión

Completar este reto establece una base sólida para la automatización en Linux, una habilidad esencial para cualquier profesional DevOps. La capacidad de desplegar y verificar configuración de cron jobs en múltiples servidores es crítica para mantener infraestructura escalable y automatizada.
