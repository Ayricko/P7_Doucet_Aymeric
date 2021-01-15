// Imports
const models = require('../models');
const asyncLib = require('async');
const fs = require('fs');

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
      return res.status(400).json({ error: 'Vous avez oublié des champs' });
    }
    if (title <= TITLE_LIMIT || content <= CONTENT_LIMIT) {
      return res.status(400).json({ error: 'Certains champs sont invalides' });
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
              return res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' });
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
            return res.status(404).json({ error: 'Utilisateur introuvable' });
          }
        },
      ],
      (newPost) => {
        if (newPost) {
          return res.status(201).json(newPost);
        } else {
          return res.status(500).json({ error: 'Impossible de publier ce post' });
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
          res.status(404).json({ error: 'Aucun post trouvé' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Certains champs sont invalide' });
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
          res.status(404).json({ error: 'Aucun post trouvé' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Certains champs sont invalide' });
      });
  },
  updatePost: (req, res) => {
    // Getting userId decoded from middleware auth
    const userId = req.userId;

    // Params
    let imageUrl = '';
    const content = req.body.content;
    const title = req.body.title;
    const postId = parseInt(req.params.PostId);
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

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
            .catch((err) => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
        },
        (userFound, done) => {
          if (userFound) {
            models.Post.findOne({
              attributes: ['id', 'title', 'content', 'UserId', 'imageUrl'],
              where: { id: postId },
            })
              .then((post) => {
                done(null, post, userFound);
              })
              .catch((err) => res.status(500).json({ error: 'Impossible de trouver ce post' }));
          } else {
            res.status(404).json({ error: 'Utilisateur introuvable' });
          }
        },
        (post, userFound, done) => {
          if (post.UserId === userFound.id || userFound.isAdmin === true) {
            if (post.imageUrl && req.file) {
              const oldImageUrl = post.imageUrl.split('/images')[1];
              fs.unlink(`images/${oldImageUrl}`, () => {
                post
                  .update({
                    title: title ? title : post.title,
                    content: content ? content : post.content,
                    imageUrl: imageUrl ? imageUrl : post.imageUrl,
                  })
                  .then(() => {
                    done(post);
                  })
                  .catch((err) => {
                    res.status(500).json({ message: 'Impossible de modifier ce post' });
                  });
              });
            } else {
              post
                .update({
                  title: title ? title : post.title,
                  content: content ? content : post.content,
                  imageUrl: imageUrl ? imageUrl : post.imageUrl,
                })
                .then(() => {
                  done(post);
                })
                .catch((err) => {
                  res.status(500).json({ message: 'Impossible de modifier ce post' });
                });
            }
          } else {
            res.status(404).json({ message: "Vous n'êtes pas autorisé à modifier ce post." });
          }
        },
      ],
      (post) => {
        if (post) {
          return res.status(201).json(post);
        } else {
          return res.status(500).json({ error: 'Impossible de modifier ce post' });
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
            .catch((err) => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
        },
        (userFound, done) => {
          if (userFound) {
            models.Post.findOne({
              attributes: ['id', 'UserId', 'imageUrl'],
              where: { id: postId },
            })
              .then((post) => {
                done(null, post, userFound);
              })
              .catch((err) => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
          } else {
            res.status(404).json({ error: 'Utilisateur introuvable' });
          }
        },
        (post, userFound, done) => {
          if (post.UserId === userFound.id || userFound.isAdmin === true) {
            if (post.imageUrl) {
              const imageName = post.imageUrl.split('/images')[1];
              fs.unlink(`images/${imageName}`, () => {
                post.destroy(post);
                res.status(200).json({ message: 'Post supprimé.' });
              });
            } else {
              post.destroy(post);
              res.status(200).json({ message: 'Post supprimé.' });
            }
          } else {
            res.status(404).json({ error: "Vous n'êtes pas autorisé à supprimer ce post." });
            console.log(userFound);
          }
        },
      ],
      (post) => {
        if (post) {
          return res.status(201).json(post);
        } else {
          return res.status(500).json({ error: 'Impossible de supprimer ce post.' });
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
            .catch((err) => res.status(500).json({ error: 'Impossible de trouver ce post' }));
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
              res.status(500).json({ error: 'Impossible de signaler le post.' });
            });
        },
      ],
      (post) => {
        if (post) {
          return res.status(201).json(post);
        } else {
          return res.status(500).json({ error: 'Impossible de signaler le post.' });
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
            .catch((err) => res.status(500).json({ error: 'Impossible de trouver ce post' }));
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
              res.status(500).json({ error: 'Impossible de supprimer le signalement.' });
            });
        },
      ],
      (post) => {
        if (post) {
          return res.status(201).json(post);
        } else {
          return res.status(500).json({ error: 'Impossible de supprimer le signalement.' });
        }
      }
    );
  },
};
