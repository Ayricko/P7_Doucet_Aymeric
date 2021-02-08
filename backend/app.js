// Imports
const express = require('express');
const db = require('./models/index');
const app = express();
const path = require('path');
const helmet = require('helmet'); // Sécurise les entête HTTP et empeche les attaques XSS, etc
const bodyParser = require('body-parser');
const cors = require('cors');

// Limitation du nombre de tentative de connection à 3 essais.
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //  15 minutes
  max: 3, //  Nbr d'essais
});

// Initialisation sequelize
db.sequelize
  .authenticate()
  .then(() => {
    db.sequelize.sync();
    console.log('Connexion réussie');
  })
  .catch((err) => {
    console.log('une erreur est survenue', err);
  });

// Routes
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/users/login', loginLimiter);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

module.exports = app;
