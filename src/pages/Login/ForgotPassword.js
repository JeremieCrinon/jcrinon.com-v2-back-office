import React, { useState } from 'react';
import { requestWithBodyWithoutJWT, requestWithoutBodyWithJWT } from '../../utils';
import { useNavigate } from 'react-router-dom';

import config from '../../config.json';

import { useTranslation } from 'react-i18next';

function ForgotPassword({setError500, setFlashMessage}){
  const [error, setError] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');

  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();

      try{

        if(recoverEmail === ''){
          throw new Error("no email");
        }

        const response = await requestWithBodyWithoutJWT(config.apiUrl + '/api/forgot/password', { email: recoverEmail });
      
        if(response === 401 || response === 403){
          throw new Error("incorrect email");
        }

        if(response === 500){
          setError500(true);
        }

        const data = await response.json();

        setFlashMessage(t('forgotPasswd.flashMessage'));
        navigate("/login");

      } catch(error) {
        if(error.message === "no email"){
          setError(t('forgotPasswd.noEmail'));
        } else {
          setError(t('forgotPasswd.failed'));
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
                      <h1 className="h4 text-gray-900 mb-4">{t('forgotPasswd.title')}</h1>
                    </div>
                     
                    <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                        <input
                            type="email"
                            className="form-control form-control-user"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder={t('forgotPasswd.emailInput')}
                            onChange={(e) => setRecoverEmail(e.target.value)}
                            value={recoverEmail}
                        />
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          {t('forgotPasswd.resetPasswdButton')}
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