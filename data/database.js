const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const altasUrl = 'mongodb+srv://chandubobbili06:NPDuilJk9zC0DEfZ@cluster0.m8zkzmd.mongodb.net/?retryWrites=true&w=majority';
const altasenv = process.env.MONGODB_URL
const localDB = 'mongodb://127.0.0.1:27017/'
let database;

async function connect(){
    const client = await MongoClient.connect(altasenv);
    database = client.db('snapshare');
}

function getDb(){
    if(!database){
        throw new Error('database is not connected!!');
    }

    return database
}

module.exports = {
    getDb: getDb,
    connectToDatabase: connect
};