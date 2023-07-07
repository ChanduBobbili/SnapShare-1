const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`insile profile auth check  middleware ${req.user}`);
    if(req.user) next();
    else res.redirect('/');
});

router.get('/', (req, res)=> {
    res.render('profile', { profile: req.user });
})

module.exports = router;