const request = require('supertest');
const assert = require('assert');
const express = require('express');
const app = express();
// You have been given an express server which has a few endpoints.
// Your task is to create a global middleware (app.use) which will
// rate limit the requests from a user to only 5 request per second
// If a user sends more than 5 requests in a single second, the server
// should block them with a 404.
// User will be sending in their user id in the header as 'user-id'
// You have been given a numberOfRequestsForUser object to start off with which
// clears every one second

let numberOfRequestsForUser = [];
setInterval(() => {
    numberOfRequestsForUser = [];
}, 1000)

app.use( (req,res,next) => {
    let userId = req.headers['user-id']
    if ( numberOfRequestsForUser.length ==0 || numberOfRequestsForUser.filter( (item) => { return userId === item.userId }).length == 0 ){
      let user = { "userId" : userId , "requestSent": 0}
      numberOfRequestsForUser.push(user)
      next()
    }
    else{
      numberOfRequestsForUser.forEach( (item) => {
          if ( item.userId === userId) {
            if ( item.requestSent ==5){
              res.status(404).json({
                "msg" : "Maximum limit reached , Please Wait for some time"
              })
            }
            else{
              item.requestSent++
              next()
            }
          }
      })
    }
})

app.get('/user', function(req, res) {
  res.status(200).json({ name: 'john' });
});

app.get('/', function(req, res) {
    res.send(numberOfRequestsForUser)
  // res.status(200).json({ msg: 'created dummy user' });
});

module.exports = app;

// app.listen(3000)