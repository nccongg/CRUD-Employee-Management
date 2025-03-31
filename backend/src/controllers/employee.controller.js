const Employee = require('../models/employee.model');

exports.getAllEmployees = async (req, res) => {
    try {
        const { search } = req.query;
        let employees;

        if (search) {
            // Use text index for full-text search
            employees = await Employee.find(
                { $text: { $search: search } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } });
        } else {
            employees = await Employee.find();
        }

        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: 'Name parameter is required' });
        }

        // Use name index for pattern matching
        const employees = await Employee.find({
            name: { $regex: name, $options: 'i' }
        });

        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmployeeByEmail = async (req, res) => {
    try {
        // Use unique email index for exact match
        const employee = await Employee.findOne({ email: req.params.email });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        // Check for existing email using unique index
        const existingEmployee = await Employee.findOne({ email: req.body.email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const employee = new Employee(req.body);
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if email is being changed and already exists
        if (updates.email) {
            const existingEmployee = await Employee.findOne({
                email: updates.email,
                _id: { $ne: id }
            });
            if (existingEmployee) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 