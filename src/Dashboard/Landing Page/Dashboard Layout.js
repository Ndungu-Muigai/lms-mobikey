import {useEffect, useRef, useState} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from '../Dashboard Components/Navbar/Navbar'
// import Sidebar from '../Dashboard Components/Sidebar/Sidebar'
import Dashboard from './Pages/Dashboard'
import { toast } from 'react-toastify'

const DashboardLayout = () => 
{
    const navigate=useNavigate()

    const [full_name, setFullName]=useState("")
    const [leaveDays, setLeaveDays]=useState()
    const id=useRef(null)


    useEffect(()=>
    {
        fetch("/dashboard")
        .then(response => response.json())
        .then(data => 
        {
            setFullName(data.full_name)
            setLeaveDays(data.leave_days)
        })
        
    },[])

    return ( 
        <>
            {
                full_name 
                ? 
                    <>
                        {toast.dismiss()}
                        <Navbar/>
                        {/* <Sidebar/> */}
                        <Routes>
                            <Route exact path='/' element={<Dashboard full_name={full_name} leaveDays={leaveDays}/>}></Route>
                        </Routes>
                    </>
                : 
                    <>
                        {
                            toast.error("Kindly log in to continue",
                            {
                                position: "top-right",
                                toastId: "auth",
                                className: "toast-message",
                                autoClose: 2000,
                                onClose:  () =>
                                {
                                    id.current="auth"
                                    navigate("/login")   
                                }
                            })
                        }
                    </>
            }
        </>
     );
}
 
export default DashboardLayout;
