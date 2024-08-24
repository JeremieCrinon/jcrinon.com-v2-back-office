import React, { useState } from 'react';
import { requestWithBodyWithJWT } from '../../utils';

import config from '../../config.json';

function NewAccount({setToken, setIsAdmin, setIsNewAccount, setIsUnverifiedEmail, userEmail, token, setFlashMessage, setError500}){
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(password!==passwordConfirm){
      setError('Please enter the same passwords.');
    }

    try {
      // const response = await fetch(config.apiUrl + '/api/modify/account/new', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ' + token
      //   },
      //   body: JSON.stringify({ email, password })
      // });
      const response = await requestWithBodyWithJWT(config.apiUrl + '/api/modify/account/new', { email, password }, token)

      if(response == 401 || response == 403){
        throw new Error;
      }

      if(response == 500){
        setError500(true);
      }

      const data = await response.json();

      setFlashMessage("Your account has been modified, please log in with the new credentials you provided.")

      setIsAdmin(null);
      setIsNewAccount(null);
      setIsUnverifiedEmail(null);
      setToken(null);

    } catch (error) {
      setError('Modifying account failed. Please check your infos and try again.');
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
                      <h1 className="h4 text-gray-900 mb-4">Modify your infos !</h1>
                    </div>
                    <form className="user" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control form-control-user"
                          id="exampleInputEmail"
                          aria-describedby="emailHelp"
                          placeholder="Enter Email Address..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      {/* <div className="form-group">
                        <input
                          type="password"
                          className="form-control form-control-user"
                          id="exampleInputPassword"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div> */}
                      <div className="form-group row">
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <input type="password" className="form-control form-control-user"
                                    id="exampleInputPassword" placeholder="New password" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                            </div>
                            <div className="col-sm-6">
                                <input type="password" className="form-control form-control-user"
                                    id="exampleRepeatPassword" placeholder="Repeat Password" value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required />
                            </div>
                      </div>
                      <button type="submit" className="btn btn-primary btn-user btn-block">
                        Validate
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

export default NewAccount;