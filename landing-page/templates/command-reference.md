# Guía de Referencia de Comandos DevOps

## 👤 Gestión de Usuarios
```bash
# Crear usuario con fecha de expiración
sudo useradd -e AAAA-MM-DD nombre_usuario

# Listar información del usuario
id nombre_usuario

# Ver detalles de la cuenta del usuario
sudo chage -l nombre_usuario

# Establecer expiración de contraseña
sudo chage -E AAAA-MM-DD nombre_usuario

# Eliminar usuario
sudo userdel nombre_usuario

# Cambiar shell del usuario
sudo usermod -s /sbin/nologin nombre_usuario
```

## 🔐 SSH y Autenticación
```bash
# Conectarse a servidor remoto
ssh usuario@DIRECCION_IP

# Copiar clave SSH
ssh-copy-id usuario@DIRECCION_IP

# Generar clave SSH
ssh-keygen -t rsa -b 4096

# Conexión con clave específica
ssh -i /ruta/a/clave usuario@servidor
```

## 🔒 Permisos Linux
```bash
# Cambiar permisos de archivo
chmod 755 nombre_archivo

# Cambiar propietario
chown usuario:grupo nombre_archivo

# Hacer script ejecutable
chmod +x script.sh

# Ver permisos en formato octal
stat -c "%a %n" nombre_archivo
```

## 📦 Gestión de Paquetes

### Ubuntu/Debian
```bash
# Instalar paquete
sudo apt install nombre_paquete

# Actualizar lista de paquetes
sudo apt update

# Actualizar sistema
sudo apt upgrade

# Buscar paquete
apt search nombre_paquete

# Eliminar paquete
sudo apt remove nombre_paquete
```

### CentOS/RHEL
```bash
# Instalar paquete
sudo yum install nombre_paquete

# Actualizar sistema
sudo yum update

# Buscar paquete
yum search nombre_paquete

# Eliminar paquete
sudo yum remove nombre_paquete
```

## 🐧 Servicios del Sistema
```bash
# Iniciar servicio
sudo systemctl start nombre_servicio

# Habilitar servicio al arranque
sudo systemctl enable nombre_servicio

# Ver estado del servicio
sudo systemctl status nombre_servicio

# Reiniciar servicio
sudo systemctl restart nombre_servicio

# Detener servicio
sudo systemctl stop nombre_servicio

# Ver logs del servicio
sudo journalctl -u nombre_servicio
```

## 📝 Operaciones de Archivos
```bash
# Crear archivo
touch nombre_archivo

# Copiar archivo
cp origen destino

# Mover archivo
mv origen destino

# Eliminar archivo
rm nombre_archivo

# Editar archivo (nano)
nano nombre_archivo

# Editar archivo (vi/vim)
vi nombre_archivo
vim nombre_archivo

# Ver contenido de archivo
cat nombre_archivo
less nombre_archivo
```

## 🔍 Solución de Problemas
```bash
# Ver registros del sistema
sudo journalctl -u nombre_servicio

# Ver últimos mensajes del kernel
dmesg

# Ver conectividad de red
ping DIRECCION_IP

# Ver puertos abiertos
netstat -tulpn
ss -tulpn

# Ver espacio en disco
df -h

# Ver uso de memoria
free -h

# Ver procesos corriendo
ps aux
top
htop

# Ver uso de CPU
top
```

## 🐳 Comandos Docker
```bash
# Descargar imagen
docker pull nombre_imagen

# Ejecutar contenedor
docker run -d nombre_imagen

# Listar contenedores
docker ps

# Detener contenedor
docker stop id_contenedor

# Eliminar contenedor
docker rm id_contenedor

# Ver logs de contenedor
docker logs id_contenedor

# Acceder a contenedor en ejecución
docker exec -it id_contenedor /bin/bash
```

## ☸️ Comandos Kubernetes
```bash
# Listar pods
kubectl get pods

# Desplegar aplicación
kubectl apply -f archivo.yaml

# Ver estado de despliegue
kubectl get deployments

# Ver servicios
kubectl get services

# Ver logs de pod
kubectl logs nombre_pod

# Acceder a pod
kubectl exec -it nombre_pod -- /bin/bash

# Escalar despliegue
kubectl scale deployment nombre_despliegue --replicas=3
```

## 🔧 Comandos Ansible
```bash
# Ejecutar playbook
ansible-playbook nombre_playbook.yml

# Verificar inventario
ansible-inventory -i archivo_inventario

# Ejecutar comando en remoto
ansible servidores -m command -a "comando"

# Ejecutar módulo raw
ansible servidores -m raw -a "comando"
```

## 🏗️ Comandos Terraform
```bash
# Inicializar Terraform
terraform init

# Ver plan de ejecución
terraform plan

# Aplicar cambios
terraform apply

# Destruir infraestructura
terraform destroy

# Validar configuración
terraform validate
```

## 🔥 Comandos Firewall (iptables)
```bash
# Listar reglas
sudo iptables -L -n

# Agregar regla
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Guardar reglas
sudo iptables-save > /etc/iptables/rules.v4

# Eliminar regla
sudo iptables -D INPUT regla_numero
```