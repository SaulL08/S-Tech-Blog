// Configuración centralizada de la aplicación S-Tech Blog

const ENV = {
  // Detectar automáticamente el entorno
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};

// URLs de API según el entorno
const API_URLS = {
  development: 'http://localhost:4000/api',
  production: 'https://s-tech-blog-production.up.railway.app/api'
};

// URLs del frontend según el entorno
const FRONTEND_URLS = {
  development: 'http://127.0.0.1:5500',
  production: 'https://s-tech-blog.vercel.app'
};

// Configuración de la aplicación
export const CONFIG = {
  // API Base URL
  API_URL: ENV.isDevelopment ? API_URLS.development : API_URLS.production,
  
  // Frontend Base URL
  FRONTEND_URL: ENV.isDevelopment ? FRONTEND_URLS.development : FRONTEND_URLS.production,
  
  // Información de la aplicación
  APP_NAME: 'S-Tech Blog',
  APP_DESCRIPTION: 'Blog de tecnología: programación, IA, ciberseguridad, gadgets y cloud',
  AUTHOR: 'Saúl Turbi',
  
  // Email de contacto y soporte
  CONTACT_EMAIL: 'stechblog.office@gmail.com',
  SUPPORT_EMAIL: 'stechblog.office@gmail.com',
  
  // Redes sociales (agregar cuando las tengas)
  SOCIAL: {
    twitter: '',
    github: '',
    linkedin: '',
    youtube: ''
  },
  
  // Configuración de búsqueda
  SEARCH: {
    MIN_CHARS: 2,
    DEBOUNCE_MS: 300
  },
  
  // Configuración de autosave (editor)
  EDITOR: {
    AUTOSAVE_INTERVAL: 30000 // 30 segundos
  },
  
  // Configuración de paginación
  PAGINATION: {
    POSTS_PER_PAGE: 10
  },
  
  // URLs de recursos estáticos
  ASSETS: {
    IMAGES_PATH: '/S-TECH-FRONT/assets/img',
    CSS_PATH: '/S-TECH-FRONT/assets/css',
    JS_PATH: '/S-TECH-FRONT/assets/js'
  },
  
  // TinyMCE API Key
  TINYMCE_API_KEY: 'b7x20zpc7dp5gk3hhk4pbn1nmtnrlbxaczaafb2kmn985ed4',
  
  // Feature flags
  FEATURES: {
    COMMENTS_ENABLED: true,
    LIKES_ENABLED: true,
    SUBSCRIPTION_ENABLED: true,
    DARK_MODE_ENABLED: true,
    SEARCH_ENABLED: true,
    SHARE_ENABLED: true,
    SPEECH_ENABLED: true
  },
  
  // Entorno actual
  ENV: ENV.isDevelopment ? 'development' : 'production'
};

// Función helper para construir URLs de API
export function apiUrl(endpoint) {
  return `${CONFIG.API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
}

// Función helper para construir URLs de recursos
export function assetUrl(path) {
  return `${CONFIG.FRONTEND_URL}${path.startsWith('/') ? path : '/' + path}`;
}

// Función para obtener la URL completa de un artículo
export function getArticleUrl(articleId) {
  return `${CONFIG.FRONTEND_URL}/#/articulo/${articleId}`;
}

// Validar configuración al cargar
if (ENV.isProduction && !API_URLS.production) {
  console.warn('⚠️ ADVERTENCIA: URL de producción no configurada. Actualiza config.js antes de publicar.');
}

// Exportar todo como default también para importación flexible
export default CONFIG;
