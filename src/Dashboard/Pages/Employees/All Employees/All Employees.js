import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import TableData from './Table Data';
import Pagination from 'react-bootstrap/Pagination';

import './Employees.css'
const Employee = () => 
{
    const [employeeData, setEmployeeData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 5;

    const lastEmployeeIndex = currentPage * dataPerPage;
    const firstEmployeeIndex = lastEmployeeIndex - dataPerPage;

    const currentEmployees = employeeData.slice(firstEmployeeIndex, lastEmployeeIndex);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("/employees-data")
            .then(response => response.json())
            .then(data =>
                {
                data.success
                ?
                    setEmployeeData(data.employee_data)
                :
                    navigate(-1);
                    toast.error(data.error, {
                        position: "top-right",
                        toastId: "employee-page-error",
                        autoClose: 2000
                    });
                })
    }, [navigate]);

    const employeeDataMap = currentEmployees.map(employee => (
        <TableData key={employee.id} employee={employee} />
    ));

    const totalPages = Math.ceil(employeeData.length / dataPerPage);

    return (
        <>
            <h1 className="text-uppercase text-center fw-bolder">All employees</h1>
            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Department</th>
                        <th scope="col">Position</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeData.length === 0 ? (
                        <tr>
                            <td colSpan={6} className='fs-5 p-2'>Fetching employee data...</td>
                        </tr>
                    ) : (
                        employeeDataMap
                    )}
                </tbody>
            </table>
            <div className="d-flex justify-content-center">
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} title='First Page'/>
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} title='Previous'/>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)} className={i + 1 === currentPage ? 'active-page' : ''}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} title='Next'/>
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} title='Last Page'/>
                </Pagination>
            </div>
        </>
    );
};

export default Employee;
