const emailService = require('../services/email.service');

/**
 * Enviar mensaje de contacto
 */
exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validaciones
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Enviar email al equipo de soporte
    await emailService.sendSupportEmail({
      name,
      email,
      subject,
      message
    });

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente. Te responderemos pronto.'
    });
  } catch (error) {
    console.error('Error al enviar mensaje de contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje. Intenta nuevamente.'
    });
  }
};

/**
 * Reportar problema técnico
 */
exports.reportProblem = async (req, res) => {
  try {
    const { email, problemType, description, url, userAgent, timestamp } = req.body;

    // Validaciones
    if (!email || !problemType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Email, tipo de problema y descripción son requeridos'
      });
    }

    // Enviar email al equipo técnico
    await emailService.sendProblemReport({
      email,
      problemType,
      description,
      url,
      userAgent,
      timestamp
    });

    res.json({
      success: true,
      message: 'Problema reportado correctamente. Trabajaremos en solucionarlo.'
    });
  } catch (error) {
    console.error('Error al reportar problema:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reportar el problema. Intenta nuevamente.'
    });
  }
};
