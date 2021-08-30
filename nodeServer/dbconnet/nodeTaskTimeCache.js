const NodeCache = require("node-cache");

/**
 * Time to Live for the cache.
 */
const timeInMin = 5 *60;
const timeToCheck = 600;

/**
 * Install node cache used for reset link
 */
const myCache = new NodeCache({
	stdTTL: timeInMin * 60,
	checkperiod: timeToCheck,
	useClones: false,
	deleteOnExpire: true
});

myCache.on('expired', (key, value) => {
	//TODO: Insert in db if expired
	console.log('Task Cache Expired', 'Insert into DB');
});

setInterval(() => {
	console.log(myCache.data);
}, 5000);


/**
 * Get the task cache
 * @param {string} key cache key stored in node cache
 */
const get = (key) => {
	const cachedTimeStamp = myCache.getTtl(key);
	const currentTimeStamp = Date.now();
	if (currentTimeStamp >= cachedTimeStamp) {
		throw Error('Cache expired');
	}
	return myCache.get(key, (err, value) => {
		if (!!err) {
			console.error("In Time Cache: Key not found. Requested key -> " + key);
		}
	});
}

/**
 * set task cache to record activity
 * @param {string} key 
 * @param {TaskCache} value 
 */
const set = (value, userId) => {
	let cacheId = null;
	if (value.action === 'start') {
		cacheId = `U${userId}T${value.taskId}`;
	} else if (value.action === 'pause') {
		cacheId = `U${userId}T${value.taskId}B`;
	}

	if (!myCache.has(cacheId)) {
		const taskCache = new TaskCache();
		taskCache.id = cacheId;
		taskCache.taskId = value.taskId;
		taskCache.userId = userId;
		taskCache.startedTime = new Date();
		taskCache.endTime = new Date();
		myCache.set(taskCache.id, taskCache, timeInMin, (err, value) => {
			if (!!err) {
				console.error(err);
			}
		});
		return taskCache;
	} else {
		const cachedData = get(cacheId);
		cachedData.endTime = new Date();
		myCache.ttl(cacheId, timeInMin);
		return cachedData;
	}
}

/**
 * @typedef {Object} TaskCache Type to record cache for task time tracking
 * @property {string} id - cacheId for the task 
 * @property {number} taskId - task Id used for recording
 * @property {userId} userId - user Id who initiated the activity
 * @property {Date} startedTime - timer started dateTime
 * @property {number} endTime - last update dateTime of the timer
 */
class TaskCache {
	constructor() {
		this.id = null;
		this.taskId = 0;
		this.userId = 0;
		this.startedTime = null
		this.endTime = null;
	}
}

/**
 * @typedef {Object}
 * @property {function} get - get db cache with key
 * @property {function} set - set db cache with key
 */
module.exports = {
	get,
	set
};