// Imports
const express = require('express');
const usersCtrl = require('./routes/userCtrl');
const postsCtrl = require('./routes/postsCtrl');

// Router
exports.router = (() => {
  const apiRouter = express.Router();

  // Users Routes
  apiRouter.route('/users/register/').post(usersCtrl.register);
  apiRouter.route('/users/login/').post(usersCtrl.login);
  apiRouter.route('/users/profile/').get(usersCtrl.getUserProfile);
  apiRouter.route('/users/profile/').put(usersCtrl.updateUserProfile);

  // Posts Routes
  apiRouter.route('/posts/new/').post(postsCtrl.createPost);
  apiRouter.route('/posts/').get(postsCtrl.listPost);

  return apiRouter;
})();
