import {useEffect, useState} from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

const Profile = () => 
{
    const [employeeData, setEmployeeData]=useState()

    useEffect(()=>
    {
        fetch("/profile")
        .then(response => response.json())
        .then(data => setEmployeeData(data))
    },[])

    if(!employeeData)
    {
        return <div>Fetching data. Please hold on....</div>
    }

    let {first_name, last_name, email, gender, department, section, position, role}=employeeData

    return ( 
        <>
            <section className="row mt-2">
                <h2 className='text-uppercase fw-bolder'>General information</h2>
                <div className="col-md-6 mb-3">
                    <p className='form-label fs-6'>First Name</p>
                    <input type="text" value={first_name} className="form-control fs-6" disabled/>
                </div>
                <div className="col-md-6 mb-3">
                    <p className='form-label fs-6'>Last Name</p>
                    <input type="text" value={last_name} className="form-control fs-6" disabled/>
                </div>
                <div className="col-md-6 mb-3">
                    <p className='form-label fs-6'>Email Address</p>
                    <input type="text" value={email} className="form-control fs-6" disabled/>
                </div>
                <div className="col-md-6">
                    <p className='form-label fs-6'>Gender</p>
                    <input type="text" value={gender} className="form-control fs-6" disabled/>
                </div>
                <div className="col-md-6 mb-3">
                    <p className='form-label fs-6'>Department</p>
                    <input type="text" value={department} className="form-control fs-6" disabled/>
                </div>
                <div className="col-md-6 mb-3">
                    <p className='form-label fs-6'>Section</p>
                    <input type="text" value={section} className="form-control fs-6" disabled/>
                </div>
                <div className="col-md-6 mb-3">
                    <p className='form-label fs-6'>Position</p>
                    <input type="text" value={position} className="form-control fs-6" disabled/>
                </div>
                <div className="col-md-6 mb-3">
                    <p className='form-label fs-6'>Role</p>
                    <input type="text" value={role} className="form-control fs-6" disabled/>
                </div>
            </section>
            <Form>
                <h2 className='text-uppercase fw-bolder'>Change password</h2>
                <Row>
                    <Form.Group className='col-md-4'>
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type='password' id="current_password" placeholder='Enter current password' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4'>
                        <Form.Label>New password</Form.Label>
                        <Form.Control type='password' id="new_password" placeholder='Enter new password' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4'>
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type='password' id="confirm_password" placeholder='Confirm new password' required></Form.Control>
                    </Form.Group>
                    <Button variant='success' className='mx-auto col-md-2 mt-3'>Update password</Button>
                </Row>
            </Form>
        </>
     );
}
 
export default Profile;