import Roles from '../Data/Roles.json'
import Departments from '../Data/Departments.json'
import Sections from '../Data/Sections.json'

import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import { useState } from 'react'
import {toast} from 'react-toastify'

const EmployeeForm = ({employeeData, setEmployeeData}) => 
{
    const rolesOptions=Roles.map(roles => <option key={roles.id} value={roles.role}>{roles.title}</option>)
    
    const departmentsMap=Departments.map(Department => 
        <option key={Department.id} value={Department.department}>{Department.department}</option>)

    const sectionsMap=Sections.map(Section=>
        <option key={Section.id} value={Section.section}>{Section.section}</option>)

    const initialFormData=
    {
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        section: "",
        position: "",
        gender: "",
        role:""
    }

    const [employeeFormData, setEmployeeFormData]=useState(initialFormData)

    const handleInputChange= e => setEmployeeFormData({...employeeFormData, [e.target.id]: e.target.value})

    const handleSubmit= e =>
    {
        e.preventDefault()
        fetch("/employees-data",
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employeeFormData)
        })
        .then(response => response.json())
        .then(data => 
            {
                data.success
                ?   
                    toast.success(data.success,
                        {
                            position: "top-right",
                            autoClose:2000,
                            onClose: ()=>
                            {
                                setEmployeeData([...employeeData, data.employee_data])
                                setEmployeeFormData(initialFormData)
                            }
                        })
                :
                    toast.error(data.error,
                        {
                            position: "top-right",
                            autoClose: 2000
                        })
            })
    }
    return ( 
        <>
            <Form onSubmit={handleSubmit}>
                <h1 className='text-center text-uppercase fs-2 fw-bold'>Employee Registration Form</h1>
                <Row>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type='text' id='first_name' value={employeeFormData.first_name} onChange={handleInputChange} placeholder='Employee First Name' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type='text' id='last_name' value={employeeFormData.last_name} onChange={handleInputChange} placeholder='Employee Last Name' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type='email' id='email' value={employeeFormData.email} onChange={handleInputChange} placeholder='Employee Email Address' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Gender</Form.Label>
                        <Form.Select id='gender' value={employeeFormData.gender} onChange={handleInputChange} required>
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Department</Form.Label>
                        <Form.Select id='department' value={employeeFormData.department} onChange={handleInputChange} required>
                            <option value="">Select depatment</option>
                            {departmentsMap}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Section</Form.Label>
                        <Form.Select id='section' value={employeeFormData.section} onChange={handleInputChange} required>
                            <option value="">Select section</option>
                            {sectionsMap}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Position</Form.Label>
                        <Form.Control type='text' id='position' value={employeeFormData.position} onChange={handleInputChange} placeholder='Employee Position' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Role</Form.Label>
                        <Form.Select id='role' value={employeeFormData.role} onChange={handleInputChange} required>
                            <option value="">Select Employee Role</option>
                            {rolesOptions}
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" variant="success" className="col-md-3 mx-auto mt-3">Register new employee</Button>
                </Row>
            </Form>
        </>
     );
}
 
export default EmployeeForm;