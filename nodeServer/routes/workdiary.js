const express = require('express');
const router = express.Router();

const workDiary = require('../controller/workdiary');
const errorHandler = require('../controller/errorHandler');
const jwtDecode = require('../utils/jwt-decode');

const { allow, ROLES } = require('../controller/authorize');

router.post('/segregate',
    allow([ROLES.ADMIN, ROLES.MANAGER]),
    async (req, res) => {
        const info = {
            id: req.body.id,
            unproductive: req.body.markUnproductive
        };

        try {
            const result = await workDiary.segregate(info);
            res.send(result);
        } catch (error) {
            errorHandler(res, error);
        }
    });

router.post('', async (req, res) => {
    // + -> %2B
    const query = {
        date: req.body.date,
        offset: req.body.offset,
        userId: req.body.userId
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