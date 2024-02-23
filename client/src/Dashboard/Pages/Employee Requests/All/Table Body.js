import { useEffect, useState } from "react";

const Table = ({application}) => 
{
    const [file, setFile]=useState(null)

    let {employee: {first_name, last_name}, leave_type, leave_duration, start_date, end_date, total_days, status}=application

    useEffect(()=>
    {
        if(application && application.file_attachment)
        {
            fetch(`/static/${application.file_attachment}`)
            .then(response => response.blob())
            .then(data => setFile(data))
        }
    },[application])
    
    return (  
        <tr>
            <td data-label="Employee Name">{first_name} {last_name}</td>
            <td data-label="Leave Type">{leave_type}</td>
            <td data-label="Leave Duration">{leave_duration}</td>
            <td data-label="Start Date">{start_date}</td>
            <td data-label="End Date">{end_date}</td>
            <td data-label="Number of days">{total_days}</td>
            <td data-label="File attachment">
                {
                    file
                    ?
                        <a href="/">Test</a>
                    :
                        "No file attachment"
                }</td>
            <td data-label="Status">{status}</td>
        </tr>
    );
}
 
export default Table;