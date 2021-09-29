const User = require('../models/user');
const Errors = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200)
      .send(users))
    .catch((err) => {
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.getUser = (req, res) => {
  const id = req.params.userId;

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
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
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
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Errors.ERR_NOT_FOUND).send({ message: `Пользователь с указанным _id не найден. ${err}` });
        return;
      }
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
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Errors.ERR_NOT_FOUND).send({ message: `Пользователь с указанным _id не найден. ${err}` });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(Errors.ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении аватара. ${err}` });
        return;
      }
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};
