---
title: "Reto 18: SELinux Installation and Configuration - xFusionCorp Industries"
category: linux
difficulty: hard
tags:
  - linux
  - ssh
  - user-management
  - selinux
  - security
date: 2025-01-25
status: blocked
---

# Reto 18: SELinux Installation and Configuration - xFusionCorp Industries

## Objetivo del Reto

Instalar y configurar SELinux con políticas de seguridad empresarial:

**Install and configure SELinux with enterprise security policies.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp03 | 172.16.238.12 | stapp03.stratos.xfusioncorp.com | banner | BigGr33n | SELinux Setup |

## Requisitos Técnicos

- **SELinux mode**: Enforcing
- **Política**: Targeted policy
- **Instalación**: Paquetes necesarios si no están presentes
- **Configuración**: /etc/selinux/config
- **Verificación**: sestatus y getenforce
- **Contextos**: Configurar para servicios web si es necesario

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh banner@172.16.238.12
sudo su -

# 2. Verificar estado actual
sestatus
getenforce
rpm -qa | grep selinux

# 3. Instalar paquetes SELinux (si es necesario)
yum install policycoreutils selinux-policy-targeted selinux-policy-devel
# En sistemas Debian/Ubuntu:
apt-get install selinux-basics selinux-policy-default

# 4. Configurar SELinux para modo enforcing
vi /etc/selinux/config
# Configurar:
# SELINUX=enforcing
# SELINUXTYPE=targeted

# 5. Configurar contexto para directorios web
semanage fcontext -a -t httpd_sys_content_t "/var/www/html(/.*)?"
restorecon -R -v /var/www/html

# 6. Configurar puertos para servicios web
semanage port -a -t http_port_t -p tcp 8080
semanage port -a -t http_port_t -p tcp 8443

# 7. Crear políticas personalizadas si es necesario
cat > custom_web.policy << 'EOF'
module custom_web 1.0;

require {
    type httpd_t;
    type var_log_t;
    class dir { read getattr search };
}

#============= httpd_t ==============
allow httpd_t var_log_t:dir { read getattr search };
EOF

# Compilar e instalar política
checkmodule -M -m -o custom_web.mod custom_web.policy
semodule_package -o custom_web.pp -m custom_web.mod
semodule -i custom_web.pp

# 8. Reiniciar y verificar
setenforce 1  # Activar enforcing mode inmediatamente
sestatus  # Verificar estado completo
```

## Resultados Esperados

- SELinux instalado y funcionando en modo enforcing
- Políticas configuradas para servicios específicos
- Contextos de archivos correctos
- Sistema reforzado con seguridad de nivel kernel

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*