import { useState } from "react";
import { Link } from "react-router-dom";

const SidebarLink = ({ link, role }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    let { title, path, icon, roles, children } = link;

    return (
        <>
            {roles.includes(role) &&
                (children ? (
                    <li key={title}>
                        <div className="link-option" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            {icon && <i className={icon}></i>}
                            <h3>{title}</h3>
                            <i className={`${dropdownOpen ? "fa fa-angle-up" : "fa fa-angle-down"} toggle-btn`}></i>
                        </div>
                        <ul className={dropdownOpen ? "dropdown-content-open sidebar-list" : "dropdown-content"}>
                            {children.map((child, index) => (
                                <SidebarLink key={index} link={child} role={role} />
                            ))}
                        </ul>
                    </li>
                ) : (
                    <li key={title}>
                        <Link to={path} className="side-link">
                            <div className="link-option">
                                <i className={`side-icon ${icon}`}></i>
                                <h3>{title}</h3>
                            </div>
                        </Link>
                    </li>
                ))}
        </>
    );
};

export default SidebarLink;
