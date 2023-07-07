const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('./strategies/local');
const mongoStore = require('connect-mongo');
const db = require('./data/database');

const app = express();
const port = process.env.PORT;

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use(express.static('public'));
app.use('/uploads',express.static('uploads'));

app.use(cookieParser());
app.use(session({
        secret: 'KDUYSDFUYAWFKDYL',
        resave: false,
        saveUninitialized: false,
        store: mongoStore.create({
            mongoUrl: 'mongodb+srv://chandubobbili06:NPDuilJk9zC0DEfZ@cluster0.m8zkzmd.mongodb.net/?retryWrites=true&w=majority/test'
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(`${req.method}:${req.url}`);
    next();
});


const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/index');
const profileRoutes = require('./routes/profile');
app.use('/',homeRoutes);
app.use('/auth',authRoutes);
app.use('/profile', profileRoutes)

app.use((err, req, res, next) => {
    res.status(500).render('500');
});

app.use((req, res, next) => {
    res.status(404).render('404');
});

db.connectToDatabase().then(function(){
    app.listen(port, function(){
        console.log(`MongoDb Atlas connected and server running on port ${port}`);
    });
});
