/* Define libraries */
const express = require('express');
const server = express();
const moveDatabase = require('./routes/core');

// Convert all to json
server.use(express.json());

// Endpoint to move databases
server.use("/movedbs", moveDatabase);

// Main endpoint 
server.use("/", (request, response) => {
    // Send response
    response.send("Welcome to MongoDB microservice");
});

// Starting server
server.listen(3030, () => {
    console.log("Server running");
});