const express = require('express'),
    router = express.Router();
const dashbaord = require('../controller/dashboard');
const errorHandler = require('../controller/errorHandler');
const jwtDecoder = require('../utils/jwt-decode');
const momentTz = require('moment-timezone');

router.get('/', async (req, res) => {
    const jwtPayload = jwtDecoder(req);
    const localTimeOffset = momentTz(momentTz(), momentTz.tz.guess()).format('Z');
    try {
        const queryCollection = [
            dashbaord.getAssignedProject(jwtPayload.id),
            dashbaord.getWorkedOnProject(jwtPayload.id),
            dashbaord.getProjectInvolvementForWeek(jwtPayload.id, localTimeOffset),
            dashbaord.getProjectHrByDay(jwtPayload.id, localTimeOffset)
        ];
        const [assignedProjects, workedOnProject, projectInvovlement, projectHrByDay] = await Promise.all(queryCollection);
        res.send({assignedProjects, workedOnProject, projectInvovlement, projectHrByDay});
    } catch (error) {
        errorHandler(res, error);
    }
});

module.exports = router;