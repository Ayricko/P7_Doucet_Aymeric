// Imports
const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

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
