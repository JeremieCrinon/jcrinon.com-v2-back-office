import React from 'react';
import { Link } from 'react-router-dom';

function InternalServerError() {
  return (
    <div className="container-fluid">
        <div className="text-center">
            <div className="error mx-auto" data-text="500">500</div>
            <p className="lead text-gray-800 mb-5">Internal server error</p>
            <p className="text-gray-500 mb-0">Oh oh, that's not supposed to append, you can try again later, or contact me....</p>
        </div>

    </div>
  );
}

export default InternalServerError;
