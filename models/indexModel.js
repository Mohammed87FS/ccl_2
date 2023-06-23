const db = require('../services/database.js');

// Function to add a user to the database
exports.addUser = (name, surname, email, password, picture, daily_calorie_goal, daily_exercise_minutes_goal) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO gymBros (name, surname, email, password, picture, daily_calorie_goal, daily_exercise_minutes_goal) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.config.query(sql, [name, surname, email, password, picture, daily_calorie_goal, daily_exercise_minutes_goal], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
                // ;)
            }
        });
    });
};

// Function to add an exercise to the database
exports.addExercise = (name, description, bodypart, picture, gymBros_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO gymExercises (name, description, bodypart, picture, gymBros_id) VALUES (?, ?, ?, ?, ?)';
        db.config.query(sql, [name, description, bodypart, picture, gymBros_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to retrieve all users from the database
exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM gymBros";
        db.config.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to retrieve all exercises from the database
exports.getAllExercises = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM gymExercises";
        db.config.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to retrieve a specific user from the database by user ID
exports.getUser = user_id => new Promise((resolve, reject) => {
    const sql = "SELECT * FROM gymBros WHERE id = ?";
    db.config.query(sql, [user_id], function (err, user, fields) {
        if (err) {
            reject(err);
        } else {
            resolve(user[0]);
        }
    })
});

// Function to calculate BMI (Body Mass Index)
exports.calculateBMI = (weight, height) => {
    let heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
};

// Function to interpret BMI (Body Mass Index)
exports.interpretBMI = (bmi) => {
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi < 24.9) {
        return 'Normal weight';
    } else if (bmi < 29.9) {
        return 'Overweight';
    } else {
        return 'Obesity';
    }
};

// Function to update a user's information in the database
exports.updateUser = (userId, name, surname, email, password, picture) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE gymBros SET name = ?, surname = ?, email = ?, password = ?, picture = ? WHERE id = ?';
        db.config.query(sql, [name, surname, email, password, picture, userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to delete a user from the database
exports.deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM gymBros WHERE id = ?';

        db.config.query(sql, [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to add calorie intake for a user
exports.addCalorieIntake = (userId, calories, date) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO caloriesIntake (userId, calories, date) VALUES (?, ?, ?)';
        db.config.query(sql, [userId, calories, date], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to retrieve exercises for a user
exports.getUserExercises = (gymBros_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM gymExercises WHERE gymBros_id = ?';
        db.config.query(sql, [gymBros_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to retrieve a specific exercise by exercise ID
exports.getExercise = (exerciseId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM gymExercises WHERE id = ?';
        db.config.query(sql, [exerciseId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log(result + "result"); // Add this line for debugging
                resolve(result);
            }
        });
    });
};

// Function to update an exercise in the database
exports.updateExercise = (exerciseId, name, description, bodypart, picture) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE gymExercises SET name = ?, description = ?, bodypart = ?, picture = ? WHERE id = ?';
        db.config.query(sql, [name, description, bodypart, picture, exerciseId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to delete an exercise from the database
exports.deleteExercise = (exerciseId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM gymExercises WHERE id = ?';

        db.config.query(sql, [exerciseId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to retrieve calorie intake for a user
exports.getUserCalorieIntake = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM caloriesIntake WHERE userId = ?';
        db.config.query(sql, [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to retrieve calories and dates for a user
exports.getUserCalories = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT calories, date FROM caloriesIntake WHERE userId = ? ORDER BY date ASC";
        db.config.query(sql, [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to set goals for a user
exports.setGoals = (userId, calorieGoal, exerciseGoal) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE gymBros SET daily_calorie_goal = ?, daily_exercise_minutes_goal = ? WHERE id = ?';
        db.config.query(sql, [calorieGoal, exerciseGoal, userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

// Function to retrieve a user's daily calorie goal
exports.getUserDailyCalorieGoal = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT daily_calorie_goal FROM gymBros WHERE id = ?';
        db.config.query(sql, [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};