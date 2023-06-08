
const uuid = require('uuid');


// In your controller

const userModel = require('../models/indexModel');
const bcrypt = require('bcrypt');

const fetch = require('node-fetch');

// ...

require('dotenv').config()

exports.getNutritionDetails = async (req, res) => {
    try {
        const { title, ingr } = req.body;

        // Convert string of ingredients to an array
        const ingredients = ingr.split('\n');

        const response = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, ingr: ingredients })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        res.render('nutrition', { data }); // render data in a 'nutrition' view
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};




// ...

exports.submitUser = (req, res) => {
    if (!req.files || !req.files.picture) {
        return res.status(400).send('No file uploaded');
    }

    const {  name, surname, email, password } = req.body;

    // Generate a UUID for the image
    const imageUUID = uuid.v4();
    const picture = req.files.picture;
    const extension = picture.name.split('.').pop();
    const fileName = `${imageUUID}.${extension}`;

    // Hash password
    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        picture.mv(`public/uploads/${fileName}`)
            .then(() => {
                return userModel.addUser( name, surname, email, hash, `/uploads/${fileName}`);
            })
            .then(() => {
                res.redirect('/login');
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Internal Server Error');
            });
    });
};


exports.getIndexPage = (req, res) => {
    userModel.getAllUsers()
        .then(users => {
            res.render('register', { users });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};





exports.getUsersPage = (req, res) => {
    userModel.getAllUsers()
        .then(users => {
            res.render('users', { users });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};

exports.getUser=(req, res, next) =>{


    userModel.getUser(parseInt(req.params.id))
        .then(user => res.render('user', {user}))
        .catch(error => {
            res.status(404)
            next(error);
        })
};