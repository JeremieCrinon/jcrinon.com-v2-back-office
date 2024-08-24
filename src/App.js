import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';

import routes from './routes';

import Header from './components/Header/Header';
import Topbar from './components/Topbar/Topbar';
import FlashMessage from './components/FlashMessage/FlashMessage';

import './App.css';

import Login from './pages/Login/Login';
import NewAccount from './pages/Login/NewAccount';
import VerifyEmail from './pages/Login/VerifyEmail';
import NotFound from './pages/Errors/404';
import InternalServerError from './pages/Errors/500';

function App() {

  // const [token, setToken] = useState(Cookies.get('token') !== "null" && Cookies.get('token') ? Cookies.get('token') : null);
  // const [isAdmin, setIsAdmin] = useState(Cookies.get('isAdmin') === 'true' || null);
  // const [isNewAccount, setIsNewAccount] = useState(Cookies.get('isNewAccount') === 'true' || null);
  // const [isUnverifiedEmail, setIsUnverifiedEmail] = useState(Cookies.get('isUnverifiedEmail') === 'true' || null);
  // const [userEmail, setUserEmail] = useState(Cookies.get('userEmail') || null);

  const [token, setToken] = useState(Cookies.get('token') !== "null" && Cookies.get('token') ? Cookies.get('token') : null);
  const [isAdmin, setIsAdmin] = useState(Cookies.get('isAdmin') !== "null" && Cookies.get('isAdmin') ? Cookies.get('isAdmin') === 'true' : null);
  const [isNewAccount, setIsNewAccount] = useState(Cookies.get('isNewAccount') !== "null" && Cookies.get('isNewAccount') ? Cookies.get('isNewAccount') === 'true' : null);
  const [isUnverifiedEmail, setIsUnverifiedEmail] = useState(Cookies.get('isUnverifiedEmail') !== "null" && Cookies.get('isUnverifiedEmail') ? Cookies.get('isUnverifiedEmail') === 'true' : null);
  const [userEmail, setUserEmail] = useState(Cookies.get('userEmail') !== "null" && Cookies.get('userEmail') ? Cookies.get('userEmail') : null);

  const [flashMessage, setFlashMessage] = useState(null);
  const [error500, setError500] = useState(false);

  const closeMessage = () => {
    setFlashMessage(null);
  };

  useEffect(() => {
    if (token === null || isNewAccount || isUnverifiedEmail) {
      document.body.classList.add('bg-gradient-primary');
    } else {
      document.body.classList.remove('bg-gradient-primary');
    }
  }, [token]);

  useEffect(() => {
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('isAdmin', isAdmin, { expires: 7 });
    Cookies.set('isNewAccount', isNewAccount, { expires: 7 });
    Cookies.set('isUnverifiedEmail', isUnverifiedEmail, { expires: 7 });
    Cookies.set('userEmail', userEmail, { expires: 7 });
  }, [token, isAdmin, isNewAccount, isUnverifiedEmail, userEmail]);

  return (
    <>
      {error500 ? (
        <InternalServerError />
      ) :
      token === null ? (
        <>
          {flashMessage && (
            <FlashMessage message={flashMessage} onClose={closeMessage} />
          )}
          <Login setToken={setToken} setIsAdmin={setIsAdmin} setIsNewAccount={setIsNewAccount} setIsUnverifiedEmail={setIsUnverifiedEmail} setUserEmail={setUserEmail} setError500={setError500} />
        </>
      ) : 
      isNewAccount ? (
        <>
          {flashMessage && (
            <FlashMessage message={flashMessage} onClose={closeMessage} />
          )}
          <NewAccount setToken={setToken} setIsAdmin={setIsAdmin} setIsNewAccount={setIsNewAccount} setIsUnverifiedEmail={setIsUnverifiedEmail} userEmail={userEmail} token={token} setFlashMessage={setFlashMessage} setError500={setError500} />
        </>
      ) : 
      isUnverifiedEmail ? (
        <>
          {flashMessage && (
            <FlashMessage message={flashMessage} onClose={closeMessage} />
          )}
          <VerifyEmail setIsUnverifiedEmail={setIsUnverifiedEmail} token={token} setFlashMessage={setFlashMessage} setError500={setError500} />
        </>
      ) :
      (
        <Router>
          <div id="wrapper">
            <Header routes={routes}/>
            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <Topbar setToken={setToken} setIsAdmin={setIsAdmin} />
                {flashMessage && (
                  <FlashMessage message={flashMessage} onClose={closeMessage} />
                )}
                <div className="container-fluid">
                  <Routes>
                    {routes.map((route, index) => (
                      <Route key={index} path={route.path} element={route.element} />
                    ))}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;