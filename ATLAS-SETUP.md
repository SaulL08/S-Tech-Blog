# 🗄️ GUÍA RÁPIDA: MONGODB ATLAS

## 📝 Pasos que acabas de completar:

### 1. Crear cuenta
✅ Registrado en: https://cloud.mongodb.com

### 2. Crear Cluster
- ✅ Plan: **M0 (FREE)**
- ✅ Region: [Tu región seleccionada]
- ✅ Nombre: Cluster0 o stechblog

### 3. Usuario creado
- Username: `stechblog_admin`
- Password: `[Tu contraseña]`

### 4. Connection String obtenido
```
mongodb+srv://stechblog_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🔧 Actualizar tu proyecto

### 1. Edita `.env`:

```bash
# Reemplaza esta línea:
MONGO_URI=mongodb://127.0.0.1:27017/stechblog

# Por tu connection string de Atlas:
MONGO_URI=mongodb+srv://stechblog_admin:TU_PASSWORD_AQUI@cluster0.xxxxx.mongodb.net/stechblog?retryWrites=true&w=majority
```

**⚠️ IMPORTANTE:**
- Reemplaza `<password>` con tu contraseña real
- Agrega `/stechblog` después de `.net`
- Si tu password tiene caracteres especiales (@, #, $, %, etc.), codifícalos:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`

### 2. Reinicia el servidor:

```powershell
# Detener servidor actual (Ctrl+C)

# Iniciar de nuevo
npm start
```

Deberías ver:
```
✅ MongoDB conectado correctamente
✅ S-Tech Backend corriendo en http://localhost:4000
```

---

## 📤 Migrar datos existentes (OPCIONAL)

Si tienes artículos, usuarios o suscriptores en tu MongoDB local:

### Opción A: Script automático

1. Agrega temporalmente en `.env`:
```bash
MONGO_URI_ATLAS=mongodb+srv://stechblog_admin:PASSWORD@cluster0.xxxxx.mongodb.net/stechblog?retryWrites=true&w=majority
```

2. Ejecuta el script:
```powershell
node migrate-to-atlas.js
```

3. Elimina `MONGO_URI_ATLAS` del `.env`

### Opción B: Exportar/Importar manual

```powershell
# Exportar desde local
mongodump --uri="mongodb://127.0.0.1:27017/stechblog" --out=./backup

# Importar a Atlas
mongorestore --uri="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/stechblog" ./backup/stechblog
```

### Opción C: Empezar desde cero

Si no tienes datos importantes, simplemente:
1. Cambia el MONGO_URI en `.env`
2. Ejecuta `node create-admin.js` para crear tu usuario admin
3. ¡Listo!

---

## ✅ Verificar conexión

```powershell
npm start
```

Si ves `✅ MongoDB conectado correctamente`, ¡funcionó!

---

## 🔒 Seguridad en Producción

Cuando despliegues a producción:

1. **En Atlas Dashboard:**
   - Ve a "Network Access"
   - Elimina `0.0.0.0/0`
   - Agrega solo la IP de tu servidor de hosting

2. **Variables de entorno:**
   - Configura `MONGO_URI` en tu hosting (Vercel, Railway, etc.)
   - **NUNCA** subas `.env` a GitHub

---

## 📊 Monitoreo

En el dashboard de Atlas puedes ver:
- 📈 Conexiones activas
- 💾 Uso de almacenamiento (límite: 512MB en plan free)
- 🔍 Queries más lentas
- 📊 Métricas en tiempo real

---

## 🆘 Problemas comunes

### Error: "Authentication failed"
- Verifica username y password
- Codifica caracteres especiales en la URL

### Error: "Connection timeout"
- Verifica que `0.0.0.0/0` esté en Network Access
- Revisa tu firewall/antivirus

### Error: "Database name not specified"
- Asegúrate de tener `/stechblog` después de `.net`

---

## 📞 Soporte

- Documentación: https://docs.atlas.mongodb.com
- Support: https://support.mongodb.com
- Community: https://www.mongodb.com/community/forums

---

✨ **¡Tu base de datos ya está en la nube!**
