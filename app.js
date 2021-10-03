const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const {
  login,
  createUser,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb',
  async (err) => {
    if (err) throw err;
    console.log('Conncted to mestodb');
  });

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.all('*', require('./routes/notFound'));

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});
