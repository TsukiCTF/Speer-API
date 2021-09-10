const pool = require('./pool');
const queries = require('./queries/tweetQueries.json');

/**
 * Retrives a tweet post by ID
 */
exports.getTweet = async (req, res) => {
  // verify user input
  if (!req.params.id) {
    return res.status(403).send({'message': 'You must provide valid ID parameter'});
  }

  try {
    const tweetId = req.params.id;
    pool.query('SELECT * FROM Tweets WHERE id = ? LIMIT 1', [tweetId], (err, results) => {
      // verify tweet exists
      if (!results[0]) {
        return res.status(403).send({'message': 'No such tweet ID'});
      }
      res.status(200).send(results[0]);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({'message': 'Unknown error occurred'});
  }
}

/**
 * Creates a new tweet post
 */
exports.postTweet = async (req, res) => {
  // verify user input
  if (!req.user) {
    return res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.body.message) {
    return res.status(403).send({'message': 'You must include tweet message'});
  }

  try {
    const userId = req.user.id;
    const message = req.body.message;
    // insert a new tweet record into database
    pool.query('INSERT INTO Tweets (user_id, tweet) VALUES (?, ?)', [userId, message], (err, results) => {
      if (err) {
        console.log(err);
      }
      // verify insertion was successful
      if (!results) {
        return res.status(401).send({'message': 'Error while creating tweet post'});
      }
      // include tweet ID in response
      const tweetId = results.insertId;
      res.status(200).send({'message': `Tweet posted successfully with ID: ${tweetId}`});
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({'message': 'Unknown error occurred'});
  }
}

/**
 * Updates an existing tweet post's message
 */
exports.updateTweet = async (req, res) => {
  // verify user input
  if (!req.user) {
    return res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.body.message) {
    return res.status(403).send({'message': 'You must include tweet message'});
  }
  else if (!req.params.id) {
    return res.status(403).send({'message': 'You must provide valid ID parameter'});
  }

  try {
    const userId = req.user.id;
    const tweetId = req.params.id;
    const message = req.body.message;
    // update tweet record
    pool.query('UPDATE Tweets SET tweet = ? WHERE user_id = ? AND id = ?', [message, userId, tweetId], (err, results) => {
      if (err) {
        console.log(err);
      }
      // verify update was successful
      if (!results.affectedRows) {
        return res.status(401).send({'message': 'Update not allowed'});
      }
      res.status(200).send({'message': 'Tweet successfully updated'});
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({'message': 'Unknown error occurred'});
  }
}

/**
 * Deletes an existing tweet post
 */
exports.deleteTweet = async (req, res) => {
  // verify user input
  if (!req.user) {
    return res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.params.id) {
    return res.status(403).send({'message': 'You must provide valid ID parameter'});
  }

  try {
    const userId = req.user.id;
    const tweetId = req.params.id;
    // delete tweet record
    pool.query('DELETE FROM Tweets WHERE user_id = ? AND id = ?', [userId, tweetId], (err, results) => {
      if (err) {
        console.log(err);
      }
      // verify deletion was successful
      if (!results.affectedRows) {
        return res.status(401).send({'message': 'Delete not allowed'});
      }
      res.status(200).send({'message': 'Tweet successfully deleted'});
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({'message': 'Unknown error occurred'});
  }
}