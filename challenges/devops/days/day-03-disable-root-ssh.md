---
title: "Deshabilitar Acceso SSH Root Directo"
category: devops
day: 3
difficulty: 2
tags:
  - devops
  - linux
  - ssh
  - seguridad
  - auditoria
date: 2026-01-26
status: completed
---

## 🎯 Objetivo
Deshabilitar el acceso SSH directo como root en todos los servidores de aplicaciones dentro del Datacenter Stratos, como parte de los nuevos protocolos de seguridad implementados por el equipo de seguridad de xFusionCorp Industries tras auditorías de seguridad.

## 🏗️ Detalles de Infraestructura
- **Datacenter**: Stratos Datacenter
- **Servidores de Aplicaciones**: stapp01, stapp02, stapp03
- **IPs**: 172.16.238.10, 172.16.238.11, 172.16.238.12
- **Protocolo**: Nueva política de seguridad post-auditoría

---

## 🔧 Proceso de Solución

### Paso 1: Conectarse a cada App Server
```bash
# Conectarse a stapp01
ssh tony@172.16.238.10

# Conectarse a stapp02  
ssh steve@172.16.238.11

# Conectarse a stapp03
ssh banner@172.16.238.12
```
Conexiones exitosas a los tres servidores de aplicaciones.

### Paso 2: Verificar configuración SSH actual
```bash
# Verificar si root SSH está permitido
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
```
Análisis de la configuración actual de SSH en cada servidor.

### Paso 3: Editar configuración SSH
```bash
# Hacer backup del archivo de configuración
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Editar archivo de configuración SSH
sudo vi /etc/ssh/sshd_config
```
Modificación del parámetro `PermitRootLogin`:

```bash
# Cambiar de yes a no (o agregar si no existe)
PermitRootLogin no
```

### Paso 4: Reiniciar servicio SSH
```bash
# Reiniciar servicio SSH para aplicar cambios
sudo systemctl restart sshd
```
Verificación de que el servicio se reinició correctamente.

### Paso 5: Verificar configuración aplicada
```bash
# Confirmar que el cambio fue aplicado
sudo sshd -T | grep -i "permitrootlogin"
# O alternativamente
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
```
Confirmación de que `PermitRootLogin no` está configurado.

---

## ✅ Verificación
- Acceso SSH directo como root deshabilitado en stapp01 ✅
- Acceso SSH directo como root deshabilitado en stapp02 ✅  
- Acceso SSH directo como root deshabilitado en stapp03 ✅
- Servicios SSH reiniciados sin interrupciones ✅
- Backups de configuración creados ✅

### 📋 Comandos ejecutados por servidor:

**stapp01 (tony@172.16.238.10):**
```bash
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
sudo vi /etc/ssh/sshd_config
sudo systemctl restart sshd
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Resultado: PermitRootLogin no
```

**stapp02 (steve@172.16.238.11):**
```bash
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
sudo vi /etc/ssh/sshd_config
sudo systemctl restart sshd
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Resultado: PermitRootLogin no
```

**stapp03 (banner@172.16.238.12):**
```bash
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
sudo vi /etc/ssh/sshd_config
sudo systemctl restart sshd
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Resultado: PermitRootLogin no
```

## 🐛 Solución de Problemas
- **Validación crítica**: Verificado que el servicio SSH remainece funcional después de los cambios
- **Documentación**: Se documentaron los cambios para cada servidor
- **Pruebas**: Se probaron conexiones con usuarios no-root para confirmar acceso

## 📚 Aprendizajes Clave
- `PermitRootLogin no` en `/etc/ssh/sshd_config` deshabilita acceso SSH root directo
- Siempre hacer backup de archivos de configuración críticos antes de modificar
- Reiniciar `sshd` después de cambios de configuración
- La seguridad por capas es fundamental: acceso root solo a través de usuarios con sudo

## 🔗 Comandos Relacionados
- `vi /etc/ssh/sshd_config` - Editar configuración SSH
- `systemctl restart sshd` - Reiniciar servicio SSH
- `sshd -T` - Test de configuración SSH
- `grep -i` - Búsqueda insensible a mayúsculas/minúsculas

## 📖 Recursos
- Documentación de seguridad SSH de xFusionCorp
- Linux Hardening Guides
- Best practices para configuración de servidores

---

## 📊 Seguimiento de Tiempo
- **Hora de Inicio**: 09:00
- **Hora de Finalización**: 09:45
- **Duración Total**: 45 minutos

## 🏆 Criterios de Éxito Cumplidos
- [x] Acceso SSH root deshabilitado en stapp01
- [x] Acceso SSH root deshabilitado en stapp02
- [x] Acceso SSH root deshabilitado en stapp03
- [x] Servicios SSH reiniciados correctamente
- [x] Configuración verificada en cada servidor

## 🌐 Contexto Adicional
Este reto implementa medidas de seguridad críticas post-auditoría, siguiendo principios de defensa en profundidad. Al deshabilitar el acceso root directo, se fuerza a los administradores a usar cuentas individuales con sudo, creando un rastro de auditoría claro y reduciendo la superficie de ataque. Esta práctica es estándar en entornos empresariales y cumple con compliance de seguridad.
