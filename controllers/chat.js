const pool = require('./pool');
const sqlQueries = require('./queries/chatQueries.json');

/**
 * Retrieves all private chat messages between two users
 */
exports.fetch = async (req, res) => {
  // verify user input
  if (!req.user) {
    return res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.params.receiver) {
    return res.status(403).send({'message': 'You must provide the receiver'});
  }

  try {
    pool.query(sqlQueries.getUserIDByUsername, [req.params.receiver], (err, results) => {
      // verify receiver exists
      if (!results[0]) {
        return res.status(403).send({'message': 'No such receiver'});
      }

      // retrieve all chat messages associated with receiver
      const senderId = req.user.id;
      const receiverId = results[0].id;

      pool.query(sqlQueries.getChats, [senderId, receiverId, receiverId, senderId], (err, results) => {
        res.status(200).send(results);
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({'message': 'Unknown error occurred'});
  }
}

/**
 * Sends a private chat message to another user
 */
exports.send = async (req, res) => {
  // verify user input
  if (!req.user) {
    return res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.params.receiver) {
    return res.status(403).send({'message': 'You must provide the receiver'});
  }
  else if (!req.body.message) {
    return res.status(403).send({'message': 'You must include chat message'});
  }
  
  try {
    pool.query(sqlQueries.getUserIDByUsername, [req.params.receiver], (err, results) => {
      // verify receiver exists
      if (!results[0]) {
        return res.status(403).send({'message': 'No such receiver'});
      }

      // insert a new chat message record into database
      const senderId = req.user.id;
      const receiverId = results[0].id;
      const message = req.body.message;

      pool.query(sqlQueries.addChat, [senderId, receiverId, message], (err, results) => {
        if (err)
          console.log(err);
        res.status(200).send({'message': 'Message sent successfully'});
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({'message': 'Unknown error occurred'});
  }
}