const db = require('../services/database.js');

exports.addUser = ( name, surname, email, password, picture,  daily_calorie_goal, daily_exercise_minutes_goal) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO gymBros ( name, surname, email, password, picture,  daily_calorie_goal, daily_exercise_minutes_goal) VALUES ( ?, ?, ?, ?, ?,?,?)';
        db.config.query(sql, [ name, surname, email, password, picture,  daily_calorie_goal, daily_exercise_minutes_goal], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};




exports.addExercise = (name, description, bodypart, picture, gymBros_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO gymExercises ( name, description, bodypart, picture, gymBros_id) VALUES (?, ?, ?, ?, ?)';
        db.config.query(sql, [ name, description, bodypart, picture,gymBros_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


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


exports.calculateBMI = (weight, height) => {
    let heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

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
}
//...

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

// indexModel.js

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
exports.getExercise = (exerciseId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM gymExercises WHERE id = ?';
        db.config.query(sql, [exerciseId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.updateExercise = (exerciseId, name, description, bodypart) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE gymExercises SET name = ?, description = ?, bodypart = ? WHERE id = ?';
        db.config.query(sql, [name, description, bodypart, exerciseId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

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

//...
