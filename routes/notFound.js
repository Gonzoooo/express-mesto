const notFoundRouter = require('express')
  .Router();
const Errors = require('../errors/errors');

notFoundRouter.all('*', (req, res) => {
  res.status(Errors.ERR_NOT_FOUND).send({ message: 'Кажется что-то полшло не так! Запрашиваемая страница не найдена' });
});

module.exports = notFoundRouter;
