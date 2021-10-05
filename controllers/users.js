const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ErrBadRequest = require('../errors/err-bad-request');
const ErrConflict = require('../errors/conflict');
const ErrNotFound = require('../errors/not-found-error');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new ErrBadRequest('Введите почту и пароль.');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrConflict('Такой пользователь уже существует.');
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
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new ErrConflict('Такого пользователя не существует');
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
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const id = req.params._id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new ErrNotFound('Пользователь по указанному _id не найден.');
      }
      res.status(200)
        .send(user);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      res.status(200)
        .send(user);
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200)
      .send(users))
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
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
      res.status(200)
        .send(user);
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200)
        .send(user);
    })
    .catch(next);
};
