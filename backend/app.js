const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
let posts = [
  {
    userId: 1,
    postId: 1,
    title: 'Super Post',
    body:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    user: 'Aymeric Doucet',
    date: '26/11/2020 - 12:35',
    like: '',
    comments: [{ user: 'Aymeric', date: '04/12/2020', body: 'Wonderfuuuuullllllll' }],
  },
];

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', (req, res) => {
  let post = req.body;
  console.log(post);
  res.json(post);
  posts.push(post);
  console.log('posté');
});

app.get('/comment', (req, res) => {
  res.send('on obtient les commentaire');
  console.log('on obtient les commentaire');
});

app.post('/comment', (req, res) => {
  res.send('on poste les commentaire');
  console.log('on poste les commentaire');
});

module.exports = app;
