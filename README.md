# 🚀 S-Tech Blog

Blog de tecnología moderno y responsivo construido con tecnologías full-stack: Node.js, Express, MongoDB y Vanilla JavaScript.

![S-Tech Blog](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

## ✨ Características

### Frontend
- 🎨 **Diseño Responsive**: Adaptable a todos los dispositivos (móvil, tablet, desktop)
- 🌓 **Modo Oscuro**: Tema claro/oscuro con persistencia en localStorage
- 🔍 **Búsqueda en Tiempo Real**: Filtrado instantáneo con debounce
- 📝 **Editor WYSIWYG**: TinyMCE con soporte para imágenes, videos y PDFs
- 💬 **Sistema de Comentarios**: Comentarios anidados con sistema de likes
- ❤️ **Sistema de Likes**: Para artículos y comentarios
- 📧 **Suscripción por Email**: Notificaciones automáticas de nuevos artículos
- 🎤 **Síntesis de Voz**: Lectura de artículos con Web Speech API
- 📤 **Compartir en Redes**: Web Share API integrada
- 🔐 **Autenticación JWT**: Login seguro con tokens

### Backend
- 🔒 **API REST Segura**: Endpoints protegidos con JWT
- 📊 **Base de Datos**: MongoDB con Mongoose ODM
- 📧 **Notificaciones Email**: Sistema de emails con Nodemailer + Gmail SMTP
- 📁 **Carga de Archivos**: Multer para imágenes, videos y documentos (50MB)
- 👥 **Gestión de Usuarios**: Sistema de roles (admin/editor)
- 🛡️ **Seguridad**: bcrypt para passwords, validación de inputs
- 📈 **Logging**: Morgan para registro de peticiones HTTP

## 🛠️ Tecnologías

### Frontend
- Vanilla JavaScript (ES6 Modules)
- CSS3 con @layer y Custom Properties
- TinyMCE Editor
- Phosphor Icons
- Hash-based SPA Router

### Backend
- Node.js v16+
- Express.js 4.18
- MongoDB / Mongoose 8.0
- JSON Web Tokens (JWT)
- bcryptjs
- Nodemailer
- Multer
- CORS
- Morgan

## 📦 Instalación

### Prerequisitos
- Node.js >= 16.0.0
- MongoDB >= 5.0
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/s-tech-blog.git
cd s-tech-blog
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/stechblog

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-jwt-secret-super-seguro

# Gmail SMTP
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-gmail

# CORS
CORS_ORIGIN=*

NODE_ENV=development
```

### 4. Crear usuario administrador
```bash
node create-admin.js
```

Esto creará el usuario admin con:
- Email: `stechblog.office@gmail.com`
- Contraseña: `Thunegrito08^`

### 5. Iniciar el servidor
```bash
# Desarrollo con nodemon
npm run dev

# Producción
npm start
```

El servidor estará corriendo en `http://localhost:4000`

### 6. Abrir el frontend
Abre `Index.html` con Live Server o cualquier servidor HTTP local.

## 📁 Estructura del Proyecto

```
S-Tech-Blog/
├── src/                          # Backend
│   ├── config/
│   │   └── db.js                # Configuración MongoDB
│   ├── controllers/             # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── subscriber.controller.js
│   │   └── upload.controller.js
│   ├── middlewares/             # Middlewares
│   │   ├── auth.js             # Verificación JWT
│   │   └── error.js            # Manejo de errores
│   ├── models/                  # Esquemas Mongoose
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── subscriber.model.js
│   ├── routes/                  # Rutas API
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── subscriber.routes.js
│   │   ├── upload.routes.js
│   │   └── index.js
│   ├── services/
│   │   └── email.service.js    # Servicio de emails
│   └── app.js                  # Configuración Express
├── S-TECH-FRONT/               # Frontend
│   ├── assets/
│   │   ├── css/               # Estilos por capas
│   │   ├── js/
│   │   │   ├── config.js      # Configuración centralizada
│   │   │   ├── main.js        # Punto de entrada
│   │   │   ├── core/          # Utilidades (DOM, HTTP)
│   │   │   ├── services/      # Servicios API
│   │   │   └── pages/         # Lógica por página
│   │   ├── layouts/           # Componentes (header, footer)
│   │   └── pages/             # Vistas HTML
│   └── pages/
│       ├── login.html
│       └── editor.html
├── uploads/                    # Archivos subidos
├── .env                       # Variables de entorno
├── .env.example              # Plantilla de .env
├── .gitignore
├── create-admin.js           # Script crear admin
├── index.js                  # Entry point backend
├── Index.html               # Entry point frontend
├── package.json
└── README.md

```

## 🔑 API Endpoints

### Autenticación
```
POST   /api/auth/login          # Iniciar sesión
POST   /api/auth/verify         # Verificar token JWT
```

### Artículos (Posts)
```
GET    /api/posts               # Obtener todos los posts
GET    /api/posts/:id           # Obtener post por ID
POST   /api/posts               # Crear post (requiere auth)
PUT    /api/posts/:id           # Actualizar post (requiere auth)
DELETE /api/posts/:id           # Eliminar post (requiere auth)
POST   /api/posts/:id/like      # Dar like a un post
POST   /api/posts/:id/comments  # Agregar comentario
POST   /api/posts/:id/comments/:commentId/like  # Like a comentario
```

### Suscriptores
```
POST   /api/subscribers/subscribe    # Suscribirse al newsletter
GET    /api/subscribers              # Listar suscriptores (requiere auth)
```

### Archivos
```
POST   /api/upload                   # Subir archivo (requiere auth)
```

## 🎨 Configuración del Frontend

Edita `S-TECH-FRONT/assets/js/config.js` para configurar URLs de producción:

```javascript
const API_URLS = {
  development: 'http://localhost:4000/api',
  production: 'https://tu-dominio.com/api'  // Actualizar aquí
};

const FRONTEND_URLS = {
  development: 'http://127.0.0.1:5500',
  production: 'https://tu-dominio.com'  // Actualizar aquí
};
```

## 🔐 Seguridad

### Generar JWT Secret seguro
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Gmail App Password
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos (activar)
3. Seguridad → Contraseñas de aplicaciones
4. Genera una contraseña para "Correo"
5. Usa esa contraseña en `EMAIL_PASS`

## 📝 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar con nodemon (desarrollo)
node create-admin.js  # Crear usuario administrador
```

## 🚀 Despliegue

### Backend (Node.js + MongoDB)
Recomendaciones:
- **Vercel**, **Railway**, **Render** para Node.js
- **MongoDB Atlas** para base de datos
- Configurar variables de entorno en el hosting
- Actualizar `CORS_ORIGIN` con tu dominio

### Frontend (SPA)
Recomendaciones:
- **Vercel**, **Netlify**, **GitHub Pages**
- Actualizar `config.js` con URLs de producción
- Configurar dominio personalizado

## 🐛 Solución de Problemas

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongosh

# O iniciar MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Error de CORS
Verifica que `CORS_ORIGIN` en `.env` incluya tu dominio frontend.

### TinyMCE no carga
Verifica que hayas agregado `localhost` y `127.0.0.1` a los dominios aprobados en https://www.tiny.cloud/my-account/domains/

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Saúl Turbi**
- Email: stechblog.office@gmail.com
- Blog: [S-Tech Blog](#)

## 🙏 Agradecimientos

- [TinyMCE](https://www.tiny.cloud/) por el editor WYSIWYG
- [Phosphor Icons](https://phosphoricons.com/) por los iconos
- [MongoDB](https://www.mongodb.com/) por la base de datos
- [Express.js](https://expressjs.com/) por el framework backend

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
