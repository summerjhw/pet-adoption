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
  dest: './public/images',
  limits: {
    fileSize: 10000000
  }
});

const currentSchema = new mongoose.Schema({
  pet_id: String,
})

const petSchema = new mongoose.Schema({
  name: String,
  species: String,
  path: String,
  description: String,
  attributes: [String],
  adopted: Boolean,
});

const Pet = mongoose.model('Pet', petSchema);

const Current = mongoose.model('Current', currentSchema);

app.post('/api/current', async (req, res) => {
  const current = new Current({
    pet_id: req.body.pet_id,
  });
  try {
    await Current.deleteMany({});
    await current.save();
    res.send(current);
  }
  catch (error) {
    res.sendStatus(500);
  }
})

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

//Get all pets
app.get('/api/pets', async (req, res) => {
  try {
    let pets = await Pet.find();
    res.send(pets);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/current', async (req, res) => {
  try {
    let current = await Current.find();
    res.send(current);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

});

app.get('/api/pets/:id', async (req, res) => {
  try {
    let pet = await Pet.findOne({
      _id: req.params.id
    });
    res.send(pet);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

});


app.listen(3000, () => console.log('Server listening on port 3000!'));