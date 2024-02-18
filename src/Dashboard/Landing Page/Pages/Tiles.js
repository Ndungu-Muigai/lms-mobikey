import '../CSS/Tiles.css'

const Tiles = ({leaveDays}) => 
{
    return ( 
        <>
            <div className="tiles mt-2">
                <div className="tile">
                    <i className='fa fa-history'></i>
                    <h4>{leaveDays.total_requests}</h4>
                    <h5>Total Requests</h5>
                </div>
                <div className="tile">
                    <i className='fa fa-calendar-check-o text-success'></i>
                    <h4>{leaveDays.approved_requests}</h4>
                    <h5>Approved Requests</h5>
                </div>
                <div className="tile">
                    <i className='fa fa-calendar-times-o text-danger'></i>
                    <h4>{leaveDays.rejected_requests}</h4>
                    <h5>Rejected Requests</h5>
                </div>
                <div className="tile">
                    <i className='fa fa-hourglass-half'></i>
                    <h4>{leaveDays.pending_requests}</h4>
                    <h5>Pending Requests</h5>
                </div>
            </div>
        </>
     );
}
 
export default Tiles;