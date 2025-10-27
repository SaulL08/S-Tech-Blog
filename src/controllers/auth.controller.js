
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    // Buscar usuario en la base de datos
    const user = await User.findOne({ email: email.toLowerCase(), active: true });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar password con hash almacenado
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'secretkey-stech-2025',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    // Si llega aquí, el middleware ya validó el token
    res.json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

exports.generateHash = async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password requerido' });
  }
  const hash = await bcrypt.hash(password, 10);
  res.json({ hash });
};
