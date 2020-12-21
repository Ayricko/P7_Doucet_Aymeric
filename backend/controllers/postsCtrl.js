// Imports
const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

// Constants
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 3;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
  createPost: (req, res) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // Params
    const title = req.body.title;
    const content = req.body.content;

    if (title == null || content == null) {
      return res.status(400).json({ error: 'missing parameters' });
    }
    if (title <= TITLE_LIMIT || content <= CONTENT_LIMIT) {
      return res.status(400).json({ error: 'invalid parameters' });
    }
    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            where: { id: userId },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch((err) => {
              return res.status(500).json({ error: 'unable to verify user' });
            });
        },
        (userFound, done) => {
          if (userFound) {
            models.Post.create({
              title: title,
              content: content,
              likes: 0,
              UserId: userFound.id,
            }).then((newPost) => {
              done(newPost);
            });
          } else {
            return res.status(404).json({ error: 'user not found' });
          }
        },
      ],
      (newPost) => {
        if (newPost) {
          return res.status(201).json(newPost);
        } else {
          return res.status(500).json({ error: 'cannot post this Post' });
        }
      }
    );
  },
  getPosts: (req, res) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    models.Post.findAll({
      order: [order != null ? order.split(':') : ['createdAt', 'DESC']],
      attirbutes: fields !== '*' && fields != null ? fields.split(',') : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName'],
        },
      ],
    })
      .then((posts) => {
        if (posts) {
          res.status(200).json(posts);
        } else {
          res.status(404).json({ error: 'no posts found' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'invalid fields' });
      });
  },
  updatePost: (req, res) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // Params
    const content = req.body.content;
    const title = req.body.title;
    const postId = parseInt(req.params.PostId);

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['id', 'firstName', 'lastName'],
            where: { id: userId },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
        },
        (userFound, done) => {
          if (userFound) {
            models.Post.findOne({
              attributes: ['id', 'title', 'content', 'UserId'],
              where: { id: postId },
            })
              .then((post) => {
                done(null, post, userFound);
              })
              .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
          } else {
            res.status(404).json({ error: 'user not found' });
          }
        },
        (post, userFound, done) => {
          if (post.UserId === userFound.id) {
            post
              .update({
                title: title ? title : post.title,
                content: content ? content : post.content,
              })
              .then(() => {
                done(post);
              })
              .catch((err) => {
                res.status(500).json({ error: 'cannot update post' });
              });
          } else {
            res.status(404).json({ error: 'This user is not allowed to update this post' });
          }
        },
      ],
      (post) => {
        if (post) {
          return res.status(201).json(post);
        } else {
          return res.status(500).json({ error: 'cannot update post' });
        }
      }
    );
  },

  deletePost: (req, res) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // Params
    const postId = parseInt(req.params.PostId);

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['id'],
            where: { id: userId },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
        },
        (userFound, done) => {
          if (userFound) {
            models.Post.findOne({
              attributes: ['id', 'UserId'],
              where: { id: postId },
            })
              .then((post) => {
                done(null, post, userFound);
              })
              .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
          } else {
            res.status(404).json({ error: 'user not found' });
          }
        }, // recupère les commentaire lié au post, supprimer les commentaire, et ensuite supprimer
        (post, userFound, done) => {
          if (post.UserId === userFound.id) {
            post.destroy(post);
            res.status(200).json({ message: 'Post deleted' });
          } else {
            res.status(404).json({ error: 'This user is not allowed to delete this post' });
          }
        },
      ],
      (post) => {
        if (post) {
          return res.status(201).json(post);
        } else {
          return res.status(500).json({ error: 'cannot delete post' });
        }
      }
    );
  },
};
