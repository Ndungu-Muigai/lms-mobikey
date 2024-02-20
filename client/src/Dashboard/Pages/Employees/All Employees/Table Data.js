import { Link } from "react-router-dom";

const TableData = ({employee}) => 
{
    let{id, first_name, last_name, email, department, position}=employee
    return ( 
        <>
            <tr>
                <td data-label="First Name">{first_name}</td>
                <td data-label="Last Name">{last_name}</td>
                <td data-label="Email">{email}</td>
                <td data-label="Department">{department}</td>
                <td data-label="Position">{position}</td>
                <td>
                    <Link to={`/dashboard/employees/${id}`}>
                        <button className="btn btn-success">View Details</button>
                    </Link>
                </td>                    
            </tr>
        </>
     );
}
 
export default TableData;