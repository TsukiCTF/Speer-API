const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const pool = require('./pool');
const sqlQueries = require('./queries/authQueries.json');

/**
 * Authenticates user by checking credentials and setting JWT
 */
exports.login = async (req, res) => {
  // verify user input
  if ( !req.body.username || !req.body.password ) {
    return res.status(401).send({'message': 'You must pass both username parameter and password parameter'});
  }
  
  try {
    const { password } = req.body;
    const username = req.body.username.toLowerCase();

    pool.query(sqlQueries.getUserByUsername, [username], async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({'message': 'Error retrieving records from database'});
      }
      else if ( !results[0] || !(await bcrypt.compare(password, results[0].password)) ) {
        return res.status(401).send({'message': 'Username or password is incorrect'});
      }
      
      // create JWT
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
      // attach JWT to response
      res.cookie('jwt', token, cookieOptions);
      res.status(200).send({'message': 'Login successful'});
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({'message': 'Unknown error occurred'});
  }
}

/**
 * Authorizes user by checking given JWT
 */
exports.isLoggedIn = async (req, res, next) => {
  // verify user input
  if (req.cookies.jwt) {
    try {
    // verify the token
    const decodedJWT = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    pool.query(sqlQueries.getUserByUserID, [decodedJWT.id], (err, results) => {
      // verify that user exists
      if (!results[0]) {
        return next();
      }
      // bind user ID to session as a proof of authorization
      req.user = results[0];
      return next();
    });
    } catch (err) {
      console.log(err);
      return next();
    }
  }
  else {
    next();
  }
}

/**
 * Registers user with given credentials
 */
exports.register = async (req, res) => {
  // verify user input
  if ( !req.body.username || !req.body.password ) {
    return res.status(401).send({'message': 'You must pass both username parameter and password parameter'});
  }

  try {
    const { password } = req.body;
    const username = req.body.username.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 8);

    pool.query(sqlQueries.getUsernameByUsername, [username], async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({'message': 'Error retrieving records from database'});
      }
      // check if user exists already
      else if (results.length > 0) {
        return res.status(401).send({'message': 'User already exists with the username'});
      }
      // create new user
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
