import axiosInstance from '@/services/api/axios';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types';

const BASE_URL = '/employees';

export const employeeService = {
    getAll: async (params?: { department?: string; status?: string; search?: string }) => {
        const response = await axiosInstance.get(BASE_URL, { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (employee: CreateEmployeeDto) => {
        const response = await axiosInstance.post(BASE_URL, employee);
        return response.data;
    },

    update: async (id: string, employee: UpdateEmployeeDto) => {
        const response = await axiosInstance.put(`${BASE_URL}/${id}`, employee);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
        return response.data;
    },

    getByDepartment: async (department: string) => {
        const response = await axiosInstance.get(BASE_URL, {
            params: { department }
        });
        return response.data;
    },

    getActive: async () => {
        const response = await axiosInstance.get(BASE_URL, {
            params: { status: 'active' }
        });
        return response.data;
    },

    search: async (searchTerm: string) => {
        const response = await axiosInstance.get(BASE_URL, {
            params: { search: searchTerm }
        });
        return response.data;
    }
}; 