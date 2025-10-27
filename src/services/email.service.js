
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendNewArticleNotification(subscribers, article) {
  const emailPromises = subscribers.map(subscriber => {
    const mailOptions = {
      from: `"S-Tech Blog" <${process.env.EMAIL_USER}>`,
      to: subscriber.email,
      subject: `📰 Nuevo artículo: ${article.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .badge { display: inline-block; background: #22d3ee; color: #001122; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 10px; }
            .title { font-size: 24px; font-weight: bold; margin: 15px 0; color: #1e293b; }
            .excerpt { color: #64748b; margin: 15px 0; font-size: 16px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
            .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px; }
            .unsubscribe { color: #64748b; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>S-Tech Blog</h1>
              <p>Nuevo contenido disponible</p>
            </div>
            <div class="content">
              <span class="badge">${article.cat}</span>
              <h2 class="title">${article.title}</h2>
              <p class="excerpt">${article.excerpt}</p>
              <p><strong>Por ${article.author}</strong> • ${article.read} de lectura</p>
              <a href="http://localhost:5500/#/articulo/${article._id}" class="button">Leer Artículo Completo →</a>
            </div>
            <div class="footer">
              <p>Estás recibiendo este email porque te suscribiste a las notificaciones de S-Tech Blog.</p>
              <p>Puedes <a href="#" class="unsubscribe">cancelar tu suscripción</a> en cualquier momento.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return transporter.sendMail(mailOptions);
  });

  try {
    await Promise.all(emailPromises);
    return { success: true, sent: subscribers.length };
  } catch (error) {
    console.error('Error enviando emails:', error);
    return { success: false, error: error.message };
  }
}

async function sendTestEmail(email) {
  const mailOptions = {
    from: `"S-Tech Blog" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✅ Suscripción confirmada - S-Tech Blog',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>¡Bienvenido a S-Tech Blog!</h1>
          </div>
          <div class="content">
            <h2>Suscripción Confirmada</h2>
            <p>Gracias por suscribirte a nuestro blog de tecnología.</p>
            <p>A partir de ahora recibirás notificaciones cuando publiquemos nuevos artículos sobre:</p>
            <ul>
              <li>Programación y Desarrollo</li>
              <li>Inteligencia Artificial</li>
              <li>Ciberseguridad</li>
              <li>Cloud Computing</li>
              <li>Gadgets y Noticias Tech</li>
            </ul>
            <p><strong>¡Nos vemos pronto!</strong></p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Enviar email de soporte
 */
async function sendSupportEmail({ name, email, subject, message }) {
  const mailOptions = {
    from: `"S-Tech Blog Soporte" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `[Contacto] ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
          .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }
          .value { margin-top: 5px; color: #1e293b; }
          .message-box { background: #f1f5f9; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nuevo Mensaje de Contacto</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">De:</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Asunto:</div>
              <div class="value">${subject}</div>
            </div>
            <div class="message-box">
              <div class="label">Mensaje:</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
              Este email fue enviado desde el formulario de contacto de S-Tech Blog.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Enviar reporte de problema técnico
 */
async function sendProblemReport({ email, problemType, description, url, userAgent, timestamp }) {
  const problemTypes = {
    error_carga: 'Error al cargar página',
    error_login: 'Problema con inicio de sesión',
    error_articulo: 'Error en artículo',
    error_comentarios: 'Problema con comentarios',
    error_busqueda: 'Error en búsqueda',
    error_responsive: 'Problema de visualización',
    otro: 'Otro'
  };

  const mailOptions = {
    from: `"S-Tech Blog Soporte" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `[Bug Report] ${problemTypes[problemType] || 'Problema técnico'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #fef2f2; }
          .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin: 15px 0; }
          .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }
          .value { margin-top: 5px; color: #1e293b; }
          .badge { display: inline-block; background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .description-box { background: #fef2f2; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; }
          .tech-info { background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 12px; color: #475569; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⚠️ Reporte de Problema Técnico</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Tipo de Problema:</div>
              <div class="value">
                <span class="badge">${problemTypes[problemType] || 'Otro'}</span>
              </div>
            </div>
            <div class="field">
              <div class="label">Reportado por:</div>
              <div class="value">${email}</div>
            </div>
            ${url ? `
            <div class="field">
              <div class="label">URL:</div>
              <div class="value"><a href="${url}">${url}</a></div>
            </div>
            ` : ''}
            <div class="description-box">
              <div class="label">Descripción del Problema:</div>
              <div class="value">${description.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="tech-info">
              <strong>Información Técnica:</strong><br>
              <strong>User Agent:</strong> ${userAgent || 'No disponible'}<br>
              <strong>Timestamp:</strong> ${timestamp ? new Date(timestamp).toLocaleString('es-ES') : new Date().toLocaleString('es-ES')}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
              Este reporte fue enviado automáticamente desde el sistema de soporte de S-Tech Blog.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendNewArticleNotification,
  sendTestEmail,
  sendSupportEmail,
  sendProblemReport
};
