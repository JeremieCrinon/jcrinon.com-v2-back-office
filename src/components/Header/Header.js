import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

function Header({userRoles}){  
    const location = useLocation();

    const { t } = useTranslation();

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
                      <i className="fas fa-fw fa-home"></i>
                      <span>{t('header.home')}</span>
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
                        <i className="fas fa-fw fa-project-diagram"></i>
                        <span>{t('header.projects')}</span>
                        </>
                        
                    </Link>
                </li>
            )}
            {userRoles && (userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_CONTROL_USERS")) && (
                <li className={location.pathname === '/users' || /\/users\/\d+\/edit$/.test(location.pathname) ? 'active nav-item' : 'nav-item'}>
                    <Link
                    to={"/users"}
                    className="nav-link"
                    >
                        <>
                        <i className="fas fa-fw fa-user"></i>
                        <span>{t('header.users')}</span>
                        </>
                        
                    </Link>
                </li>
            )}

            {userRoles && (userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_SHOPPING_LIST")) && (
                <li className={location.pathname === '/shopping-lists' || /\/shopping-lists\/\d+\/$/.test(location.pathname) || /\/shopping-lists\/\d$/.test(location.pathname) ? 'active nav-item' : 'nav-item'}>
                    <Link
                    to={"/shopping-lists"}
                    className="nav-link"
                    >
                        <>
                        <i className="fas fa-fw fa-list"></i>
                        <span>{t('header.shoppingLists')}</span>
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