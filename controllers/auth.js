const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const pool = require('./pool');
const e = require('express');

exports.login = async (req, res) => {
    // check empty field(s)
    if ( !req.body.username || !req.body.password ) {
        return res.status(401).send({'message': 'You must pass both username parameter and password parameter'});
    }
    
    try {
        const { password } = req.body;
        const username = req.body.username.toLowerCase();

        pool.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send({'message': 'Error retrieving records from database'});
            }
            else if ( !results[0] || !(await bcrypt.compare(password, results[0].password)) ) {
                return res.status(401).send({'message': 'Username or password is incorrect'});
            }
            
            const id = results[0].id;
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000   // convert to milliseconds
                ),
                httpOnly: true  // disallow scripts to access cookie
            }
            res.cookie('jwt', token, cookieOptions);
            res.status(200).send({'message': 'Login successful'});
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({'message': 'Unknown error occurred'});
    }
}

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // verify the token
            const decodedJWT = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            // verify that user exists
            pool.query('SELECT * FROM Users WHERE id = ?', [decodedJWT.id], (err, results) => {
                if (!results[0])
                    return next();
                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.log(err);
            return next();
        }
    } else {
        next();
    }
}

exports.register = async (req, res) => {
    // check empty field(s)
    if ( !req.body.username || !req.body.password ) {
        return res.status(401).send({'message': 'You must pass both username parameter and password parameter'});
    }

    try {
        const { password } = req.body;
        const username = req.body.username.toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 8);

        pool.query('SELECT username FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send({'message': 'Error retrieving records from database'});
        }
        // verify input fields
        else if (results.length > 0) {
          return res.status(401).send({'message': 'User already exists with the username'});
        }

        pool.query('INSERT INTO Users SET ?', { username: username, password: hashedPassword }, (err, results) => {
          if (err) {
              console.log(err);
              return res.status(500).send({'message': 'Error registering user to database'});
          }
          else {
              return res.status(200).send({'message': 'Registration success'});
          }
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({'message': 'Unknown error occurred'});
    }
}
