
const path = require('path');
const fs = require('fs');

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Archivo subido exitosamente',
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Archivo eliminado' });
    } else {
      res.status(404).json({ message: 'Archivo no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};
