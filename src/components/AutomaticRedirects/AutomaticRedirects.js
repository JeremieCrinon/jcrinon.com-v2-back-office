import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AutomaticRedirects({ error500, token, isNewAccount, isUnverifiedEmail }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (error500) {
            navigate('/500');
        }
    }, [error500, navigate, location.pathname]);

    useEffect(() => {
        const verifyPathIsNotForgotPasswordRegex = /^\/forgot\/password\/.*$/;
        if((token === null || token == 'null') && (location.pathname !== '/500' && location.pathname !== '/forgot/password' && !verifyPathIsNotForgotPasswordRegex.test(location.pathname))) {
            navigate('/login');
        }
    }, [token, navigate, location.pathname])

    useEffect(() => {
        if (isNewAccount) {
            navigate('/new-account');
        }
    }, [isNewAccount, navigate, location.pathname])

    useEffect(() => {
        if(isUnverifiedEmail && !isNewAccount && token!== null){
            navigate('verify-email');
        }
    }, [isUnverifiedEmail, navigate, location.pathname])

    return null;
}

export default AutomaticRedirects;