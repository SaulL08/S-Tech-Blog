
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { verifyToken } = require('../middlewares/auth');

router.get('/', postController.getAllPosts);
router.post('/', verifyToken, postController.createPost);

// Rutas de comentarios ANTES de /:id para evitar conflictos
router.post('/:id/comments', postController.addComment);
router.get('/:id/comments', postController.getComments);
router.post('/:id/comments/:commentId/like', postController.likeComment);
router.post('/:id/like', postController.likePost);
router.post('/:id/view', postController.incrementViews);

// Rutas genéricas de posts al final
router.get('/:id', postController.getPostById);
router.put('/:id', verifyToken, postController.updatePost);
router.delete('/:id', verifyToken, postController.deletePost);

module.exports = router;