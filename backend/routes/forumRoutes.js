const express = require('express');
const router = express.Router();
const fc = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// Public / Optional Auth Feed & Posts
router.get('/posts', fc.getForumPosts);
router.get('/posts/:id', fc.getForumPostById);
router.get('/posts/:postId/comments', fc.getForumComments);
router.get('/user-posts/:userId', fc.getUserForumPosts);

// Authenticated Actions
router.post('/posts', protect, fc.createForumPost);
router.delete('/posts/:id', protect, fc.deleteForumPost);
router.post('/posts/:id/react', protect, fc.reactToForumPost);
router.post('/posts/:postId/comments', protect, fc.addForumComment);
router.delete('/comments/:commentId', protect, fc.deleteForumComment);
router.post('/comments/:commentId/react', protect, fc.reactToForumComment);

module.exports = router;
