var express = require('express');
var router = express.Router();

const cache = require('../dbconnet/nodeTaskTimeCache');
const jwtDecoder = require('../utils/jwt-decode');

router.post('/update', (req, res) => {
	const jwtPayload = jwtDecoder(req);
	const updatedData = cache.set(req.body, jwtPayload.id);
	res.send(updatedData);
});

module.exports = router;