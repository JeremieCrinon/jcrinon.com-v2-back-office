import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

function NotFound() {

  const { t } = useTranslation();

  return (
    <div className="container-fluid">
        <div className="text-center">
            <div className="error mx-auto" data-text="404">404</div>
            <p className="lead text-gray-800 mb-5">{t('notFound.errorName')}</p>
            <p className="text-gray-500 mb-0">{t('notFound.errorDescription')}</p>
            <Link to={"/"}>&larr; {t('notFound.link')}</Link>
        </div>

    </div>
  );
}

export default NotFound;
