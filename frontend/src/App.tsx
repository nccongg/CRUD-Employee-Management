import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { EmployeeList } from './features/employees/components/EmployeeList';
import { EmployeeForm } from './features/employees/components/EmployeeForm';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/employees" replace />} />
                <Route path="employees" element={<EmployeeList />} />
                <Route path="employees/add" element={<EmployeeForm />} />
                <Route path="employees/edit/:id" element={<EmployeeForm />} />
            </Route>
        </Routes>
    );
};

export default App; 