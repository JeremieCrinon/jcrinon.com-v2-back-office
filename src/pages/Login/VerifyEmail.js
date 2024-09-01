import React, { useState } from 'react';
import { requestWithBodyWithJWT } from '../../utils';
import { useNavigate } from 'react-router-dom';

import config from '../../config.json';

function VerifyEmail({setIsUnverifiedEmail, token, setFlashMessage, setError500}){
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // const response = await fetch(config.apiUrl + '/api/verify/email', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ' + token
      //   },
      //   body: JSON.stringify({ code })
      // });

      // if (!response.ok) {
      //   throw new Error('Email verification failed');
      // }

      const response = await requestWithBodyWithJWT(config.apiUrl + '/api/verify/email', { code }, token)

      if(response == 401 || response == 403){
        throw new Error;
      }

      if(response == 500){
        setError500(true);
      }

      setFlashMessage("Email successfully verified !")
      setIsUnverifiedEmail(false);
      navigate('/');

    } catch (error) {
      setError('Email verification failed, please verify the code and try again.');
      console.error('Error:', error);
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
                      <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                    </div>
                    <form className="user" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          placeholder="Enter the code sent by mail"
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-user btn-block">
                        Verify Email
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

export default VerifyEmail;