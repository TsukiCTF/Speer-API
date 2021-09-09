//
// UNIT TESTING FOR controllers/tweet.js
// [*] This test assumes the DB already has following 3 users (username:password):
//      admin:admin
//      eric:eric
//      sarah:sarah
// [*] This test assumes the DB already has a tweet (id: 5) in Tweets table

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();
chai.use(chaiHttp);

describe('Unit testing controllers/tweet.js', () => {
  /*=========================
  GET /tweet/:id route
  =========================*/
  // test fetching tweet object with INVALID ID
  describe('GET /tweet/:id', () => {
    it('It should fetch tweet object with INVALID ID', (done) => {
      chai.request(server)
        .get('/tweet/9999999')
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('No such tweet ID');
        done();
        })
    });
  });

  // test fetching tweet object with VALID ID
  describe('GET /tweet/:id', () => {
    it('It should fetch tweet object with VALID ID', (done) => {
      chai.request(server)
        .get('/tweet/5')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
        done();
        })
    });
  });

  /*=========================
  POST /tweet/:id route
  =========================*/
  // test creating new tweet post without message
  describe('POST /tweet/:id', () => {
    it('It should login user and create a new tweet post with empty message', (done) => {
      const body = {
        username: 'admin',
        password: 'admin'
      }
      // 1. login request
      chai.request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Login successful');
          res.should.have.cookie('jwt');

          // 2. create tweet
          let cookie = res.header['set-cookie'][0];
          chai.request(server)
            .post('/tweet')
            .set({'Cookie': cookie})
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message').eql('You must include tweet message');
            });
        done();
        })
    });
  });

  // test creating new tweet post with message
  let tweetId = null; // used later for PATCH & DELETE tests
  describe('POST /tweet/:id', () => {
    it('It should login user and create a new tweet post with message', (done) => {
      const body = {
        username: 'admin',
        password: 'admin'
      }
      // 1. login request
      chai.request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Login successful');
          res.should.have.cookie('jwt');

          // 2. create tweet
          let cookie = res.header['set-cookie'][0];
          let body = {
            message: 'hello world!'
          }
          chai.request(server)
            .post('/tweet')
            .set({'Cookie': cookie})
            .send(body)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message');
              // save the newly created tweet ID
              tweetId = res.body.message.match(/\d+/g);
            });
        done();
        })
    });
  });

  /*=========================
  PATCH /tweet/:id route
  =========================*/
  describe('PATCH /tweet/:id', () => {
    it('It should login user and update tweet with ID', (done) => {
      const body = {
        username: 'admin',
        password: 'admin'
      }
      // 1. login request
      chai.request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Login successful');
          res.should.have.cookie('jwt');

          // 2. update tweet
          let cookie = res.header['set-cookie'][0];
          const body = { 'message': 'i am updated data!'};
          chai.request(server)
            .patch(`/tweet/${tweetId}`)
            .set({'Cookie': cookie})
            .send(body)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message').eql('Tweet successfully updated');
            });
        done();
        })
    });
  });

  /*=========================
  POST /tweet/:id route
  =========================*/
  // test creating new tweet post without message
  describe('POST /tweet/:id', () => {
    it('It should login user and create a new tweet post with empty message', (done) => {
      const body = {
        username: 'admin',
        password: 'admin'
      }
      // 1. login request
      chai.request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Login successful');
          res.should.have.cookie('jwt');

          // 2. create tweet
          let cookie = res.header['set-cookie'][0];
          chai.request(server)
            .post('/tweet')
            .set({'Cookie': cookie})
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message').eql('You must include tweet message');
            });
        done();
        })
    });
  });

  // test creating new tweet post with message
  describe('POST /tweet/:id', () => {
    it('It should login user and create a new tweet post with message', (done) => {
      const body = {
        username: 'admin',
        password: 'admin'
      }
      // 1. login request
      chai.request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Login successful');
          res.should.have.cookie('jwt');

          // 2. create tweet
          let cookie = res.header['set-cookie'][0];
          let body = {
            message: 'hello world!'
          }
          chai.request(server)
            .post('/tweet')
            .set({'Cookie': cookie})
            .send(body)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message');
              // save the newly created tweet ID
              tweetId = res.body.message.match(/\d+/g);
            });
        done();
        })
    });
  });

  /*=========================
  DELETE /tweet/:id route
  =========================*/
  describe('DELETE /tweet/:id', () => {
    it('It should login user and delete tweet with ID', (done) => {
      const body = {
        username: 'admin',
        password: 'admin'
      }
      // 1. login request
      chai.request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Login successful');
          res.should.have.cookie('jwt');

          // 2. delete tweet
          let cookie = res.header['set-cookie'][0];
          chai.request(server)
            .delete(`/tweet/${tweetId}`)
            .set({'Cookie': cookie})
            .send(body)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message').eql('Tweet successfully deleted');
            });
        done();
        })
    });
  });

});