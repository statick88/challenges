---
title: "Day 9: MariaDB Troubleshooting"
category: devops
day: 9
difficulty: 2
tags:
  - devops
  - troubleshooting
  - mariadb
  - database
  - systemctl
  - logs
date: 2026-02-20
status: completed
---

# Day 9: MariaDB Troubleshooting

## Troubleshooting de Servicios de Base de Datos

---

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "Cuando la aplicación no puede conectar a la base de datos, el problema puede estar en la aplicación O en la base de datos. Un buen DevOps debe saber diagnosticar rápidamente el origen del problema y aplicar la solución correcta."

Este escenario es común en producción: un día llegas y la aplicación no funciona porque el servicio de base de datos está caído.

---

## 🎭 Escenario Real: Aplicación Nautilus Sin Conexión a DB

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus Application  
**Servidor**: stdb01 (Database Server)  
**Tu rol**: DevOps Engineer - Incident Response

### La Problemática

> "There is a critical issue going on with the Nautilus application in Stratos DC. The production support team identified that the application is unable to connect to the database. After digging into the issue, the team found that mariadb service is down on the database server."

### Tu Misión

1. Identificar que el servicio mariadb está caído
2. Diagnosticar la causa raíz del problema
3. Aplicar la solución
4. Verificar que el servicio está funcionando
5. Confirmar que la aplicación puede conectar a la base de datos

### Infraestructura Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Rol |
|----------|-----|----------|---------|------------|-----|
| stdb01 | 172.16.239.10 | stdb01.stratos.xfusioncorp.com | peter | Sp!dy | Nautilus DB Server |
| stapp01 | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony | Ir0nM@n | Nautilus App 1 |
| stapp02 | 172.16.238.11 | stapp02.stratos.xfusioncorp.com | steve | Am3ric@ | Nautilus App 2 |
| stapp03 | 172.16.238.12 | stapp03.stratos.xfusioncorp.com | banner | BigGr33n | Nautilus App 3 |

---

## 🧠 Fundamentos: Troubleshooting de MariaDB

### Comandos Esenciales

```bash
# Ver estado del servicio
sudo systemctl status mariadb

# Ver si está corriendo
sudo systemctl is-active mariadb

# Ver puertos en uso
sudo ss -tulpn | grep 3306

# Ver logs del servicio
sudo journalctl -u mariadb -n 50

# Ver logs de MariaDB
sudo tail -f /var/log/mariadb/mariadb.log
```

### Problemas Comunes de MariaDB

| Problema | Causa | Solución |
|----------|-------|----------|
| Service not found | Paquete no instalado | Instalar mariadb-server |
| Permission denied | Permisos incorrectos en directorios | chown mysql:mysql |
| Can't create PID file | Directorio /run/mariadb no existe | mkdir -p /run/mariadb |
| Can't bind to address | Puerto en uso | Matar proceso o cambiar puerto |
| Database corruption | Archivos dañados | Reparar o restaurar |

### Directorios Críticos de MariaDB

```bash
/var/lib/mysql/    # Directorio de datos
/run/mariadb/      # Socket y PID
/var/log/mariadb/  # Logs
/etc/my.cnf        # Configuración principal
```

---

## 🛠️ Implementación: Paso a Paso

### Paso 1: Conectar al Servidor de Base de Datos

```bash
ssh peter@172.16.239.10
```

### Paso 2: Verificar Estado del Servicio

```bash
sudo systemctl status mariadb
```

**Salida esperada si está caído:**
```
○ mariadb.service - MariaDB 10.5 database server
     Active: inactive (dead)
```

### Paso 3: Diagnosticar el Problema

```bash
# Ver logs para identificar la causa
sudo journalctl -u mariadb -n 50 --no-pager
sudo tail -50 /var/log/mariadb/mariadb.log
```

**En este caso, el error era:**
```
[ERROR] mariadbd: Can't create/write to file '/run/mariadb/mariadb.pid' (Errcode: 13 "Permission denied")
```

### Paso 4: Aplicar la Solución

```bash
# Crear directorio con permisos correctos
sudo mkdir -p /run/mariadb
sudo chown mysql:mysql /run/mariadb
sudo chmod 755 /run/mariadb
```

### Paso 5: Iniciar el Servicio

```bash
sudo systemctl start mariadb
sudo systemctl enable mariadb  # Paraauto-inicio al boot
```

### Paso 6: Verificar que está Corriendo

```bash
sudo systemctl status mariadb
# Resultado esperado: Active: active (running)
```

### Paso 7: Verificar Puerto 3306

```bash
sudo ss -tulpn | grep 3306
# Resultado: tcp 0 0 0.0.0.0:3306 0.0.0.0:* LISTEN
```

### Paso 8: Probar Conexión Local

```bash
sudo mysql -u root -e "SHOW DATABASES;"
```

---

## ✅ Verificación del Reto

### Checklist de Éxito

- [x] Servicio mariadb identificado como caído
- [x] Logs revisados para identificar causa raíz
- [x] Problema de permisos en /run/mariadb/ identificado
- [x] Directorio creado con permisos correctos
- [x] Servicio iniciado exitosamente
- [x] Puerto 3306 escuchando
- [x] Estado: active (running)

### Verificación desde App Server

Desde cualquier servidor de aplicación:
```bash
mysql -h 172.16.239.10 -u root -p -e "SHOW DATABASES;"
```

---

## 🎯 Análisis Post-Implementación

### ¿Qué aprendimos?

1. **Diagnóstico sistemático**: Primero verificar el estado, luego revisar logs
2. **Lectura de errores**: Los logs de MariaDB indican exactamente el problema
3. **Permisos críticos**: MariaDB necesita escribir en /run/mariadb/
4. **Persistencia**: Usar systemctl enable paraauto-inicio

### Comandos de Troubleshooting Futuros

```bash
# Health check script
#!/bin/bash
if ! systemctl is-active --quiet mariadb; then
  echo "MariaDB down, restarting..."
  systemctl restart mariadb
fi

# Monitor de conexiones
watch -n 5 'mysql -u root -e "SHOW STATUS LIKE \"Threads_connected\";"'
```

---

## 🚀 Próximos Desafíos

Con este troubleshooting completado, puedes proceeder con:

- Configurar réplicas de MariaDB
- Implementar backups automáticos
- Optimizar rendimiento de base de datos
- Configurar conexiones SSL

---

## 📚 Recursos

- [MariaDB Documentation](https://mariadb.com/kb/en/)
- [Systemd Service Management](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [Linux Performance Analysis](http://www.brendangregg.com/linuxperf.html)

---

## ✅ Estado del Laboratorio

**COMPLETADO EXITOSAMENTE** 🎉

- 📅 Fecha: 2026-02-20
- ⏱️ Tiempo: 15-20 minutos
- 🎯 Nivel: Intermedio - Troubleshooting
- 💼 Habilidades: systemctl, logs, permisos, diagnóstico

---

> **Nota del Instructor**: "El troubleshooting es 80% observación y 20% acción. Siempre revisa los logs antes de actuar. En este caso, el error de 'Permission denied' en el archivo PID nos dio la pista exacta."

**¿Listo para el siguiente reto, DevOps Engineer?**
