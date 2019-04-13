const router = require('express').Router();
const passport = require('passport');

// //auth login for email page
router.get('/login', (req, res) => {
    res.render('login');
});



//GOOGLE

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.status(200).json({message:'Welcome!', success: true, user: req.user});
    // console.log(res);
});


//FACEBOOK
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    res.status(200).json({message:'Welcome!', success: true, user: req.user});
    // res.redirect('/', {message:'Welcome!', success: true, user: req.user})
});

//Local


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

// router.get('/manu', (req, res) => {
//     res.status(200).json({message:'Welcome! Manu'});
// });



module.exports = router;