const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const authenticationService = require('../services/authentication');
const userModel = require('../models/indexModel');
// GET route for rendering the index page
router.get('/register', indexController.getRegisterPage);


router.get('/users', indexController.getUsersPage);

router.get('/user/:id', indexController.getUser);





router.post('/getNutritionDetails', indexController.getNutritionDetails);

// ...

router.route('/')
    .get((req, res, next) => {
        res.render('homePage');
    });

router.route('/goals')
    .get((req, res, next) => {
        res.render('goals');
    });
router.get('/calculate', indexController.calculateBMI);

router.route('/inputFood')
    .get((req, res, next) => {
        res.render('inputFood');
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

router.get('/user/:id/edit', indexController.getEditUserPage);
router.post('/user/:id/edit', indexController.editUser);
router.post('/user/:id/delete', indexController.deleteUser);

//...



module.exports = router;
