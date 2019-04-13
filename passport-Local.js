const express = require('express');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user-model');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bcryp = require('bcryptjs');
const PORT = process.env.PORT || 5000
const app = express();


// mongoose.connect(keys.mongodb.dbURI)
// console.log('connected to db');


  passport.use(new LocalStrategy(function (username, password, done) {
    let query = { username: username }
    User.findOne(query, function(err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: 'Nouser found' });
        }
        bcryp.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Wrong Password' });
          }
        })
    });
  }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  })

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    })
  })


 

