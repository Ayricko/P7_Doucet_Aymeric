const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const commentCtrl = require('../controllers/commentCtrl');

router.post('/:PostId/new/', auth, commentCtrl.createComment);
router.get('/', commentCtrl.getComments);
router.put('/:CommentId/', auth, commentCtrl.updateComment);
router.delete('/:CommentId/', auth, commentCtrl.deleteComment);
router.put('/:CommentId/signale/', commentCtrl.signaleComment);
router.put('/:CommentId/deleteSignale/', commentCtrl.deleteSignaleComment);

module.exports = router;
