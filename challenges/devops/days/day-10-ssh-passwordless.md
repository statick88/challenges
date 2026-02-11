---
title: "Configuración de SSH sin Contraseña"
category: devops
day: 10
difficulty: 3
tags:
  - devops
  - ssh
  - autenticacion
  - clave-publica
date: 2026-02-05
status: ready
---

# 🎓 Día 10: Autenticación SSH sin Contraseña

## 🎓 Del Instructor: DevOps Coach

> 🔄 **Mentalidad DevOps**: "Las contraseñas en producción son el enemigo de la automatización. Las claves SSH son tu pasaporte digital entre servidores - seguro, auditado y perfecto para pipelines que nunca deben detenerse por un prompt de contraseña."

Hoy implementamos **SSH key-based authentication** - el estándar de facto para automatización en DevOps. Esto es lo que permite que tus servidores se comuniquen entre sí sin intervención humana.

---

## 🎭 Contexto del Día

### Conexión con Días Anteriores

- **Días 1-9**: Usuarios, permisos, Git configurado
- **Hoy**: Añadimos autenticación automatizada entre servidores
- **Días 11-15**: Usaremos esta conexión para automatizar todo

### Progresión hacia el Pipeline CI/CD

SSH sin contraseña habilita:

- **Git Operations**: Clonar/pull/push automáticamente
- **Multi-Server Deploys**: Distribuir código a múltiples servidores
- **Ansible**: Conectarse a nodos sin intervención
- **Monitoring**: SSH para health checks entre servidores

### Escenario Empresarial

El usuario `deploy` en stapp01 necesita:

1. Conectarse a stapp02 sin ingresar contraseña
2. Ejecutar `git pull` desde stapp02 automáticamente
3. Mantener seguridad mediante criptografía de clave pública

---

## 🧠 Fundamentos DevOps

### Cultura de Colaboración

SSH keys facilitan:

- **Desarrolladores**: Pueden desplegar sin tener credenciales de producción
- **Operaciones**: Rotación de claves centralizada
- **Seguridad**: Auditoría de qué claves acceden a qué servidores

### Automatización

```bash
# Sin SSH keys (manual):
ssh deploy@stapp02
Password: ********
git pull

# Con SSH keys (automatizado):
ssh deploy@stapp02 "cd /app && git pull"
# Sin prompts, ejecuta inmediatamente
```

### Métricas y Seguridad

- **Key Rotation Frequency**: Qué tan a menudo rotamos claves
- **Failed Key Attempts**: Intentos de autenticación con claves inválidas
- **Access Patterns**: Qué servidores acceden a qué otros servidores

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Generar Par de Claves SSH

```bash
# En servidor origen (stapp01)
ssh tony@172.16.238.10

# Cambiar al usuario deploy
sudo su - deploy

# Generar clave Ed25519 (moderna y segura)
ssh-keygen -t ed25519 -C "deploy@xfusioncorp.com"
```

**Prompts interactivos**:

```
Enter file in which to save the key: [Enter]  # ~/.ssh/id_ed25519
Enter passphrase: [Enter]  # Vacío para automatización
Enter same passphrase again: [Enter]
```

**Análisis DevOps**:

- `-t ed25519`: Algoritmo moderno, más seguro y rápido que RSA
- `-C`: Comentario para identificar la clave
- Sin passphrase: Esencial para automatización (aunque menos seguro)

**Archivos generados**:

```
~/.ssh/id_ed25519      # Clave privada (¡NUNCA compartir!)
~/.ssh/id_ed25519.pub  # Clave pública (se distribuye)
```

### Paso 2: Verificar Claves Generadas

```bash
# Ver clave pública
cat ~/.ssh/id_ed25519.pub
```

**Salida**:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDIhz2GK/XCUj4i6Q5yQJNL1MXMY0RxzPV2QrBqfHrDq deploy@xfusioncorp.com
```

### Paso 3: Distribuir Clave Pública al Servidor Destino

```bash
# Método 1: ssh-copy-id (recomendado)
ssh-copy-id deploy@172.16.238.11

# Método 2: Manual (si ssh-copy-id no está disponible)
cat ~/.ssh/id_ed25519.pub | ssh deploy@172.16.238.11 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

**Análisis DevOps**:

- `ssh-copy-id`: Automáticamente configura el directorio `.ssh` y permisos
- La clave pública se añade a `~/.ssh/authorized_keys` en el servidor destino
- `chmod 600` y `chmod 700` aplicados automáticamente

