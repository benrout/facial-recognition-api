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
        host: '127.0.0.1',
        user: 'postgres',
        password: '',
        database: 'face_recognition'
    }
});

const app = express();
app.use(bodyParser.json())
app.use(cors());

// Root Route
app.get('/', (req, res) => { res.status(200).json('All good') })

// Sign In
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })

// Register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// User Profile
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

// Update User Image Count
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

// App Listen
app.listen(3000, () => {
    console.log("App is listening on port 3000");
})