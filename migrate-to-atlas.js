// Exportar datos de MongoDB local a Atlas
const mongoose = require('mongoose');
require('dotenv').config();

// Modelos
const Post = require('./src/models/post.model');
const User = require('./src/models/user.model');
const Subscriber = require('./src/models/subscriber.model');

// Conexiones
const LOCAL_URI = 'mongodb://127.0.0.1:27017/stechblog';
const ATLAS_URI = process.env.MONGO_URI_ATLAS; // Agregar esta variable en .env temporalmente

async function migrateData() {
  try {
    console.log('🔄 Iniciando migración...');

    // Conectar a local
    console.log('📥 Conectando a MongoDB local...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    
    // Obtener modelos de local
    const LocalPost = localConn.model('Post', Post.schema);
    const LocalUser = localConn.model('User', User.schema);
    const LocalSubscriber = localConn.model('Subscriber', Subscriber.schema);

    // Obtener datos
    const posts = await LocalPost.find();
    const users = await LocalUser.find();
    const subscribers = await LocalSubscriber.find();

    console.log(`✅ Datos locales obtenidos:`);
    console.log(`   - Posts: ${posts.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Subscribers: ${subscribers.length}`);

    // Cerrar conexión local
    await localConn.close();

    // Conectar a Atlas
    console.log('\n📤 Conectando a MongoDB Atlas...');
    await mongoose.connect(ATLAS_URI);

    // Insertar datos en Atlas
    console.log('💾 Migrando datos a Atlas...');
    
    if (users.length > 0) {
      await User.insertMany(users);
      console.log(`✅ ${users.length} usuarios migrados`);
    }

    if (posts.length > 0) {
      await Post.insertMany(posts);
      console.log(`✅ ${posts.length} posts migrados`);
    }

    if (subscribers.length > 0) {
      await Subscriber.insertMany(subscribers);
      console.log(`✅ ${subscribers.length} suscriptores migrados`);
    }

    console.log('\n🎉 ¡Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

// Ejecutar migración
migrateData();
