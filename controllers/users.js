const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const Errors = require('../errors/errors');

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    res.status(Errors.ERR_BAD_REQUEST).send({ message: 'Введите почту и пароль.' });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(403).send({ message: 'Такой пользователь уже существует' });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Errors.ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя. ${err}` });
        return;
      }
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        res.status(403).send({ message: 'Такого пользователя не существует' });
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: `Пользователь ${email} авторизован` });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(Errors.ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден. ' });
        return;
      }
      res.status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Errors.ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные пользователя. ${err}` });
        return;
      }
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200)
      .send(users))
    .catch((err) => {
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const {
    name,
    about,
  } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    {
      name,
      about,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(Errors.ERR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Errors.ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении профиля. ${err}` });
        return;
      }
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(Errors.ERR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Errors.ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении аватара. ${err}` });
        return;
      }
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};
