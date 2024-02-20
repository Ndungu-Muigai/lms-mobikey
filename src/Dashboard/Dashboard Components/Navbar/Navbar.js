import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './Navbar.css'

const NavBar = ({sidebarOpen, setSidebarOpen}) => 
{
    const navigate=useNavigate()
    const logOut= () =>
    {
        fetch("/logout",
        {
            method: "POST"
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
                        onClose: navigate("/login")
                    })
                :
                    toast.error(message.error,
                    {
                        position: "top-right",
                        className: "toast-message"
                    })
            })
    }
    return ( 
        <>
            <Navbar fixed='top' style={{height: "65px"}} className='bg-dark navbar'>
                <Navbar.Brand>
                    <i className={`hamburger ${sidebarOpen ? "fa fa-close" : "fa fa-bars"}`} aria-hidden="true" onClick={()=> setSidebarOpen(!sidebarOpen)}></i>
                </Navbar.Brand>
                <Navbar.Collapse className='justify-content-end'>
                    <Nav.Link href='/profile'>Profile</Nav.Link>
                    <Nav.Link onClick={logOut}>Sign Out</Nav.Link>
                </Navbar.Collapse>
            </Navbar>
        </>
     );
}
 
export default NavBar;