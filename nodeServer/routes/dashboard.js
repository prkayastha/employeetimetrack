const express = require('express'),
    router = express.Router();
const dashbaord = require('../controller/dashboard');
const errorHandler = require('../controller/errorHandler');
const jwtDecoder = require('../utils/jwt-decode');

router.get('/', async (req, res) => {
    const jwtPayload = jwtDecoder(req);
    try {
        const assignedProjects = await dashbaord.getAssignedProject(jwtPayload.id);
        const workedOnProject = await dashbaord.getWorkedOnProject(jwtPayload.id);
        const projectInvovlement = await dashbaord.getProjectInvolvementForWeek(jwtPayload.id, '+09:30')
        res.send({assignedProjects, workedOnProject, projectInvovlement});
    } catch (error) {
        errorHandler(res, error);
    }
});

module.exports = router;