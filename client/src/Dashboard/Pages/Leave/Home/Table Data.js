import { Link } from "react-router-dom";

const TableData = ({application}) => 
{
    let {id, leave_type, leave_duration, start_date, end_date}=application
    return ( 
        <>
            <tr>
                <td data-label="Leave Type">{leave_type}</td>
                <td data-label="Leave Duration">{leave_duration}</td>
                <td data-label="Start Date">{start_date}</td>
                <td data-label="End Date">{end_date}</td>
                <td>
                    <Link to={`/dashboard/leave/${id}`}>
                        <button className="btn btn-success">View application details</button>
                    </Link>
                </td>
            </tr>
        </>
     );
}
 
export default TableData;