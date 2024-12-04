import React from 'react';

import { baseAdmin } from '../../utils';

function Dashboard({setToken, setUserRoles, userRoles}) {
  const content = (
    <>
    {/* Page Heading */}
    <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Home</h1>
    </div>

    {/* Content Row */}
    <div className="row">

        <div className="col-lg-12 mb-4">

            {/* What can you do */}
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">What you can do here</h6>
                </div>
                <div className="card-body">
                    <p>Depending on the permission that have been gave to you, you can do a lot of different things, the person who has created your account certainly told you what you have the permission to do.</p>
                </div>
            </div>

            {/* Contact me */}
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Contact me</h6>
                </div>
                <div className="card-body">
                    <p>If you find a bug, have a problem, or any question, you can contact me. You certainly already have a contact method, but if you don't, here is my contact informations : <br /> email : jeremie@jcrinon.com <br /> phone number : 06 33 12 10 52</p>
                </div>
            </div>

        </div>
    </div>
    </>
  )
  return baseAdmin(content, {setToken, setUserRoles, userRoles});
}

export default Dashboard;
