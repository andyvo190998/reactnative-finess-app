import express from 'express';

import { getAllWorkLogs, getWorkLog, updateWorkLog, createWorkLog } from '../controllers/work-log.controller.js';

const router = express.Router();

// Get all work logs
router.get('/streak/:id', getAllWorkLogs);

// Get a single work log by ID
router.get('/:id', getWorkLog);

// Create a new work log
router.post('/', createWorkLog);

// Update a work log by ID
router.put('/:id', updateWorkLog);

export default router;