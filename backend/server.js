// Imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

// Instantiate Server
const app = express();

// BodyParser Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Routes
app.get('/', (req, res) => {
  res.setHeader('Content-type', 'text/html');
  res.status(200).send('<h1>Bonjour</h1>');
});

app.use('/api/', apiRouter);

// Launch Server
app.listen(3000, () => {
  console.log('listening on port 3000');
});
