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


  passport.use(new LocalStrategy(function ( username, password, done) {
    let query = { username: username }
    User.findOne(query, function(err, user) {
      console.log("Manu inside function")
        if (err) throw err;
        if (!user) {
          console.log('*** no username')
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.verified) {
          console.log('*** Please verify the user')
          return done(null, false, { message: 'Please verify the user' });
        }

        bcryp.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.log('*** error ', err)
            return done(null, false, { message:err })};
          if (!isMatch){   
         console.log('*** Invalid password found')
          return done(null, false, { message: 'Invalid password found' });
        }
          if (isMatch) {
            console.log('*** ', user)
            return done( null, user);
            
          } else {
            console.log('*** Wrong Password')
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



  

 

