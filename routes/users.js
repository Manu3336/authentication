const router = require('express').Router();
const passport = require('passport');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
let User = require('../models/user-model');
const bcryp = require('bcryptjs');
const loginTime = new Date();
const passportLocalPath = require('../passport-Local');

router.get('/register', (req, res) => {
    res.render('register');
})


router.get('/verifyEmail', (req, res) => {
    res.render('verifyEmail');
})


router.post('/register', (req, res, errors) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const newUser = new User({
        email: email,
        username: username,
        password: password,
        verified: 'false'
    })
    console.log("email is " + email);
    bcryp.genSalt(10, function (err, salt) {
        bcryp.hash(newUser.password, salt, function (err, hash) {
            if (err) {
                console.log(err)
            }
            newUser.password = hash;
        });
    })
    User.findOne({ email: email }).then((existingUser) => {
        if (existingUser) {
            console.log(`existingUser ${existingUser}`)
            done(null, existingUser);
        } else {
            newUser.save().then((newUserCreated) => {
                console.log(`new user created ${newUserCreated}`);
                done(null, newUserCreated); //callback to let passport know that we are done processing
                res.redirect('/')
            });
        }
    })
})

router.get('/login', (req, res) => {
    res.render('login');
    console.log("Inside Users")
})

//Login process

router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/login'
})(req, res, next)
console.log(req.user);
})


//Verify Email
router.post('/verifyEmail', (req, res, errors) => {
    const email = req.body.email;
    const newUser = new User({
        email:email,
        verified: 'true'
    })
    User.findOneAndUpdate({email: email}, {$set:{verified:"true"}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    });
})


//Logout

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
})

module.exports = router;