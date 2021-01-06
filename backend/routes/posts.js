const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

const postsCtrl = require('../controllers/postsCtrl');

router.post('/new/', postsCtrl.createPost);
router.get('/', postsCtrl.getPosts);
router.get('/:PostId/', postsCtrl.getOnePost);
router.put('/:PostId/', postsCtrl.updatePost);
router.delete('/:PostId/', postsCtrl.deletePost);
router.put('/:PostId/signale/', postsCtrl.signalePost);
router.put('/:PostId/deleteSignale/', postsCtrl.deleteSignalePost);

module.exports = router;
