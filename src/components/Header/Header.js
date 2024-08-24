import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ routes }){  
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(null);
    const underlineRef = useRef(null);

    useEffect(() => {
      const activeRoute = routes.find(route => route.path === location.pathname);
      if (activeRoute) {
        const activeElement = document.querySelector(`.header--link--desktop[href='${activeRoute.path}']`);
        setActiveLink(activeElement);
      }
    }, [location.pathnamej, routes, location]);
  
    useEffect(() => {
      if (activeLink && underlineRef.current) {
        const { offsetLeft, offsetWidth } = activeLink;
        underlineRef.current.style.left = `${offsetLeft}px`;
        underlineRef.current.style.width = `${offsetWidth}px`;
      }
    }, [activeLink]);

    useEffect(() => {
      if (activeLink) {
          const { offsetWidth } = activeLink;
          underlineRef.current.style.width = `calc(${offsetWidth}px - 3rem)`;
      }
    }, [activeLink]);  
    return(
      <>
      {/* Sidebar */}
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

            {/* Sidebar - Brand */}
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                {/* <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div> */}
                <div className="sidebar-brand-text mx-3">jcrinon.com</div>
            </a>

            {/* Divider */}
            <hr className="sidebar-divider my-0" />

            {routes.map((route, index) => (
                <li key={index} className={location.pathname === route.path ? 'active nav-item' : 'nav-item'}>
                    <Link
                    to={route.path}
                    className="nav-link"
                    >
                        <>
                          <i className="fas fa-fw fa-tachometer-alt"></i>
                          <span>{route.name}</span>
                        </>
                        
                    </Link>
                </li>
            ))}
            <li className={location.pathname === '/projects' || location.pathname === '/projects/create' ? 'active nav-item' : 'nav-item'}>
                <Link
                to={"/projects"}
                className="nav-link"
                >
                    <>
                      <i className="fas fa-fw fa-tachometer-alt"></i>
                      <span>{"Projects"}</span>
                    </>
                    
                </Link>
            </li>

        </ul>
        {/* End of Sidebar */}
        </>
    );
}

export default Header