// Imports
const express = require('express');
const db = require('./models/index');
const app = express();
const path = require('path');
const helmet = require('helmet'); // Sécurise les entête HTTP et empeche les attaques XSS, etc
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialisation sequelize
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connexion réussie');
    // db.sequelize.sync({ force: true });
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
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

module.exports = app;
