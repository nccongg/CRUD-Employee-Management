import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Employee } from '../types/employee';
import { employeeService } from '../services/employeeService';

export const EmployeeForm: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const employee = await employeeService.getEmployeeById(Number(id));
            form.setFieldsValue(employee);
        } catch (error) {
            message.error('Failed to fetch employee details');
            navigate('/employees');
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: Omit<Employee, 'id'>) => {
        try {
            setLoading(true);
            if (id) {
                await employeeService.updateEmployee(Number(id), values);
                message.success('Employee updated successfully');
            } else {
                await employeeService.createEmployee(values);
                message.success('Employee created successfully');
            }
            navigate('/employees');
        } catch (error) {
            message.error(id ? 'Failed to update employee' : 'Failed to create employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input the name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input the email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Please input the phone number!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {id ? 'Update' : 'Create'}
                    </Button>
                    <Button 
                        style={{ marginLeft: 8 }}
                        onClick={() => navigate('/employees')}
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}; 