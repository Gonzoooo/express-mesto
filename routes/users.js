const usersRouter = require('express')
  .Router();

const {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getUser);

usersRouter.patch('/me', updateUserProfile);

usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
