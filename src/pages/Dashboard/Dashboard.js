import React from 'react';

import { baseAdmin } from '../../utils';

import { useTranslation } from 'react-i18next';

function Dashboard({setToken, setUserRoles, userRoles}) {

    const { t } = useTranslation();

    const content = (
        <>
        {/* Page Heading */}
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">{t('dashboard.title')}</h1>
        </div>

        {/* Content Row */}
        <div className="row">

            <div className="col-lg-12 mb-4">

                {/* What can you do */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">{t('dashboard.whatCanDoTitle')}</h6>
                    </div>
                    <div className="card-body">
                        <p>{t('dashboard.whatCanDoText')}</p>
                    </div>
                </div>

                {/* Contact me */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">{t('dashboard.contactMeTitle')}</h6>
                    </div>
                    <div className="card-body">
                        <p>{t('dashboard.contactMeText')} <br /> email : jeremie@jcrinon.com <br /> {t('dashboard.contactMePhoneNumber')} : 06 33 12 10 52</p>
                    </div>
                </div>

            </div>
        </div>
        </>
    )
    return baseAdmin(content, {setToken, setUserRoles, userRoles});
}

export default Dashboard;
