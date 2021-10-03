const cardsRouter = require('express')
  .Router();

const {
  celebrate,
  Joi,
} = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string(),
  }).unknown(true),
}), createCard);

cardsRouter.delete('/:cardId', deleteCard);

cardsRouter.put('/:cardId/likes', likeCard);

cardsRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
