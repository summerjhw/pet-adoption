const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/petshop', {
  useNewUrlParser: true
});

const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

const petSchema = new mongoose.Schema({
    name: String,
    species: String,
    path: String,
    description: String,
    attributes: [String],
    adopted: Boolean,
  });

const Pet = mongoose.model('Pet', petSchema);


app.post('/api/photos', upload.single('photo'), async (req, res) => {
    if (!req.file) {
      return res.sendStatus(400);
    }
    res.send({
      path: "/images/" + req.file.filename
    });
  });

  app.post('/api/pets', async (req, res) => {
    const pet = new Pet({
      name: req.body.name,
      species: req.body.species,
      path: req.body.path,
      description: req.body.description,
      attributes: req.body.attributes,
      adopted: req.body.adopted,
    });
    try {
      await pet.save();
      res.send(pet);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  