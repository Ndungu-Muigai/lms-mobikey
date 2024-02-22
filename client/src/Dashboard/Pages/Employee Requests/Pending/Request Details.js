/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

const RequestDetails = () => 
{
    const [file, setFile]=useState(null)
    const [applicationDetails, setApplicationDetails]=useState(null)
    const {id}=useParams()
    const navigate=useNavigate()
    

    useEffect(()=>
    {
        fetch(`/pending-employee-requests/${id}`)
        .then(response => response.json())
        .then(data =>setApplicationDetails(data))
    },[id])
    
    useEffect(() => 
    {
        if (applicationDetails && applicationDetails.file_attachment) 
        {
            fetch(`/static/${applicationDetails.file_attachment}`)
            .then(response => response.blob())
            .then(data => setFile(data))
        }
    }, [applicationDetails]);

    if (!applicationDetails) 
    {
        return <div>Fetching data...</div>;
    }

    const { employee, leave_type, leave_duration, start_date, end_date, total_days, reason, hod_status, hr_status, gm_status } = applicationDetails;
    const first_name = employee ? employee.first_name : '';
    const last_name = employee ? employee.last_name : '';

    return ( 
        <>
            <Form>
                <Row className="mt-2">
                    <div className="col-md-12 d-flex justify-content-between align-items-center">
                        <h1 className="fw-bolder text-uppercase fs-4">Request Details</h1>
                        <div className="btn btn-success" onClick={() => navigate(-1)}>Go back</div>
                    </div>
                    <Form.Group className="col-md-6 mb-2">
                        <Form.Label>Employee First Name</Form.Label>
                        <Form.Control value={first_name} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-6 mb-2">
                        <Form.Label>Employee Last Name</Form.Label>
                        <Form.Control value={last_name} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-6 mb-2">
                        <Form.Label>Leave Type</Form.Label>
                        <Form.Control value={leave_type || ''} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-6 mb-2">
                        <Form.Label>Leave Duration</Form.Label>
                        <Form.Control value={leave_duration || ''} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-4 mb-2">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control value={start_date || ''} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-4 mb-2">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control value={end_date || ''} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-4 mb-2">
                        <Form.Label>Number of days</Form.Label>
                        <Form.Control value={total_days || ''} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-6 mb-2">
                        <Form.Label>File Attachment</Form.Label>
                        {
                        file 
                        ? 
                            <Form.Control as="a" href={URL.createObjectURL(file)}  target="_blank" rel="noopener noreferrer">View file attachment</Form.Control>
                        : 
                            <Form.Control value="No file attachment" disabled></Form.Control>
                        }
                    </Form.Group>
                    <Form.Group className="col-md-6 mb-2">
                        <Form.Label>Reason for leave</Form.Label>
                        <Form.Control value={reason || 'No reason'} disabled></Form.Control>
                    </Form.Group>
                    <h1 className="text-uppercase fw-bolder fs-4 my-3">Approval Status</h1>
                    <Form.Group className="col-md-4 mb-2">
                        <Form.Label>Head of Department</Form.Label>
                        <Form.Control value={hod_status || ''} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-4 mb-2">
                        <Form.Label>General Manager</Form.Label>
                        <Form.Control value={gm_status || ''} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className="col-md-4 mb-2">
                        <Form.Label>Human Resource Manager</Form.Label>
                        <Form.Control value={hr_status || ''} disabled></Form.Control>
                    </Form.Group>
                    <div className="col-md-12 text-center d-flex flex-row justify-content-around my-3">
                        <Button variant="success">Approve request</Button>
                        <Button className="btn btn-danger">Reject request</Button>
                    </div>
                </Row>
            </Form>
        </>
     );
}
 
export default RequestDetails;