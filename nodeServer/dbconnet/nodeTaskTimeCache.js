const NodeCache = require("node-cache");
const TimerOps = require('../controller/timer');

/**
 * Time to Live for the cache.
 */
const timeInMin = 5 * 60;
const timeToCheck = 10 * 60;

/**
 * Install node cache used for reset link
 */
const myCache = new NodeCache({
	stdTTL: timeInMin,
	checkperiod: timeToCheck,
	useClones: false,
	deleteOnExpire: true
});

myCache.on('del', (key, value) => {
	const category = key.slice(-1);
	if (category === 'B') {
		const mainTaskId = key.slice(0, -1);
		const mainTask = get(mainTaskId);
		if (!!mainTask) {
			delete value['breaks'];
			mainTask.breaks.push(value);
		}
	} else {
		TimerOps.insert(value);
	}
});

myCache.on('expired', (key, value) => {
	//TODO: Insert in db if expired
	myCache.del(key);
});

/**
 * Get the task cache
 * @param {string} key cache key stored in node cache
 */
const get = (key) => {
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
	let isBreak = false;
	if (value.action === 'start') {
		cacheId = `U${userId}T${value.taskId}`;
	} else if (value.action === 'pause') {
		isBreak = true;
		cacheId = `U${userId}T${value.taskId}B`;
	}
	const currentTimeStamp = new Date();

	if (!myCache.has(cacheId) && !isBreak) {
		const taskCache = new TaskCache();
		taskCache.id = cacheId;
		taskCache.taskId = value.taskId;
		taskCache.userId = userId;
		taskCache.startedTime = currentTimeStamp;
		taskCache.endTime = currentTimeStamp;
		myCache.set(taskCache.id, taskCache, timeInMin, (err, value) => {
			if (!!err) {
				console.error(err);
			}
		});
		return taskCache;
	} else if (!myCache.has(cacheId) && isBreak) {
		const cachedTask = get(cacheId.slice(0,-1));
		if (!cachedTask) {
			throw Error('Task not started yet');
		}
		const taskCache = new TaskCache();
		taskCache.id = cacheId;
		taskCache.taskId = value.taskId;
		taskCache.userId = userId;
		taskCache.startedTime = currentTimeStamp;
		taskCache.endTime = currentTimeStamp;
		myCache.set(taskCache.id, taskCache, timeInMin, (err, value) => {
			if (!!err) {
				console.error(err);
			}
		});

		cachedTask.endTime = currentTimeStamp;
		myCache.ttl(cacheId.slice(0,-1), timeInMin);

		return taskCache;
	} else {
		const cachedData = get(cacheId);
		cachedData.endTime = currentTimeStamp;
		myCache.ttl(cacheId, timeInMin);

		if (isBreak) {
			const mainTask = get(cacheId.slice(0,-1));
			mainTask.endTime = currentTimeStamp;
			myCache.ttl(cacheId, timeInMin);
		} else {
			const breakTask = get(cacheId+'B');
			if (!!breakTask) {
				breakTask.endTime = currentTimeStamp;
				myCache.del(cacheId+'B');
			}
		}
		return cachedData;
	}
}

const remove = (value, userId) => {
	const cacheId = `U${userId}T${value.taskId}`;
	const cacheIdForBreak = `U${userId}T${value.taskId}B`;
	const returnData = [];
	const currentTimeStamp = new Date();

	if (myCache.has(cacheIdForBreak)) {
		const cachedDataBreak = get(cacheIdForBreak);
		cachedDataBreak.endTime = currentTimeStamp;
		returnData.push(Object.assign({}, cachedDataBreak));
		myCache.del(cacheIdForBreak);
	}

	if (myCache.has(cacheId)) {
		const cachedData = get(cacheId);
		cachedData.endTime = currentTimeStamp;
		returnData.push(Object.assign({}, cachedData));
		myCache.del(cacheId);
	}

	return returnData.reverse();
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
		this.breaks = [];
	}
}

/**
 * @typedef {Object}
 * @property {function} get - get db cache with key
 * @property {function} set - set db cache with key
 */
module.exports = {
	get,
	set,
	remove
};