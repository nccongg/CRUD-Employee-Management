import { useState, useCallback } from 'react';
import { employeeService } from '../services/employee.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types';

export const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = useCallback(async (params?: { department?: string; status?: string; search?: string }) => {
        try {
            setLoading(true);
            setError(null);
            const data = await employeeService.getAll(params);
            setEmployees(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    const createEmployee = useCallback(async (employeeData: CreateEmployeeDto) => {
        try {
            setLoading(true);
            setError(null);
            const newEmployee = await employeeService.create(employeeData);
            setEmployees(prev => [...prev, newEmployee]);
            return newEmployee;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateEmployee = useCallback(async (id: string, employeeData: UpdateEmployeeDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedEmployee = await employeeService.update(id, employeeData);
            setEmployees(prev => prev.map(emp => emp._id === id ? updatedEmployee : emp));
            return updatedEmployee;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteEmployee = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await employeeService.delete(id);
            setEmployees(prev => prev.filter(emp => emp._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const searchEmployees = useCallback(async (searchTerm: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await employeeService.search(searchTerm);
            setEmployees(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        employees,
        loading,
        error,
        fetchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        searchEmployees
    };
}; 