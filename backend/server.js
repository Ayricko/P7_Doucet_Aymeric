// Imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;
const cors = require('cors');

// Instantiate Server
const app = express();

// BodyParser Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Routes
app.use(cors());
app.use('/api/', apiRouter);

// Launch Server
app.listen(3000, () => {
  console.log('listening on port 3000');
});
