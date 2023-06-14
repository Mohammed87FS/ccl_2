const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const authenticationService = require('../services/authentication');
const { authenticateJWT } = require('../services/authentication');
const userModel = require('../models/indexModel');


// GET route for rendering the index page
router.get('/register', indexController.getRegisterPage);


router.get('/users', indexController.getUsersPage);


router.route('/setGoal')
    .post(authenticateJWT, indexController.setGoals);

// ...

router.route('/')
    .get((req, res, next) => {
        res.render('homePage');
    });



router.route('/login')
    .get((req, res, next) => {
        res.render('login');
    })
    .post((req, res, next) => {
        userModel.getAllUsers()
            .then((users) => {
                authenticationService.authenticateUser(req.body, users, res)
            })
            .catch((err) => {
                res.sendStatus(500)
            })
    });

// POST route for submitting user
router.post('/submitUser', indexController.submitUser);

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
