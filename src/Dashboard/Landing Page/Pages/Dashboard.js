import PieChart from "./PieChart";
import Tiles from "./Tiles";
import UpcomingLeave from "./Upcoming Leave";

import '../CSS/Dashboard.css'

const Dashboard = ({full_name, leaveDays}) => 
{
    return ( 
        <>
            <h1 className="text-uppercase text-center fw-bold mt-2">Welcome back, {full_name}</h1>
            <Tiles leaveDays={leaveDays}/>
            <div className="dashboard mt-2">
                <PieChart leaveDays={leaveDays}/>
                <UpcomingLeave/>
            </div>
        </>
     );
}
 
export default Dashboard;