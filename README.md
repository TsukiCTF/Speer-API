# Speer-API
Backend REST API for:
1) User login/registration system
2) Private chat system between two users
3) Tweet post create/retreive/update/delete system

## API Endpoints
Logs in user (requires ``username`` and ``password`` in request body):
```HTTP
POST /login
```
Registers user (requires ``username`` and ``password`` in request body):
```HTTP
POST /register
```
Retrieves private chat associated with another user:
```HTTP
GET /chat/{receiver_username}
```
Send private chat to another user (requires ``message`` in request body):
```HTTP
POST /chat/{receiver_username}
```
Retreives a tweet post:
```HTTP
GET /tweet/{tweet_id}
```
Creates a new tweet post (requires ``message`` in request body):
```HTTP
POST /tweet
```
Updates an existing tweet (requires ``message`` in request body):
```HTTP
PATCH /tweet/{tweet_id}
```
Deletes an existing tweet:
```HTTP
DELETE /tweet/{tweet_id}
```

## Unit Testing
Unit testing is available with [Mocha](https://mochajs.org/) framework.
Simply run following line on console:
```bash
npm test
```
![image](https://user-images.githubusercontent.com/32463233/132783975-9eb7f3e0-75f3-45d0-aa96-7d41dccef0ac.png)

## Setting Up Database
This project depends on external MySQL server running. After configuring ``.env`` file at the root of this project hierarchy and creating a new user in MySQL server, run the following queries in MySQL console to create necessary data:
```SQL
CREATE DATABASE Speer_API;
Use Speer;

CREATE TABLE Users (
        id INT AUTO_INCREMENT,
        username VARCHAR(100),
        password VARCHAR(255),
        PRIMARY KEY (id)
);

CREATE TABLE Chats (
        id INT AUTO_INCREMENT,
        sender_id INT,
        receiver_id INT,
        message VARCHAR(4096),
        PRIMARY KEY (id),
        FOREIGN KEY (sender_id) REFERENCES Users(id),
        FOREIGN KEY (receiver_id) REFERENCES Users(id)
);

CREATE TABLE Tweets (
        id INT AUTO_INCREMENT,
        user_id INT,
        tweet VARCHAR(4096),
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
);
```
