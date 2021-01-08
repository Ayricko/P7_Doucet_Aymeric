// Imports
const models = require('../models');
const asyncLib = require('async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,15}$/;

// Routes
module.exports = {
  register: (req, res) => {
    // Params
    const email = req.body.email;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const password = req.body.password;

    if (email == null || lastName == null || firstName == null || password == null) {
      return res.status(400).json({ error: 'missing parameters' });
    }

    if (lastName.length >= 13 || lastName.length <= 2) {
      return res.status(400).json({ error: 'wrong lastName (must be length 5 - 12)' });
    }
    if (firstName.length >= 13 || firstName.length <= 2) {
      return res.status(400).json({ error: 'wrong firstName (must be length 5 - 12)' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'email is not valid' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ error: 'password invalid (must length 4 - 8 and include 1 number at least)' });
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
            .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
        },
        (userFound, done) => {
          if (!userFound) {
            bcrypt.hash(password, 5, (err, bcryptedPassword) => {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: 'user already exist' });
          }
        },
        (userFound, bcryptedPassword, done) => {
          const newUser = models.User.create({
            email: email,
            lastName: lastName,
            firstName: firstName,
            password: bcryptedPassword,
            isAdmin: 0,
          })
            .then((newUser) => {
              done(newUser);
            })
            .catch((err) => res.status(500).json({ error: 'cannot add user' }));
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
          return res.status(500).json({ error: 'cannot add user' });
        }
      }
    );
  },

  login: (req, res) => {
    // Params
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: 'missing parameters' });
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
            .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
        },
        (userFound, done) => {
          if (userFound) {
            bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {
              done(null, userFound, resBycrypt);
            });
          } else {
            return res.status(404).json({ error: 'user not exist in DB' });
          }
        },
        (userFound, resBycrypt, done) => {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: 'invalid password' });
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
          return res.status(500).json({ error: 'cannot log on user' });
        }
      }
    );
  },

  getUserProfile: (req, res) => {
    // Getting userId decoded from middleware auth
    const userId = req.userId;
    models.User.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin'],
      where: { id: userId },
    })
      .then((user) => {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: 'user not found' });
        }
      })
      .catch((err) => {
        res.status(501).json({ error: 'cannot fetch user' });
      });
  },

  updateUserProfile: (req, res) => {
    // Getting userId decoded from middleware auth
    const userId = req.userId;

    // Params
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

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
            bcrypt.hash(password, 5, (err, bcryptedPassword) => {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: 'user already exist' });
          }
        },
        (userFound, bcryptedPassword, done) => {
          if (userFound) {
            userFound
              .update({
                firstName: firstName ? firstName : userFound.firstName,
                lastName: lastName ? lastName : userFound.lastName,
                password: bcryptedPassword,
              })
              .then(() => {
                done(userFound);
              })
              .catch((err) => {
                res.status(500).json({ error: 'cannot update user' });
              });
          } else {
            res.status(404).json({ error: 'user not found' });
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

    if (userId < 0) return res.status(400).json({ error: 'wrong token' });

    models.User.findOne({
      where: { id: userId },
    })
      .then((user) => {
        if (user) {
          user.destroy(user);
          res.status(200).json({ message: 'user deleted' });
        } else {
          res.status(404).json({ error: 'user not found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: 'cannot fetch user' });
      });
  },
};
