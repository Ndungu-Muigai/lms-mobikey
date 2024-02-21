import Accordion from 'react-bootstrap/Accordion'
import Pagination from 'react-bootstrap/Pagination'
import LeaveForm from '../Leave Form/Form'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TableData from './Table Data'

const Leave = () => 
{
    const [leaveApplications, setLeaveApplications]=useState([])
    const [leaveDays, setLeaveDays]=useState([])
    const [gender, setGender]=useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAccordionOpen, setAccordionOpen]=useState(true)
    const dataPerPage = 5

    const lastEmployeeIndex = currentPage * dataPerPage
    const firstEmployeeIndex = lastEmployeeIndex - dataPerPage

    const currentApplications = leaveApplications.slice(firstEmployeeIndex, lastEmployeeIndex)
    const totalPages = Math.ceil(leaveApplications.length / dataPerPage)
    const navigate = useNavigate()

    useEffect(()=>
    {
        fetch("/leave-applications")
        .then(response => response.json())
        .then(data => 
            {
                setLeaveApplications((data.leave_applications).reverse())
                setLeaveDays(data.leave_days)
                setGender(data.gender)
            })
    },[])

    const leaveApplicationsMap=currentApplications.map(application =>
        {
            return <TableData application={application} key={application.id}/>
        })

    return ( 
        <>
            <Accordion className='mt-3'>
                <Accordion.Item eventKey={isAccordionOpen ? "1" : "0"}>
                    <Accordion.Header>Create new leave application</Accordion.Header>
                    <Accordion.Body>
                        <LeaveForm leaveDays={leaveDays} gender={gender}/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th scope="col">Leave Type</th>
                        <th scope="col">Leave Duration</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        leaveApplications.length === 0
                        ?
                            <tr>
                                <td colSpan={5} className='fs-5 p-2 text-center'>No leave applications</td>
                            </tr>
                        : leaveApplicationsMap
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
     )
}
 
export default Leave