/**
 * Import libraries
 */
const mapping = require('./mapping');
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
        for (const coll of dbsInfo.collections) {
            // Define variables
            const cursor = sourceDB.db(dbsInfo.database).collection(coll).find();
            let docs = [];
            let counter = 0;

            // Debugging
            console.log(`Moving data from ${dbsInfo.database}.${coll}`);

            /* Loop to handle cursor */
            while (await cursor.hasNext()) {
                // Add documents to array
                docs.push(await cursor.next());

                // Conditional to insert data on packets
                if (docs.length == 1000) {
                    // Insert data
                    destinationDB.db(dbsInfo.database).collection(coll).insertMany(docs, { "ordered": false });

                    // Set counter value
                    counter += docs.length;

                    // Reset docs
                    docs = [];
                }
            }

            /* Conditional to insert last documents */
            if (docs.length != 0) {
                // Insert data
                destinationDB.db(dbsInfo.database).collection(coll).insertMany(docs, { "ordered": false });

                // Set counter value
                counter += docs.length;
            }

            // Documentos procesados
            console.log(`Documents copied: ${counter}`);
        }
    }

    // Return
    return process;
}