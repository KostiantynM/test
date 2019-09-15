const express = require('express');
const batchRoutes = require('./batch');
const router = express.Router();
router.use('/batch', batchRoutes);

module.exports = router;
