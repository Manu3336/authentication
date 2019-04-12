const express = require('express');
const authRoutes = require('./routes/auth-route');
const facebookRoutes = require('./routes/profile-route');
const profileRoutes = require('./routes/profile-route');
const localRoutes = require('./routes/users');
const passportSetup = require('./passport-google');
const facebookSetup = require('./passport-facebook');
const keys = require('./config/keys');
const PORT = process.env.PORT || 5000
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
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

app.use(passport.initialize());
app.use(passport.session());




//set up routes
app.use('/auth',authRoutes)
app.use('/profile',profileRoutes)
app.use('/facebook',facebookRoutes);
app.use('/',localRoutes);

app.get('/', (req, res)=>{
    res.render('home');
})

// app.get('/users/register', (req, res)=>{
//     res.render('register');
// })

app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`)
});

