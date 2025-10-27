// Script para crear usuario administrador
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/user.model');

const createAdmin = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stechblog');
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ email: 'stechblog.office@gmail.com' });
    
    if (existingUser) {
      console.log('⚠️  El usuario ya existe. Actualizando contraseña...');
      
      // Actualizar contraseña
      const hashedPassword = await bcrypt.hash('Thunegrito08^', 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      
      console.log('✅ Contraseña actualizada exitosamente');
    } else {
      // Crear nuevo usuario administrador
      const hashedPassword = await bcrypt.hash('Thunegrito08^', 10);
      
      const admin = new User({
        email: 'stechblog.office@gmail.com',
        password: hashedPassword,
        name: 'Administrador S-Tech',
        role: 'admin',
        active: true
      });

      await admin.save();
      console.log('✅ Usuario administrador creado exitosamente');
    }

    console.log('\n📧 Email: stechblog.office@gmail.com');
    console.log('🔑 Contraseña: Thunegrito08^');
    console.log('👤 Rol: admin\n');

    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
