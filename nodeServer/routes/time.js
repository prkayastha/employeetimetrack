var express = require('express');
var router = express.Router();

const cache = require('../dbconnet/nodeTaskTimeCache');
const jwtDecoder = require('../utils/jwt-decode');

router.post('/update', (req, res) => {
	const jwtPayload = jwtDecoder(req);
	if (req.body.action === 'start' || req.body.action === 'pause') {
		const updatedData = cache.set(req.body, jwtPayload.id);
		res.send(updatedData);
	} else if (req.body.action === 'stop') {
		const removeData = cache.remove(req.body, jwtPayload.id);
		res.send(removeData);
	}
});

module.exports = router;