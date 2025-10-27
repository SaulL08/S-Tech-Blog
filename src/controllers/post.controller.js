/**
 * Controlador de posts
 * Maneja todas las operaciones CRUD de artículos y comentarios
 */

const Post = require('../models/post.model');
const Subscriber = require('../models/subscriber.model');
const { sendNewArticleNotification } = require('../services/email.service');

/**
 * Obtiene todos los posts con opciones de filtrado
 * Soporta query params: limit (cantidad) y sort (ordenamiento)
 * Ejemplo: /api/posts?limit=5&sort=-createdAt
 */
exports.getAllPosts = async (req, res, next) => {
  try {
    const { limit, sort } = req.query;
    
    let query = Post.find();
    
    // Aplicar ordenamiento
    if (sort) {
      query = query.sort(sort);
    } else {
      query = query.sort({ createdAt: -1 }); // Por defecto: más recientes primero
    }
    
    // Aplicar límite
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const posts = await query;
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    
    // Enviar notificaciones a suscriptores (en segundo plano)
    Subscriber.find({ active: true })
      .then(subscribers => {
        if (subscribers.length > 0) {
          sendNewArticleNotification(subscribers, post)
            .then(result => console.log(`✉️ Emails enviados: ${result.sent} suscriptores`))
            .catch(err => console.error('Error enviando notificaciones:', err));
        }
      });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { name, email, text } = req.body;
    
    if (!name || !email || !text) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    post.comments.push({ name, email, text });
    await post.save();

    res.status(201).json({ message: 'Comentario agregado', comment: post.comments[post.comments.length - 1] });
  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.json(post.comments);
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    post.likes += 1;
    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    next(error);
  }
};

/**
 * Incrementa el contador de vistas de un post
 * Usa $inc para operación atómica (evita race conditions)
 */
exports.incrementViews = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    res.json({ views: post.views });
  } catch (error) {
    next(error);
  }
};

exports.likeComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    
    comment.likes += 1;
    await post.save();
    res.json({ likes: comment.likes });
  } catch (error) {
    next(error);
  }
};