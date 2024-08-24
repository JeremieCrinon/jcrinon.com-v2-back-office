import React, { useRef, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function Topbar({setToken, setIsAdmin}) {
    function logout(){
        setIsAdmin(null);
        setToken(null);
        Cookies.remove('token');
        Cookies.remove('isAdmin');
        Cookies.remove('isNewAccount');
        Cookies.remove('isUnverifiedEmail');
        Cookies.remove('userEmail');
    }
    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

            {/* Topbar Navbar */}
            <ul className="navbar-nav ml-auto">

                <div className="topbar-divider d-none d-sm-block"></div>

                {/* Nav Item - User Information */}
                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {/* <span className="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span> */}
                        <i className="fas fa-solid fa-user fa-md fa-fw mr-2 text-gray-400"></i>
                    </a>
                    {/* Dropdown - User Information */}
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown">
                        {/* <a className="dropdown-item" href="#">
                            <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                            Settings
                        </a> */}
                        <a className="dropdown-item" onClick={logout}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </a>
                    </div>
                </li>

            </ul>

        </nav>
    );
}

export default Topbar;