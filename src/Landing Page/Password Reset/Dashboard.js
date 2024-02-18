import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
const Dashboard = () => 
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
                console.log(data)
            })
        // .catch(error =>
        //     {
        //         toast.error(error.error,
        //             {
        //                 position: "top-right",
        //                 autoClose: 2000,
        //                 className: "toast-message"
        //             })
        //             setTimeout(() => navigate("/login"), 2000);
        //     })
    },[])

    // console.log(full_name)
    // console.log(leaveDays)

    
    return ( 
        <>
            <h1>Dashboard Page</h1>
            {/* {full_name ? console.log('Yes') : navigate("/login")} */}
        </>
     );
}
 
export default Dashboard;
