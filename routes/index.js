const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const authenticationService = require('../services/authentication');
const { authenticateJWT } = require('../services/authentication');
const userModel = require('../models/indexModel');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// GET route for rendering the register page
router.get('/register', indexController.getRegisterPage);

// GET route for rendering the users page
router.get('/users', indexController.getUsersPage);

// POST route for setting goals
router.route('/setGoal')
    .post(authenticateJWT, indexController.setGoals);

// GET route for the home page
router.route('/')
    .get((req, res, next) => {
        const token = req.cookies['accessToken'];
        const justLoggedIn = req.query.justLoggedIn === 'true'; // Check the query parameter
        if (token) {
            try {
                const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
                res.render('homePage', {
                    user: decoded.name,
                    userGoalCal: decoded.userGoalCal,
                    userGoalExercise: decoded.userGoalExercise,
                    justLoggedIn: justLoggedIn // Pass the flag to your view
                });
            } catch (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    res.clearCookie('accessToken');  // Clear the expired token
                    res.render('homePage', { user: null, userGoalCal: null, userGoalExercise: null });
                } else {
                    console.error(err);  // Log other errors
                    res.sendStatus(500);
                }
            }
        } else {
            res.render('homePage', { user: null, userGoalCal: null, userGoalExercise: null });
        }
    });



// GET route for retrieving an exercise by ID
router.get('/exercise/:id', authenticateJWT, indexController.getExercise);

// GET route for editing an exercise
router.get('/exercise/:id/edit', authenticateJWT, (req, res, next) => {
    indexController.getEditExercisePage(req, res, next);
});

// POST route for submitting edited exercise
router.post('/exercise/:id/editIt', authenticateJWT, indexController.editExercise);

// POST route for deleting an exercise
router.post('/exercise/:id/delete', authenticateJWT, indexController.deleteExercise);

// GET route for rendering the login page
router.route('/login')
    .get((req, res, next) => {
        res.render('login');
    })
    .post((req, res, next) => {
        userModel.getAllUsers()
            .then((users) => {
                authenticationService.authenticateUser(req, users, res);
            })
            .catch((err) => {
                res.sendStatus(500);
            });
    });

// POST route for submitting a user
router.post('/submitUser', indexController.submitUser);

// GET route for rendering the makeExercise page
router.get('/makeExercise', authenticateJWT, indexController.getMakeExercisePage);

// GET route for rendering the workoutPlans page
router.get('/workoutPlans', authenticateJWT, indexController.getWorkoutPlansPage);

// POST route for submitting an exercise
router.post('/submitExercise', authenticateJWT, indexController.submitExercise);

// Route for checking if user is logged in
router.get('/isloged', indexController.isloged);

// Route for retrieving user calories
router.get('/getUserCalories', authenticateJWT, indexController.getUserCalories);

// Route for retrieving a specific user by ID
router.get('/user/:id', authenticateJWT, indexController.getUser);

// Route for rendering the edit user page
router.get('/user/:id/edit', authenticateJWT, indexController.getEditUserPage);

// POST route for editing a user
router.post('/user/:id/edit', authenticateJWT, indexController.editUser);

// POST route for deleting a user
router.post('/user/:id/delete', authenticateJWT, indexController.deleteUser);

// Route for rendering the goals page
router.route('/goals')
    .get(authenticateJWT, (req, res, next) => {
        res.render('goals');
    });

// Route for rendering the inputFood page
router.route('/inputFood')
    .get(authenticateJWT, (req, res, next) => {
        res.render('inputFood');
    });

// Route for calculating BMI (Body Mass Index)
router.get('/calculate', authenticateJWT, indexController.calculateBMI);

// Route for getting nutrition details
router.post('/getNutritionDetails', authenticateJWT, indexController.getNutritionDetails);

// Route for logging out
router.get('/logout', (req, res) => {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.redirect('/');
});

module.exports = router;