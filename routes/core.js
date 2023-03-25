/* Import libraries */
const express = require('express');
const router = express.Router();
const copy = require('../controllers/copyData');


/**
 * Endpoint to copy all data
 */
router.get("/", (request, response) => {
    // Execute function
    copy.allData()
        .then((process) => {
            // Send response
            response.send({
                "status": 200,
                "message": process
            });
        })
        .then(() => console.log("Copy completed correctly"))
        .catch(error => {
            // Send response
            response.json({
                "status": 400,
                "message": `Error procesing function. ${error}`
            });
        })
});


// Export
module.exports = router;