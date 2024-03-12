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
                message.success
                ?
                    message.first_login
                    ?
                        toast.success("Login successful. Redirecting to password reset page...",
                        {
                            position: "top-right",
                            className: "toast-message",
                            autoClose: 2000,
                            onClose: ()=> navigate("/update")
                        })
                    :
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
        <div className="background d-flex justify-content-end align-items-start">
            <Form className="bg-light form mx-3 p-1" onSubmit={formSubmit}>
                <img src={MANImage} alt="Mobikey Logo" className="img-thumbnail mb-3 border border-0" />
                <Form.Group className="mx-2 mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="name" id="username" value={loginInfo.username} onChange={handleInputChange} placeholder="Enter your username" required></Form.Control>
                </Form.Group>
                <Form.Group className="mx-2 mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" id="password" value={loginInfo.password} onChange={handleInputChange} placeholder="Enter your password" required></Form.Control>
                </Form.Group>
                <div className="d-flex justify-content-between gap-5 mt-3 px-2">
                    <Button type="submit" variant="success" className="col-md-5">Login</Button>
                    <Link className="btn btn-danger col-md-5" to="/">Cancel</Link>
                </div>
                <div className='px-2 my-2'>
                    <Link className="btn btn-danger col-12" to="/reset">Forgot password?</Link>
                </div>
            </Form>
        </div>
     );
}
 
export default Login;