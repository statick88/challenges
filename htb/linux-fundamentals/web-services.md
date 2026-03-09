---
title: "Linux Fundamentals - Working with Web Services"
category: htb
difficulty: easy
tags: [linux, web-services, apache, curl, wget, npm, php, http-server]
date: 2026-02-20
status: completed
platform: HTB Academy
module: Linux Fundamentals
section: 20
quarto: /learning-journey/security/linux-fundamentals/10-web-services.qmd
---

# Linux Fundamentals - Working with Web Services

## Objetivo

Aprender a trabajar con servidores web en Linux: Apache, servidores HTTP simples (Python, PHP, npm), y herramientas de cliente HTTP como curl y wget.

---

## Preguntas y Soluciones

### Question 1: npm HTTP Server

**Pregunta:** Find a way to start a simple HTTP server inside Pwnbox or your local VM using "npm". Submit the command that starts the web server on port 8080 (use the short argument to specify the port number).

**Respuesta:** `http-server -p 8080`

**Explicación:**
- `http-server` es un paquete npm que proporciona un servidor HTTP simple
- Se puede instalar con `npm install -g http-server`
- La opción `-p` especifica el puerto (forma corta)
- También se puede usar con `npx http-server -p 8080` sin instalación global

---

### Question 2: PHP Built-in Server

**Pregunta:** Find a way to start a simple HTTP server inside Pwnbox or your local VM using "php". Submit the command that starts the web server on the localhost (127.0.0.1) on port 8080.

**Respuesta:** `php -S 127.0.0.1:8080`

**Explicación:**
- PHP tiene un servidor web integrado desde PHP 5.4
- `-S` especifica la dirección IP y puerto
- El servidor sirve archivos del directorio actual
- Ideal para desarrollo rápido y testing

---

## Conceptos Clave

### Servidores Web en Linux

| Herramienta | Comando | Uso |
|-------------|---------|-----|
| Python | `python3 -m http.server 8080` | Servidor simple, todos los archivos |
| PHP | `php -S 127.0.0.1:8080` | Servidor con soporte PHP |
| npm http-server | `http-server -p 8080` | Servidor estático con cache |
| npm serve | `serve -p 8080` | Servidor con SPA support |
| Apache | `systemctl start apache2` | Servidor completo de producción |
| Nginx | `systemctl start nginx` | Servidor de alto rendimiento |

### Cliente HTTP: curl

```bash
# Obtener página web
curl http://localhost

# Solo headers
curl -I http://localhost

# Descargar archivo
curl -O http://localhost/archivo.txt

# POST request
curl -X POST -d "data=value" http://localhost/api

# Seguir redirecciones
curl -L http://localhost
```

### Cliente HTTP: wget

```bash
# Descargar archivo
wget http://localhost/archivo.txt

# Descargar con nombre específico
wget -O miarchivo.txt http://localhost/archivo.txt

# Descargar recursivamente
wget -r http://localhost

# Continuar descarga interrumpida
wget -c http://localhost/archivo.grande
```

---

## Configuración de Apache

### Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `/etc/apache2/apache2.conf` | Configuración global |
| `/etc/apache2/ports.conf` | Puertos de escucha |
| `/etc/apache2/sites-available/` | Sitios disponibles |
| `/etc/apache2/sites-enabled/` | Sitios activos |
| `/var/www/html/` | Directorio raíz por defecto |

### Comandos de Gestión

```bash
# Iniciar/Detener
sudo systemctl start apache2
sudo systemctl stop apache2
sudo systemctl restart apache2

# Verificar configuración
sudo apache2ctl configtest

# Ver estado
sudo systemctl status apache2

# Habilitar sitio
sudo a2ensite misitio.conf
sudo a2dissite 000-default.conf
```

### Cambiar Puerto

```bash
# Editar ports.conf
sudo nano /etc/apache2/ports.conf
# Cambiar Listen 80 por Listen 8080

# Reiniciar
sudo systemctl restart apache2
```

---

## Módulos de Apache

| Módulo | Función |
|--------|---------|
| mod_ssl | HTTPS/TLS |
| mod_rewrite | Reescritura de URLs |
| mod_proxy | Proxy inverso |
| mod_headers | Manipular headers HTTP |
| mod_security | Firewall de aplicaciones web |

```bash
# Habilitar módulo
sudo a2enmod ssl

# Deshabilitar módulo
sudo a2dismod status
```

---

## Ejemplos Prácticos

### Servidor Python Rápido
```bash
# Desde el directorio que quieres servir
cd /ruta/a/archivos
python3 -m http.server 8080
# Acceder: http://localhost:8080
```

### Servidor PHP para Desarrollo
```bash
# Servir aplicación PHP
cd /ruta/a/mi/app
php -S localhost:8000
# Acceder: http://localhost:8000
```

### Servidor npm Estático
```bash
# Sin instalación (npx)
npx http-server -p 8080

# Con instalación global
npm install -g http-server
http-server -p 8080 --cors
```

### Transferir Archivos con curl/wget
```bash
# Descargar desde servidor local
wget http://localhost:8080/archivo.txt

# Subir archivo con curl
curl -X POST -F "file=@archivo.txt" http://localhost:8080/upload
```

---

## curl vs wget

| Característica | curl | wget |
|----------------|------|------|
| Protocolos | Muchos (HTTP, FTP, SCP...) | HTTP, HTTPS, FTP |
| Output | STDOUT por defecto | Guarda archivo |
| Upload | ✓ | ✗ |
| Resume | ✗ | ✓ |
| Uso típico | Testing, APIs | Descargas |

---

## Lecciones Aprendidas

1. **npm http-server:** Servidor estático simple con `-p` para puerto
2. **PHP built-in:** `php -S IP:PORT` para desarrollo rápido
3. **curl:** Herramienta versátil para testing HTTP
4. **wget:** Ideal para descargar archivos
5. **Python:** Servidor simple con `python3 -m http.server`

---

## Referencias

- [http-server (npm)](https://www.npmjs.com/package/http-server)
- [PHP Built-in Web Server](https://www.php.net/manual/en/features.commandline.webserver.php)
- [curl(1) - Linux manual](https://man7.org/linux/man-pages/man1/curl.1.html)
- [wget(1) - Linux manual](https://man7.org/linux/man-pages/man1/wget.1.html)
- [Apache Documentation](https://httpd.apache.org/docs/)

---

## Estado

**COMPLETADO** ✓

- Fecha: 2026-02-20
- Módulo: Linux Fundamentals
- Sección: 20 - Working with Web Services
- Respuestas correctas: 2/2
