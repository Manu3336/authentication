const keys = require('./config/keys');
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('./models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    })
})

passport.use(new FacebookStrategy(
    {
        clientID: keys.facebook.facebookAppID,
        clientSecret: keys.facebook.facebookAppSecret,
        callbackURL: 'https://aeto.herokuapp.com/auth/facebook/callback',
    },
    (req, accessToken, refreshToken, profile, done) => {
        // console.log(profile.id);
        // console.log({name: profile.displayName, id: profile.id});
        User.findOne({ googleId: profile.id }).then((existingUser) => {
            if (existingUser) {
                console.log(`existingUser ${existingUser}`)
                done(null, existingUser);
            } else {
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    provider: 'Facebook'
                }).save().then((newUser) => {
                    console.log(`new user created ${newUser}`);
                    done(null, newUser); //callback to let passport know that we are done processing
                });
                console.log(profile);
            }
        })
    }
));

