// Ver datos en MongoDB Atlas
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/user.model');
const Post = require('./src/models/post.model');
const Subscriber = require('./src/models/subscriber.model');

async function viewData() {
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado\n');

    // Ver usuarios
    const users = await User.find();
    console.log('👥 USUARIOS:');
    users.forEach(user => {
      console.log(`   📧 ${user.email} - ${user.role}`);
    });

    // Ver posts
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`\n📝 ARTÍCULOS (${posts.length}):`);
    posts.forEach(post => {
      console.log(`   📄 ${post.title}`);
      console.log(`      Autor: ${post.author} | Vistas: ${post.views}`);
      console.log(`      Fecha: ${post.createdAt.toLocaleDateString()}`);
    });

    // Ver suscriptores
    const subscribers = await Subscriber.find();
    console.log(`\n📧 SUSCRIPTORES (${subscribers.length}):`);
    subscribers.forEach(sub => {
      console.log(`   📬 ${sub.email} - ${sub.createdAt.toLocaleDateString()}`);
    });

    console.log('\n✅ Consulta completada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

viewData();
