# Sistema de Editor y Autenticación - S-Tech Blog

## 🚀 Sistema Implementado

### **Autenticación**
- Login con email y contraseña
- Token JWT con expiración de 7 días
- LocalStorage para persistencia de sesión

### **Editor Avanzado (TinyMCE)**
- Editor tipo Word con formato rico
- Inserción de imágenes (URL o upload)
- Inserción de videos (YouTube o archivo)
- Soporte para PDFs embebidos
- Tablas interactivas
- Bloques de código con syntax highlighting
- Autoguardado cada 30 segundos
- Vista previa en tiempo real

### **Gestión de Artículos**
- Crear nuevos artículos
- Editar artículos existentes
- Eliminar artículos
- Botones visibles solo para admin autenticado

## 🔐 Credenciales de Acceso

**Email:** `stechblog.office@gmail.com`  
**Contraseña:** `SaulTurbi2025!`

## 📝 Cómo Usar

### 1. Iniciar Sesión
1. Ve a: `http://localhost:5500/S-TECH-FRONT/pages/login.html`
2. Ingresa las credenciales
3. Serás redirigido al inicio

### 2. Crear Artículo
1. Ve a la página "Artículos"
2. Verás el botón **"+ Nuevo Artículo"** (solo si estás autenticado)
3. Click en el botón
4. Completa los campos:
   - **Título** (requerido)
   - **Categoría** (requerido)
   - **Extracto** (requerido)
   - **Tiempo de lectura** (ej: "5 min")
   - **URL de Imagen** (opcional, puedes subirla)
   - **URL de Video** (opcional, puedes subirlo)
   - **Contenido** (requerido, usa el editor TinyMCE)

### 3. Subir Archivos en el Editor
**Opción 1: Desde el Editor TinyMCE**
- Click en el ícono de imagen/video en la barra de herramientas
- Selecciona "Upload"
- Elige el archivo desde tu computadora

**Opción 2: Desde los Botones de Upload**
- En los campos "URL de Imagen" o "URL de Video"
- Click en el botón **"📤 Subir"**
- Selecciona el archivo
- La URL se llenará automáticamente

### 4. Insertar Elementos Avanzados

**Imágenes:**
- Toolbar → Ícono de imagen → Upload o URL
- Drag & drop directo al editor

**Videos:**
- **YouTube:** Pega la URL completa en el campo "URL de Video"
- **Archivo:** Usa el botón de upload

**Tablas:**
- Toolbar → Table → Insert table
- Configura filas y columnas
- Usa los botones de tabla para editar

**PDF:**
- Toolbar → Media → Insertar PDF embebido

**Código:**
- Toolbar → Code sample
- Selecciona el lenguaje
- Pega tu código

### 5. Editar Artículo Existente
1. Abre cualquier artículo
2. Verás botones **"✏️ Editar"** y **"🗑️ Eliminar"** (solo si estás autenticado)
3. Click en "Editar"
4. Modifica lo necesario
5. Click en "Publicar" o "Guardar Borrador"

### 6. Eliminar Artículo
1. Abre el artículo
2. Click en **"🗑️ Eliminar"**
3. Confirma la acción

## 🎨 Características del Editor

### Formato de Texto
- Negrita, cursiva, subrayado, tachado
- Títulos (H1-H6)
- Listas ordenadas y desordenadas
- Alineación (izquierda, centro, derecha, justificado)
- Colores de texto y fondo

### Medios
- **Imágenes:** JPG, PNG, GIF, WEBP (hasta 50MB)
- **Videos:** MP4, WEBM (hasta 50MB)
- **PDFs:** Documentos embebidos

### Tablas
- Crear tablas personalizadas
- Fusionar celdas
- Ajustar propiedades (bordes, colores, padding)
- Insertar/eliminar filas y columnas

### Código
- Syntax highlighting
- Múltiples lenguajes soportados
- Copia fácil

## 🔒 Seguridad

### Rutas Protegidas (Requieren Token JWT)
- `POST /api/posts` - Crear artículo
- `PUT /api/posts/:id` - Actualizar artículo  
- `DELETE /api/posts/:id` - Eliminar artículo
- `POST /api/upload` - Subir archivos

### Rutas Públicas
- `GET /api/posts` - Listar artículos
- `GET /api/posts/:id` - Ver artículo
- `POST /api/posts/:id/comments` - Comentar
- `POST /api/posts/:id/like` - Dar like

## 📁 Archivos Subidos
- Los archivos se guardan en: `uploads/`
- Se acceden vía: `http://localhost:4000/uploads/[filename]`

## 🛠️ Cambiar Contraseña

Si necesitas cambiar la contraseña:

1. Genera un nuevo hash:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TuNuevaContraseña', 10).then(hash => console.log(hash));"
```

2. Actualiza `.env`:
```env
AUTH_PASSWORD_HASH=tu_nuevo_hash_aqui
```

3. Reinicia el servidor

## 🚨 Solución de Problemas

### "Token no proporcionado" o "Token inválido"
- Inicia sesión de nuevo
- Verifica que el servidor esté corriendo
- Limpia localStorage y vuelve a loguearte

### Error al subir archivos
- Verifica que la carpeta `uploads/` exista
- Tamaño máximo: 50MB
- Formatos permitidos: imágenes, videos, PDFs

### Editor no carga
- Verifica conexión a internet (TinyMCE usa CDN)
- Revisa la consola del navegador

## 📦 Estructura de Archivos Nuevos

```
Backend:
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js (Login, verificación)
│   │   └── upload.controller.js (Upload de archivos)
│   ├── middlewares/
│   │   └── auth.js (Verificación JWT)
│   └── routes/
│       ├── auth.routes.js
│       └── upload.routes.js
└── uploads/ (Archivos subidos)

Frontend:
├── S-TECH-FRONT/
│   ├── pages/
│   │   ├── login.html (Página de login)
│   │   └── editor.html (Editor de artículos)
│   └── assets/
│       ├── css/pages/
│       │   ├── login.css
│       │   └── editor.css
│       └── js/
│           ├── pages/
│           │   ├── login.js
│           │   └── editor.js
│           └── services/
│               └── auth.service.js (Lógica de autenticación)
```

## ✨ Funcionalidades Extra

- **Autoguardado:** El borrador se guarda automáticamente cada 30 segundos en localStorage
- **Recuperación de borradores:** Al abrir el editor, pregunta si quieres recuperar el último borrador
- **Vista previa:** El contenido se renderiza exactamente como se verá publicado
- **Responsive:** El editor funciona en dispositivos móviles
- **Dark mode:** Compatible con el modo oscuro del sitio

---

**¡Listo para crear contenido profesional! 🚀**
