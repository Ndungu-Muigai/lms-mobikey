import Form from 'react-bootstrap/Form'
import Button  from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import MANImage from '../../assets/images/Logo.png'
import { useState } from 'react';
const Reset = () => 
{
    const [email, setEmail]=useState("")

    const handleInputChange= e => setEmail(e.target.value)
    return ( 
        <div className="background d-flex justify-content-end align-items-center">
            <Form className='form mx-4 bg-light'>
                <img src={MANImage} alt='Logo' className='img-thumbnail mb-3 border border-0'/>
                <h1 className='mb-4 text-center text-uppercase'>Password Reset</h1>
                <Form.Group className='mx-2 mb-3'>
                    <Form.Label className='fs-5'>Email</Form.Label>
                    <Form.Control type='email' id="email" value={email} onChange={handleInputChange} placeholder='Enter your email address' required></Form.Control>
                </Form.Group>
                <div className="container mt-4">
                    <Button type="submit" className="btn btn-success col-12 mb-3">Generate One Time Password</Button>
                    <Link to="/login" className="col-12 btn btn-danger mb-3">Back to login</Link>
                </div>
            </Form>
        </div>
     );
}
 
export default Reset;