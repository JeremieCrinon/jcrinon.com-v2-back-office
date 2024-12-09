import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

function InternalServerError() {

  const { t } = useTranslation();

  return (
    <div className="container-fluid">
        <div className="text-center">
            <div className="error mx-auto" data-text="500">500</div>
            <p className="lead text-gray-800 mb-5">{t('serverError.errorName')}</p>
            <p className="text-gray-500 mb-0">{t('serverError.errorDescription')}</p>
            <Link to={"/"}>&larr; {t('serverError.link')}</Link>
        </div>

    </div>
  );
}

export default InternalServerError;
