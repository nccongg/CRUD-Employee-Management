# Employee Management System

A full-stack application for managing employee information, built with Spring Boot and React.

## Project Structure

The project is divided into two main parts:
- `backend/`: Spring Boot application
- `frontend/`: React application

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- npm 8 or higher
- MySQL 8.0 or higher

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure the database connection in `src/main/resources/application.properties`

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend server will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend application will start on http://localhost:3000

## Features

- View list of employees
- Add new employees
- Edit existing employee information
- Delete employees
- Responsive design using Ant Design

## API Endpoints

- GET `/api/employees`: Get all employees
- GET `/api/employees/{id}`: Get employee by ID
- POST `/api/employees`: Create new employee
- PUT `/api/employees/{id}`: Update employee
- DELETE `/api/employees/{id}`: Delete employee

## Technologies Used

### Backend
- Spring Boot
- Spring Data JPA
- MySQL
- Lombok
- Maven

### Frontend
- React
- TypeScript
- Ant Design
- React Router
- Axios 