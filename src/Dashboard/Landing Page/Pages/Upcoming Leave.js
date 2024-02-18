import Table from 'react-bootstrap/Table'

const UpcomingLeave = ({upcomingLeave}) => 
{
    return ( 
        <div className="border-start upcoming">
            <h1 className='text-uppercase fs-2 fw-bolder'>Upcoming department leave</h1>
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
                    <tr>
                        {
                            upcomingLeave ?
                                <td colSpan={4}>Data exists</td>
                            : 
                                <td colSpan={4}>No upcoming department leave</td>
                        }   
                    </tr>
                </tbody>
            </Table>
        </div>
     );
}
 
export default UpcomingLeave;