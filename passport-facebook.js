const keys = require('./config/keys');
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('./models/user-model');
const loginTime = new Date();
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
        callbackURL: '/auth/facebook/callback',
    },
    (req, accessToken, refreshToken, profile, done) => {
        // console.log(profile.id);
        // console.log({name: profile.displayName, id: profile.id});
        User.findOne({ facebookID: profile.id }).then((existingUser) => {
            if (existingUser) {
                console.log(`existingUser ${existingUser}`)
                done(null, existingUser);
            } else {
                new User({
                    username: profile.displayName,
                    facebookID: profile.id,
                    userRegistrationTime:loginTime,
                    provider: 'Facebook',
                    verified: true
                }).save().then((newUser) => {
                    console.log(`new user created ${newUser}`);
                    done(null, newUser); //callback to let passport know that we are done processing
                });
                console.log(profile);
            }
        })
    }
));

