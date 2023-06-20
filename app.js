const express = require('express');
const app = express();
const port = 8900;
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cookieParser = require('cookie-parser');

//...

app.use(cookieParser());


app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);

app.use('/users', usersRouter);

app.use((err, req, res, next) => {
    console.error(err.stack); // log error stack trace
    res.status(err.status || 500); // set HTTP status code
    res.render('error', { error: err.message || 'Internal Server Error' }); // render the error page
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
