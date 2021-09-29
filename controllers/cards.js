const Card = require('../models/card');
const Errors = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200)
      .send(cards))
    .catch((err) => {
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.createCard = (req, res) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(201)
      .send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Errors.ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки. ${err}` });
        return;
      }
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;

  Card.findByIdAndRemove(id)
    .then((card) => res.status(200)
      .send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Errors.ERR_NOT_FOUND).send({ message: `Карточка с указанным _id не найдена. ${err}` });
        return;
      }
      res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .then((card) => res.status(200)
    .send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(Errors.ERR_NOT_FOUND).send({ message: `Передан несуществующий _id карточки. ${err}` });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(Errors.ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные для постановки лайка. ${err}` });
      return;
    }
    res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .then((card) => res.status(200)
    .send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(Errors.ERR_NOT_FOUND).send({ message: `Передан несуществующий _id карточки. ${err}` });
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(Errors.ERR_BAD_REQUEST).send({ message: `Переданы некорректные данные для снятии лайка. ${err}` });
      return;
    }
    res.status(Errors.ERR_DEFAULT).send({ message: `Ошибка по умолчанию. ${err}` });
  });
