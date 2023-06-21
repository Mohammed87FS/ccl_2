const express = require('express');
const app = express();
const port = 8900;
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cookieParser = require('cookie-parser');

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for handling file uploads
app.use(fileUpload());

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine and views directory for rendering templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route for the root URL
app.use('/', indexRouter);

// Route for the '/users' URL
app.use('/users', usersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // log error stack trace
    res.status(err.status || 500); // set HTTP status code
    res.render('error', { error: err.message || 'Internal Server Error' }); // render the error page
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});