import Logo from '../../../assets/images/Logo.png'
import './Sidebar.css'

import Links from './Links.json'
import SidebarLink from "./SidebarLink";

const Sidebar = ({role, sidebarOpen}) => 
{

    const linksMap=Links.map(link =>
        {
            return <SidebarLink key={link.title} link={link} role={role}/>
        })
    

    return ( 
        <>
            <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""} bg-dark`}>
                <img src={Logo} alt="Mobikey Logo"/>
                <ul className='sidebar-list'>
                    {linksMap}
                </ul>
            </aside>
        </>
     );
}
 
export default Sidebar;