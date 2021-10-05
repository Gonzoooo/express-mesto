const Card = require('../models/card');

const ErrBadRequest = require('../errors/err-bad-request');
const ErrNotFound = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200)
      .send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
        throw new ErrBadRequest('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new ErrNotFound('Карточка с указанным _id не найдена.');
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new Forbidden('Нет прав');
      }
      Card.findByIdAndRemove(id)
        .then(() => {
          res.status(200).send({ message: 'Карточка удалена.' });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new ErrBadRequest('Переданы некорректные данные для удаления карточки.');
          }
        });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) {
      throw new ErrNotFound('Передан несуществующий _id карточки.');
    }
    res.status(200)
      .send(card);
  })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) {
      throw new ErrNotFound('Передан несуществующий _id карточки.');
    }
    res.status(200)
      .send(card);
  })
  .catch(next);
