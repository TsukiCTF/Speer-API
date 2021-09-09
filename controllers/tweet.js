const pool = require('./pool');

exports.getTweet = async (req, res) => {
  if (!req.params.id) {
    res.status(403).send({'message': 'You must provide valid ID parameter'});
  }
  else {
    const tweetId = req.params.id;
    pool.query('SELECT * FROM Tweets WHERE id = ? LIMIT 1', [tweetId], (err, results) => {
      if (!results[0]) {
        return res.status(403).send({'message': 'No such tweet ID'});
      }

      res.status(200).send(results[0]);
    });
  }
}

exports.postTweet = async (req, res) => {
  if (!req.user) {
    res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.body.message) {
    res.status(403).send({'message': 'You must include tweet message'});
  }
  else {
    const userId = req.user.id;
    const message = req.body.message;
    pool.query('INSERT INTO Tweets (user_id, tweet) VALUES (?, ?)', [userId, message], (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.status(401).send({'message': 'Error while creating tweet post'});
      }
      const tweetId = results.insertId;
      res.status(200).send({'message': `Tweet posted successfully with ID: ${tweetId}`});
    });
  }
}

exports.updateTweet = async (req, res) => {
  if (!req.user) {
    res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.body.message) {
    res.status(403).send({'message': 'You must include tweet message'});
  }
  else if (!req.params.id) {
    res.status(403).send({'message': 'You must provide valid ID parameter'});
  }
  else {
    const userId = req.user.id;
    const tweetId = req.params.id;
    const message = req.body.message;
    pool.query('UPDATE Tweets SET tweet = ? WHERE user_id = ? AND id = ?', [message, userId, tweetId], (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results.affectedRows) {
        return res.status(401).send({'message': 'Update not allowed'});
      }
      res.status(200).send({'message': 'Tweet successfully updated'});
    });
  }
}

exports.deleteTweet = async (req, res) => {
  if (!req.user) {
    res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.params.id) {
    res.status(403).send({'message': 'You must provide valid ID parameter'});
  }
  else {
    const userId = req.user.id;
    const tweetId = req.params.id;
    pool.query('DELETE FROM Tweets WHERE user_id = ? AND id = ?', [userId, tweetId], (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results.affectedRows) {
        return res.status(401).send({'message': 'Delete not allowed'});
      }
      res.status(200).send({'message': 'Tweet successfully deleted'});
    });
  }
}