const express = require('express');
const router = express.Router();

const workDiary = require('../controller/workdiary');
const errorHandler = require('../controller/errorHandler');
const jwtDecode = require('../utils/jwt-decode');

router.get('', async (req, res) => {
    // + -> %2B
    const query = {
        date: req.query.date,
        offset: req.query.offset
    };

    const jwtPayload = jwtDecode(req);

    try {
        const result = await workDiary.getDiary(query, jwtPayload);
        res.send(result);
    } catch (error) {
        errorHandler(res, error);
    }
    
})

module.exports = router;