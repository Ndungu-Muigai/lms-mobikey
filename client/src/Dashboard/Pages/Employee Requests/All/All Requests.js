import { useEffect, useState } from "react";
import Table from "./Table Body";

const AllEmployeeRequests = () => 
{
    const [requests, setRequests]=useState()

    useEffect(()=>
    {
        fetch("/employee-requests")
        .then(response => response.json())
        .then(data => setRequests(data))
    },[])

    if(!requests)
    {
        return(
            <div>Fetching requests...</div>
        )
    }

    const requestsMap=requests.map(application =>
        {
            return <Table key={application.id} application={application}/>
        })
    return ( 
        <>
            <h1 className="text-uppercase text-center fs-2 fw-bolder mt-2">All Employee Requests</h1>
            <table className="table table-stripped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Employee Name</th>
                        <th scope="col">Leave Type</th>
                        <th scope="col">Leave Duration</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Number of days</th>
                        <th scope="col">File Attachment</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        requests.length > 0
                        ?
                            requestsMap
                        :
                            <tr>
                                <td colSpan={8} className='fs-5 p-2'>Fetching requests...</td>
                            </tr>
                    }
                </tbody>
            </table>
        </>
     );
}
 
export default AllEmployeeRequests;