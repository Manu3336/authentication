const router = require('express').Router();
const passport = require('passport');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
let User = require('../models/user-model');
const bcryp = require('bcryptjs');
const loginTime = new Date();

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})


router.post('/register', (req, res, errors) => {
    const email = req.body.email;
    const password = req.body.password;
    const newUser = new User({
        email: email,
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


router.post('/login', (req, res, errors) => {
    const email = req.body.email;
    const password = req.body.password;
    const newUser = new User({
        email: email,
        password: password,
        timestamp:loginTime
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
            newUser.then((newUserCreated) => {
                console.log(`new user created ${newUserCreated}`);
                done(null, newUserCreated); //callback to let passport know that we are done processing
            });
        }
    })
})
module.exports = router;