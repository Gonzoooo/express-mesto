const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch((err) => res.status(500)
      .send({ message: `Произошла ошибка ${err}` }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.status(200).send(user))
    .catch((err) => res.status(500)
      .send({ message: `Произошла ошибка ${err}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
};
