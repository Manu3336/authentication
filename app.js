const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth-route');
const facebookRoutes = require('./routes/profile-route');
const profileRoutes = require('./routes/profile-route');
const localRoutes = require('./routes/users');
let User = require('./models/user-model');
const localSetup = require('./passport-Local');
const passportSetup = require('./passport-google');
const facebookSetup = require('./passport-facebook');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const loginTime = new Date();
const resetPasswordTime = new Date();
const keys = require('./config/keys');
const PORT = process.env.PORT || 5000
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(keys.mongodb.dbURI)
console.log("mongodb connected");



app.set('view engine', 'ejs');

//Initialise cookie

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));


// require('./passport-Local')(passport);


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());
//Logout to set user object to null

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



//set up routes
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/facebook', facebookRoutes);
app.use('/', localRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

/// LOGIN MODULE

app.post('/login', (req, res, err) => {
    const password = req.body.password;
    const query = { username: req.body.email }
    try{
        User.findOne(query, (err, user) =>{
            if (err) {
                return res.status(400).json({ message: err, statusCode: "400" });
            } else if (user == null) {
                return res.status(400).json({ message: 'Email Not registered', statusCode: "400" });
            }
            else if (user.verified == false) {
                return res.status(400).json({ message: 'user not verified', statusCode: "400" });
            }
            else {
                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) {
                        return res.status(400).json({ message: err, statusCode: "400" });
                    } else if (isValid == false) {
                        return res.status(400).json({ message: 'wrong password', statusCode: "400" });
                    } else {
                        return res.status(200).json({ message: 'welcome to login screen', statusCode: "200" });
                    }
                })
    
            }
        });
    }catch(err){
        res.send("err");
    }
  
})


app.get('/verifyEmail/:registrationToken', (req, res, err) => {
    const registrationTokenValue = req.params.registrationToken;
    console.log("TokenValue: " + registrationTokenValue)
    console.log("user " + User);
    try {
        User.findOneAndUpdate({ registrationToken: registrationTokenValue }, { $set: { verified: true }, $unset: { registrationToken: '' } }, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                res.status(400).json({ message: 'Something wrong when updating data!', success: false });
            } else {
                res.status(200).json({ message: 'Email Verified! inpost', success: true });
            }
        });
    }
    catch (err) {
        console.log("inside catch");
        // res.send(err)
        res.status(400).json({ message: 'Something wrong when updating data!', success: false });
    }
    // console.log("error "+ err);
})

//RESET***PASSWORD

app.post('/resetPassword', (req, res, err) => {
    const emailValue = req.body.email;
    const passwordValue = req.body.password;
    const hashedPassword = bcrypt.hashSync(passwordValue, 10);
    console.log("passowrd is " + hashedPassword);
    console.log("emails is " + emailValue);
    try {
        User.findOneAndUpdate({ email: emailValue }, { $set: { password: hashedPassword, passwordResetTime: resetPasswordTime } }, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                res.status(400).json({ message: 'Something wrong when updating data!', success: false });
            } else {
                res.status(200).json({ message: 'Password updated successfuly', success: true });
            }
        });
    }
    catch (err) {
        console.log("inside catch");
        // res.send(err)
        res.status(400).json({ message: 'Something wrong when updating data!', success: false });
    }
    // console.log("error "+ err);
})








app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
});

