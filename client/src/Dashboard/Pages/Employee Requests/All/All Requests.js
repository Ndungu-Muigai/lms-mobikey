import { useEffect, useState } from "react";
import Table from "./Table Body";

const AllEmployeeRequests = () => 
{
    const [requests, setRequests]=useState()
    const [filteredRequests, setFilteredRequests]=useState([])
    const [approvalStatusFilter, setApprovalStatusFilter] = useState("all")
    const [leaveTypeFilter, setLeaveTypeFilter] = useState("all")
    const [employeeFilter, setEmployeeFilter]=useState("")

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
            <div className="my-2">
                {/* <h1 className="fs-4 fw-bolder mt-2">Sort by:</h1> */}
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="employee" className="form-label">Employee name</label>
                        <input type="text" name="employee" className="form-control" placeholder="Employee name e.g. John Doe" onChange={(e => setEmployeeFilter(e.target.value))}/>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="leaveType" className="form-label">Leave Type</label>
                        <select name="leaveType" className="form-select" onChange={(e => setLeaveTypeFilter(e.target.value))}>
                            <option value="all">All</option>
                            <option value="normal">Normal</option>
                            <option value="sick">Sick</option>
                            <option value="paternity">Paternity</option>
                            <option value="maternity">Maternity</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="approvalStatus" className="form-label">Approval status</label>
                        <select name="approvalStatus" className="form-select" onChange={(e => setApprovalStatusFilter(e.target.value))}>
                            <option value="all">All</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>
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
                                <td colSpan={8} className='fs-5 p-2'>No requests could be fetched</td>
                            </tr>
                    }
                </tbody>
            </table>
        </>
     );
}
 
export default AllEmployeeRequests;