const router = require('express').Router();
const passport = require('passport');

// //auth login for email page
router.get('/login', (req, res) => {
    res.render('login');
});



router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/facebook', passport.authenticate('facebook'));


router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.status(200).json({message:'Welcome!', success: true, user: req.user});
});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.status(200).json({message:'Welcome!', success: true, user: req.user});
});


module.exports = router;