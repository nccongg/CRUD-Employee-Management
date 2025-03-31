import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, DatePicker, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, updateEmployee, getEmployeeById } from '../services/employeeService';
import dayjs from 'dayjs';

const { Option } = Select;

const EmployeeForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      const employee = response.data;
      form.setFieldsValue({
        ...employee,
        startDate: dayjs(employee.startDate),
      });
    } catch (error) {
      message.error('Failed to fetch employee details');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const employeeData = {
        ...values,
        startDate: values.startDate.toISOString(),
      };

      if (id) {
        await updateEmployee(id, employeeData);
        message.success('Employee updated successfully');
      } else {
        await createEmployee(employeeData);
        message.success('Employee created successfully');
      }
      navigate('/');
    } catch (error) {
      message.error('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: 'Please input first name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: 'Please input last name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="department"
        label="Department"
        rules={[{ required: true, message: 'Please select department!' }]}
      >
        <Select>
          <Option value="IT">IT</Option>
          <Option value="HR">HR</Option>
          <Option value="Finance">Finance</Option>
          <Option value="Marketing">Marketing</Option>
          <Option value="Sales">Sales</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="position"
        label="Position"
        rules={[{ required: true, message: 'Please input position!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Start Date"
        rules={[{ required: true, message: 'Please select start date!' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="workingDays"
        label="Working Days"
        rules={[{ required: true, message: 'Please input working days!' }]}
      >
        <InputNumber min={1} max={7} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="salary"
        label="Salary"
        rules={[{ required: true, message: 'Please input salary!' }]}
      >
        <InputNumber
          min={0}
          step={1000}
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select status!' }]}
      >
        <Select>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {id ? 'Update' : 'Create'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => navigate('/')}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm; 