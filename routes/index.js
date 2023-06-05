const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// GET route for rendering the index page
router.get('/', indexController.getIndexPage);
router.get('/user', indexController.getUsersPage);

// POST route for submitting user
router.post('/submitUser', indexController.submitUser);



module.exports = router;
