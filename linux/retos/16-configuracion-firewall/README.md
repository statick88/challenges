# Reto 16: Firewall Configuration - xFusionCorp Industries

## Objetivo del Reto

Configurar firewall según políticas de seguridad de la empresa:

**Configure firewall according to corporate security policies.**

## Servidor Objetivo

| Servidor | IP | Hostname | Usuario | Contraseña | Propósito |
|----------|----|-----------|--------|-------------|-----------|
| stapp01 | 172.16.238.10 | stapp01.stratos.xfusioncorp.com | tony | Ir0nM@n | Firewall Setup |

## Requisitos Técnicos

- **Firewall**: iptables o firewalld (según sistema)
- **Reglas entrantes**: SSH (22), HTTP (80), HTTPS (443)
- **Reglas salientes**: Permitir todo
- **Política**: DROP por defecto para tráfico entrante
- **Persistencia**: Reglas que sobreviven reboot
- **Logging**: Log de conexiones denegadas

## Estrategia de Implementación

### Comandos Requeridos

```bash
# 1. Conexión al servidor
ssh tony@172.16.238.10
sudo su -

# 2. Verificar firewall actual
systemctl status firewalld
iptables -L -n

# 3. Configurar con firewalld (si disponible)
systemctl start firewalld
systemctl enable firewalld

# Crear zonas si es necesario
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --set-default-zone=public

# Recargar reglas
firewall-cmd --reload

# 4. Configurar con iptables (alternativa)
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# Política por defecto
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Reglas específicas
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 5. Guardar reglas (distro-specific)
service iptables save  # CentOS/RHEL
iptables-save > /etc/iptables/rules.v4  # Debian/Ubuntu

# 6. Verificación
iptables -L -n
firewall-cmd --list-all
```

## Resultados Esperados

- Firewall activo con políticas configuradas
- Solo puertos necesarios abiertos (22,80,443)
- Política DROP por defecto para seguridad
- Reglas persistentes después de reboot
- Logs de conexiones registrados

## Estado del Reto

🔒 **BLOQUEADO** - Requiere completar retos 4-6

*Fecha planeada: Pendiente*