
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: 'Error de validación', errors });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;