const Employee = require('../models/employee.model');

class EmployeeService {
    async getAllEmployees(query = {}) {
        try {
            const employees = await Employee.find(query);
            return employees;
        } catch (error) {
            throw new Error(`Error fetching employees: ${error.message}`);
        }
    }

    async getEmployeeById(id) {
        try {
            const employee = await Employee.findById(id);
            if (!employee) {
                throw new Error('Employee not found');
            }
            return employee;
        } catch (error) {
            throw new Error(`Error fetching employee: ${error.message}`);
        }
    }

    async createEmployee(employeeData) {
        try {
            const employee = new Employee(employeeData);
            await employee.save();
            return employee;
        } catch (error) {
            throw new Error(`Error creating employee: ${error.message}`);
        }
    }

    async updateEmployee(id, employeeData) {
        try {
            const employee = await Employee.findByIdAndUpdate(
                id,
                employeeData,
                { new: true, runValidators: true }
            );
            if (!employee) {
                throw new Error('Employee not found');
            }
            return employee;
        } catch (error) {
            throw new Error(`Error updating employee: ${error.message}`);
        }
    }

    async deleteEmployee(id) {
        try {
            const employee = await Employee.findByIdAndDelete(id);
            if (!employee) {
                throw new Error('Employee not found');
            }
            return employee;
        } catch (error) {
            throw new Error(`Error deleting employee: ${error.message}`);
        }
    }

    async searchEmployees(searchTerm) {
        try {
            const employees = await Employee.find(
                { $text: { $search: searchTerm } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } });
            return employees;
        } catch (error) {
            throw new Error(`Error searching employees: ${error.message}`);
        }
    }

    async getEmployeesByDepartment(department) {
        try {
            const employees = await Employee.find({ department });
            return employees;
        } catch (error) {
            throw new Error(`Error fetching employees by department: ${error.message}`);
        }
    }

    async getActiveEmployees() {
        try {
            const employees = await Employee.find({ status: 'active' });
            return employees;
        } catch (error) {
            throw new Error(`Error fetching active employees: ${error.message}`);
        }
    }
}

module.exports = new EmployeeService(); 