const NodeCache = require("node-cache");

/**
 * Time to Live for the cache.
 */
const timeInMin = 30

/**
 * Install node cache used for reset link
 */
const myCache = new NodeCache({ 
    stdTTL: timeInMin*60, 
    checkperiod: 20*60*60,
    useClones: false,
    deleteOnExpire: true
});

module.exports = myCache;