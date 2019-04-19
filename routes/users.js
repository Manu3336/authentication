const router = require('express').Router();
const passport = require('passport');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
let User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const loginTime = new Date();
const passportLocalPath = require('../passport-Local');
const nodemailer = require("nodemailer");
const details = { emailCreated: '' };
const jwt  = require('jsonwebtoken');
const config = require('../config/keys')



router.get('/register', (req, res) => {
    res.render('register');
})


router.get('/verifyEmail', (req, res) => {
    res.render('verifyEmail');
})

const registrationToken = jwt.sign({
    data: 'email id of the user'
  }, config.tokenKey.keyValue);




router.post('/register', (req, res, errors) => {
    const email = req.body.email;
    const password = req.body.password;
    // const username = req.body.username;
    const newUser = new User({
        email: email,
        username: email,
        password: password,
        userRegistrationTime:loginTime,
        verified: false,
        registrationToken:registrationToken,
        passwordResetTime: ''
    })
    // console.log("email is " + email);
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) {
                console.log(err)
            }
            newUser.password = hash;
        });
    })
    User.findOne({ email: email }).then((existingUser) => {
        if (existingUser) {
            console.log(`existingUser ${existingUser}`)
            return res.status(400).json({ message: 'Email already exist', statusCode: "400", existingUserDetails: existingUser.username });
            // done(null, existingUser);
        } else {
            newUser.save().then((newUserCreated) => {
                var transporter = nodemailer.createTransport({
                    host: "smtp-mail.outlook.com", // hostname
                    secureConnection: false, // TLS requires secureConnection to be false
                    port: 587, // port for secure SMTP
                    tls: {
                        ciphers: 'SSLv3'
                    },
                    auth: {
                        user: '###',
                        pass: '####'
                    }
                });
                const mailOptions = {
                    from: '###',
                    to: '###',
                    subject: 'Login credentials for aeto',
                    html: `Username: ${req.body.email} <br> https://aeto.herokuapp.com/verifyEmail/${registrationToken}`
                    // html: `Username: ${'http://localhost:5000/verifyEmail'}/${registrationToken}`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        //   console.log('Email sent: ' + info.response);
                        // res.redirect('/');
                    }
                });
                return res.status(200).json({ message: 'User Registered', statusCode: "200", newUserDetails: newUserCreated });
                // done(null, newUserCreated);
            });
        }
    })
})



router.get('/login', (req, res) => {
    res.render('login');
    // console.log("Inside Users")
})

//Login process





//Verify Email



//Logout

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;


