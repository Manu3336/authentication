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



router.post('/register', (req, res, errors) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const newUser = new User({
        email: email,
        username: username,
        password: password
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


//Logout

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
})

module.exports = router;