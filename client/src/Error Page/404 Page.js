import Image from '../assets/images/Error.png'
import Button
 from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import './Error.css'
const ErrorPage = () => 
{
    const navigate=useNavigate()
    return (  
        <>
            <div className='error-message'>
                <img src={Image} alt='404 Error'/>
                <h1>404- Page Not Found</h1>
                <p>The page you are looking for might have been removed, had its name changed or is temporarily unavailable</p>
                <Button className="btn btn-primary" onClick={() => navigate(-1)}>Go back</Button>
            </div>
        </>
    );
}
 
export default ErrorPage;