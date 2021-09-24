const express = require('express'),
    router = express.Router();
const dashbaord = require('../controller/dashboard');
const report = require('../controller/report');
const errorHandler = require('../controller/errorHandler');
const jwtDecoder = require('../utils/jwt-decode');
const momentTz = require('moment-timezone');

router.get('/report/generate', async (req, res) => {
    const jwtPayload = jwtDecoder(req);
    try {
        report.generateReport(32);
        res.send('Done');
    } catch (error) {
        errorHandler(res, error);
    }
});

router.get('/report', async (req, res) => {
    const jwtPayload = jwtDecoder(req);
    try {
        const result = await report.getReport(req.query.userId || jwtPayload.id);
        res.send(result);
    } catch (error) {
        errorHandler(res, error);
    }
});

router.get('/', async (req, res) => {
    const jwtPayload = jwtDecoder(req);
    const localTimeOffset = momentTz(momentTz(), momentTz.tz.guess()).format('Z');
    try {
        const queryCollection = [
            dashbaord.getAssignedProject(req.query.userId || jwtPayload.id),
            dashbaord.getWorkedOnProject(req.query.userId || jwtPayload.id),
            dashbaord.getProjectInvolvementForWeek(req.query.userId || jwtPayload.id, localTimeOffset),
            dashbaord.getProjectHrByDay(req.query.userId || jwtPayload.id, localTimeOffset)
        ];
        const [assignedProjects, workedOnProject, projectInvovlement, projectHrByDay] = await Promise.all(queryCollection);
        res.send({ assignedProjects, workedOnProject, projectInvovlement, projectHrByDay });
    } catch (error) {
        errorHandler(res, error);
    }
});

module.exports = router;