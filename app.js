const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '641a302e89e9e5de6efc4912',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.all('*', (req, res) => {throw res.status(404).send()});

app.listen(PORT, console.log('ok'))