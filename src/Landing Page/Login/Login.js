import Form from 'react-bootstrap/Form'
import Button  from 'react-bootstrap/Button';

import { useState } from 'react';
import {toast} from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom';

import './Login.css'
import MANImage from '../../assets/images/Logo.png'


const Login = () => 
{
    const [loginInfo, setLoginInfo]=useState(
        {
            username: "",
            password: ""
        })

    const handleInputChange = e => setLoginInfo({...loginInfo, [e.target.id]: e.target.value})

    const navigate=useNavigate()
    const formSubmit= e =>
    {
        e.preventDefault()
        fetch("/login",
        {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginInfo)
        })
        .then(response => response.json())
        .then(message => 
            {
                message.success ? 
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
                        className: "toast-message"
                    })
                }
            )
    }
    return ( 
        <div className='background d-flex justify-content-end align-items-center'>
            <Form className='form mx-4 mt-4 bg-light' onSubmit={formSubmit}>
                <img src={MANImage} alt='Logo' className='img-thumbnail mb-3 border border-0'/>
                <Form.Group className='mx-2 mb-2'>
                    <Form.Label className='fs-5'>Username</Form.Label>
                    <Form.Control type='username' id="username" value={loginInfo.username} onChange={handleInputChange} placeholder='Enter your username' required></Form.Control>
                </Form.Group>
                <Form.Group className='mx-2 mb-3'>
                    <Form.Label className='fs-5'>Password</Form.Label>
                    <Form.Control type='password' id="password" value={loginInfo.password} onChange={handleInputChange} placeholder='Enter your password' required></Form.Control>
                </Form.Group>
                <div className="mt-3 buttons">
                    <Button variant='success' type='submit' className='col-md-5 ms-2'>Login</Button>
                    <Link to="/" variant='danger' className='btn btn-danger col-md-5 ms-5 me-2'>Back</Link>
                </div>
                <div className="container">
                    <Link to="/reset" className='btn btn-danger col-md-12 mx-auto my-3'>Forgot password?</Link>
                </div> 
            </Form>
        </div>
     );
}
 
export default Login;