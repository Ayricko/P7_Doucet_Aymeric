const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/commentCtrl');

router.post('/:PostId/new/', commentCtrl.createComment);
router.get('/', commentCtrl.getComments);
router.put('/:CommentId/', commentCtrl.updateComment);
router.delete('/:CommentId/', commentCtrl.deleteComment);
router.put('/:CommentId/signale/', commentCtrl.signaleComment);
router.put('/:CommentId/deleteSignale/', commentCtrl.deleteSignaleComment);

module.exports = router;
