const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to MongoDB using the connection string stored in environment variable
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
            
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`); // Logs the connection host to the console
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with a non-zero status to indicate failure
    }
};

// Gracefully shutdown MongoDB connection on app termination
process.on('SIGINT', async () => {
    await mongoose.connection.close(); // Close the mongoose connection
    console.log('MongoDB connection closed');
    process.exit(0); // Exit the process with a success status
});

module.exports = connectDB;
