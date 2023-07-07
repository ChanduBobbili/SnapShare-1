const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../data/database');

const router = express.Router();
const saltRounds = 10;

router.get('/login', (req, res)=>{
    if(req.user) return res.redirect('/');
    res.render('login');
})

router.post('/register', (req, res)=> {
    bcrypt.hash(req.body.logpass, saltRounds, (err, hash) => {
        if (err) {
            return res.redirect('/register');
        }
        const newUser = {
            username: req.body.logname,
            email: req.body.logemail,
            password: hash,
            createdAt: new Date()
        };
        const userResult = db.getDb().collection('users').insertOne(newUser);
        res.redirect('/auth/login');
    });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/profile',failureRedirect: '/auth/login'}), (req, res)=> {
    console.log('logged success');
    // res.redirect('/profile');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
