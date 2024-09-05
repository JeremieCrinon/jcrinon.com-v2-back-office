import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import { requestWithoutBodyWithoutJWT, requestWithoutBodyWithJWT, baseAdmin } from '../../utils';
import config from '../../config.json';

function ReadDeleteProject({token, setError500, setFlashMessage, setToken, setIsAdmin}){

    const [projects, setProjects] = useState([]);
    
    async function requestProjects() {
        try{
            const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/projects/get', token);

            if(response == 401 || response == 403 || response == 404){
                setError500(true);
            }

            if(response == 500){
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

            if(response == 401 || response == 403){
                setError500(true);
            } else if(response == 500){
                setError500(true);
            } else {
                setFlashMessage("The project as been deleted !");
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
                            <h1 className="h3 mb-2 text-gray-800">Projects</h1>
                            <p className="">Here, you can view , create, edit and delete the projects displayed on the website.</p>
                                
                            <Link to={"/projects/create"} className="btn btn-primary btn-icon-split mb-4">
                                <span className="icon text-white-50">
                                    <i className="fas fa-flag"></i>
                                </span>
                                <span className="text">Create a project</span>
                            </Link>

                            {/* DataTales Example */}
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Projects</h6>
                                </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
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

    return baseAdmin(content, {setToken, setIsAdmin})
}

export default ReadDeleteProject;