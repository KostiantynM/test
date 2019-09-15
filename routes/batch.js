const express = require('express');
const batch = require('../controllers/batch');
const router = express.Router();

router.route('/').post(batch.action);

module.exports = router;
