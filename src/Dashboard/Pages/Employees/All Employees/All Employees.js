import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import TableData from './Table Data'

const Employee = () => 
{
    const [employeeData, setEmployeeData]=useState([])

    const navigate=useNavigate()

    useEffect(()=>
    {
        fetch("/employees-data")
        .then(response => response.json())
        .then(data => 
            {
                data.success
                ?
                    setEmployeeData(data.employee_data)
                :
                    navigate(-1)
                    toast.error(data.error,
                        {
                            position: "top-right",
                            toastId: "employee-page-error",
                            autoClose: 2000
                        })
            })
    },[navigate])
    
    const employeeDataMap=employeeData.map(employee =>
        {
            return <TableData key={employee.id} employee={employee}/>
        })
    return ( 
        <>
            {
                employeeData
                ?
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
                                {employeeData.length === 0 ?
                                    <tr>
                                        <td colSpan={6} className='fs-5 p-2'>Fetching employee data...</td>
                                    </tr>
                                : 
                                    employeeDataMap
                                }
                            </tbody>
                        </table>
                    </>
                :
                    <div>Loading....</div>
            }
        </>
     );
}
 
export default Employee;