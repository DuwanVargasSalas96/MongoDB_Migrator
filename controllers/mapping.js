/**
 * Import libraries
 */
const sourceDB = require('../services/sourceDB');


/**
 * Function to catch database list
 * @returns array
 */
async function mappingDatabases() {
    // Define variables
    const databasesInfo = await sourceDB.db().admin().listDatabases();
    let databases = [];

    /* Loop to prepare database array */
    databasesInfo.databases.forEach(dbInfo => {
        // Add database's name to array
        databases.push(dbInfo.name);
    });

    // Return
    return databases;
}


/**
 * Funtion to catch collection list
 * @param {string} dbName 
 * @returns array
 */
async function mappingCollections(dbName) {
    // Define variables
    const collectionsInfo = await sourceDB.db(dbName).listCollections().toArray();
    let collections = [];

    /* Loop to prepare collection array */
    collectionsInfo.forEach(collInfo => {
        // Add collection's name to array
        collections.push(collInfo.name);
    });

    // Return
    return collections;
}


/**
 * Function to prepare namespaces
 * @returns array
 */
exports.namespaces = async () => {
    // Define variables
    const databases = await mappingDatabases();
    let namespaces = [];

    /* Loop to prepare namespaces */
    for (const db of databases) {
        // Conditional to exclude local and admin databases
        if (db != "local" && db != "admin" && db != "config") {
            // Define variables
            const collections = await mappingCollections(db);
            
            // Add collection information to array
            namespaces.push({
                "database": db,
                "collections": collections
            });
        }
    }

    // Resolve
    return namespaces;
}