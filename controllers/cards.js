const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({message: 'Переданы некорректные данные'})
      } else {
      res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if(err.name === "ValidationError") {
        res.status(400).send({message: 'Переданы некорректные данные'})
      } else {
      res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена'});
      } else {
        res.send({ data: card })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
       else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена'});
      } else {
        res.send({ data: card })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
       else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена'});
    } else {
      res.send({ data: card })
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
     else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  });
}