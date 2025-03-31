import axios from 'axios';
import { Employee } from '../types/employee';

const API_URL = 'http://localhost:8080/api/employees';

export const employeeService = {
    getAllEmployees: async (): Promise<Employee[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getEmployeeById: async (id: number): Promise<Employee> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    createEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
        const response = await axios.post(API_URL, employee);
        return response.data;
    },

    updateEmployee: async (id: number, employee: Omit<Employee, 'id'>): Promise<Employee> => {
        const response = await axios.put(`${API_URL}/${id}`, employee);
        return response.data;
    },

    deleteEmployee: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    },
}; 