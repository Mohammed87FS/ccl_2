const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// GET route for rendering the index page
router.get('/', indexController.getIndexPage);
router.get('/user', indexController.getUsersPage);


router.route('/homePage')
    .get((req, res, next) => {
        res.render('homePage');
    });


router.route('/login')
    .get((req, res, next) => {
        res.render('login');
    })
    .post((req, res, next) => {
        userModel.getUsers()
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
