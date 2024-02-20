import { Link } from "react-router-dom";
import './Home.css'

const Home = () => 
{
    return ( 
        <div className="background">
            <nav className="nav d-flex justify-content-end">
                <Link to="/login">Login</Link>
            </nav>
            <div className="message d-flex  justify-content-center align-items-center">
                <div className="text">
                    <h2>Mobikey Truck and Bus Limited</h2>
                    <p>Official dealer of MAN trucks and busses</p>
                </div>
            </div>
        </div>
     );
}
 
export default Home;