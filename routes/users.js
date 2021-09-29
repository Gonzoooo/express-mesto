const usersRouter = require('express')
  .Router();

const {
  getUsers,
  createUser,
  getUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/:userId', getUser);

usersRouter.post('/', createUser);

usersRouter.patch('/me', updateUserProfile);

usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
