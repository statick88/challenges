---
title: "Reto 13: Secure Data Transfer - xFusionCorp Industries"
category: linux
difficulty: easy
tags:
  - linux
  - ssh
  - user-management
  - group-management
  - permissions
date: 2025-01-25
status: blocked
---

# Reto 13: Secure Data Transfer - xFusionCorp Industries

## Transferencia Segura de Datos Sensibles: Integridad y Confidencialidad

---

## 🎓 Del Instructor

Bienvenido a tu decimotercer desafío como SysAdmin Senior en xFusionCorp. Hoy abordamos la transferencia de **datos sensibles** entre sistemas, donde la integridad y confidencialidad son críticas.

> 💭 **Mentalidad de SysAdmin**: "Transferir datos sensibles sin verificación de integridad es como enviar un mensaje importante sin acuse de recibo. Nunca sabes si llegó completo, si fue alterado, o si alguien lo interceptó."

En entornos empresariales, los datos sensibles (PII, credenciales, datos financieros) requieren protección adicional durante la transferencia.

---

## 🎭 Escenario Real: Migración de Datos Sensibles en Nautilus

**Empresa**: xFusionCorp Industries  
**Proyecto**: Nautilus - Migración Segura de Datos  
**Infraestructura**: stapp01 (origen) → stapp03 (destino)  
**Tu rol**: Senior System Administrator - Seguridad de Datos

### La Problemática

El equipo de Seguridad de xFusionCorp necesita transferir datos sensibles del sistema de análisis:

- Datos de clientes (información PII)
- Registros de auditoría
- Configuraciones con credenciales
- Claves de API y certificados

Los datos deben transferirse de forma que:

- Nadie pueda interceptarlos durante la transferencia
- Se pueda verificar que no fueron alterados
- Solo usuarios autorizados puedan acceder en destino
- Haya registro de la transferencia para auditoría

**El requerimiento del CISO**:

> "Transfer sensitive data using secure methods with encryption."

### Infraestructura Objetivo

| Rol     | Servidor | IP            | Usuario Acceso | Contraseña |
| ------- | -------- | ------------- | -------------- | ---------- |
| Origen  | stapp01  | 172.16.238.10 | tony           | Ir0nM@n    |
| Destino | stapp03  | 172.16.238.12 | banner         | BigGr33n   |

### Requisitos Técnicos

- **Método**: `scp` con compresión y encriptación
- **Datos**: `/secure/sensitive_data/`
- **Destino**: `/secure/incoming/`
- **Compresión**: gzip durante transferencia
- **Verificación**: Hash MD5/SHA256
- **Logging**: Registro de transferencia completa
- **Permisos**: 600 (solo owner) en destino

---

## 🧠 La Arquitectura: Transferencia Segura

### Triada de Seguridad en Transferencias

```
┌─────────────────────────────────────────────────────────────────┐
│            CIA EN TRANSFERENCIA DE DATOS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔒 CONFIDENCIALIDAD                                            │
│     • Encriptación durante transporte (SSH/SCP)                 │
│     • Certificados y claves de host verificados                 │
│     • No exposición en texto plano                              │
│                                                                  │
│  ✅ INTEGRIDAD                                                  │
│     • Checksums/hash antes y después                            │
│     • Comparación de hashes                                     │
│     • Detección de corrupción o alteración                      │
│                                                                  │
│  📋 DISPONIBILIDAD                                              │
│     • Confirmación de recepción                                 │
│     • Registro de transferencia                                 │
│     • Recuperabilidad                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Herramientas de Transferencia Segura

| Herramienta     | Encriptación | Verificación | Caso de Uso                 |
| --------------- | ------------ | ------------ | --------------------------- |
| **scp**         | ✅ SSH       | ❌ Manual    | Transferencia simple segura |
| **rsync + SSH** | ✅ SSH       | ✅ Checksum  | Sincronización segura       |
| **sftp**        | ✅ SSH       | ❌ Manual    | Transferencia interactiva   |
| **gpg + scp**   | ✅ GPG + SSH | ✅ GPG       | Máxima seguridad            |

### Verificación de Integridad con Hashes

```bash
# Generar hash MD5 (rápido, menos seguro)
md5sum archivo

# Generar hash SHA256 (recomendado, más seguro)
sha256sum archivo

# Verificar hash
sha256sum -c archivo.sha256
```

### Analogía: Transporte de Valores

- **Datos sensibles**: Lingotes de oro de un banco
- **SCP con SSH**: Camión blindado con guardias armados (encriptación en tránsito)
- **Checksums**: Sellos numerados en cada lingote (verificación de integridad)
- **Permisos 600**: Caja fuerte en destino solo accesible por el gerente (acceso restringido)
- **Logs de auditoría**: Registro de quién movió qué y cuándo

---

## 🛠️ Implementación Profesional

### Fase 1: Preparación en Servidor Origen (stapp01)

```bash
# Conexión al servidor origen
ssh tony@172.16.238.10
sudo su -

# Verificar datos a transferir
ls -la /secure/sensitive_data/
du -sh /secure/sensitive_data/

