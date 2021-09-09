const pool = require('./pool');

exports.fetch = async (req, res) => {
  if (!req.user) {
    res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.params.receiver) {
    res.status(403).send({'message': 'You must provide the receiver'});
  }
  else {
    pool.query('SELECT id FROM Users WHERE username = ? LIMIT 1', [req.params.receiver], (err, results) => {
      if (!results[0]) {
        return res.status(403).send({'message': 'No such receiver'});
      }

      const sender_id = req.user.id;
      const receiver_id = results[0].id;
      
      pool.query('SELECT c.id, u.username, c.message FROM Users u INNER JOIN Chats c ON u.id = c.sender_id WHERE (c.sender_id = ? AND c.receiver_id = ?) OR (c.sender_id = ? AND c.receiver_id = ?)', [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
        res.status(200).send(results);
      });
    });
  }
}

exports.send = async (req, res) => {
  if (!req.user) {
    res.status(403).send({'message': 'You must be logged in'});
  }
  else if (!req.params.receiver) {
    res.status(403).send({'message': 'You must provide the receiver'});
  }
  else if (!req.body.message) {
    res.status(403).send({'message': 'You must include chat message'});
  }
  else {
    pool.query('SELECT id FROM Users WHERE username = ? LIMIT 1', [req.params.receiver], (err, results) => {
      if (!results[0]) {
        return res.status(403).send({'message': 'No such receiver'});
      }

      const sender_id = req.user.id;
      const receiver_id = results[0].id;
      const message = req.body.message;

      pool.query('INSERT INTO Chats (sender_id, receiver_id, message) VALUES (?, ?, ?)', [sender_id, receiver_id, message], (err, results) => {
        if (err)
          console.log(err);
        res.status(200).send({'message': 'Message sent successfully'});
      });
    });
  }
}