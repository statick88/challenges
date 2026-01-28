# 🖥️ Instrucciones Detalladas por Servidor - Día 3

## 📋 Resumen del Reto
Deshabilitar acceso SSH directo como root en todos los servidores de aplicaciones del Datacenter Stratos según protocolos de seguridad post-auditoría.

---

## 🎯 stapp01 (172.16.238.10) - Usuario: tony

### 📝 Paso a Paso:
```bash
# 1. Conectarse al servidor
ssh tony@172.16.238.10

# 2. Verificar configuración actual
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Salida esperada: PermitRootLogin yes

# 3. Hacer backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 4. Editar configuración SSH
sudo vi /etc/ssh/sshd_config

# 5. Buscar y modificar línea
# Buscar: PermitRootLogin yes
# Cambiar a: PermitRootLogin no
# Guardar: ESC + :wq

# 6. Reiniciar servicio SSH
sudo systemctl restart sshd

# 7. Verificar cambio
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Salida esperada: PermitRootLogin no
```

### ✅ Verificación:
```bash
# Probar acceso normal (debe funcionar)
ssh tony@172.16.238.10

# Probar acceso root (debe fallar)
ssh root@172.16.238.10
```

---

## 🎯 stapp02 (172.16.238.11) - Usuario: steve

### 📝 Paso a Paso:
```bash
# 1. Conectarse al servidor
ssh steve@172.16.238.11

# 2. Verificar configuración actual
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Salida esperada: PermitRootLogin yes

# 3. Hacer backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 4. Editar configuración SSH
sudo vi /etc/ssh/sshd_config

# 5. Buscar y modificar línea
# Buscar: PermitRootLogin yes
# Cambiar a: PermitRootLogin no
# Guardar: ESC + :wq

# 6. Reiniciar servicio SSH
sudo systemctl restart sshd

# 7. Verificar cambio
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Salida esperada: PermitRootLogin no
```

### ✅ Verificación:
```bash
# Probar acceso normal (debe funcionar)
ssh steve@172.16.238.11

# Probar acceso root (debe fallar)
ssh root@172.16.238.11
```

---

## 🎯 stapp03 (172.16.238.12) - Usuario: banner

### 📝 Paso a Paso:
```bash
# 1. Conectarse al servidor
ssh banner@172.16.238.12

# 2. Verificar configuración actual
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Salida esperada: PermitRootLogin yes

# 3. Hacer backup
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# 4. Editar configuración SSH
sudo vi /etc/ssh/sshd_config

# 5. Buscar y modificar línea
# Buscar: PermitRootLogin yes
# Cambiar a: PermitRootLogin no
# Guardar: ESC + :wq

# 6. Reiniciar servicio SSH
sudo systemctl restart sshd

# 7. Verificar cambio
sudo grep -i "permitrootlogin" /etc/ssh/sshd_config
# Salida esperada: PermitRootLogin no
```

### ✅ Verificación:
```bash
# Probar acceso normal (debe funcionar)
ssh banner@172.16.238.12

# Probar acceso root (debe fallar)
ssh root@172.16.238.12
```

---

## 🔍 Comandos de Verificación Final

### Validar todos los servidores:
```bash
# Desde jumphost o máquina externa:
for server in 172.16.238.10 172.16.238.11 172.16.238.12; do
    echo "=== Probando servidor: $server ==="
    ssh -o ConnectTimeout=5 root@$server 2>&1 | head -3
done

# O probar individualmente:
ssh tony@172.16.238.10    # ✓ Conexión OK
ssh steve@172.16.238.11   # ✓ Conexión OK  
ssh banner@172.16.238.12  # ✓ Conexión OK

ssh root@172.16.238.10  # ❌ Permiso denegado
ssh root@172.16.238.11  # ❌ Permiso denegado
ssh root@172.16.238.12  # ❌ Permiso denegado
```

## 📊 Checklist de Finalización
- [ ] stapp01 configurado y verificado
- [ ] stapp02 configurado y verificado
- [ ] stapp03 configurado y verificado
- [ ] Pruebas de acceso root fallan en todos
- [ ] Backups creados en cada servidor
- [ ] Documentación actualizada

---

## 🚨 Notas Importantes
1. **NO cerrar** las conexiones SSH hasta verificar todo
2. **Mantener sesión** en cada servidor hasta confirmar cambios
3. **Verificar dos veces**: con grep y con ssh real
4. **Documentar cualquier error** que aparezca durante systemctl restart
5. **Probar desde máquina externa** para validar completamente

## 📞 Si algo falla:
- Revisar logs: `sudo journalctl -u sshd`
- Verificar sintaxis: `sudo sshd -T`
- Restaurar backup: `sudo cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config`