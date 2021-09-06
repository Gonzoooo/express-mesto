const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(3000);

app.get('/users', (req, res) => {
  res.send(req.params);
});

app.get('/users/:userId', (req, res) => {
  res.send(req.params);
});

app.post('/users', (req, res) => {
  const { name, about, avatar } = req.params;
  res.send({name, about, avatar});
});