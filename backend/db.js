const mongoose = require('mongoose');

const uri = 'mongodb+srv://patcharalukklin:LmiWcmmFqQzFp6HR@travel-inventory-cluste.jxmoe.mongodb.net/?retryWrites=true&w=majority&appName=travel-inventory-cluster';

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Stop the server if connection fails
    }
};

module.exports = connectDB;
