'use strict';

const express = require('express');
const router = express.Router();

const operations = require('../controller/project');
const errorHandler = require('../controller/errorHandler');

const jwtUtil = require('../utils/jwt-decode');

router.post('/upsert', async (req, res) => {
    const body = req.body;
    const jwtPayload = jwtUtil(req);
    if (!body.id) {
        body.createdByUserId = jwtPayload.id;
        body.projectOwnerUserId = jwtPayload.id;
    }
    try {
        const project = await operations.add(jwtPayload, body);
        res.status(200).send(project);
    } catch (error) {
        errorHandler(res, error);
    }
});

router.post('/list', async (req, res) => {
    const options = req.body;
    const jwtPayload = jwtUtil(req);
    try {
        const projectList = await operations.list(jwtPayload, options);
        res.status(200).send(projectList);
    } catch (error) {
        errorHandler(res, error);
    }
});

router.delete('/delete/:id',async (req, res) => {
    const jwtPayload = jwtUtil(req);
    try {
        const project = await operations.delete(jwtPayload, req.params.id);
        res.status(200).send(project);
    } catch (error) {
        errorHandler(res, error);
    }
});

router.get('/getAll', async (req, res) => {
    const options = {
        limit: null,
        offset: 0,
        orderBy: 'projectName',
        order: 'ASC',
        searchString: ''
    };
    const jwtPayload = jwtUtil(req);
    try {
        const projectList = await operations.list(jwtPayload, options, false);
        res.status(200).send(projectList);
    } catch (error) {
        errorHandler(res, error);
    }
});

router.get('/:id', async (req, res) => {
    const jwtPayload = jwtUtil(req);
    try {
        const project = await operations.get(jwtPayload, req.params.id);
        res.status(200).send(project);
    } catch (error) {
        errorHandler(res, error);
    }
});



module.exports = router;
