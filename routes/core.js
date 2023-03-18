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
                "message": "Completed " + process
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


/**
 * Endpoint to copy all data
 */
router.get("/:percent", (request, response) => {
    // Define variables
    const percent = request.params.percent;

    // Execute function
    if (parseInt(percent) && percent > 0) {
        copy.percentData((percent / 100))
            .then((process) => {
                // Send response
                response.send({
                    "status": 200,
                    "message": "Completed " + process
                })
            })
            .then(() => console.log("Copy completed correctly"))
            .catch(error => {
                // Send response
                response.json({
                    "status": 400,
                    "message": `Error procesing function. ${error}`
                });
            });
    }
    else {
        // Send response
        response.json({
            "status": 400,
            "message": "Params error."
        });
    }
});


// Export
module.exports = router;