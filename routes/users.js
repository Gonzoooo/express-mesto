const usersRouter = require('express')
  .Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateUserAvatar);

module.exports = usersRouter;
