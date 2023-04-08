const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     res.status(400).send({ message: 'Переданы некорректные данные' });
    //   } else {
    //     res.status(500).send({ message: 'На сервере произошла ошибка' });
    //   }
    // });
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     res.status(400).send({ message: 'Переданы некорректные данные' });
    //   } else {
    //     res.status(500).send({ message: 'На сервере произошла ошибка' });
    //   }
    // });
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        // res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        throw new NotFound('Карточка с указанным _id не найдена');
      } else if (card.owner !== req.user._id) {
        // res.send({ message: 'Вы не можете удалить эту карточку' });
        throw new Forbidden('Вы не можете удалить эту карточку');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        throw new NotFound('Карточка с указанным _id не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        throw new NotFound('Карточка с указанным _id не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
