// Insertar artículos de prueba en MongoDB Atlas
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./src/models/post.model');

const articulos = [
  {
    title: "Introducción a JavaScript Moderno",
    cat: "Programación",
    excerpt: "Descubre las características más importantes de JavaScript ES6+ y cómo aprovecharlas en tus proyectos.",
    author: "S-Tech Blog",
    date: "26 Oct 2025",
    read: "5 min",
    content: `<h2>¿Qué es JavaScript Moderno?</h2>
<p>JavaScript ha evolucionado significativamente con ES6. Arrow functions, destructuring, template literals y async/await son solo algunas de las características que revolucionaron el lenguaje.</p>

<h3>Características principales:</h3>
<ul>
<li><strong>Arrow Functions:</strong> Sintaxis concisa para funciones</li>
<li><strong>Destructuring:</strong> Extracción de datos simplificada</li>
<li><strong>Template Literals:</strong> Strings con interpolación</li>
<li><strong>Async/Await:</strong> Manejo asíncrono elegante</li>
</ul>

<p>JavaScript moderno hace tu código más limpio y mantenible.</p>`,
    imageUrl: ""
  },
  {
    title: "MongoDB vs MySQL: ¿Cuál elegir?",
    cat: "Bases de Datos",
    excerpt: "Comparativa detallada entre MongoDB y MySQL para ayudarte a elegir la mejor base de datos.",
    author: "S-Tech Blog",
    date: "24 Oct 2025",
    read: "6 min",
    content: `<h2>La Gran Decisión: SQL vs NoSQL</h2>
<p>Elegir entre MongoDB y MySQL depende de tu proyecto. MongoDB ofrece flexibilidad de esquema y escala horizontal, ideal para datos no estructurados. MySQL garantiza integridad ACID y consultas complejas con JOINs.</p>

<h3>MongoDB (NoSQL)</h3>
<ul>
<li>✅ Esquema flexible</li>
<li>✅ Escalabilidad horizontal</li>
<li>✅ JSON nativo</li>
</ul>

<h3>MySQL (SQL)</h3>
<ul>
<li>✅ Integridad ACID</li>
<li>✅ Consultas complejas</li>
<li>✅ Madurez probada</li>
</ul>

<p><strong>MongoDB:</strong> Apps dinámicas, APIs REST. <strong>MySQL:</strong> Sistemas financieros, e-commerce.</p>`,
    imageUrl: ""
  },
  {
    title: "Guía Completa de Node.js",
    cat: "Backend",
    excerpt: "Aprende Node.js desde cero: instalación, conceptos básicos y tu primer servidor web.",
    author: "S-Tech Blog",
    date: "22 Oct 2025",
    read: "7 min",
    content: `<h2>¿Qué es Node.js?</h2>
<p>Node.js es un entorno de ejecución de JavaScript construido sobre V8 de Chrome. Permite ejecutar JavaScript en el servidor con alto rendimiento.</p>

<h3>Ventajas principales</h3>
<ul>
<li>🚀 Operaciones asíncronas rápidas</li>
<li>📦 NPM con millones de paquetes</li>
<li>🔄 JavaScript full-stack</li>
<li>⚡ Event-driven architecture</li>
</ul>

<h3>Tu primer servidor:</h3>
<pre><code>const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('¡Hola Node.js!');
});

server.listen(3000);</code></pre>

<p>Con Node.js creas APIs, microservicios, herramientas CLI y más.</p>`,
    imageUrl: ""
  },
  {
    title: "CSS Grid y Flexbox: Layout Moderno",
    cat: "Frontend",
    excerpt: "Aprende a crear layouts profesionales y responsivos usando CSS Grid y Flexbox.",
    author: "S-Tech Blog",
    date: "20 Oct 2025",
    read: "5 min",
    content: `<h2>El Poder del Layout Moderno</h2>
<p>CSS Grid y Flexbox revolucionaron el diseño web. Ya no necesitas hacks con floats o posicionamiento absoluto complicado.</p>

<h3>Flexbox: Layouts en 1D</h3>
<p>Perfecto para alinear elementos en una dirección:</p>
<pre><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}</code></pre>

<h3>CSS Grid: Layouts en 2D</h3>
<p>Ideal para estructuras complejas:</p>
<pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}</code></pre>

<p><strong>Flexbox:</strong> menús, cards. <strong>Grid:</strong> páginas completas, galerías.</p>`,
    imageUrl: ""
  },
  {
    title: "REST API: Mejores Prácticas",
    cat: "API Development",
    excerpt: "Diseña APIs REST profesionales siguiendo las mejores prácticas de la industria.",
    author: "S-Tech Blog",
    date: "18 Oct 2025",
    read: "6 min",
    content: `<h2>¿Qué es REST?</h2>
<p>REST (Representational State Transfer) es un estilo arquitectónico que define principios para crear APIs escalables y mantenibles.</p>

<h3>Principios fundamentales</h3>
<ol>
<li><strong>Recursos:</strong> URIs identifican recursos</li>
<li><strong>Métodos HTTP:</strong> GET, POST, PUT, DELETE</li>
<li><strong>Stateless:</strong> Peticiones independientes</li>
<li><strong>JSON:</strong> Formato estándar</li>
</ol>

<h3>Estructura de endpoints:</h3>
<pre><code>GET    /api/posts       // Todos
GET    /api/posts/:id   // Uno
POST   /api/posts       // Crear
PUT    /api/posts/:id   // Actualizar
DELETE /api/posts/:id   // Eliminar</code></pre>

<h3>Códigos HTTP:</h3>
<p>200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Error</p>`,
    imageUrl: ""
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado\n');

    await Post.deleteMany({});
    console.log('🗑️  Posts anteriores eliminados\n');

    console.log('📝 Insertando artículos de prueba...\n');
    
    for (const articulo of articulos) {
      const post = await Post.create(articulo);
      console.log(`✅ "${post.title}"`);
    }

    console.log(`\n🎉 ${articulos.length} artículos creados exitosamente!\n`);
    console.log('📊 Resumen:');
    articulos.forEach((art, i) => {
      console.log(`   ${i + 1}. ${art.title} (${art.cat})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    process.exit();
  }
}

seedDatabase();
