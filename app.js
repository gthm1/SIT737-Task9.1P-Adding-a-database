const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const atob = require('atob');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Decode base64-encoded values from Kubernetes secrets
const connectionStringStandard = process.env.CONNECTION_STRING_STANDARD;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;


// Connect to MongoDB Atlas
mongoose
  .connect(connectionStringStandard, { useNewUrlParser: true, useUnifiedTopology: true, auth: { username: username, password:password } })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(error => console.error('Error connecting to MongoDB Atlas:', error));


// Create a Friend schema
const friendSchema = new mongoose.Schema({
  name: String,
  hobbies: [String],
  placesOfInterest: [String]
});

const Friend = mongoose.model('Friend', friendSchema);

// Routes
app.get('/', async (req, res) => {
  try {
    const friends = await Friend.find();
    res.render('index', { friends });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/friends/:id', async (req, res) => {
  try {
    const friend = await Friend.findById(req.params.id);
    res.render('show', { friend });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/friends/:id/edit', async (req, res) => {
  try {
    const friend = await Friend.findById(req.params.id);
    res.render('edit', { friend });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/friends', async (req, res) => {
  try {
    await Friend.create(req.body.friend);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/friends/:id', async (req, res) => {
  try {
    await Friend.findByIdAndUpdate(req.params.id, req.body.friend);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/friends/:id', async (req, res) => {
  try {
    await Friend.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
