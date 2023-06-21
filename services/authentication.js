const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Function to check if the provided password matches the hash
async function checkPassword(password, hash) {
    let pw = await bcrypt.compare(password, hash);
    return pw;
}

// Function to authenticate the user during login
async function authenticateUser(req, users, res) {
    const { email, password } = req.body;
    const user = users.find(u => {
        return u.email === email;
    });

    if (user && password && await checkPassword(password, user.password)) {
        const accessToken = jwt.sign(
            {
                id: user.id,
                name: user.name,
                userGoalCal: user.daily_calorie_goal,
                userGoalExercise: user.daily_exercise_minutes_goal
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );
        res.cookie('accessToken', accessToken);

        // Redirect to the homepage with a query parameter
        res.redirect('/?justLoggedIn=true');
    } else {
        res.send('Username or password incorrect');
    }
}

// Middleware function to authenticate JWT (JSON Web Token)
function authenticateJWT(req, res, next) {
    const token = req.cookies['accessToken'];

    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    authenticateUser,
    authenticateJWT,
};