const router = require('express').Router();
const passport = require('passport');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
let User = require('../models/user-model');
const bcryp = require('bcryptjs');
const loginTime = new Date();
const passportLocalPath = require('../passport-Local');
const nodemailer = require("nodemailer");
const details = { emailCreated: '' };
const jwt  = require('jsonwebtoken');
const config = require('../config/keys')

newUserEmail = "";
module.exports = {

}

router.get('/register', (req, res) => {
    res.render('register');
})


router.get('/verifyEmail', (req, res) => {
    res.render('verifyEmail');
})

const registrationToken = jwt.sign({
    data: 'email id of the user'
  }, config.tokenKey.keyValue, { expiresIn: '24h' });




router.post('/register', (req, res, errors) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const newUser = new User({
        email: email,
        username: username,
        password: password,
        timestamp:loginTime,
        verified: false,
        registrationToken:registrationToken
    })
    // console.log("email is " + email);
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
                        user: 'manu.kapoor@outlook.com',
                        pass: 'Kapoor@91'
                    }
                });
                const mailOptions = {
                    from: 'manu.kapoor@outlook.com',
                    to: 'chattel6@gmail.com',
                    subject: 'Login credentials for aeto',
                    html: `Username: ${'http://localhost:5000/verifyEmail'}/${registrationToken}`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        //   console.log('Email sent: ' + info.response);
                        res.redirect('/');
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

// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: 'Success',
//         failureRedirect: 'Failure',
//         failureFlash: true
//     })(req, res, next)

// })



router.post('/login', passport.authenticate('local'), (req, res, next) => {
    try{
        res.status(200).json({ message: 'Welcome!', success: true });
        console.log("Manu inside callback")
    }catch(err){
       res.send(err); 
    }
});


//Verify Email
router.post(`/verifyEmail`, (req, res, err) => {
    const newUserEmail = req.body.email;
    try{
        User.findOneAndUpdate({ email: newUserEmail }, { $set: { verified: true } , $unset: {registrationToken:''}}, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                res.status(400).json({ message: 'Something wrong when updating data!', success: false });
            } else {
                res.status(200).json({ message: 'Email Verified! inpost', success: true });
            }
    
        });
    }
    catch(err){
        res.send(err)
    }
})


// router.get('/verifyEmail', (req, res) => {
//     try{
//         User.findOneAndUpdate({ email: newUserEmail }, { $set: { verified: true } }, { new: true }, (err, doc) => {
//             if (err) {
//                 console.log("Something wrong when updating data!");
//                 res.status(400).json({ message: 'Something wrong when updating data!', success: false });
//             } else {
//                 res.status(200).json({ message: 'Email Verified!', success: true });
//                 console.log(user);
//             }
//         });
//     }catch(err){
//         res.send(err)
//     }
// })


//Logout

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;


