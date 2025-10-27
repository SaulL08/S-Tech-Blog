require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./src/models/post.model');

async function initializeViews() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');

    // Inicializar views en todos los posts que no lo tengan o sea undefined
    const result = await Post.updateMany(
      { $or: [{ views: { $exists: false } }, { views: null }] },
      { $set: { views: 0 } }
    );

    console.log(`✅ Inicializadas vistas en ${result.modifiedCount} artículos`);

    // Mostrar todos los posts con sus vistas
    const posts = await Post.find({}, 'title views').sort({ createdAt: -1 });
    console.log('\n📊 Estado actual de posts:');
    posts.forEach(post => {
      console.log(`  - ${post.title}: ${post.views} vistas`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initializeViews();
