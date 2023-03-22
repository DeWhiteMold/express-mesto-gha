const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({message: 'Переданы некорректные данные'})
      } else {
      res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'ValidationError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден'});
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
        if(err.name === "ValidationError") {
          res.status(400).send({message: 'Переданы некорректные данные'})
        } else {
          res.status(500).send({ message: 'Произошла ошибка' })
        }
    });
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id, 
    { name, about },
    { new: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден'});
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id, 
    { avatar },
    { new: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден'});
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}