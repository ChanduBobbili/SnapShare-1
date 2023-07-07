const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../data/database');
const { ObjectId } = require('mongodb');

passport.serializeUser((user, done) => {
    console.log('serializing user--------');
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    console.log('deserializing user-------');
    try {
        const user = await db.getDb().collection('users').findOne({ _id: new ObjectId(id) });
        if(!user) throw new Error('User Not Found!');
        done(null, user);
    } catch (err) {
        console.log(err);
        done(err, null);
    }
});

passport.use(
    new LocalStrategy( {usernameField: 'email', passwordField: 'password' }, async (email, password, done)=> {
        console.log(`entered email: ${email}`);
        console.log(`entered password: ${password}`);
        try{
            if(!email || !passport ) throw new Error('Missing Credentails!');
            const userDB = await db.getDb().collection('users').findOne({ email });
            if(!userDB) throw new Error('User not found!');
            const matchb = bcrypt.compareSync(password, userDB.hashPassword);
            if(matchb){
                console.log('Authenticated successfully');
                done(null, userDB);
            } else {
                console.log('Invalid Authentication');
                done(null, null);
            }
        } catch(err) {
            console.log(err);
            done(err, null);
        }
    })
);