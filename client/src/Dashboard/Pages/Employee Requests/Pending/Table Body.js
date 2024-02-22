import {Link} from 'react-router-dom'

const TableBody = ({request}) => 
{
    let {id, employee: {first_name, last_name}, leave_type, start_date, end_date, total_days}=request
    return ( 
        <tr>
            <td data-label="Employee Name">{first_name} {last_name}</td>
            <td data-label="Leave Type">{leave_type}</td>
            <td data-label="Start Date">{start_date}</td>
            <td data-label="End Date">{end_date}</td>
            <td data-label="Number of days">{total_days}</td>
            <td>
                <Link to={`/dashboard/pending-employee-requests/${id}`}>
                    <button className='btn btn-success'>View details</button>
                </Link>
            </td>
        </tr>
     );
}
 
export default TableBody;