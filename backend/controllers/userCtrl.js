// Imports
const models = require('../models');
const asyncLib = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/;
const NAME_REGEX = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

// Routes
module.exports = {
  register: (req, res) => {
    // Params
    const Email = req.body.email;
    const LastName = req.body.lastName;
    const FirstName = req.body.firstName;
    const Password = req.body.password;
    const Avatar = null;

    if (Email == '' || LastName == '' || FirstName == '' || Password == '') {
      return res.status(400).json({ error: "Veuillez saisir les champs nécessaire à l'inscription" });
    }

    if (LastName.length <= 2 || !NAME_REGEX.test(LastName)) {
      return res.status(400).json({ error: 'Votre nom doit contenir au minimum 2 caractères' });
    }
    if (FirstName.length <= 2 || !NAME_REGEX.test(FirstName)) {
      return res.status(400).json({ error: 'Votre prénom doit contenir au minimum 2 caractères' });
    }

    if (!EMAIL_REGEX.test(Email)) {
      return res.status(400).json({ error: "Le format de cet email n'est pas valide" });
    }

    if (!PASSWORD_REGEX.test(Password)) {
      return res.status(400).json({ error: 'Le mot de passe doit être un alphanumérique avec un minimum de 8 caractères' });
    }

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['email'],
            where: { email: Email },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch(() => res.status(500).json({ error: "Impossible de vérifier l'utilisateur" }));
        },
        (userFound, done) => {
          if (!userFound) {
            bcrypt.hash(Password, 5, (_err, bcryptedPassword) => {
              done(null, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: 'Ce compte existe déjà!' });
          }
        },
        (bcryptedPassword, done) => {
          models.User.create({
            email: Email,
            lastName: LastName,
            firstName: FirstName,
            password: bcryptedPassword,
            avatar: Avatar,
            isAdmin: 0,
          })
            .then((newUser) => {
              done(newUser);
            })
            .catch(() => res.status(500).json({ error: "Impossible d'enregistrer l'utilisateur" }));
        },
      ],
      (newUser) => {
        if (newUser) {
          return res.status(201).json({
            // userId: newUser.id,
            token: jwt.sign(
              {
                userId: newUser.id,
              },
              '$2y$10$y.V7MlX.fKDZuVsUsTnVBeKLpFHssV9AM7SSWSJJYE1Ij0MAgnUxW;',
              {
                expiresIn: '1h',
              }
            ),
          });
        } else {
          return res.status(500).json({ error: "Impossible d'enregistrer l'utilisateur" });
        }
      }
    );
  },

  login: (req, res) => {
    // Params
    const Email = req.body.email;
    const Password = req.body.password;

    if (Email === '' || Password === '') {
      return res.status(400).json({ error: "Veuillez saisir les champs nécessaire à l'authentification" });
    }

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            where: { email: Email },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch(() => res.status(500).json({ error: 'Impossible de vérifier votre compte' }));
        },
        (userFound, done) => {
          if (userFound) {
            bcrypt.compare(Password, userFound.password, (errBycrypt, resBycrypt) => {
              done(null, userFound, resBycrypt);
            });
          } else {
            return res.status(404).json({ error: "Cet email n'existe pas dans notre base de donnée" });
          }
        },
        (userFound, resBycrypt, done) => {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: 'Le mot de passe saisi est incorrect' });
          }
        },
      ],
      (userFound) => {
        if (userFound) {
          return res.status(200).json({
            // userId: userFound.id,
            token: jwt.sign(
              {
                userId: userFound.id,
              },
              '$2y$10$y.V7MlX.fKDZuVsUsTnVBeKLpFHssV9AM7SSWSJJYE1Ij0MAgnUxW;',
              {
                expiresIn: '1h',
              }
            ),
          });
        } else {
          return res.status(500).json({ error: 'Impossible de connecter cet utilisateur' });
        }
      }
    );
  },

  getUserProfile: (req, res) => {
    // Getting userId decoded from middleware auth
    const UserIdDecoded = req.userId;
    models.User.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'avatar'],
      where: { id: UserIdDecoded },
    })
      .then((user) => {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: 'Utilisateur introuvable' });
        }
      })
      .catch(() => {
        res.status(501).json({ error: 'Impossible de trouver cet utilisateur' });
      });
  },

  updateUserProfile: (req, res) => {
    // Getting userId decoded from middleware auth
    const UserIdDecoded = req.userId;

    // Params
    let Avatar = '';
    const FirstName = req.body.firstName;
    const LastName = req.body.lastName;
    if (FirstName !== '' && !NAME_REGEX.test(FirstName)) {
      return res.status(400).json({ error: 'Votre prénom doit contenir au minimum 2 caractères sans caractères spéciaux' });
    }
    if (LastName !== '' && !NAME_REGEX.test(LastName)) {
      return res.status(400).json({ error: 'Votre nom doit contenir au minimum 2 caractères sans caractères spéciaux' });
    }
    if (req.file) {
      Avatar = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['id', 'firstName', 'lastName', 'avatar'],
            where: { id: UserIdDecoded },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch(() => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
        },
        (userFound, done) => {
          if (userFound) {
            if (userFound.avatar && req.file) {
              const oldAvatar = userFound.avatar.split('/images')[1];
              fs.unlink(`images/${oldAvatar}`, () => {
                userFound
                  .update({
                    firstName: FirstName ? FirstName : userFound.firstName,
                    lastName: LastName ? LastName : userFound.lastName,
                    avatar: Avatar ? Avatar : userFound.avatar,
                  })
                  .then(() => {
                    done(userFound);
                  })
                  .catch(() => {
                    res.status(500).json({ error: 'cannot update user' });
                  });
              });
            } else {
              userFound
                .update({
                  firstName: FirstName ? FirstName : userFound.firstName,
                  lastName: LastName ? LastName : userFound.lastName,
                  avatar: Avatar ? Avatar : userFound.avatar,
                })
                .then(() => {
                  done(userFound);
                })
                .catch(() => {
                  res.status(500).json({ error: 'cannot update user' });
                });
            }
          } else {
            res.status(404).json({ error: 'Utilisateur introuvable' });
          }
        },
      ],
      (userFound) => {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res.status(500).json({ error: 'cannot update user profile' });
        }
      }
    );
  },

  deleteUserProfile: (req, res) => {
    // Getting userId decoded from middleware auth
    const UserIdDecoded = req.userId;

    models.User.findOne({
      where: { id: UserIdDecoded },
    })
      .then((user) => {
        if (user) {
          if (user.avatar) {
            const avatarName = user.avatar.split('/images')[1];
            fs.unlink(`images/${avatarName}`, () => {
              user.destroy(user);
              res.status(200).json({ message: 'Utilisateur supprimé' });
            });
          } else {
            user.destroy(user);
            res.status(200).json({ message: 'Utilisateur supprimé' });
          }
        } else {
          res.status(404).json({ error: 'Utilisateur introuvable' });
        }
      })
      .catch(() => {
        res.status(500).json({ error: "Imposible de charger l'utilisateur" });
      });
  },
};
