import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { requestWithBodyWithoutJWT, requestWithoutBodyWithJWT } from '../../utils';

import config from '../../config.json';

import { useTranslation } from 'react-i18next';

function Login({setToken, setUserRoles, setIsNewAccount, setIsUnverifiedEmail, setUserEmail, setError500, setFlashMessage}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();

      try{

        if(email === '' || password === ''){
          throw new Error("no email or passwd")
        }

        const response = await requestWithBodyWithoutJWT(config.apiUrl + '/api/login_check', { email, password });
      
        if(response === 401 || response === 403){
          throw new Error("incorrect credentials");
        }

        if(response === 500 || response === 404){
          setError500(true);
        }

        const data = await response.json();

        const response2 = await requestWithoutBodyWithJWT(config.apiUrl + '/api/isuser', data.token);

        if(response2 === 401 || response2 === 403){
          setError500(true);
        }

        if(response2 === 500 || response2 === 404){
          setError500(true);
        }

        const data2 = await response2.json();

        setIsUnverifiedEmail(data2.roles.includes("UNVERIFIED_EMAIL"));
        setIsNewAccount(data2.roles.includes("NEW_ACCOUNT"));
        setUserRoles(data2.roles);
        setToken(data.token);
        setUserEmail(email);

        navigate('/');

      } catch(error) {
        if(error.message === "no email or passwd"){
          setError(t('login.noPasswd'));
          // setError('Please enter an email and password');
        } else{
          setError(t('login.failed'));
          // setError('Login failed. Please check your credentials and try again.');
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
                      <h1 className="h4 text-gray-900 mb-4">{t('login.title')}</h1>
                    </div>
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control form-control-user"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder={t('login.emailInput')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder={t('login.passwdInput')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          {t('login.loginButton')}
                        </button>
                      </form>
                      {error && <div className="alert alert-danger mt-3">{error}</div>}
                      <hr />
                      <div className="text-center">
                        <Link to={"/forgot/password"} className="small">{t('login.forgotPasswdButton')}</Link>
                      </div>
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

export default Login;