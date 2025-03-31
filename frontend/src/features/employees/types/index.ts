export type Department = 'IT' | 'HR' | 'Finance' | 'Marketing' | 'Sales';
export type Status = 'active' | 'inactive';

export interface Employee {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    startDate: string;
    workingDays: number;
    department: Department;
    position: string;
    salary: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

export type CreateEmployeeDto = Omit<Employee, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeeDto = Partial<CreateEmployeeDto>; 