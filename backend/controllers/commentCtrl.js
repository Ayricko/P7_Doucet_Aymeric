// Imports
const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

// Constants
const CONTENT_LIMIT = 3;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
  createComment: (req, res) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // Params
    const content = req.body.content;
    const PostId = parseInt(req.params.PostId);

    if (content == null) {
      return res.status(400).json({ error: 'missing content' });
    }
    if (content <= CONTENT_LIMIT) {
      return res.status(400).json({ error: 'invalid content' });
    }
    if (PostId <= 0) {
      return res.status(400).json({ error: 'invalid parameters' });
    }

    asyncLib.waterfall(
      [
        (done) => {
          models.Post.findOne({
            where: { id: PostId },
          })
            .then((postFound) => {
              done(null, postFound);
            })
            .catch((err) => {
              return res.status(500).json({ error: 'unable to verify PostId' });
            });
        },
        (postFound, done) => {
          if (postFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then((userFound) => {
                done(null, postFound, userFound);
              })
              .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
          } else {
            res.status(404).json({ error: 'wrong PostId or UserId' });
          }
        },
        (postFound, userFound, done) => {
          if (postFound && userFound) {
            models.Comment.create({
              content: content,
              signale: 0,
              UserId: userFound.id,
              PostId: postFound.id,
            })
              .then((newComment) => {
                done(newComment);
              })
              .catch((err) => res.status(500).json({ error: 'unable to post the comment' }));
          } else {
            return res.status(404).json({ error: 'user not found' });
          }
        },
      ],
      (newComment) => {
        if (newComment) {
          return res.status(200).json(newComment);
        } else {
          return res.status(500).json({ error: 'cannot post this Comment' });
        }
      }
    );
  },

  getComments: (req, res) => {
    // Constants
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }
    models.Comment.findAll({
      order: [order != null ? order.split(':') : ['createdAt', 'DESC']],
      attributes: fields !== '*' && fields != null ? fields.split(',') : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName'],
        },
      ],
    })
      .then((comments) => {
        if (comments) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({ error: 'no comments found' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'invalid fields' });
      });
  },

  updateComment: (req, res) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // Params
    const content = req.body.content;
    const commentId = parseInt(req.params.CommentId);

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
            .catch((err) => res.status(500).json({ error: 'unable to verify this user' }));
        },
        (userFound, done) => {
          if (userFound) {
            models.Comment.findOne({
              attributes: ['id', 'content', 'UserId'],
              where: { id: commentId },
            })
              .then((comment) => {
                done(null, comment, userFound);
              })
              .catch((err) => res.status(500).json({ error: 'invalide parameters' }));
          } else {
            res.status(404).json({ error: 'user not found' });
          }
        },
        (comment, userFound, done) => {
          if (comment.UserId === userFound.id || userFound.isAdmin === true) {
            comment
              .update({
                content: content ? content : comment.content,
              })
              .then(() => {
                done(comment);
              })
              .catch((err) => {
                res.status(500).json({ error: 'cannot update comment' });
              });
          } else {
            res.status(404).json({ error: 'This user is not allowed to update this comment' });
          }
        },
      ],
      (comment) => {
        if (comment) {
          return res.status(201).json(comment);
        } else {
          return res.status(500).json({ error: 'cannot update comment content' });
        }
      }
    );
  },

  deleteComment: (req, res) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // Params
    const commentId = parseInt(req.params.CommentId);

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
            models.Comment.findOne({
              attributes: ['id', 'UserId'],
              where: { id: commentId },
            })
              .then((comment) => {
                done(null, comment, userFound);
              })
              .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
          } else {
            res.status(404).json({ error: 'user not found' });
          }
        },
        (comment, userFound, done) => {
          if (comment.UserId === userFound.id || userFound.isAdmin === true) {
            comment.destroy(comment);
            res.status(200).json({ message: 'comment deleted' });
          } else {
            res.status(404).json({ error: 'This user is not allowed to delete this comment' });
          }
        },
      ],
      (comment) => {
        if (comment) {
          return res.status(201).json(comment);
        } else {
          return res.status(500).json({ error: 'cannot delete comment' });
        }
      }
    );
  },

  signaleComment: (req, res) => {
    // Params
    const signale = true;
    const commentId = parseInt(req.params.CommentId);

    asyncLib.waterfall(
      [
        (done) => {
          models.Comment.findOne({
            attributes: ['id', 'signale'],
            where: { id: commentId },
          })
            .then((comment) => {
              done(null, comment);
            })
            .catch((err) => res.status(500).json({ error: 'unable to find comment' }));
        },
        (comment, done) => {
          comment
            .update({
              signale: signale ? signale : comment.signale,
            })
            .then(() => {
              done(comment);
            })
            .catch((err) => {
              res.status(500).json({ error: 'cannot signal comment' });
            });
        },
      ],
      (comment) => {
        if (comment) {
          return res.status(201).json(comment);
        } else {
          return res.status(500).json({ error: 'cannot signal comment' });
        }
      }
    );
  },
  deleteSignaleComment: (req, res) => {
    // Params
    const signale = -1;
    const commentId = parseInt(req.params.CommentId);

    asyncLib.waterfall(
      [
        (done) => {
          models.Comment.findOne({
            attributes: ['id', 'signale'],
            where: { id: commentId },
          })
            .then((comment) => {
              done(null, comment);
            })
            .catch((err) => res.status(500).json({ error: 'unable to find comment' }));
        },
        (comment, done) => {
          comment
            .update({
              signale: signale ? signale : comment.signale,
            })
            .then(() => {
              done(comment);
            })
            .catch((err) => {
              res.status(500).json({ error: 'cannot signal comment' });
            });
        },
      ],
      (comment) => {
        if (comment) {
          return res.status(201).json(comment);
        } else {
          return res.status(500).json({ error: 'cannot signal comment' });
        }
      }
    );
  },
};
