// Imports
const models = require('../models');
const asyncLib = require('async');

// Routes
module.exports = {
  createComment: (req, res) => {
    // Getting userId decoded from middleware auth
    const userId = req.userId;

    asyncLib.waterfall(
      [
        (done) => {
          models.Post.findOne({
            where: { id: req.params.PostId },
          })
            .then((postFound) => {
              done(null, postFound);
            })
            .catch((err) => {
              return res.status(500).json({ error: 'imposible de trouver le post' });
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
              .catch((err) => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
          } else {
            res.status(404).json({ error: 'Imposible de trouver cet utilisateur' });
          }
        },
        (postFound, userFound, done) => {
          if (postFound && userFound) {
            models.Comment.create({
              content: req.body.content,
              signale: 0,
              UserId: userFound.id,
              PostId: postFound.id,
            })
              .then((newComment) => {
                done(newComment);
              })
              .catch((err) => res.status(500).json({ error: 'Impossible de publier ce commentaire' }));
          } else {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
          }
        },
      ],
      (newComment) => {
        if (newComment) {
          return res.status(200).json(newComment);
        } else {
          return res.status(500).json({ error: 'Impossible de publier ce commentaire' });
        }
      }
    );
  },

  getComments: (req, res) => {
    models.Comment.findAll({
      where: { postId: req.params.PostId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'avatar'],
        },
      ],
    })
      .then((comments) => {
        if (comments) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({ error: 'Aucun commentaire trouvé' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Problème serveur' });
      });
  },

  updateComment: (req, res) => {
    // Getting userId decoded from middleware auth
    const userId = req.userId;

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
            models.Comment.findOne({
              attributes: ['id', 'content', 'UserId'],
              where: { id: req.params.CommentId },
            })
              .then((comment) => {
                done(null, comment, userFound);
              })
              .catch((err) => res.status(500).json({ error: 'Impossible de trouver le commentaire' }));
          } else {
            res.status(404).json({ error: 'Utilisateur introuvable' });
          }
        },
        (comment, userFound, done) => {
          if (comment.UserId === userFound.id || userFound.isAdmin === true) {
            comment
              .update({
                content: req.body.content ? req.body.content : comment.content,
              })
              .then(() => {
                done(comment);
              })
              .catch((err) => {
                res.status(500).json({ error: 'Impossible de modifier ce commentaire' });
              });
          } else {
            res.status(404).json({ error: "Cet utilisateur n'est pas autorisé a modifier ce commentaire" });
          }
        },
      ],
      (comment) => {
        if (comment) {
          return res.status(201).json(comment);
        } else {
          return res.status(500).json({ error: 'Impossible de modifier ce commentaire' });
        }
      }
    );
  },

  getCommentsSignaled: (req, res) => {
    models.Comment.findAll({
      where: { signale: true },
      order: [['createdAt', 'DESC']],
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
          res.status(404).json({ error: 'Aucun commentaire trouvé' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Problème serveur' });
      });
  },

  deleteComment: (req, res) => {
    // Getting userId decoded from middleware auth
    const userId = req.userId;

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
            .catch((err) => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
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
              .catch((err) => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
          } else {
            res.status(404).json({ error: 'Utilisateur introuvable' });
          }
        },
        (comment, userFound, done) => {
          if (comment.UserId === userFound.id || userFound.isAdmin === true) {
            comment.destroy(comment);
            res.status(200).json({ message: 'Commentaire supprimé' });
          } else {
            res.status(404).json({ error: "Cet utilisateur n'est pas autorisé a supprimer ce commentaire" });
          }
        },
      ],
      (comment) => {
        if (comment) {
          return res.status(201).json(comment);
        } else {
          return res.status(500).json({ error: 'Impossible de supprimer le commentaire' });
        }
      }
    );
  },

  signaleComment: (req, res) => {
    // Params
    const signale = true;

    asyncLib.waterfall(
      [
        (done) => {
          models.Comment.findOne({
            attributes: ['id', 'signale'],
            where: { id: req.params.CommentId },
          })
            .then((comment) => {
              done(null, comment);
            })
            .catch((err) => res.status(500).json({ error: 'Impossible de trouver le commentaire' }));
        },
        (comment, done) => {
          comment
            .update({
              signale: req.body.signale,
            })
            .then(() => {
              done(comment);
            })
            .catch((err) => {
              res.status(500).json({ error: 'Impossible de signaler le commentaire' });
            });
        },
      ],
      (comment) => {
        if (comment) {
          return res.status(201).json(comment);
        } else {
          return res.status(500).json({ error: 'Impossible de signaler le commentaire' });
        }
      }
    );
  },
  deleteSignaleComment: (req, res) => {
    // Params
    const signale = -1;

    asyncLib.waterfall(
      [
        (done) => {
          models.Comment.findOne({
            attributes: ['id', 'signale'],
            where: { id: req.params.CommentId },
          })
            .then((comment) => {
              done(null, comment);
            })
            .catch((err) => res.status(500).json({ error: 'Impossible de trouver le commentaire' }));
        },
        (comment, done) => {
          comment
            .update({
              signale: req.body.signale,
            })
            .then(() => {
              done(comment);
            })
            .catch((err) => {
              res.status(500).json({ error: 'Impossible de supprimer le signalement' });
            });
        },
      ],
      (comment) => {
        if (comment) {
          return res.status(201).json(comment);
        } else {
          return res.status(500).json({ error: 'Impossible de supprimer le signalement' });
        }
      }
    );
  },
};
