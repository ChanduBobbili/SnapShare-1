const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if(req.user) return res.redirect('/profile');
    res.render('home');
})

module.exports = router;