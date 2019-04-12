const router = require('express').Router();

const authCheck = (req, res, next) =>{
    if(!req.user){
        res.redirect('/auth/login')
    }else{
        next();
    }
}


router.get('/', authCheck, (req, res)=>{
    res.send('you are on profile page '+ req.user.username);
})

router.get('/manu', (req, res) => {
    res.status(200).json({message:'Welcome! Manu Kapoor'});
});


module.exports = router;