# Generar checksums de origen
find /secure/sensitive_data/ -type f -exec sha256sum {} \; > /tmp/source_checksums.txt

# Verificar checksums generados
cat /tmp/source_checksums.txt | head -10
```

### Fase 2: Transferencia Segura

```bash
# Transferencia con scp (encriptada por SSH)
scp -C -r /secure/sensitive_data/ banner@172.16.238.12:/secure/incoming/

# Flags:
# -C = compresión
# -r = recursivo
# -p = preservar permisos (opcional)

# Transferencia alternativa con rsync sobre SSH
# rsync -avz -e ssh /secure/sensitive_data/ banner@172.16.238.12:/secure/incoming/
```

### Fase 3: Verificación en Destino (stapp03)

```bash
# Conexión al servidor destino
ssh banner@172.16.238.12
sudo su -

# Generar checksums en destino
find /secure/incoming/sensitive_data/ -type f -exec sha256sum {} \; > /tmp/destination_checksums.txt

# Comparar checksums
scp tony@172.16.238.10:/tmp/source_checksums.txt /tmp/
diff /tmp/source_checksums.txt /tmp/destination_checksums.txt

# Si no hay salida, los datos son idénticos
```

### Fase 4: Configuración de Seguridad en Destino

```bash
# Establecer permisos restrictivos
chmod -R 600 /secure/incoming/sensitive_data/*

# Establecer ownership seguro
chown -R secure_user:secure_group /secure/incoming/

# Logging de transferencia
echo "$(date): Transferencia completada de stapp01 a stapp03" >> /var/log/secure_transfers.log
echo "  - Archivos: $(find /secure/incoming/sensitive_data/ -type f | wc -l)" >> /var/log/secure_transfers.log
echo "  - Tamaño: $(du -sh /secure/incoming/sensitive_data/ | awk '{print $1}')" >> /var/log/secure_transfers.log
```

### Resumen de Comandos

```bash
# EN ORIGEN (stapp01):
find /secure/sensitive_data/ -type f -exec sha256sum {} \; > /tmp/source_checksums.txt
scp -C -r /secure/sensitive_data/ banner@172.16.238.12:/secure/incoming/
scp /tmp/source_checksums.txt banner@172.16.238.12:/tmp/

# EN DESTINO (stapp03):
find /secure/incoming/sensitive_data/ -type f -exec sha256sum {} \; > /tmp/destination_checksums.txt
diff /tmp/source_checksums.txt /tmp/destination_checksums.txt
chmod -R 600 /secure/incoming/sensitive_data/*
echo "$(date): Transferencia completada" >> /var/log/secure_transfers.log
```

---

## 🎯 Análisis Post-Implementación

### Arquitectura de Transferencia Segura

```
┌─────────────────────────────────────────────────────────────────────────┐
│              TRANSFERENCIA SEGURA COMPLETADA                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ORIGEN: stapp01                                                        │
│  ├── Datos: /secure/sensitive_data/                                     │
│  ├── Checksums: SHA256 generados                                        │
│  └── Método: SCP con SSH (encriptado)                                   │
│                              │                                           │
│                              ▼                                           │
│  TRANSPORTE:                                                             │
│  ├── Encriptación: SSH (AES-256)                                        │
│  ├── Compresión: gzip (-C)                                              │
│  └── Integridad: Verificación post-transferencia                        │
│                              │                                           │
│                              ▼                                           │
│  DESTINO: stapp03                                                       │
│  ├── Ubicación: /secure/incoming/                                       │
│  ├── Permisos: 600 (solo owner)                                         │
│  ├── Ownership: secure_user:secure_group                                │
│  ├── Checksums verificados: SHA256 coinciden                            │
│  └── Log: /var/log/secure_transfers.log                                 │
│                                                                          │
│  ✅ SEGURIDAD IMPLEMENTADA:                                              │
│     • Confidencialidad: Encriptación SSH durante transporte             │
│     • Integridad: Verificación SHA256                                   │
│     • Control de acceso: Permisos 600 en destino                        │
│     • Auditoría: Logs de transferencia                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎓 Reflexión Final

### La Importancia de la Verificación

> "Sin verificación de integridad, la transferencia es solo una suposición."

Lecciones clave:

- Siempre verificar con checksums después de transferir
- Usar métodos encriptados para datos sensibles
- Documentar las transferencias para auditoría
- Restringir permisos inmediatamente después de la transferencia

---

## 🚀 Siguientes Pasos

- Implementar transferencias automatizadas con verificación
- Considerar GPG para encriptación adicional en reposo
- Integrar monitoreo de transferencias

---

## ✅ Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

- 📅 Fecha planeada: Pendiente
- ⏱️ Tiempo estimado: 20 minutos
- 🎯 Dificultad: Fácil

### Criterios de Éxito

- ✅ Transferencia completada con éxito
- ✅ Integridad de datos verificada (hashes coinciden)
- ✅ Permisos seguros configurados en destino
- ✅ Registro auditado de la transferencia

---

_Documentación creada siguiendo estándares de SysAdmin - Seguridad de Datos_
