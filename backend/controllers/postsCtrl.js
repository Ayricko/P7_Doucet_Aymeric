// Imports
const models = require('../models');
const asyncLib = require('async');
const fs = require('fs');

// Routes
module.exports = {
  createPost: (req, res) => {
    // Getting userId decoded from middleware auth
    const UserIdDecoded = req.userId;
    // Params
    let imageUrl = '';
    const Title = req.body.title;
    const Content = req.body.content;

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    if (Title == '') {
      return res.status(400).json({ error: 'Le titre du post est obligatoire' });
    }
    if (!req.file && Content == '') {
      return res.status(400).json({ error: 'Un contenu texte ou une photo est obligatoire' });
    }
    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            where: { id: UserIdDecoded },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch(() => {
              return res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' });
            });
        },
        (userFound, done) => {
          if (userFound) {
            models.Post.create({
              title: Title,
              content: Content,
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
    models.Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: models.Comment,
          attributes: ['PostId'],
        },
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'avatar'],
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
      where: { id: req.params.PostId },
    })
      .then((post) => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ error: 'Aucun post trouvé' });
        }
      })
      .catch(() => {
        res.status(500).json({ error: 'Certains champs sont invalide' });
      });
  },
  updatePost: (req, res) => {
    // Getting userId decoded from middleware auth
    const UserIdDecoded = req.userId;

    // Params
    let ImageUrl = '';
    const Content = req.body.content;
    const Title = req.body.title;
    if (req.file) {
      ImageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['id', 'isAdmin'],
            where: { id: UserIdDecoded },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch(() => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
        },
        (userFound, done) => {
          if (userFound) {
            models.Post.findOne({
              attributes: ['id', 'title', 'content', 'UserId', 'imageUrl'],
              where: { id: req.params.PostId },
            })
              .then((post) => {
                done(null, post, userFound);
              })
              .catch(() => res.status(500).json({ error: 'Impossible de trouver ce post' }));
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
                    title: Title ? Title : post.title,
                    content: Content ? Content : post.content,
                    imageUrl: ImageUrl ? ImageUrl : post.imageUrl,
                  })
                  .then(() => {
                    done(post);
                  })
                  .catch(() => {
                    res.status(500).json({ message: 'Impossible de modifier ce post' });
                  });
              });
            } else {
              post
                .update({
                  title: Title ? Title : post.title,
                  content: Content ? Content : post.content,
                  imageUrl: ImageUrl ? ImageUrl : post.imageUrl,
                })
                .then(() => {
                  done(post);
                })
                .catch(() => {
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
    const UserIdDecoded = req.userId;

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['id', 'isAdmin'],
            where: { id: UserIdDecoded },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch(() => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
        },
        (userFound, done) => {
          if (userFound) {
            models.Post.findOne({
              attributes: ['id', 'UserId', 'imageUrl'],
              where: { id: req.params.PostId },
            })
              .then((post) => {
                done(null, post, userFound);
              })
              .catch(() => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
          } else {
            res.status(404).json({ error: 'Utilisateur introuvable' });
          }
        },
        (post, userFound) => {
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
  getPostsSignaled: (req, res) => {
    models.Post.findAll({
      where: { signale: true },
      order: [['createdAt', 'DESC']],
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
          res.status(404).json({ error: 'Aucun post trouvé' });
        }
      })
      .catch(() => {
        res.status(500).json({ error: 'Problème serveur' });
      });
  },
  signalePost: (req, res) => {
    asyncLib.waterfall(
      [
        (done) => {
          models.Post.findOne({
            attributes: ['id', 'signale'],
            where: { id: req.params.PostId },
          })
            .then((post) => {
              done(null, post);
            })
            .catch(() => res.status(500).json({ error: 'Impossible de trouver ce post' }));
        },
        (post, done) => {
          post
            .update({
              signale: req.body.signale,
            })
            .then(() => {
              done(post);
            })
            .catch(() => {
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
    asyncLib.waterfall(
      [
        (done) => {
          models.Post.findOne({
            attributes: ['id', 'signale'],
            where: { id: req.params.PostId },
          })
            .then((post) => {
              done(null, post);
            })
            .catch(() => res.status(500).json({ error: 'Impossible de trouver ce post' }));
        },
        (post, done) => {
          post
            .update({
              signale: req.body.signale,
            })
            .then(() => {
              console.log(post);
              done(post);
            })
            .catch(() => {
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
