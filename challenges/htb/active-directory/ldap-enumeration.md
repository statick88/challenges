---
title: "HTB Academy - LDAP Enumeration"
category: active-directory
difficulty: easy
tags: ["ldap", "active-directory", "enumeration", "htb-academy", "pentesting"]
date: 2026-02-17
status: ready
platform: HTB
---

# 🎓 HTB Academy - LDAP Enumeration

## 🎭 Enumeración de Active Directory via LDAP

---

👨‍🏫 **Del Instructor**: Bienvenido al módulo de Active Directory. Como Ethical Hacker, la enumeración LDAP es fundamental para comprender la estructura de un dominio Windows y identificar vectores de ataque potenciales.

> 🎯 **Mentalidad de Hacker**: "Active Directory es el cerebro de la infraestructura empresarial. Cada objeto, cada permiso, cada relación es una pieza del rompecabezas que puede conducir a la compromise total del dominio."

---

## 🎭 El Escenario: Assessing Corporate Domain

### Contexto del Pentest

Eres un consultor de seguridad realizando un assessment autorizado para una empresa. Durante la fase de reconocimiento, has identificado un Domain Controller expuesto. Tu objetivo es enumerar la estructura del dominio utilizando LDAP para:

- Identificar usuarios y grupos del dominio
- Descubrir políticas de contraseñas
- Mapear la estructura organizacional
- Encontrar cuentas de servicio vulnerables (Kerberoasting)

**Tu misión como Pentester**:
- Conectar al servidor LDAP del dominio
- Enumerar usuarios del dominio
- Identificar grupos con privilegios elevados
- Documentar hallazgos para el reporte

## 🧠 Fundamentos de Análisis: LDAP y Active Directory

### ¿Qué es LDAP?

LDAP (Lightweight Directory Access Protocol) es el protocolo que utiliza Active Directory para almacenar y consultar información sobre objetos del dominio:

- **Usuarios**: Cuentas de usuario y sus atributos
- **Grupos**: Estructuras de permisos y membresías
- **Computadoras**: Cuentas de máquina
- **Políticas**: GPOs y configuraciones de seguridad
- **Servicios**: Service accounts y SPNs

### Estructura LDAP

```
DC=htb,DC=local (Dominio)
├── CN=Users (Contenedor de usuarios)
│   ├── CN=Administrator
│   ├── CN=Guest
│   └── CN=krbtgt (Cuenta de servicio Kerberos)
├── CN=Computers
├── OU=Domain Controllers
└── CN=System
```

## 🔍 Metodología de Investigación

### Paso 1: Preparación del Entorno

```bash
# Conectar a Pwnbox HTB Academy
ssh htb-ac-XXXXXX@htb-XXXXXX.htb-cloud.com

# Verificar herramientas disponibles
which ldapsearch windapsearch ldapdomaindump

# Instalar herramientas si es necesario
sudo apt update && sudo apt install -y ldap-utils
```

### Paso 2: Identificar el Domain Controller

```bash
# Escaneo de puertos AD comunes
nmap -p 389,636,3268,3269 10.10.10.10

# Output esperado:
# 389/tcp   open  ldap
# 636/tcp   open  ssl/ldap (LDAPS)
# 3268/tcp  open  globalcatLDAP
# 3269/tcp  open  globalcatLDAPssl
```

**Análisis**: Los puertos LDAP indican presencia de Active Directory. El puerto 389 es LDAP estándar, 636 es LDAP sobre SSL.

### Paso 3: Enumeración LDAP Básica

```bash
# Enumeración anónima
ldapsearch -x -H ldap://10.10.10.10 -b "DC=htb,DC=local" "(objectClass=*)" | head -100

# Enumeración de usuarios
ldapsearch -x -H ldap://10.10.10.10 -b "DC=htb,DC=local" "(objectClass=user)" sAMAccountName | grep sAMAccountName

# Enumeración de grupos
ldapsearch -x -H ldap://10.10.10.10 -b "DC=htb,DC=local" "(objectClass=group)" sAMAccountName | grep sAMAccountName

# Enumeración de Domain Admins
ldapsearch -x -H ldap://10.10.10.10 -b "DC=htb,DC=local" "(&(objectClass=group)(cn=Domain Admins))" member
```

### Paso 4: Enumeración con Credenciales

```bash
# Si tenemos credenciales válidas
ldapsearch -x -H ldap://10.10.10.10 -D "htb\\user" -W -b "DC=htb,DC=local" "(objectClass=user)" sAMAccountName pwdLastSet

# Usar ldapdomaindump para visualización completa
ldapdomaindump -u 'htb\user' -p 'password' 10.10.10.10

# Los resultados se guardan en:
# domain_users.json, domain_groups.json, domain_computers.json
```

### Paso 5: Identificar Cuentas de Servicio (Kerberoasting)

```bash
# Buscar cuentas con SPN (Service Principal Name)
ldapsearch -x -H ldap://10.10.10.10 -D "htb\\user" -W -b "DC=htb,DC=local" "(&(objectClass=user)(servicePrincipalName=*))" sAMAccountName servicePrincipalName

# Output ejemplo:
# sAMAccountName: sqlservice
# servicePrincipalName: MSSQLSvc/db.htb.local:1433
```

## 🛠️ Arsenal de Herramientas HTB Academy

| Herramienta | Uso | Comando |
|-------------|-----|---------|
| `ldapsearch` | Queries LDAP nativas | `ldapsearch -x -H ldap://IP` |
| `windapsearch` | Enumeración AD específica | `windapsearch.py -u user@domain` |
| `ldapdomaindump` | Dump completo del dominio | `ldapdomaindump -u user IP` |
| `bloodhound-python` | Mapeo de relaciones AD | `bloodhound-python -u user@domain` |
| `CrackMapExec` | Enumeración integrada | `cme ldap IP -u user -p pass` |

## ✅ Checklist de Verificación

- [ ] Identificar Domain Controller via nmap
- [ ] Enumerar usuarios del dominio
- [ ] Enumerar grupos y membresías
- [ ] Identificar Domain Admins
- [ ] Descubrir cuentas de servicio (SPNs)
- [ ] Documentar estructura del dominio
- [ ] Identificar vectores de ataque potenciales

## 🎓 Lo Que Acabas de Aprender

**Habilidades Técnicas**:
- Enumeración LDAP básica y avanzada
- Identificación de estructura de dominio
- Detección de cuentas de servicio
- Uso de herramientas especializadas AD

**Mentalidad de Pentester**:
- **Reconocimiento exhaustivo**: Enumerar todo antes de atacar
- **Documentación rigurosa**: Cada hallazgo es importante
- **Pensamiento lateral**: Usuarios → Grupos → Permisos → Acceso

## 🚀 Próximos Pasos

1. **Kerberoasting**: Atacar cuentas de servicio identificadas
2. **AS-REP Roasting**: Usuarios sin pre-auth
3. **BloodHound**: Visualizar relaciones de ataque
4. **Lateral Movement**: Usar información para pivotear

## 📚 Recursos HTB Academy

- [HTB Academy - Active Directory LDAP Module](https://academy.hackthebox.com/module/details/74)
- [Attacking Active Directory: LDAP Enumeration](https://book.hacktricks.xyz/pentesting/pentesting-ldap)
- [WindAPSearch GitHub](https://github.com/ropnop/windapsearch)

---

## ✅ Estado

**LISTO PARA COMPLETAR** 🔵

- 📅 Fecha: 2026-02-17
- ⏱️ Tiempo estimado: 30 minutos
- 🎯 Dificultad: Fácil (HTB Academy Beginner)
