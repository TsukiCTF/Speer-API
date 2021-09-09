//
// UNIT TESTING CLASS FOR SPEER API
//
const chai = require('chai');
const chaiHttp = require('chai-http');
const { nanoid } = require('nanoid');
const server = require('../app.js');

chai.should();
chai.use(chaiHttp);

describe('Speer API', () => {

  /*=================
    POST /login route
    =================*/
  // test no parameters
  describe('POST /login', () => {
    it('It should POST a login request with no parameters', (done) => {
      chai.request(server)
        .post('/login')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('You must pass both username parameter and password parameter');
        done();
        })
    });
  });

  // test wrong credentials
  describe('POST /login', () => {
    it('It should POST a login request with wrong credentials', (done) => {
      const body = {
        username: 'no such user',
        password: 'password'
      }
      chai.request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Username or password is incorrect');
        done();
        })
    });
  });

  // test correct
  describe('POST /login', () => {
    it('It should POST a login request with correct credentials', (done) => {
      const body = {
        username: 'admin',
        password: 'admin'
      }
      chai.request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Login successful');
        done();
        })
    });
  });

  /*====================
    POST /register route
    ====================*/
  // test no parameters
  describe('POST /register', () => {
    it('It should POST a register request with no parameters', (done) => {
      chai.request(server)
        .post('/login')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('You must pass both username parameter and password parameter');
        done();
        })
    });
  });

  // test existing credentials
  describe('POST /register', () => {
    it('It should POST a register request with existing credentials', (done) => {
      const body = {
        username: 'admin',
        password: 'admin'
      }
      chai.request(server)
        .post('/register')
        .send(body)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User already exists with the username');
        done();
        })
    });
  });

  // test available credentials
  describe('POST /register', () => {
    it('It should POST a register request with available credentials', (done) => {
      // create random enough username for unit testing purpose
      const randomUsername = nanoid();
      const body = {
        username: randomUsername,
        password: 'admin'
      }
      chai.request(server)
        .post('/register')
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Registration success');
        done();
        })
    });
  });
});