import PieChart from "./PieChart";
import Tiles from "./Tiles";
import UpcomingLeave from "./Upcoming Leave";

import '../CSS/Dashboard.css'

const Dashboard = ({full_name, leaveDays, upcomingLeaves}) => 
{
    return ( 
        <>
            <h1 className="text-uppercase text-center fw-bold">Welcome back, {full_name}</h1>
            <Tiles leaveDays={leaveDays}/>
            <div className="dashboard">
                <PieChart leaveDays={leaveDays}/>
                <UpcomingLeave upcomingLeaves={upcomingLeaves}/>
            </div>
        </>
     );
}
 
export default Dashboard;