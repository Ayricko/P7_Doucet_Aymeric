const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
let message = ['test'];

app.get('/messages', (req, res) => {
  res.send(message);
});

app.post('/messages', (req, res) => {
  let msg = req.body.message;
  res.json(msg);
  message.push(msg);
});

app.listen(port, () => console.log('Connection is ok'));
