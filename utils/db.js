const mongoose = require('mongoose');

const MONGODB_URI =
    process.env.MONGODB_URI ||
    'mongodb+srv://DvWilkerOFC:dvwilker15@dvwilker15.xndilqb.mongodb.net/?appName=dvwilker15';

const MONGODB_DB = process.env.MONGODB_DB || 'wilker_api';

async function connectDB() {
    await mongoose.connect(MONGODB_URI, {
        dbName: MONGODB_DB
    });

    console.log('Conectado a MongoDB:', MONGODB_DB);
}

module.exports = connectDB;