### Paso 4: Verificar Conexión sin Contraseña

```bash
# Probar conexión
ssh deploy@172.16.238.11

# Resultado esperado: Login exitoso SIN pedir contraseña
```

**Testing avanzado**:

```bash
# Ejecutar comando remoto sin login interactivo
ssh deploy@172.16.238.11 "hostname && whoami"
# Salida:
# stapp02
# deploy
```

### Paso 5: Verificar Configuración en Servidor Destino

```bash
# En stapp02, verificar authorized_keys
cat ~/.ssh/authorized_keys
```

**Debería contener**:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDIhz2GK/XCUj4i6Q5yQJNL1MXMY0RxzPV2QrBqfHrDq deploy@xfusioncorp.com
```

---

## ✅ Criterios de Éxito

- [x] Par de claves Ed25519 generado exitosamente
- [x] Clave privada protegida (`chmod 600`)
- [x] Clave pública distribuida a servidor destino
- [x] Conexión SSH exitosa SIN contraseña
- [x] Comandos remotos ejecutables automáticamente
- [x] Verificación de `authorized_keys` completada

---

## 🎓 Lecciones Aprendidas

### 🔑 Conceptos Clave

1. **Asymmetric Cryptography**:
   - **Clave privada**: Se queda en el origen, nunca se comparte
   - **Clave pública**: Se distribuye a servidores destino
   - **Autenticación**: Servidor verifica que tienes la privada correspondiente

2. **SSH Agent (Opcional pero recomendado)**:

   ```bash
   # Evita ingresar passphrase repetidamente
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Authorized Keys Format**:

   ```
   options keytype base64-encoded-key comment

   # Ejemplo con restricciones:
   command="/usr/bin/git",no-pty ssh-ed25519 AAA... deploy@xfusioncorp.com
   ```

### 🚨 Troubleshooting DevOps

**Problema 1**: Aún pide contraseña

- **Causas comunes**:
  - Permisos incorrectos en `~/.ssh` (debe ser 700)
  - Permisos incorrectos en `authorized_keys` (debe ser 600)
  - SELinux bloqueando acceso
- **Solución**:
  ```bash
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  restorecon -Rv ~/.ssh  # Si SELinux está activo
  ```

**Problema 2**: "Too many authentication failures"

- **Causa**: SSH intenta múltiples claves antes de la correcta
- **Solución**: Especificar clave explícitamente
  ```bash
  ssh -i ~/.ssh/id_ed25519 deploy@stapp02
  ```

### 💡 Mejores Prácticas

1. **Key Rotation**:

   ```bash
   # Generar nueva clave cada 6-12 meses
   # Revocar clave anterior eliminándola de authorized_keys
   ```

2. **Principle of Least Privilege**:

   ```bash
   # Restringir qué comandos puede ejecutar la clave
   echo 'command="/usr/bin/git",no-pty,no-port-forwarding ssh-ed25519 AAA... deploy' >> ~/.ssh/authorized_keys
   ```

3. **Ansible Automation**:

   ```yaml
   - name: Deploy SSH public key
     authorized_key:
       user: deploy
       state: present
       key: "{{ lookup('file', '/home/deploy/.ssh/id_ed25519.pub') }}"
   ```

4. **Audit**:
   ```bash
   # Ver qué claves están autorizadas
   for host in stapp01 stapp02 stapp03; do
     ssh deploy@$host "cat ~/.ssh/authorized_keys"
   done
   ```

---

## 🚀 Día Siguiente: Preparación

**Día 11** configura variables de entorno - conexión perfecta porque:

- Las claves SSH permiten la conexión
- Las variables de entorno configuran el comportamiento
- Juntos permiten automatización completa

**Preparación**: Piensa en qué variables necesita tu aplicación cuando se despliega automáticamente.

---

## 📚 Recursos DevOps

- [SSH Key Management](https://www.ssh.com/academy/ssh/key)
- [GitHub SSH Documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Ansible authorized_key Module](https://docs.ansible.com/ansible/latest/collections/ansible/posix/authorized_key_module.html)

---

## 📊 Seguimiento de Progreso

- **Día**: 10 de 100
- **Bloque**: Autenticación y Conectividad
- **Progresión**: 1-9 → 10 → 11 (Infraestructura/Git → SSH → Variables)
- **Habilidad**: Autenticación automatizada entre servidores

**¡Listo! Tus servidores ahora pueden comunicarse entre ellos de forma segura y automatizada.** 🔑
