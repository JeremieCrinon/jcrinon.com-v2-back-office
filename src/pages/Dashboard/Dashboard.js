import React from 'react';

import { baseAdmin } from '../../utils';

function Dashboard({setToken, setUserRoles, userRoles}) {
  const content = (
    <div className="text-center">
        <p className="lead text-gray-800 mb-5">Hi !</p>
        <p className="text-gray-500 mb-0">This is your dashboard... for now, it's a bit empty... but I'm sure there will be a lot of things on this page in the future!</p>
        <p className="text-gray-500 mb-0 mt-2">Your roles are : {userRoles && userRoles.map((role, index) => (
          <strong key={index}>
            <br />
            {role}
          </strong>
        ))}</p>
    </div>
  )
  return baseAdmin(content, {setToken, setUserRoles, userRoles});
}

export default Dashboard;
