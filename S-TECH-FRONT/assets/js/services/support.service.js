// Servicio de soporte y contacto
import { apiUrl } from '../config.js';
import { toast } from '../core/toast.js';

/**
 * Envía un mensaje de soporte
 * @param {Object} data - Datos del mensaje
 * @param {string} data.name - Nombre del usuario
 * @param {string} data.email - Email del usuario
 * @param {string} data.subject - Asunto del mensaje
 * @param {string} data.message - Mensaje
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function sendSupportMessage(data) {
  try {
    const response = await fetch(apiUrl('/support/contact'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al enviar el mensaje');
    }

    toast.success('Mensaje enviado correctamente. Te responderemos pronto.');
    return result;
  } catch (error) {
    console.error('Error al enviar mensaje de soporte:', error);
    toast.error(error.message || 'Error al enviar el mensaje. Intenta nuevamente.');
    throw error;
  }
}

/**
 * Reporta un problema técnico
 * @param {Object} data - Datos del problema
 * @param {string} data.email - Email del usuario
 * @param {string} data.problemType - Tipo de problema
 * @param {string} data.description - Descripción del problema
 * @param {string} data.url - URL donde ocurrió el problema
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function reportProblem(data) {
  try {
    const response = await fetch(apiUrl('/support/report'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al reportar el problema');
    }

    toast.success('Problema reportado. Trabajaremos en solucionarlo pronto.');
    return result;
  } catch (error) {
    console.error('Error al reportar problema:', error);
    toast.error(error.message || 'Error al reportar el problema. Intenta nuevamente.');
    throw error;
  }
}
