import Form from 'react-bootstrap/Form'
import Button  from 'react-bootstrap/Button';

import MANImage from '../../assets/images/Logo.png'

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {toast} from "react-toastify"

const Reset = () => 
{
    const navigate=useNavigate()

    const [errorMessage, setErrorMessage] = useState("")
    const [email, setEmail]=useState("")
    const [passwordReset, setPasswordReset] = useState(localStorage.getItem('passwordReset'));
    const [passwords, setPasswords]=useState(
        {
            otp: "",
            new_password: "",
            confirm_password: ""
        })


    useEffect(() => 
    {
        const storedPasswordReset = localStorage.getItem('passwordReset');
        setPasswordReset(storedPasswordReset);
    }, []);

    const handleEmailChange= e => setEmail(e.target.value)

    const handlePasswordChange= e => setPasswords({...passwords, [e.target.id]: e.target.value})

    const generateOTP= e =>
    {
        e.preventDefault()
        setErrorMessage("")
        fetch("/generate-otp",
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"email": email})
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
                            onClose: ()=> 
                            {
                                localStorage.setItem("passwordReset", true)
                                setPasswordReset(true)
                                setEmail("")
                            }
                        })

                :
                   toast.error(message.error,
                    {
                        position: "top-right",
                        className: "toast-message",
                        autoClose: 2000,
                        onClose:  ()=> 
                        {
                            localStorage.setItem("passwordReset", false)
                            setPasswordReset(false)
                        }
                    })
            })
    }

    const resetPassword = e =>
    {
        e.preventDefault()

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}/.test(passwords.new_password)) 
        {
            setErrorMessage("Password must be at least 10 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)")
        }
        else
        {
            setErrorMessage("")
            fetch("/update-password-with-otp",
            {
                method:"POST",
                headers:
                {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(passwords)
            })
            .then(response =>response.json())
            .then(message => 
                {
                    message.success
                    ?
                        toast.success(message.success,
                        {
                            position: "top-right", 
                            className: "toast-message",
                            autoClose: 2000,
                            onClose: ()=> 
                            {
                                localStorage.removeItem("passwordReset")
                                setPasswordReset(false)
                                navigate("/login")
                            }
                        })

                    :
                        toast.error(message.error,
                        {
                            position: "top-right",
                            className: "toast-message",
                            autoClose: 2000,
                            onClose: ()=> 
                            {
                                localStorage.setItem("passwordReset", false)
                                setPasswordReset(false)
                            }
                        })
                })
        }
    }

    return ( 
        <div className="background d-flex justify-content-end align-items-center">
            <div className='form mx-4 bg-light'>
                <img src={MANImage} alt='Logo' className='img-thumbnail mb-2 border border-0'/>
                {
                    passwordReset === null || passwordReset === 'false'
                    ?
                        <>
                            <h1 className='mb-3 text-center text-uppercase'>Password Reset</h1>
                            <Form onSubmit={generateOTP}>
                                <Form.Group className='mx-2 mb-3'>
                                    <Form.Label className='fs-5'>Email</Form.Label>
                                    <Form.Control type='email' id="email" value={email} onChange={handleEmailChange} placeholder='Enter your email address' required></Form.Control>
                                </Form.Group>
                                <div className="container mt-2">
                                    <Button type="submit" className="btn btn-success col-12 mb-3">Generate One Time Password</Button>
                                    <Link to="/login" className="col-12 btn btn-danger mb-3">Back to login</Link>
                                </div>
                            </Form>
                        </>
                    :
                        <Form onSubmit={resetPassword}>
                            <Form.Group className='mx-2 mb-2'>
                                <Form.Label className='fs-5'>One Time password</Form.Label>
                                <Form.Control type='text' id="otp" value={passwords.otp} onChange={handlePasswordChange} placeholder='Enter your new password' required></Form.Control>
                            </Form.Group>
                            <Form.Group className='mx-2 mb-2'>
                                <Form.Label className='fs-5'>New password</Form.Label>
                                <Form.Control type='password' id="new_password" value={passwords.new_password} onChange={handlePasswordChange} placeholder='Enter your new password' required></Form.Control>
                            </Form.Group>
                            <Form.Group className='mx-2 mb-2'>
                                <Form.Label className='fs-5'>Confirm new password</Form.Label>
                                <Form.Control type='password' id="confirm_password" value={passwords.confirm_password} onChange={handlePasswordChange} placeholder='Confirm your new password' required></Form.Control>
                            </Form.Group>
                            {errorMessage && <div style={{ color: 'red' }} className='mx-2'>{errorMessage}</div>}
                            <div className="container mt-4">
                                <Button type="submit" className="btn btn-success col-12 mb-3">Reset Password</Button>
                                <Link to="/login" className="col-12 btn btn-danger mb-3">Back to login</Link>
                            </div>
                        </Form>
                }
            </div>
        </div>
     );
}
 
export default Reset;
