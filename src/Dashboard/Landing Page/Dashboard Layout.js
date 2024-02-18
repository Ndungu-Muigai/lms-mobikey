import {useEffect, useState} from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
// import Navbar from '../Dashboard Components/Navbar/Navbar'
// import Sidebar from '../Dashboard Components/Sidebar/Sidebar'
import Dashboard from './Pages/Dashboard'

const DashboardLayout = () => 
{
    const navigate=useNavigate()

    const [full_name, setFullName]=useState("")
    const [leaveDays, setLeaveDays]=useState()

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
                    // (
                    <>
                        {/* <Navbar/>
                        <Sidebar/> */}
                        <Routes>
                            <Route exact path='/' element={<Dashboard full_name={full_name} leaveDays={leaveDays}/>}></Route>
                        </Routes>
                    </>
                    // ) 
                : 
                    navigate("/login")
            }
        </>
     );
}
 
export default DashboardLayout;
