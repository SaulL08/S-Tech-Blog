
const Subscriber = require('../models/subscriber.model');
const { sendTestEmail } = require('../services/email.service');

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requerido' });
    }

    // Verificar si ya existe
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.active) {
        return res.status(200).json({ message: 'Ya estás suscrito', alreadySubscribed: true });
      } else {
        // Reactivar suscripción
        existing.active = true;
        await existing.save();
        await sendTestEmail(email);
        return res.json({ message: 'Suscripción reactivada exitosamente' });
      }
    }

    // Crear nueva suscripción
    const subscriber = await Subscriber.create({ email: email.toLowerCase() });
    
    // Enviar email de confirmación
    await sendTestEmail(email);

    res.status(201).json({ 
      message: 'Suscripción exitosa. Revisa tu email para confirmar.',
      subscriber: { email: subscriber.email }
    });
  } catch (error) {
    next(error);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requerido' });
    }

    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (!subscriber) {
      return res.status(404).json({ message: 'Email no encontrado' });
    }

    subscriber.active = false;
    await subscriber.save();

    res.json({ message: 'Te has desuscrito exitosamente' });
  } catch (error) {
    next(error);
  }
};

exports.getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find({ active: true });
    res.json({ 
      total: subscribers.length,
      subscribers 
    });
  } catch (error) {
    next(error);
  }
};
