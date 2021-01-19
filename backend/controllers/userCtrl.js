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
    const email = req.body.email;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const password = req.body.password;
    const avatar = null;

    if (email == '' || lastName == '' || firstName == '' || password == '') {
      return res.status(400).json({ error: "Veuillez saisir les champs nécessaire à l'inscription" });
    }

    if (lastName.length <= 2 || !NAME_REGEX.test(lastName)) {
      return res.status(400).json({ error: 'Votre nom doit contenir au minimum 2 caractères' });
    }
    if (firstName.length <= 2 || !NAME_REGEX.test(firstName)) {
      return res.status(400).json({ error: 'Votre prénom doit contenir au minimum 2 caractères' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Le format de cet email n'est pas valide" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ error: 'Le mot de passe doit être un alphanumérique avec un minimum de 8 caractères' });
    }

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['email'],
            where: { email: email },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch((err) => res.status(500).json({ error: "Impossible de vérifier l'utilisateur" }));
        },
        (userFound, done) => {
          if (!userFound) {
            bcrypt.hash(password, 5, (err, bcryptedPassword) => {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: 'Ce compte existe déjà!' });
          }
        },
        (userFound, bcryptedPassword, done) => {
          const newUser = models.User.create({
            email: email,
            lastName: lastName,
            firstName: firstName,
            password: bcryptedPassword,
            avatar: avatar,
            isAdmin: 0,
          })
            .then((newUser) => {
              done(newUser);
            })
            .catch((err) => res.status(500).json({ error: "Impossible d'enregistrer l'utilisateur" }));
        },
      ],
      (newUser) => {
        if (newUser) {
          return res.status(201).json({
            userId: newUser.id,
            token: jwt.sign(
              {
                userId: newUser.id,
                isAdmin: newUser.isAdmin,
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
    const email = req.body.email;
    const password = req.body.password;

    if (email === '' || password === '') {
      return res.status(400).json({ error: "Veuillez saisir les champs nécessaire à l'authentification" });
    }

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            where: { email: email },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch((err) => res.status(500).json({ error: 'Impossible de vérifier votre compte' }));
        },
        (userFound, done) => {
          if (userFound) {
            bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {
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
            userId: userFound.id,
            isAdmin: userFound.isAdmin,
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
    const userId = req.userId;
    models.User.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin', 'avatar'],
      where: { id: userId },
    })
      .then((user) => {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: 'Utilisateur introuvable' });
        }
      })
      .catch((err) => {
        res.status(501).json({ error: 'Impossible de trouver cet utilisateur' });
      });
  },

  updateUserProfile: (req, res) => {
    // Getting userId decoded from middleware auth
    const userId = req.userId;

    // Params
    let avatar = '';
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    if (firstName !== '' && !NAME_REGEX.test(firstName)) {
      return res.status(400).json({ error: 'Votre prénom doit contenir au minimum 2 caractères sans caractères spéciaux' });
    }
    if (lastName !== '' && !NAME_REGEX.test(lastName)) {
      return res.status(400).json({ error: 'Votre nom doit contenir au minimum 2 caractères sans caractères spéciaux' });
    }
    if (req.file) {
      avatar = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    asyncLib.waterfall(
      [
        (done) => {
          models.User.findOne({
            attributes: ['id', 'firstName', 'lastName', 'avatar'],
            where: { id: userId },
          })
            .then((userFound) => {
              done(null, userFound);
            })
            .catch((err) => res.status(500).json({ error: 'Impossible de vérifier cet utilisateur' }));
        },
        (userFound, done) => {
          if (userFound) {
            if (userFound.avatar && req.file) {
              const oldAvatar = userFound.avatar.split('/images')[1];
              fs.unlink(`images/${oldAvatar}`, () => {
                userFound
                  .update({
                    firstName: firstName ? firstName : userFound.firstName,
                    lastName: lastName ? lastName : userFound.lastName,
                    avatar: avatar ? avatar : userFound.avatar,
                  })
                  .then(() => {
                    done(userFound);
                  })
                  .catch((err) => {
                    res.status(500).json({ error: 'cannot update user' });
                  });
              });
            } else {
              userFound
                .update({
                  firstName: firstName ? firstName : userFound.firstName,
                  lastName: lastName ? lastName : userFound.lastName,
                  avatar: avatar ? avatar : userFound.avatar,
                })
                .then(() => {
                  done(userFound);
                })
                .catch((err) => {
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
    const userId = req.userId;

    models.User.findOne({
      where: { id: userId },
    })
      .then((user) => {
        if (user) {
          if (user.avatar) {
            const avatarName = user.avatar.split('/images')[1];
            fs.unlink(`images/${avatarName}`, () => {
              user.destroy(user);
              res.status(200).json({ message: 'user deleted' });
            });
          } else {
            user.destroy(user);
            res.status(200).json({ message: 'user deleted' });
          }
        } else {
          res.status(404).json({ error: 'user not found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: 'cannot fetch user' });
      });
  },
};
