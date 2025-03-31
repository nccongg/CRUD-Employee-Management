import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <h1>Employee Management System</h1>
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App; 