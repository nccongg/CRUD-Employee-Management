const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateEmployee = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('department').isIn(['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'])
        .withMessage('Invalid department'),
    body('salary.amount').isNumeric().withMessage('Salary must be a number'),
];

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new employee
router.post('/', validateEmployee, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const employee = new Employee(req.body);
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update employee
router.put('/:id', validateEmployee, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Request leave
router.post('/:id/leave', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.requestLeave(
            req.body.startDate,
            req.body.endDate,
            req.body.reason,
            req.body.type
        );

        res.json({ message: 'Leave request submitted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Clock in/out
router.post('/:id/attendance', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.clockInOut(req.body.type);
        res.json({ message: 'Attendance recorded successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get monthly attendance report
router.get('/:id/attendance/:year/:month', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const report = await employee.getCompleteReport(
            parseInt(req.params.year),
            parseInt(req.params.month)
        );
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 