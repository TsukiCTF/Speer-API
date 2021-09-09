const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// set environment variables
dotenv.config({ path: '.env' });

// create global app variables
const app = express();

// add middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// add routes
app.use('/', require('./routes/api'));

// start server
const port = process.env.PORT || 3000;
module.exports = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});