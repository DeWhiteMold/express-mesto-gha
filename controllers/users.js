const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const AlreadyExist = require('../errors/AlreadyExist');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        throw new NotFound('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        throw new NotFound('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Переданы некорректные данные' });
        next(BadRequest('Переданы некорректные данные'));
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then(() => res.send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExist('Пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        next(new NotFound('Пользователь с указанным _id не найден'));
      } else if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Переданы некорректные данные' });
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
        next(new NotFound('Пользователь с указанным _id не найден'));
      } else if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Переданы некорректные данные' });
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send(token);
    })
    .catch(next);
};
