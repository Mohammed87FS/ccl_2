
const uuid = require('uuid');

const jwt = require('jsonwebtoken');
// In your controller

const indexModel = require('../models/indexModel');
const bcrypt = require('bcrypt');

const fetch = require('node-fetch');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// ...

require('dotenv').config()


// indexController.js
// indexController.js

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

        const userId = req.user.id;

        // Get today's date
        const today = new Date().toISOString().slice(0,10);

        // Store the calorie intake in the database
        indexModel.addCalorieIntake(userId, data.calories, today)
            .then(() => {
                res.render('nutrition', { data });
            })
            .catch(err => {
                console.error('Error:', err);
                res.status(500).send('Internal Server Error');
            });

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

    const {  name, surname, email, password, daily_calorie_goal, daily_exercise_minutes_goal } = req.body;

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
                return indexModel.addUser( name, surname, email, hash, `/uploads/${fileName}`, daily_calorie_goal, daily_exercise_minutes_goal);
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

exports.submitExercise = (req, res) => {
    if (!req.files || !req.files.picture) {
        return res.status(400).send('No file uploaded');
    }
    const gymBros_id = req.user.id;
    const { name, description, bodypart } = req.body;

    // Generate a UUID for the image
    const imageUUID = uuid.v4();
    const picture = req.files.picture;
    const extension = picture.name.split('.').pop();
    const fileName = `${imageUUID}.${extension}`;

    picture.mv(`public/uploads/${fileName}`)
        .then(() => {
            return indexModel.addExercise(name, description, bodypart, `/uploads/${fileName}`, gymBros_id);
        })

        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};




exports.getRegisterPage = (req, res) => {
    indexModel.getAllUsers()
        .then(users => {
            res.render('register', { users });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};


exports.getWorkoutPlansPage = (req, res) => {
    indexModel.getAllExercises()
        .then(exercises => {
            res.render('workoutPlans', { exercises });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};
exports.getMakeExercisePage = (req, res) => {

            res.render('makeWorkoutPlans');

};


exports.getUsersPage = (req, res) => {
    indexModel.getAllUsers()
        .then(users => {
            res.render('users', { users });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};



exports.getUser = (req, res, next) => {
    // Cast to number as the id in token is a number and params are always strings
    if (parseInt(req.params.id) !== req.user.id) {
        return res.status(403).send('Unauthorized access');
    }

    indexModel.getUser(parseInt(req.user.id))
        .then(user => res.render('user', {user}))

        .catch(error => {
            res.status(404)
            next(error);
        })
};

exports.isloged=(req,res) =>{
    console.log( ACCESS_TOKEN_SECRET );
    const token = req.cookies['accessToken'];
    console.log(token)

    if (!token) {
        console.log("!token")

        // if there's no token in the cookies, return an error or do something else
        //return res.status(401).json({ error: 'No token provided.' });
        res.redirect("/login")
    }

    try {
        // verify and decode the token
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        // once decoded, you can access the id that was stored in it
        const id = decoded.id;

        // do something with the id
      res.redirect("/user/"+id)

        //... rest of your logic

    } catch(err) {
        // if there's a problem with decoding, return an error or do something else
        return res.status(401).json({ error: 'Invalid token.' });
    }


}

exports.calculateBMI = (req, res) => {
    let weight = parseFloat(req.query.weight);
    let height = parseFloat(req.query.height);
    let bmi = indexModel.calculateBMI(weight, height);
    let interpretation = indexModel.interpretBMI(bmi);
    res.render('bmi', { bmi: bmi, interpretation: interpretation });
}

//...

exports.getEditUserPage = (req, res) => {
    indexModel.getUser(req.params.id)
        .then(user => {
            res.render('editUser', { user });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};

exports.editUser = (req, res) => {
    const userId = req.params.id;
    const { name, surname, email, password } = req.body;

    // If a new image is uploaded, process it; otherwise, use the existing image
    let pictureUrl = req.body.pictureUrl;
    if (req.files && req.files.picture) {
        const imageUUID = uuid.v4();
        const picture = req.files.picture;
        const extension = picture.name.split('.').pop();
        const fileName = `${imageUUID}.${extension}`;
        picture.mv(`public/uploads/${fileName}`);
        pictureUrl = `/uploads/${fileName}`;
    }

    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        indexModel.updateUser(userId, name, surname, email, hash, pictureUrl)
            .then(() => {
                res.redirect(`/user/${userId}`);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Internal Server Error');
            });
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    indexModel.deleteUser(userId)
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};

exports.getUserCalories = async (req, res) => {
    try {
        const userId = req.user.id;
        const caloriesIntake = await indexModel.getUserCalorieIntake(userId);
        const dailyCalorieGoal = await indexModel.getUserDailyCalorieGoal(userId);
        console.log(dailyCalorieGoal)
        console.dir(dailyCalorieGoal);

        console.log("Calories data: ", caloriesIntake); // This line will print the calorie data to your console
        console.log("Daily calorie goal: ", dailyCalorieGoal); // This will print the daily calorie goal to your console
        res.render('chart', {calories: caloriesIntake, dailyCalorieGoal: dailyCalorieGoal});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.setGoals = (req, res) => {
    const { 'calorie-goal': calorieGoal, 'exercise-goal': exerciseGoal } = req.body;
    const userId = req.user.id;
    console.log(req.body)

    indexModel.setGoals(userId, calorieGoal, exerciseGoal)
        .then(() => {
            res.redirect(`/user/${userId}`);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
};




//...
