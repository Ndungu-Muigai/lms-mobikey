/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {toast} from 'react-toastify'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

const IndividualEmployee = () => 
{
    const [employeeDetails, setEmployeeDetails]=useState()
    const navigate=useNavigate()
    const {id}=useParams()

    const fetchData= () =>
    {
        fetch(`/employees-data/${id}`)
        .then(response => response.json())
        .then(data => setEmployeeDetails(data))
    }

    useEffect(()=>
    {
        fetchData()
    },[])

    console.log(employeeDetails)

    const handleInputChange= e => setEmployeeDetails({...employeeDetails,[e.target.id]:e.target.value})

    const editDetails= e =>
    {
        e.preventDefault()
        fetch(`/employees-data/${id}`,
        {
            method: "PATCH",
            headers:
            {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(employeeDetails)
        })
        .then(response => response.json())
        .then(data => 
            {
                console.log(data)
                data.success
                ?
                    toast.success(data.success,
                        {
                            position: "top-right",
                            className: "toast-message",
                            autoClose: 2000,
                            onClose: fetchData()
                        })
                :
                    toast.error(data.error,
                        {
                            position: "top-right",
                            className: "toast-message",
                            autoClose: 2000,
                            onClose: fetchData()
                        })
            })
    }

    return ( 
        <>
            {
                employeeDetails 
                ?
                    <Form onSubmit={editDetails}>
                        <Row className="mt-2">
                            <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <h1 className="fw-bold text-uppercase fs-3">{employeeDetails.first_name} {employeeDetails.last_name}'s details</h1>
                                <div className="btn btn-success" onClick={() => navigate(-1)}>Go back</div>
                            </div>
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control disabled value={employeeDetails.first_name}></Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control disabled value={employeeDetails.last_name}></Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control disabled value={employeeDetails.email}></Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>Section</Form.Label>
                                <Form.Control disabled value={employeeDetails.section}></Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Control disabled value={employeeDetails.department}></Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>Position</Form.Label>
                                <Form.Control disabled value={employeeDetails.position}></Form.Control>
                            </Form.Group>
                            <h1 className="fw-bold text-uppercase my-3 fs-3">{employeeDetails.first_name} {employeeDetails.last_name}'s leave days</h1>
                            <Form.Group className="col-md-4">
                                <Form.Label className="fw-bold text-uppercase">Normal Leave Days</Form.Label>
                                <Form.Control type="number" id="normal_leave" value={employeeDetails.normal_leave} step={0.5} onChange={handleInputChange}></Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-4">
                                <Form.Label className="fw-bold text-uppercase">Sick Leave Days</Form.Label>
                                <Form.Control type="number" id="sick_leave" value={employeeDetails.sick_leave} step={0.5} onChange={handleInputChange}></Form.Control>
                            </Form.Group>
                            {
                                employeeDetails.gender === "Male"
                                ?
                                    <>
                                        <Form.Group className="col-md-4">
                                            <Form.Label className="fw-bold text-uppercase">Paternity Leave Days</Form.Label>
                                            <Form.Control type="number" id="paternity_leave" value={employeeDetails.paternity_leave} disabled></Form.Control>
                                        </Form.Group>
                                    </>
                                :
                                    <>
                                        <Form.Group className="col-md-4">
                                            <Form.Label className="fw-bold text-uppercase">Maternity Leave Days</Form.Label>
                                            <Form.Control type="number" id="maternity_leave" value={employeeDetails.maternity_leave} disabled></Form.Control>
                                        </Form.Group>
                                    </>
                            }
                            <div className="col-md-12 text-center d-flex flex-row justify-content-around my-3">
                                <Button variant="success" type="submit">Update Details</Button>
                                <div className="btn btn-danger">Disable account</div>
                            </div>
                        </Row>
                    </Form>
                :
                    <div>Fetching Employee Details</div>
            }
            
        </>
     );
}
 
export default IndividualEmployee;