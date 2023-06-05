const db = require('../services/database.js');

exports.addUser = ( name, surname, email, password, picture) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO gymBros ( name, surname, email, password, picture) VALUES ( ?, ?, ?, ?, ?)';
        db.config.query(sql, [ name, surname, email, password, picture], (err, result) => {
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
