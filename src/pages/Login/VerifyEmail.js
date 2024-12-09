import React, { useState } from 'react';
import { requestWithBodyWithJWT } from '../../utils';
import { useNavigate } from 'react-router-dom';

import config from '../../config.json';

import { useTranslation } from 'react-i18next';

function VerifyEmail({setIsUnverifiedEmail, token, setFlashMessage, setError500}){
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      if(code === ''){
        throw new Error("no code")
      }

      const response = await requestWithBodyWithJWT(config.apiUrl + '/api/verify/email', { code }, token)

      if(response === 401 || response === 403){
        throw new Error("incorrect code");
      }

      if(response === 500){
        setError500(true);
      }

      setFlashMessage(t('verifyEmail.flashMessage'))
      setIsUnverifiedEmail(false);
      navigate('/');

    } catch (error) {
      if(error.message === "no code"){
        setError(t('verifyEmail.noCode'));
      } else {
        setError(t('verifyEmail.failed'));
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
                      <h1 className="h4 text-gray-900 mb-4">{t('verifyEmail.title')}</h1>
                    </div>
                    <form className="user" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control form-control-user"
                          placeholder={t('verifyEmail.codeInput')}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-user btn-block">
                        {t('verifyEmail.validateButton')}
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