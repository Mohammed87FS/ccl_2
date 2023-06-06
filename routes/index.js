const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const authenticationService = require('../services/authentication');
const userModel = require('../models/indexModel');
// GET route for rendering the index page
router.get('/', indexController.getIndexPage);
router.get('/user', authenticationService.authenticateJWT, (req, res, next) => {
    userModel.getUser(req.user.id)
        .then(user => res.render('user', {user}))
        .catch(error => {
            res.status(404)
            next(error);
        })
});

router.get('/users', indexController.getUsersPage);


router.route('/homePage')
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



module.exports = router;
