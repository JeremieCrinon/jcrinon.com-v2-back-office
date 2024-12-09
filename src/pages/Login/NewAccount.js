import React, { useState } from 'react';
import { requestWithBodyWithJWT } from '../../utils';

import config from '../../config.json';

import { useTranslation } from 'react-i18next';

function NewAccount({setToken, setUserRoles, setIsNewAccount, setIsUnverifiedEmail, userEmail, token, setFlashMessage, setError500}){
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if(password!==passwordConfirm){
        throw new Error("passwd not matching");
      }
      if(email  ===  ''){
        throw new Error("no email");
      }
      if(password  ===  ''){
        throw new Error("no passwd");
      }
      const response = await requestWithBodyWithJWT(config.apiUrl + '/api/modify/account/new', { email, password }, token)

      if(response === 401 || response === 403){
        throw new Error("incorrect credentials");
      }

      if(response === 500){
        setError500(true);
      }

      const data = await response.json();

      setFlashMessage(t('newAccount.flashMessage'))

      setUserRoles(null);
      setIsNewAccount(null);
      setIsUnverifiedEmail(null);
      setToken(null);

    } catch (error) {
      if(error.message  ===  "passwd not matching"){
        setError(t('newAccount.noSamePasswd'))
      } else if(error.message  ===  "no email"){
        setError(t('newAccount.noEmail'));
      } else if (error.message  ===  "no passwd"){
        setError(t('newAccount.noPasswd'));
      } else {
        setError(t('newAccount.failed'));
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
                      <h1 className="h4 text-gray-900 mb-4">{t('newAccount.title')}</h1>
                    </div>
                    <form className="user" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control form-control-user"
                          id="exampleInputEmail"
                          aria-describedby="emailHelp"
                          placeholder={t('newAccount.emailInput')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-group row">
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <input type="password" className="form-control form-control-user"
                                    id="exampleInputPassword" placeholder={t('newAccount.newPasswdInput')} value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                   />
                            </div>
                            <div className="col-sm-6">
                                <input type="password" className="form-control form-control-user"
                                    id="exampleRepeatPassword" placeholder={t('newAccount.newPasswdConfirmInput')} value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    />
                            </div>
                      </div>
                      <button type="submit" className="btn btn-primary btn-user btn-block">
                        {t('newAccount.valideButton')}
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