// Actualizar artículos con imágenes
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./src/models/post.model');

const imagenesUnsplash = [
  'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1200&q=80', // JavaScript
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80', // Databases
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80', // Node.js
  'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&q=80', // CSS
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80', // API
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80'  // Código
];

async function updateImages() {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado\n');

    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`📝 Actualizando ${posts.length} artículos...\n`);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const imageUrl = imagenesUnsplash[i % imagenesUnsplash.length];
      
      post.imageUrl = imageUrl;
      await post.save();
      
      console.log(`✅ ${i + 1}. "${post.title}"`);
      console.log(`   Imagen: ${imageUrl.substring(0, 60)}...`);
    }

    console.log(`\n🎉 ${posts.length} artículos actualizados con imágenes!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    process.exit();
  }
}

updateImages();
