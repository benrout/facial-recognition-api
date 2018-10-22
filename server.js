const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();
app.use(bodyParser.json())
app.use(cors());

// Root Route
app.get('/', (req, res) => { res.json('Welcome to the Face Recognition App!') })

// Sign In
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })

// Register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// User Profile
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

// Submit Image
app.post('/imageURL', (req, res) => { image.handleAPICall(req, res) })

// Update User Image Count
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// App Listen
app.listen(process.env.PORT || 3000, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
})