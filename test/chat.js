//
// UNIT TESTING FOR controllers/chat.js
// [*] This test assumes the DB already has following 3 users (username:password):
//      admin:admin
//      eric:eric
//      sarah:sarah
//

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();
chai.use(chaiHttp);

describe('Unit testing controllers/chat.js', () => {
  /*=========================
    GET /chat/:receiver route
    =========================*/
  // test fetching chat data with INVALID receiver
  describe('GET /chats/:receiver', () => {
    it('It should login user and fetch all chat data associated with INVALID receiver', (done) => {
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

          // 2. fetch chat data
          let cookie = res.header['set-cookie'][0];
          chai.request(server)
            .get('/chat/NO_SUCH_USER')
            .set({'Cookie': cookie})
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message').eql('No such receiver');
            });
        done();
        })
    });
  });

  // test fetching chat data with VALID receiver
  describe('GET /chats/:receiver', () => {
    it('It should login user and fetch all chat data associated with VALID receiver', (done) => {
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

          // 2. fetch chat data
          let cookie = res.header['set-cookie'][0];
          chai.request(server)
            .get('/chat/eric')
            .set({'Cookie': cookie})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.be.a('array');
            });
        done();
        })
    });
  });

  /*=========================
  POST /chat/:receiver route
  =========================*/
  // test sending empty chat message
  describe('POST /chats/:receiver', () => {
    it('It should login user and send empty chat message', (done) => {
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

          // 2. send chat message
          let cookie = res.header['set-cookie'][0];
          const body = { 'message': '' }
          chai.request(server)
            .post('/chat/admin')
            .set({'Cookie': cookie})
            .send(body)
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message').eql('You must include chat message');
            });
        done();
        })
    });
  });

  // test sending chat message to INVALID receiver
  describe('POST /chats/:receiver', () => {
    it('It should login user and send chat message to INVALID receiver', (done) => {
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

          // 2. send chat message
          let cookie = res.header['set-cookie'][0];
          const body = { 'message': 'hello world!' }
          chai.request(server)
            .post('/chat/NO_SUCH_USER')
            .set({'Cookie': cookie})
            .send(body)
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message').eql('No such receiver');
            });
        done();
        })
    });
  });

  // test sending chat message to VALID receiver
  describe('POST /chats/:receiver', () => {
    it('It should login user and send chat message to VALID receiver', (done) => {
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

          // 2. send chat message
          let cookie = res.header['set-cookie'][0];
          const body = { 'message': 'hello world!' }
          chai.request(server)
            .post('/chat/eric')
            .set({'Cookie': cookie})
            .send(body)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.be.a('object');
              res.body.should.have.property('message').eql('Message sent successfully');
            });
        done();
        })
    });
  });

});