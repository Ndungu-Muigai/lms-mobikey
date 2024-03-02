import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MANImage from '../../assets/images/Logo.png';

import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"

const UpdatePassword = () => 
{
    const [formData, setFormData] = useState(
    {
        new_password: "",
        confirm_password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const navigate=useNavigate()

    const updatedFormDetails = e => setFormData({ ...formData, [e.target.id]: e.target.value });

    const submitData = e => 
    {
        e.preventDefault();
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}/.test(formData.new_password)) 
        {
            setErrorMessage("Password must be at least 10 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)");
        }

        else
        {
            fetch("/update-password",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
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
                            onClose: ()=> navigate("/dashboard")  
                        })
                    :
                        toast.error(message.error,
                            {
                                position: "top-right",
                                className: "toast-message", 
                                autoClose: 2000
                            })
                })
        }
    }

    return (
        <>
            <div className="background d-flex justify-content-end align-items-center">
                <Form className='form mx-4 mt-4 bg-light' onSubmit={submitData}>
                    <img src={MANImage} alt='Logo' className='img-thumbnail mb-3 border border-0' />
                    <Form.Group className='mx-2 mb-2'>
                        <Form.Label>Enter new password</Form.Label>
                        <Form.Control type='password' id='new_password' value={formData.new_password} placeholder='Enter your new password' onChange={updatedFormDetails} required />
                    </Form.Group>
                    <Form.Group className='mx-2 mb-2'>
                        <Form.Label>Confirm new password</Form.Label>
                        <Form.Control type='password' id='confirm_password' value={formData.confirm_password} placeholder='Confirm your new password' onChange={updatedFormDetails} required />
                    </Form.Group>
                    {errorMessage && <div style={{ color: 'red' }} className='mx-2'>{errorMessage}</div>}
                    <div className="container">
                        <Button variant='success' type='submit' className="col-md-12 mx-auto my-3">Update password</Button>
                    </div>
                </Form>
            </div>
        </>
    );
}

export default UpdatePassword;
