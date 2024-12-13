import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import { requestWithoutBodyWithoutJWT, requestWithoutBodyWithJWT, baseAdmin } from '../../utils';
import config from '../../config.json';

import { useTranslation } from 'react-i18next';

function ReadDeleteProject({token, setError500, setFlashMessage, setToken, setUserRoles, userRoles}){

    const [projects, setProjects] = useState([]);

    const { t } = useTranslation();
    
    async function requestProjects() {
        try{
            const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/projects/get', token);

            if(response === 401 || response === 403 || response === 404){
                setError500(true);
            }

            if(response === 500){
                setError500(true);
            }

            const data = await response.json();
        
            setProjects([...Object.values(data)])
        } catch{
            setError500(true);
        }
        
    }

    async function deleteProject(project_id){
        try{
            const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/projects/' + project_id + '/delete', token);

            if(response === 401 || response === 403){
                setError500(true);
            } else if(response === 500){
                setError500(true);
            } else {
                setFlashMessage(t('projects.readDelete.deleteFlashMessage'));
                requestProjects();
            }
        } catch{
            setError500(true);
        }

    }

    useEffect(() => {
        requestProjects();
    }, []);
    
    const content = (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        {/* Page Heading */}
                            <h1 className="h3 mb-2 text-gray-800">{t('projects.readDelete.title')}</h1>
                            <p className="">{t('projects.readDelete.subTitle')}</p>
                                
                            <Link to={"/projects/create"} className="btn btn-primary btn-icon-split mb-4">
                                <span className="icon text-white-50">
                                    <i className="fas fa-plus-square"></i>
                                </span>
                                <span className="text">{t('projects.readDelete.linkCreate')}</span>
                            </Link>

                            {/* DataTales Example */}
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">{t('projects.readDelete.tab.title')}</h6>
                                </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>{t('projects.readDelete.tab.name')}</th>
                                                <th>Description</th>
                                                <th>{t('projects.readDelete.tab.frenchName')}</th>
                                                <th>{t('projects.readDelete.tab.frenchDescription')}</th>
                                                <th>Image</th>
                                                <th>{t('projects.readDelete.tab.githubLink')}</th>
                                                <th>{t('projects.readDelete.tab.projectLink')}</th>
                                                <th>{t('projects.readDelete.tab.edit')}</th>
                                                <th>{t('projects.readDelete.tab.delete')}</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>French name</th>
                                                <th>French description</th>
                                                <th>Image</th>
                                                <th>Github link</th>
                                                <th>Project link</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                            </tr>
                                        </tfoot>
                                        <tbody>
                                            
                                            { projects && projects.map((project, index) => (
                                                <tr key={index}>
                                                    <td>{project.name}</td>
                                                    <td>{project.description}</td>
                                                    <td>{project.french_name}</td>
                                                    <td>{project.french_description}</td>
                                                    <td><img src={config.apiUrl + "/api/projects/image/" + project.image} style={{width: '100%'}} /></td>
                                                    <td>{project.github_link}</td>
                                                    <td>{project.project_link}</td>
                                                    <td>
                                                        <Link to={`/projects/${project.id}/edit`} className="btn btn-secondary btn-icon-split">
                                                            <span className="icon text-white-50">
                                                                <i className="fas fa-arrow-right"></i>
                                                            </span>
                                                            <span className="text">Edit</span>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <a href="#" className="btn btn-danger btn-icon-split" onClick={() => deleteProject(project.id)} >
                                                            <span className="icon text-white-50">
                                                                <i className="fas fa-trash"></i>
                                                            </span>
                                                            <span className="text">Delete</span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return baseAdmin(content, {setToken, setUserRoles, userRoles});
}

export default ReadDeleteProject;