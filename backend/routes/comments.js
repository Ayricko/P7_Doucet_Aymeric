const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const commentCtrl = require('../controllers/commentCtrl');

router.post('/:PostId/new/', auth, commentCtrl.createComment);
router.get('/:PostId/byPost/', auth, commentCtrl.getComments);
router.get('/signaled/', auth, commentCtrl.getCommentsSignaled);
router.put('/:CommentId/', auth, commentCtrl.updateComment);
router.delete('/:CommentId/', auth, commentCtrl.deleteComment);
router.put('/:CommentId/signale/', auth, commentCtrl.signaleComment);
router.put('/:CommentId/deleteSignale/', auth, commentCtrl.deleteSignaleComment);

module.exports = router;
