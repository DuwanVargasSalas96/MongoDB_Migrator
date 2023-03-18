/**
 * Import libraries
 */
const mapping = require('./mappping');
const destinationDB = require('../services/destinationDB');
const sourceDB = require('../services/sourceDB');


/**
 * Function to move documents between clusters
 * @returns boolean
 */
exports.allData = async () => {
    // Define variables
    const namespaces = await mapping.namespaces();
    let process = true;

    /* Loop to check each database */
    for (const dbsInfo of namespaces) {
        /* Loop to check each collection */
        for (const collsInfo of dbsInfo.collections) {
            // Debugging
            console.log(`Moving data from ${dbsInfo.database}.${collsInfo.collection}`);

            // Define variables
            const cursor = sourceDB.db(dbsInfo.database).collection(collsInfo.collection).find();
            let docs = [];
            let counter = 0;

            /* Loop to handle cursor */
            while (await cursor.hasNext()) {
                // Add documents to array
                docs.push(await cursor.next());

                // Conditional to insert data on packets
                if (docs.length == 1000) {
                    // Insert data
                    destinationDB.db(dbsInfo.database).collection(collsInfo.collection).insertMany(docs, { "ordered": false });

                    // Set counter value
                    counter += docs.length;

                    // Reset docs
                    docs = [];
                }
            }

            // Conditional to insert last documents
            if (docs.length != 0) {
                // Insert data
                destinationDB.db(dbsInfo.database).collection(collsInfo.collection).insertMany(docs, { "ordered": false });

                // Set counter value
                counter += docs.length;
            }

            // Documentos procesados
            console.log(`Documents copied: ${counter} / ${collsInfo.objects}`);
        }
    }

    // Return
    return process;
}


/**
 * Function to move documents between clusters
 * @returns boolean
 */
exports.percentData = async (percent) => {
    // Define variables
    const namespaces = await mapping.namespaces();
    let process = true;

    /* Loop to check each database */
    for (const dbsInfo of namespaces) {
        /* Loop to check each collection */
        for (const collsInfo of dbsInfo.collections) {
            // Debugging
            console.log(`Moving data from ${dbsInfo.database}.${collsInfo.collection}`);

            // Define variables
            const objectsToMove = Math.round(collsInfo.objects * percent);
            const cursor = sourceDB.db(dbsInfo.database).collection(collsInfo.collection).find().sort({ "_id": -1 }).limit(objectsToMove);
            let docs = [];
            let counter = 0;

            /* Loop to handle cursor */
            while (await cursor.hasNext()) {
                // Add documents to array
                docs.push(await cursor.next());

                // Conditional to insert data on packets
                if (docs.length == 1000) {
                    // Insert data
                    destinationDB.db(dbsInfo.database).collection(collsInfo.collection).insertMany(docs, { "ordered": false });

                    // Set counter value
                    counter += docs.length;

                    // Reset docs
                    docs = [];
                }
            }

            // Conditional to insert last documents
            if (docs.length != 0) {
                // Insert data
                destinationDB.db(dbsInfo.database).collection(collsInfo.collection).insertMany(docs, { "ordered": false });

                // Set counter value
                counter += docs.length;
            }

            // Documentos procesados
            console.log(`Documents copied: ${counter} / ${collsInfo.objects}`);
        }
    }

    // Return
    return process;
}