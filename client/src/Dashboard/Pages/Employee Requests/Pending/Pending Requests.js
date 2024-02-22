import { useEffect, useState } from "react";
import TableBody from "./Table Body";

const PendingRequests = () => 
{
    const [pendingRequests, setPendingRequests]=useState([])

    useEffect(()=>
    {
        fetch("/pending-employee-requests")
        .then(response => response.json())
        .then(data => setPendingRequests(data))
    },[])

    const requestsMap=pendingRequests.map(request => 
        {
            return (<TableBody key={request.id} request={request}/>)
        })
    return ( 
        <>
            <h1 className="text-uppercase text-center fw-bolder">Pending Employee Requests</h1>
            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th scope="col">Employee Name</th>
                        <th scope="col">Leave Type</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Number of days</th>
                        <th scope="col" colSpan={2} className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingRequests.length === 0
                        ?
                            <tr>
                                <td colSpan={6} className='fs-5 p-2'>No data could be fetched</td>
                            </tr>
                        :
                            requestsMap
                    }
                </tbody>
            </table>
        </>
     );
}
 
export default PendingRequests;