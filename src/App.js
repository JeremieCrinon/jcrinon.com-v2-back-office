import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';

import './App.css';

import FlashMessage from './components/FlashMessage/FlashMessage';

import Login from './pages/Login/Login';
import NewAccount from './pages/Login/NewAccount';
import VerifyEmail from './pages/Login/VerifyEmail';
import NotFound from './pages/Errors/404';
import InternalServerError from './pages/Errors/500';
import ReadDeleteProject from './pages/Projects/ReadDelete';
import CreateProject from './pages/Projects/Create';
import EditProject from './pages/Projects/Edit';
import Dashboard from './pages/Dashboard/Dashboard';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';

import { requestWithoutBodyWithJWT } from './utils';

import AutomaticRedirects from './components/AutomaticRedirects/AutomaticRedirects';

// SB-admin
import "./sb-admin/sb-admin-2.min.css";
import "./vendor/fontawesome-free/css/all.min.css";


import config from './config.json';

function App() {

  const [token, setToken] = useState(Cookies.get('token') !== "null" && Cookies.get('token') ? Cookies.get('token') : null);
  const [userRoles, setUserRoles] = useState(Cookies.get('userRoles') !== "null" && Cookies.get('userRoles') ?  JSON.parse(Cookies.get('userRoles')) : null);
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


  //Verifying that the token is still correct on starting
  useEffect(() => {
    console.log("Testing connexion");
    if(token === null || token === 'null'){
      setUserRoles(null);
      setToken(null);
      Cookies.remove('token');
      Cookies.remove('userRoles');
      Cookies.remove('isNewAccount');
      Cookies.remove('isUnverifiedEmail');
      Cookies.remove('userEmail');
    } else {
      async function fetchData(){
        console.log("Making a request");
        const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/isuser', token);
        // console.log(await response.json());
        if(response === 401 || response === 403){
          setUserRoles(null);
          setToken(null);
          Cookies.remove('token');
          Cookies.remove('userRoles');
          Cookies.remove('isNewAccount');
          Cookies.remove('isUnverifiedEmail');
          Cookies.remove('userEmail');
        } else if(response === 500){
          setError500(true);
        } else {
          const data = await response.json();
          if(await data.result === null){
            console.log(response.json().result);
            setUserRoles(null);
            setToken(null);
            Cookies.remove('token');
            Cookies.remove('userRoles');
            Cookies.remove('isNewAccount');
            Cookies.remove('isUnverifiedEmail');
            Cookies.remove('userEmail');
          }
        }
        
      }
      
      fetchData();
    }
    
  }, [])

  useEffect(() => {
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('userRoles', JSON.stringify(userRoles), { expires: 7 });
    Cookies.set('isNewAccount', isNewAccount, { expires: 7 });
    Cookies.set('isUnverifiedEmail', isUnverifiedEmail, { expires: 7 });
    Cookies.set('userEmail', userEmail, { expires: 7 });
  }, [token, userRoles, isNewAccount, isUnverifiedEmail, userEmail]);

  return (
    <>
        {flashMessage && (
            <FlashMessage message={flashMessage} onClose={closeMessage} />
        )}
        <Router>
            <AutomaticRedirects error500={error500} token={token} isNewAccount={isNewAccount} isUnverifiedEmail={isUnverifiedEmail} />
            <Routes>
                {/* Dashboard */}
                <Route path="/" element={<Dashboard setToken={setToken} setUserRoles={setUserRoles} userRoles={userRoles} />} />

                {/* Login system */}
                <Route path="/login" element={<Login setToken={setToken} setUserRoles={setUserRoles} setIsNewAccount={setIsNewAccount} setIsUnverifiedEmail={setIsUnverifiedEmail} setUserEmail={setUserEmail} setError500={setError500} setFlashMessage={setFlashMessage} />} />
                <Route path="/new-account" element={<NewAccount setToken={setToken} setUserRoles={setUserRoles} setIsNewAccount={setIsNewAccount} setIsUnverifiedEmail={setIsUnverifiedEmail} userEmail={userEmail} token={token} setFlashMessage={setFlashMessage} setError500={setError500} />} />
                <Route path="/verify-email" element={<VerifyEmail setIsUnverifiedEmail={setIsUnverifiedEmail} token={token} setFlashMessage={setFlashMessage} setError500={setError500} />} />
                <Route path="/forgot/password" element={<ForgotPassword setError500={setError500} setFlashMessage={setFlashMessage} />} />
                <Route path="/forgot/password/:code" element={<ResetPassword setError500={setError500} setFlashMessage={setFlashMessage} />} />

                {/* Projects CRUD */}
                {userRoles && (userRoles.includes("ROLE_ADMIN") || userRoles.includes("ROLE_PROJECTS")) && (
                  <>
                    <Route path="/projects" element={<ReadDeleteProject token={token} setError500={setError500} setFlashMessage={setFlashMessage} setToken={setToken} setUserRoles={setUserRoles} userRoles={userRoles} />} />
                    <Route path="/projects/create" element={<CreateProject token={token} setError500={setError500} setFlashMessage={setFlashMessage} setToken={setToken} setUserRoles={setUserRoles} userRoles={userRoles} />} />
                    <Route path="/projects/:id/edit" element={<EditProject token={token} setError500={setError500} setFlashMessage={setFlashMessage} setToken={setToken} setUserRoles={setUserRoles} userRoles={userRoles} />} />
                  </>
                )}

                {/* Errors */}
                <Route path="/500" element={<InternalServerError />} />
                <Route path="*" element={<NotFound token={token} />} />
            </Routes>
        </Router>
      
    </>
  );
}

export default App;
