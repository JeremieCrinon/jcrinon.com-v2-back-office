import React, { useState } from 'react';
import { requestWithBodyWithoutJWT, requestWithoutBodyWithJWT } from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';

import config from '../../config.json';

function ResetPassword({setError500, setFlashMessage}){
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const navigate = useNavigate();
  const { code } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

      try{
        
        if (newPassword != newPasswordConfirm) {
            throw new Error("no_same_passwords");
        }

        const response = await requestWithBodyWithoutJWT(config.apiUrl + '/api/reset/password', { code: code, new_password: newPassword });
      
        if(response == 401 || response == 403){
          throw new Error;
        }

        if(response == 500){
          setError500(true);
        }

        const data = await response.json();

        setFlashMessage('The password as successfully been changed, you can login with it!');
        navigate("/login");

      } catch {
        if(error.message === "no_same_passwords"){
            setError("The password and password confirmation does not match.");
        } else {
            setError('Changing password failed. Please check the email and try again.');
        }
      }

  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Change you're password.</h1>
                    </div>
                     
                    <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                        <input
                            type="password"
                            className="form-control form-control-user"
                            placeholder="Enter you're new password..."
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                            required
                        />
                        <input
                            type="password"
                            className="form-control form-control-user"
                            placeholder="Confirm password..."
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            value={newPasswordConfirm}
                            required
                        />
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                        Reset the password
                        </button>
                    </form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;