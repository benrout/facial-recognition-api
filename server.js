const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

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

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "bananas",
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: "987",
            hash: "",
            email: "john@gmail.com"
        }
    ]
}

// Root Route
app.get('/', (req, res) => {
    res.send(database.users);
})

// Sign In
app.post('/signin', (req, res) => {

    // Load hash from your password DB.
    bcrypt.compare("apples", '$2a$10$5NzoASFQKzTactWnX/0Zu.BAAeUaNNSkkA5THw.1JW2JoL/CYtfBm', function (err, res) {
        console.log("First guess: ", res);
        // res == true
    });
    bcrypt.compare("veggies", '$2a$10$5NzoASFQKzTactWnX/0Zu.BAAeUaNNSkkA5THw.1JW2JoL/CYtfBm', function (err, res) {
        console.log("Second guess: ", res);
        // res = false
    });

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json("Error logging in");
    }
})

// Register
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json("Unable to register"))
})

// User Profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
        return
    })
    if (!found) {
        res.status(400).json("No user found with that ID");
    }
})

// Update User Image Count
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
        return
    })
    if (!found) {
        res.status(400).json("No user found with that ID");
    }
})








// App Listen
app.listen(3000, () => {
    console.log("App is running on port 3000");
})