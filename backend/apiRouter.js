// Imports
const express = require('express');
const usersCtrl = require('./controllers/userCtrl');
const postsCtrl = require('./controllers/postsCtrl');
const commentCtrl = require('./controllers/commentCtrl');

// Router
exports.router = (() => {
  const apiRouter = express.Router();

  // Users Routes
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);
  apiRouter.route('/users/profile/').get(usersCtrl.getUserProfile);
  apiRouter.route('/users/profile/').put(usersCtrl.updateUserProfile);
  apiRouter.route('/users/profile/').delete(usersCtrl.deleteUserProfile);

  // Posts Routes
  apiRouter.route('/posts/new/').post(postsCtrl.createPost);
  apiRouter.route('/posts/').get(postsCtrl.getPosts);
  apiRouter.route('/posts/:PostId/').get(postsCtrl.getOnePost);
  apiRouter.route('/posts/:PostId/').put(postsCtrl.updatePost);
  apiRouter.route('/posts/:PostId/').delete(postsCtrl.deletePost);
  apiRouter.route('/posts/:PostId/signale/').put(postsCtrl.signalePost);
  apiRouter.route('/posts/:PostId/deleteSignale/').put(postsCtrl.deleteSignalePost);

  // Comments Routes
  apiRouter.route('/comments/:PostId/new/').post(commentCtrl.createComment);
  apiRouter.route('/comments/').get(commentCtrl.getComments);
  apiRouter.route('/comments/:CommentId/').put(commentCtrl.updateComment);
  apiRouter.route('/comments/:CommentId/').delete(commentCtrl.deleteComment);
  apiRouter.route('/comments/:CommentId/signale/').put(commentCtrl.signaleComment);
  apiRouter.route('/comments/:CommentId/deleteSignale/').put(commentCtrl.deleteSignaleComment);

  return apiRouter;
})();
