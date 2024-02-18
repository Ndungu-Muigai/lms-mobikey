import {PieChart} from '@mui/x-charts/PieChart'
const LeaveBreakdown = ({leaveDays}) => 
{
    let{approved_requests,pending_requests,rejected_requests}=leaveDays

    const values=
    {
        approved: approved_requests,
        pending: pending_requests,
        rejected: rejected_requests
    }

    const chartData=
    [
        {id: 0,value: values.approved, label:"Approved",color: "#4CAF50" },
        {id: 1,value: values.pending, label:"Pending", color: "#FFC107" },
        {id: 2,value: values.rejected, label:"Rejected",color: "#FF5722"}
    ]


    return ( 
        <>
            <div className='border-start history'>
                <h1 className='text-uppercase fw-bolder fs-2 '>Leave history Breakdown</h1>
                <div className='pie-chart'>
                    <PieChart series={[{data: chartData,outerRadius: 100}]} width={400} height={200}/>
                </div>
            </div>
        </>
     );
}
 
export default LeaveBreakdown;