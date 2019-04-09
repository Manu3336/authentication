const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
const mongoose = require('mongoose');
const User = require('./models/user-model');
const router = require('express').Router();
const PORT = process.env.PORT || 5000
const app = express();

mongoose.connect(keys.mongodb.dbURI)
console.log('connected to db');

    passport.use(new GoogleStrategy({
        clientID: keys.google.googleClientID,
        clientSecret: keys.google.googleClientSecret,
        callbackURL: "/auth/google/callback"
    }, (accessToken, refreshToken, profile, done)=> {
        User.findOne({googleId: profile.id}).then((existingUser)=>{
            if(existingUser){
                console.log(`existing user is ${existingUser}`)
            }else{
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    provider: 'Google'
                }).save().then((newUser) => {
                    console.log(`new user created ${newUser}`);
                    done(null, newUser); //callback to let passport know that we are done processing
                });
                console.log(profile);
            }
        })    
      }
    ));
    
    app.get('/auth/google', passport.authenticate('google',{
        scope: ['profile']
    }))

    app.get('/auth/google/callback', passport.authenticate('google'), (req, res)=>{
        //    return res.redirect('/loggedin')
           console.log("inside callback")
        });

    app.get('/users', function (req, res) {
       
    });
    
    app.get('/logout',(req, res)=>{
        //handle with passport
        // res.send('logging out')
        req.logout();
        // res.redirect('/')
    });




    // router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    //     // res.send('you are on callback page')
    //     // res.send(req.user)
    //     res.redirect('/profile')
    // });
    

    app.get('/loggedin', function (req, res) {
        res.status(200).json({message:'Welcome!', success: true});
    });


app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`)
});



