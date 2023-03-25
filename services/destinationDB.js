// Import libraries
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Define variables
const client = new MongoClient(process.env.DESTINATION_DB_URI);

/* Errors control */
try {
    // Execute database connection
    client.connect();
} catch (error) {
    // Print
    console.log("Database not connected. " + error);
}

// Export
module.exports = client;