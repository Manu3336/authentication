const express = require('express');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user-model');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const PORT = process.env.PORT || 5000
const app = express();


mongoose.connect(keys.mongodb.dbURI)
console.log('connected to db');

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


  app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`)
});
