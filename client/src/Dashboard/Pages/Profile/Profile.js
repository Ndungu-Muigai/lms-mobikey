import {useEffect, useState} from 'react'
import {toast} from "react-toastify"

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

const Profile = () => 
{
    const [employeeData, setEmployeeData]=useState()
    const [errorMessage, setErrorMessage] = useState("")
    const [password, setPassword]=useState(
        {
            current_password: "",
            new_password: "",
            confirm_password: ""
        })

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

    const handlePasswordChange= e => setPassword({...password, [e.target.id]: e.target.value})

    const updatePassword= e =>
    {
        e.preventDefault()
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}/.test(password.new_password)) 
        {
            setErrorMessage("Password must be at least 10 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)")
        }
        else
        {
            setErrorMessage("")
            fetch("/profile",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(password)
            })
            .then(response => response.json())
            .then(message =>
                {
                    message.success
                    ?
                        toast.success(message.success,
                        {
                            position: "top-right",
                            className: "toast-message",
                            autoClose: 2000,
                            onClose: ()=> setPassword({current_password: "", new_password: "", confirm_password: ""})
                        })
                    :
                        toast.error(message.error,
                        {
                            position: "top-right",
                            className: "toast-message",
                            autoClose: 2000,
                        })
                })
        }
    }

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
            <Form onSubmit={updatePassword}>
                <h2 className='text-uppercase fw-bolder'>Change password</h2>
                <Row>
                    <Form.Group className='col-md-4'>
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type='password' id="current_password" value={password.current_password} onChange={handlePasswordChange} placeholder='Enter current password' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4'>
                        <Form.Label>New password</Form.Label>
                        <Form.Control type='password' id="new_password" placeholder='Enter new password' value={password.new_password} onChange={handlePasswordChange} required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4'>
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type='password' id="confirm_password" placeholder='Confirm new password' value={password.confirm_password} onChange={handlePasswordChange} required></Form.Control>
                    </Form.Group>
                    {errorMessage && <div style={{ color: 'red' }} className='mx-2'>{errorMessage}</div>}
                    <Button variant='success' type='submit' className='mx-auto col-md-2 mt-3'>Update password</Button>
                </Row>
            </Form>
        </>
     );
}
 
export default Profile;