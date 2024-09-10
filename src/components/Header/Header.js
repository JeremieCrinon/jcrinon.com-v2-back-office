import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({userRoles}){  
    const location = useLocation();
    
    const underlineRef = useRef(null);

    return(
      <>
      {/* Sidebar */}
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            {/* Sidebar - Brand */}
            <Link to={"/"} className="sidebar-brand d-flex align-items-center justify-content-center">
                <div className="sidebar-brand-text mx-3">jcrinon.com</div>
            </Link>

            {/* Divider */}
            <hr className="sidebar-divider my-0" />

            <li className={location.pathname === '/' ? 'active nav-item' : 'nav-item'}>
                <Link
                to={"/"}
                className="nav-link"
                >
                    <>
                      <i className="fas fa-fw fa-tachometer-alt"></i>
                      <span>Dashboard</span>
                    </>
                    
                </Link>
            </li>

            {userRoles && (userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_PROJECTS")) && (
                <li className={location.pathname === '/projects' || location.pathname === '/projects/create' || /\/projects\/\d+\/edit$/.test(location.pathname) ? 'active nav-item' : 'nav-item'}>
                    <Link
                    to={"/projects"}
                    className="nav-link"
                    >
                        <>
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Projects</span>
                        </>
                        
                    </Link>
                </li>
            )}
            {userRoles && (userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_CONTROL_USERS")) && (
                <li className={location.pathname === '/users' || location.pathname === '/projects/create' || /\/users\/\d+\/edit$/.test(location.pathname) ? 'active nav-item' : 'nav-item'}>
                    <Link
                    to={"/users"}
                    className="nav-link"
                    >
                        <>
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Users</span>
                        </>
                        
                    </Link>
                </li>
            )}

        </ul>
        {/* End of Sidebar */}
        </>
    );
}

export default Header