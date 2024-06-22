import { useEffect, useState } from "react";

import TableBody from "./Table Body";
import Pagination from 'react-bootstrap/Pagination';

const PendingRequests = () => 
{
    const [pendingRequests, setPendingRequests]=useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 10;

    const lastRequestIndex = currentPage * dataPerPage;
    const firstRequestIndex = lastRequestIndex - dataPerPage;


    useEffect(()=>
    {
        fetch("/pending-employee-requests")
        .then(response => response.json())
        .then(data => setPendingRequests(data.pending_requests))
    },[])

    const currentRequests = pendingRequests.slice(firstRequestIndex, lastRequestIndex);
    const totalPages = Math.ceil(pendingRequests.length / dataPerPage);

    const requestsMap=currentRequests.map(request => 
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
                                <td colSpan={6} className='fs-5 p-2'>No pending requests</td>
                            </tr>
                        :
                            requestsMap
                    }
                </tbody>
            </table>
            <div className="d-flex justify-content-center">
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} title='First Page'/>
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} title='Previous'/>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)} className={i + 1 === currentPage ? 'active-page' : ''}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} title='Next'/>
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} title='Last Page'/>
                </Pagination>
            </div>
        </>
     );
}
 
export default PendingRequests;