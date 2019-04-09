
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const User = require('./models/user-model');


passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    })
})

passport.use(new GoogleStrategy({
    clientID: keys.google.googleClientID,
    clientSecret: keys.google.googleClientSecret,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
            console.log(`existingUser ${existingUser}`)
            done(null, existingUser);
        } else {
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




