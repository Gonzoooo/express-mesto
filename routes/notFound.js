const createError = require('http-errors');

const notFoundRouter = require('express')
  .Router();

const Errors = require('../errors/errors');

notFoundRouter.all('*', () => {
  throw createError(Errors.ERR_NOT_FOUND, { message: 'Кажется что-то полшло не так! Запрашиваемая страница не найдена' });
});

module.exports = notFoundRouter;
