const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postsCtrl = require('../controllers/postsCtrl');

router.post('/new/', auth, multer, postsCtrl.createPost);
router.get('/', auth, postsCtrl.getPosts);
router.get('/signaled', auth, postsCtrl.getPostsSignaled);
router.put('/:PostId/', auth, multer, postsCtrl.updatePost);
router.delete('/:PostId/', auth, postsCtrl.deletePost);
router.put('/:PostId/signale/', auth, postsCtrl.signalePost);
router.put('/:PostId/deleteSignale/', auth, postsCtrl.deleteSignalePost);

module.exports = router;
