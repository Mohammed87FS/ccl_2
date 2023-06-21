const uuid = require('uuid');

const jwt = require('jsonwebtoken');

const indexModel = require('../models/indexModel');
const bcrypt = require('bcrypt');

const fetch = require('node-fetch');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


require('dotenv').config()




exports.getNutritionDetails = async (req, res, next) => {
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
                next(err); // forward error to the next middleware
            });

    } catch (error) {
        console.error('Error:', error);
        next(error); // forward error to the next middleware
    }
};


exports.submitUser = (req, res, next) => {
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
            return next(err); // forward error to the next middleware
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
                next(err); // forward error to the next middleware
            });
    });
};


exports.submitExercise = (req, res, next) => {
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
        .then(() => {
            res.redirect("/workoutPlans")
        })
        .catch(err => {
            console.log(err);
            next(err); // forward error to the next middleware
        });
};




exports.getRegisterPage = (req, res, next) => {
    indexModel.getAllUsers()
        .then(users => {
            res.render('register', { users });
        })
        .catch(err => {
            console.log(err);
            next(err); // forward error to the next middleware
        });
};






exports.getWorkoutPlansPage = async (req, res, next) => {
    try {
        const gymBros_id = req.user.id;
        const exercises = await indexModel.getUserExercises(gymBros_id);

        res.render('workoutPlans', {exercises: exercises});
    } catch (error) {
        console.error('Error:', error);
        next(error); // forward error to the next middleware
    }
};

exports.getUserCalories = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const caloriesIntake = await indexModel.getUserCalorieIntake(userId);
        const dailyCalorieGoal = await indexModel.getUserDailyCalorieGoal(userId);



        res.render('chart', {calories: caloriesIntake, dailyCalorieGoal: dailyCalorieGoal});
    } catch (error) {
        console.error('Error:', error);
        next(error); // forward error to the next middleware
    }
};





exports.getMakeExercisePage = (req, res, next) => {
    try {
        res.render('makeWorkoutPlans');
    } catch (error) {
        next(error);
    }
};

exports.getUsersPage = async (req, res, next) => {
    try {
        const users = await indexModel.getAllUsers();
        res.render('users', { users });
    } catch (error) {
        next(error);
    }
};

exports.getExercise = async (req, res, next) => {
    try {
        const exerciseData = await indexModel.getExercise(parseInt(req.params.id));
        const exercise = exerciseData[0];
        console.log("Exercise:", exercise);

    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    if (parseInt(req.params.id) !== req.user.id) {
        return res.status(403).send('Unauthorized access');
    }
    try {
        const user = await indexModel.getUser(parseInt(req.user.id));
        res.render('user', {user});
    } catch (error) {
        next(error);
    }
};

exports.isloged = (req, res, next) => {

    const token = req.cookies['accessToken'];

    if (!token) {

        return res.redirect("/login")
    }
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        const id = decoded.id;
        res.redirect("/user/"+id);
    } catch(err) {
        return next(new Error('Invalid token.'));
    }
};

exports.calculateBMI = (req, res, next) => {
    try {
        let weight = parseFloat(req.query.weight);
        let height = parseFloat(req.query.height);
        let bmi = indexModel.calculateBMI(weight, height);
        let interpretation = indexModel.interpretBMI(bmi);
        res.render('bmi', { bmi: bmi, interpretation: interpretation });
    } catch (error) {
        next(error);
    }
};

exports.getEditUserPage = async (req, res, next) => {
    try {
        const user = await indexModel.getUser(req.params.id);
        res.render('editUser', { user });
    } catch (error) {
        next(error);
    }
};

exports.editUser = (req, res, next) => {
    const userId = req.params.id;
    const { name, surname, email, password } = req.body;

    let pictureUrl = req.body.pictureUrl;
    if (req.files && req.files.picture) {
        const imageUUID = uuid.v4();
        const picture = req.files.picture;
        const extension = picture.name.split('.').pop();
        const fileName = `${imageUUID}.${extension}`;

        picture.mv(`public/uploads/${fileName}`)
            .then(() => {
                pictureUrl = `/uploads/${fileName}`;
            })
            .catch(error => {
                next(error);
            });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        indexModel.updateUser(userId, name, surname, email, hash, pictureUrl)
            .then(() => {
                res.redirect(`/user/${userId}`);
            })
            .catch(error => {
                next(error);
            });
    });
};

exports.editExercise = (req, res, next) => {
    if (!req.files || !req.files.picture) {
        return res.status(400).send('No file uploaded');
    }
    const exerciseId= req.params.id;
    const { name, description, bodypart } = req.body;

    // Generate a UUID for the image
    const imageUUID = uuid.v4();
    const picture = req.files.picture;
    const extension = picture.name.split('.').pop();
    const fileName = `${imageUUID}.${extension}`;

    picture.mv(`public/uploads/${fileName}`)
        .then(() => {
            return indexModel.updateExercise(exerciseId, name, description, bodypart, `/uploads/${fileName}`);

        })
        .then(() => {
            res.redirect("/workoutPlans")
        })
        .catch(err => {
            console.log(err);
            next(err); // forward error to the next middleware
        });

};


exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        await indexModel.deleteUser(userId);
        res.redirect('/logout');
    } catch (error) {
        next(error);
    }
};

exports.getEditExercisePage = async (req, res, next) => {
    try {
        const exercise = await indexModel.getExercise(req.params.id);
        if (!exercise || exercise.length === 0) {
            res.status(404).send('Exercise not found');
        } else {
            res.render('editExercise', { exercise: exercise[0] });
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteExercise = async (req, res, next) => {
    try {
        const exerciseId = req.params.id;
        await indexModel.deleteExercise(exerciseId);
        res.redirect('/workoutPlans');
    } catch (error) {
        next(error);
    }
};

exports.setGoals = async (req, res, next) => {
    const { 'calorie-goal': calorieGoal, 'exercise-goal': exerciseGoal } = req.body;
    const userId = req.user.id;
    console.log(req.body);
    try {
        await indexModel.setGoals(userId, calorieGoal, exerciseGoal);
        res.redirect(`/user/${userId}`);
    } catch (error) {
        next(error);
    }
};