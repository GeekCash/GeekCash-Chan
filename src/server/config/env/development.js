// Invoke 'strict' JavaScript mode
"use strict";

// Set the 'development' environment configuration object
module.exports = {
    db: "mongodb://localhost:27017/discord",
    token: "",
    prefix: '/',

    api: 'https://api.geekcash.org/',

    protocol: 70208,    

    log: {
        collection: 'logs',
        level: 'all'
    },

};