// Imports
const models = require('../models');
const asyncLib = require('async');

// Constants
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 3;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
  createPost: (req, res) => {
    let imageUrl = '';
    // Getting userId decoded from middleware auth
    const userId = req.userId;
    // Params
    const title = req.body.title;
    const content = req.body.content;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

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
              signale: 0,
              UserId: userFound.id,
              imageUrl: imageUrl,
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
      attributes: fields !== '*' && fields != null ? fields.split(',') : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'avatar'],
        },
        {
          model: models.Comment,
          order: ['createdAt', 'DESC'],
          attributes: ['id', 'content', 'userId', 'createdAt', 'signale'],
          include: [
            {
              model: models.User,
              attributes: ['firstName', 'avatar'],
            },
          ],
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
  getOnePost: (req, res) => {
    // Params
    const postId = parseInt(req.params.PostId);
    models.Post.findOne({
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName'],
        },
        {
          model: models.Comment,
          attributes: ['id', 'content', 'userId'],
        },
      ],
      where: { id: postId },
    })
      .then((post) => {
        if (post) {
          res.status(200).json(post);
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
    // Getting userId decoded from middleware auth
    const userId = req.userId;

    // Params
    const content = req.body.content;
    const title = req.body.title;
    const postId = parseInt(req.params.PostId);

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['id', 'isAdmin'],
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
          if (post.UserId === userFound.id || userFound.isAdmin === true) {
            post
              .update({
                title: title ? title : post.title,
                content: content ? content : post.content,
              })
              .then(() => {
                done(post);
              })
              .catch((err) => {
                res.status(500).json({ message: 'cannot update this post' });
              });
          } else {
            res.status(404).json({ message: 'This user is not allowed to update this fucking post' });
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
    // Getting userId decoded from middleware auth
    const userId = req.userId;

    // Params
    const postId = parseInt(req.params.PostId);

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['id', 'isAdmin'],
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
        },
        (post, userFound, done) => {
          if (post.UserId === userFound.id || userFound.isAdmin === true) {
            post.destroy(post);
            res.status(200).json({ message: 'Post deleted' });
          } else {
            res.status(404).json({ error: 'This user is not allowed to delete this post' });
            console.log(userFound);
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
  signalePost: (req, res) => {
    // Params
    const signale = 1;
    const postId = parseInt(req.params.PostId);

    asyncLib.waterfall(
      [
        (done) => {
          models.Post.findOne({
            attributes: ['id', 'signale'],
            where: { id: postId },
          })
            .then((post) => {
              done(null, post);
              console.log(post);
            })
            .catch((err) => res.status(500).json({ error: 'unable to find post' }));
        },
        (post, done) => {
          post
            .update({
              signale: signale ? signale : post.signale,
            })
            .then(() => {
              console.log(post);
              done(post);
            })
            .catch((err) => {
              res.status(500).json({ error: 'cannot signal post' });
            });
        },
      ],
      (post) => {
        if (post) {
          return res.status(201).json(post);
        } else {
          return res.status(500).json({ error: 'cannot signal post' });
        }
      }
    );
  },
  deleteSignalePost: (req, res) => {
    // Params
    const signale = -1;
    const postId = parseInt(req.params.PostId);

    asyncLib.waterfall(
      [
        (done) => {
          models.Post.findOne({
            attributes: ['id', 'signale'],
            where: { id: postId },
          })
            .then((post) => {
              done(null, post);
            })
            .catch((err) => res.status(500).json({ error: 'unable to find post' }));
        },
        (post, done) => {
          post
            .update({
              signale: signale ? signale : post.signale,
            })
            .then(() => {
              console.log(post);
              done(post);
            })
            .catch((err) => {
              res.status(500).json({ error: 'cannot delete signal post' });
            });
        },
      ],
      (post) => {
        if (post) {
          return res.status(201).json(post);
        } else {
          return res.status(500).json({ error: 'cannot  delete signal post' });
        }
      }
    );
  },
};
