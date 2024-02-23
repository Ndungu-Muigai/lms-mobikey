import Table from 'react-bootstrap/Table'

const UpcomingLeave = ({upcomingLeaves}) => 
{

    const upcomingLeavesMap=upcomingLeaves.map(leave =>
        {
            console.log(leave)
            let {id, employee: {first_name, last_name}, start_date, end_date, total_days}=leave
            return (
                <tr key={id}>
                    <td data-label="Employee Name">{first_name} {last_name}</td>
                    <td data-label="Start Date">{start_date}</td>
                    <td data-label="End Date">{end_date}</td>
                    <td data-label="Number of days">{total_days}</td>
                </tr>
            )
        })
    return ( 
        <div className="border-start upcoming">
            <h1 className='text-uppercase fs-3 fw-bolder'>Upcoming department leave</h1>
            <Table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th scope='col'>Employee Name</th>
                        <th scope='col'>Start Date</th>
                        <th scope='col'>End Date</th>
                        <th scope='col'>Number of Days</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        upcomingLeaves.length > 0
                        ?
                            upcomingLeavesMap
                        :
                            <tr>
                                <td colSpan={4}>No upcoming department leave</td>
                            </tr>
                    }
                </tbody>
            </Table>
        </div>
     );
}
 
export default UpcomingLeave;