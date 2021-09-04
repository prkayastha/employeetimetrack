'use strict';

const express = require('express');
const router = express.Router();
const path= require('path');
const fs = require('fs');

const operations = require('../controller/task');
const jwtDecode = require('../utils/jwt-decode');
const errorHandler = require('../controller/errorHandler');

const Task = require('../prototypes/task/task.model');
const caputres = require('../controller/captures');

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

router.post('/screenshot',
    caputres.upload.single('capture'),
    async (req, res) => {
        try {
            const result = await caputres.rename(req);
            res.status(200).send(result);
        } catch (error) {
            errorHandler(res, error);
        }
    });

router.post('/:id', async (req, res) => {
    const jwtPayload = jwtDecode(req);
    const projectId = req.params.id;
    const options = {
        offset: req.body.offset || 0,
        limit: req.body.limit || 10,
        orderBy: req.body.orderBy || 'id',
        order: req.body.order || 'asc',
        search: req.body.search || ''
    };
    try {
        const list = await operations.list(jwtPayload, options, projectId);
        res.send(list);
    } catch (error) {
        errorHandler(res, error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    const jwtPayload = jwtDecode(req);
    const taskId = req.params.id;
    try {
        const deleteTask = await operations.delete(jwtPayload, taskId);
        res.status(deleteTask.statusCode).send(deleteTask);
    } catch (error) {
        errorHandler(res, error);
    }
});

module.exports = router;
