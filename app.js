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

const router = require('express').Router();

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
    maxAge: 24*60*60*1000,
    keys:[keys.session.cookieKey]
}));


// require('./passport-Local')(passport);


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());
//Logout to set user object to null

app.get('*', (req, res, next)=>{
    res.locals.user = req.user || null;
    next();
});



//set up routes
app.use('/auth',authRoutes)
app.use('/profile',profileRoutes)
app.use('/facebook',facebookRoutes);
app.use('/',localRoutes);

app.get('/', (req, res)=>{
    res.render('home');
})

app.get('/manu/:id', function(req, res){
    res.send('id: ' + req.params.id);
  });

  app.get('/verifyEmail/:registrationToken', (req, res, err) => {
    const registrationTokenValue = req.params.registrationToken;
    console.log("TokenValue: " +registrationTokenValue)
   console.log("user "+ User);
    try{
        User.findOneAndUpdate({ registrationToken: registrationTokenValue }, { $set: { verified: true } , $unset: {registrationToken:''}}, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
                res.status(400).json({ message: 'Something wrong when updating data!', success: false });
            } else {
                res.status(200).json({ message: 'Email Verified! inpost', success: true });
            }
        });
    }
    catch(err){
        console.log("inside catch");
        // res.send(err)
        res.status(400).json({ message: 'Something wrong when updating data!', success: false });
    }
    // console.log("error "+ err);
})


app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`)
});

