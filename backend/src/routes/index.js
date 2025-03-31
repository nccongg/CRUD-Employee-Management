const express = require('express');
const router = express.Router();
const employeeRoutes = require('./employee.routes');

router.use('/employees', employeeRoutes);

module.exports = router; 