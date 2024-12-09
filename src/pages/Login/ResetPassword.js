import React, { useState } from 'react';
import { requestWithBodyWithoutJWT, requestWithoutBodyWithJWT } from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';

import config from '../../config.json';

import { useTranslation } from 'react-i18next';

function ResetPassword({setError500, setFlashMessage}){
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const navigate = useNavigate();
  const { code } = useParams();

  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();

      try{
        
        if (newPassword != newPasswordConfirm) {
          throw new Error("no same passwords");
        }

        if(newPassword === ''){
          throw new Error("no password");
        }

        const response = await requestWithBodyWithoutJWT(config.apiUrl + '/api/reset/password', { code: code, new_password: newPassword });
      
        if(response === 401 || response === 403){
          throw new Error("no code or problem");
        }

        if(response === 500){
          setError500(true);
        }

        const data = await response.json();

        setFlashMessage(t('resetPasswd.flashMessage'));
        navigate("/login");

      } catch(error) {
        if(error.message === "no same passwords"){
          setError(t('resetPasswd.noSamePasswd'));
        } else if (error.message === "no password") {
          setError(t('resetPasswd.noPasswd'));
        } else {
            setError(t('resetPasswd.failed'));
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
                      <h1 className="h4 text-gray-900 mb-4">{t('resetPasswd.title')}</h1>
                    </div>
                     
                    <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                              type="password"
                              className="form-control form-control-user"
                              placeholder={t('resetPasswd.newPasswdInput')}
                              onChange={(e) => setNewPassword(e.target.value)}
                              value={newPassword}
                          />
                        </div>
                        <div className="form-group">
                          <input
                              type="password"
                              className="form-control form-control-user"
                              placeholder={t('resetPasswd.newPasswdConfirmInput')}
                              onChange={(e) => setNewPasswordConfirm(e.target.value)}
                              value={newPasswordConfirm}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          {t('resetPasswd.resetPasswdButton')}
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