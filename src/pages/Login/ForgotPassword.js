import React, { useState } from 'react';
import { requestWithBodyWithoutJWT, requestWithoutBodyWithJWT } from '../../utils';
import { useNavigate } from 'react-router-dom';

import config from '../../config.json';

function ForgotPassword({setError500, setFlashMessage}){
  const [error, setError] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

      try{

        if(recoverEmail === ''){
          throw new Error("no email");
        }

        const response = await requestWithBodyWithoutJWT(config.apiUrl + '/api/forgot/password', { email: recoverEmail });
      
        if(response == 401 || response == 403){
          throw new Error("incorrect email");
        }

        if(response == 500){
          setError500(true);
        }

        const data = await response.json();

        setFlashMessage('An email with a link to recover your password has been sent to the user\'s email is he exists.');
        navigate("/login");

      } catch(error) {
        if(error.message === "no email"){
          setError('Please enter you\'re email!');
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
                      <h1 className="h4 text-gray-900 mb-4">Forgot you're password ?</h1>
                    </div>
                     
                    <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                        <input
                            type="email"
                            className="form-control form-control-user"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email Address..."
                            onChange={(e) => setRecoverEmail(e.target.value)}
                            value={recoverEmail}
                        />
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                        Send a reset password e-mail
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

export default ForgotPassword;