
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
// Mask password in logs
const maskedUri = uri ? uri.replace(/:([^:@]{1,})@/, ':****@') : 'undefined';
console.log('Testing connection to:', maskedUri);

if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

// Connect with options to mimic production
mongoose.connect(uri)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        // Also list collections to be sure
        return mongoose.connection.db.listCollections().toArray();
    })
    .then((cols) => {
        console.log('Collections:', cols.map(c => c.name));
        process.exit(0);
    })
    .catch((err) => {
        console.error('Connection failed:', err.message); // Only message to avoid noise
        if (err.cause) console.error('Cause:', err.cause);
        process.exit(1);
    });
