'use strict';

const express = require('express');
const router = express.Router();

const operations = require('../controller/task');
const jwtDecode = require('../utils/jwt-decode');
const errorHandler = require('../controller/errorHandler');

const Task = require('../prototypes/task/task.model');

router.post('/upsert', async (req, res) => {
    const taskInfo = new Task(req.body);
    try {
        const jwtPayload = jwtDecode(req);
        const task = await operations.add(jwtPayload, taskInfo);
        res.status(200).send(task);
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/list', (req, res) => {

});

router.delete('/delete/:id', (req, res) => {

});

router.get('/:id', (req, res) => {

});

module.exports = router;
