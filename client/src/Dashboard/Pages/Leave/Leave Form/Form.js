/* eslint-disable react-hooks/exhaustive-deps */
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import DateRange from '../Calculations/Date Ranges'
import Days from '../Calculations/Leave Days'

import { useEffect, useState } from 'react'
import {toast} from 'react-toastify'

const LeaveForm = ({leaveDays, gender, updateLeaveApplications}) => 
{
    const {minDateRange, MaxDateRange}=DateRange()

    //Declaring the form's state
    const [leaveFormData, setLeaveFormData]=useState(
        {
            leave_type: "",
            leave_duration: "",
            start_date: "",
            end_date: "",
            total_days: null,
            file_attachment: null,
            reason: ""
        })

    //Function to handle state change
    const handleInputChange= e => setLeaveFormData({...leaveFormData, [e.target.id]: e.target.value})

    //Function to handle file input change
    const handleFileInputChange = e => setLeaveFormData({ ...leaveFormData,file_attachment: e.target.files[0]})

    //useEffect hook to change the end date state back to default once the start date changes
    useEffect(()=>
    {
        setLeaveFormData(
            {
                ...leaveFormData, 
                end_date : ""
            })
    },[leaveFormData.start_date])

    //useEffect to trigger calculation of leave days once end_date, leave_type and leave_duration states change
    useEffect(()=>
    {
        const leave_days=Days(leaveFormData.start_date, leaveFormData.end_date,leaveFormData.leave_type, leaveFormData.leave_duration)
        setLeaveFormData(
            {
                ...leaveFormData,
                total_days: leave_days
            })
    },[leaveFormData.end_date, leaveFormData.leave_type, leaveFormData.leave_duration, leaveFormData.start_date])

    //Setting the file upload input field to required once the leave type is sick or paternity
    const fileRequired = leaveFormData.leave_type === "Sick" || leaveFormData.leave_type === "Paternity" ? "required" : ""

    //Form submission function
    const submitApplication= e =>
    {
        e.preventDefault()
        
        const formData = new FormData();
        formData.append("leave_type", leaveFormData.leave_type);
        formData.append("leave_duration", leaveFormData.leave_duration);
        formData.append("start_date", leaveFormData.start_date);
        formData.append("end_date", leaveFormData.end_date);
        formData.append("total_days", leaveFormData.total_days);
        formData.append("file_attachment", leaveFormData.file_attachment);
        formData.append("reason", leaveFormData.reason);

        fetch("/leave-applications", 
        {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => 
        {
            data.success
            ?
                toast.success(data.success,
                    {
                        position: "top-right",
                        className: "toast-message",
                        autoClose: 2000,
                        onClose: ()=>
                        {
                            updateLeaveApplications(data.application)
                            setLeaveFormData(
                                {
                                    leave_type: "",
                                    leave_duration: "",
                                    start_date: "",
                                    end_date: "",
                                    total_days: null,
                                    file_attachment: null,
                                    reason: ""
                                })
                        }
                    })
            :
                toast.error(data.error,
                    {
                        position: "top-right",
                        className: "toast-message",
                        autoClose: 2000
                    })
        });
       
    }
    return ( 
        <>
            <Form onSubmit={submitApplication} encType="multipart/form-data">
                <Row>
                    <h1 className='text-uppercase fs-2 fw-bold'>Available Leave Days</h1>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>Normal Leave</Form.Label>
                        <Form.Control type='number' defaultValue={leaveDays.normal_leave} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>Sick Leave</Form.Label>
                        <Form.Control type='number' defaultValue={leaveDays.sick_leave} disabled></Form.Control>
                    </Form.Group>
                    {
                        gender === "Male"
                        ?
                            <Form.Group className='col-md-4 mb-3'>
                                <Form.Label>Paternity Leave</Form.Label>
                                <Form.Control type='number' defaultValue={leaveDays.paternity_leave} disabled></Form.Control>
                            </Form.Group>
                        :
                            <Form.Group className='col-md-4 mb-3'>
                                <Form.Label>Maternity Leave</Form.Label>
                                <Form.Control type='number' defaultValue={leaveDays.maternity_leave} disabled></Form.Control>
                            </Form.Group>
                    }
                
                    <h1 className='text-uppercase fs-2 fw-bold'>Leave application details</h1>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Leave Type</Form.Label>
                        <Form.Select id='leave_type' value={leaveFormData.leave_type} onChange={handleInputChange} required>
                            <option value="">Select Leave Type</option>
                            <option value="Normal">Normal Leave</option>
                            <option value="Sick">Sick Leave</option>
                            {
                                gender === "Male"
                                ?
                                    <option value="Paternity">Paternity Leave</option>
                                :
                                    <option value="Maternity">Maternity Leave</option>
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Leave Duration</Form.Label>
                        <Form.Select id='leave_duration' value={leaveFormData.leave_duration} onChange={handleInputChange}required>
                            <option value="">Select Leave Duration</option>
                            <option value="Full">Full Day</option>
                            <option value="Half">Half Day</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type='date' id='start_date' min={minDateRange} max={MaxDateRange} value={leaveFormData.start_date} onChange={handleInputChange} required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type='date' id='end_date' min={leaveFormData.start_date} max={MaxDateRange} value={leaveFormData.end_date} onChange={handleInputChange} required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>Number of days</Form.Label>
                        <Form.Control type='number' id='total_days' value={leaveFormData.total_days ? leaveFormData.total_days : 0} onChange={handleInputChange} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>File attachment</Form.Label>
                        <Form.Control type='file' id='file_attachment' onChange={handleFileInputChange} accept="image/*, application/pdf" required={fileRequired} />
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Reason</Form.Label>
                        <Form.Control type='textarea' aria-colspan={20} aria-rowspan={1} value={leaveFormData.reason} placeholder='Reason for leave (Optional)' onChange={handleInputChange}></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="success" className="col-md-3 mx-auto mt-3">Submit application</Button>
                </Row>
            </Form>
        </>
     );
}
 
export default LeaveForm;