const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const authenticationService = require('../services/authentication');
const { authenticateJWT } = require('../services/authentication');
const userModel = require('../models/indexModel');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;



// GET route for rendering the index page
router.get('/register', indexController.getRegisterPage);


router.get('/users', indexController.getUsersPage);


router.route('/setGoal')
    .post(authenticateJWT, indexController.setGoals);

// ...

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
                    res.clearCookie('accessToken');  // clear the expired token
                    res.render('homePage', { user: null, userGoalCal: null, userGoalExercise: null });
                } else {
                    console.error(err);  // log other errors
                    res.sendStatus(500);
                }
            }
        } else {
            res.render('homePage', { user: null, userGoalCal: null, userGoalExercise: null });
        }
    });



/*router.route('/')
    .get((req, res, next) => {

            res.render('homePage2');

    });*/







router.route('/login')
    .get((req, res, next) => {
        res.render('login');
    })
    .post((req, res, next) => {
        userModel.getAllUsers()
            .then((users) => {
                authenticationService.authenticateUser(req, users, res)
            })
            .catch((err) => {
                res.sendStatus(500)
            })
    });

// POST route for submitting user
router.post('/submitUser', indexController.submitUser);

router.get('/makeExercise', indexController.getMakeExercisePage);
router.get('/workoutPlans', indexController.getWorkoutPlansPage);

router.post('/submitExercise',authenticateJWT, indexController.submitExercise);


//...

router.get('/isloged',indexController.isloged);

router.get('/getUserCalories', authenticateJWT, indexController.getUserCalories);

// ...
router.get('/user/:id', authenticateJWT, indexController.getUser);
//router.get('/user',(req, res)=> res.render('user'));


router.get('/user/:id/edit', authenticateJWT, indexController.getEditUserPage);
router.post('/user/:id/edit', authenticateJWT, indexController.editUser);
router.post('/user/:id/delete', authenticateJWT, indexController.deleteUser);

//...


//...
router.route('/goals')
    .get(authenticateJWT, (req, res, next) => {
        res.render('goals');
    });

router.route('/inputFood')
    .get(authenticateJWT, (req, res, next) => {
        res.render('inputFood');
    });

router.get('/calculate', authenticateJWT, indexController.calculateBMI);

router.post('/getNutritionDetails', authenticateJWT, indexController.getNutritionDetails);

router.get('/logout', (req, res) => {
    res.cookie('accessToken', '', {maxAge: 0});
    res.redirect('/');
})



module.exports = router;
