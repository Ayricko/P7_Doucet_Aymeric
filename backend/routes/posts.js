const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postsCtrl = require('../controllers/postsCtrl');

router.post('/new/', auth, postsCtrl.createPost);
router.get('/', postsCtrl.getPosts);
router.get('/:PostId/', postsCtrl.getOnePost);
router.put('/:PostId/', auth, postsCtrl.updatePost);
router.delete('/:PostId/', auth, postsCtrl.deletePost);
router.put('/:PostId/signale/', postsCtrl.signalePost);
router.put('/:PostId/deleteSignale/', postsCtrl.deleteSignalePost);

module.exports = router;
