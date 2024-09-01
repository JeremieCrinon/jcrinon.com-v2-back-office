import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../../config.json';

import { baseAdmin } from '../../utils';

function CreateProject({token, setError500, setFlashMessage, setToken, setIsAdmin}){

    const [name, setName] = useState('');
    const [french_name, setFrench_name] = useState('');
    const [description, setDescription] = useState('');
    const [french_description, setFrench_description] = useState('');
    const [github_link, setGithub_link] = useState('');
    const [project_link, setProject_link] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async () => {
          try{

            if(name === "" || french_name === "" || description === "" || french_description === ""){
                throw new Error("no_main_input");
            }

            const image = document.getElementById('image');
            const selectedFile = image.files[0];

            if (!selectedFile) {
                throw new Error("no_file");
            }

            const acceptedExtensions = ['png', 'jpeg', 'webp', 'jpg'];
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

            if (!acceptedExtensions.includes(fileExtension)) {
                throw new Error("invalid_file_format");
            }
    
            const formData = new FormData();
            formData.append('name', name);
            formData.append('french_name', french_name);
            formData.append('description', description);
            formData.append('french_description', french_description);

            // Verify if github_link and project_link are filled, and append them to the form data if they are
            if (github_link) {
                formData.append('github_link', github_link);
            }
            if (project_link) {
                formData.append('project_link', project_link);
            }

            // Append the selected image file to the form data
            formData.append('image', selectedFile);
            

            const response = await fetch(config.apiUrl + '/api/projects/new', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData,
              })

            console.log(await response.json());

            if(response.status == 401 || response.status == 403){ // That's an error comming from the user
                throw new Error;
            } else if (!response.ok){ // That's an error from either the back-end or front-end, but it ain't comming from the user
                setError500(true);
            }

            setFlashMessage("The project has been created.");
            navigate('/projects');
    
          } catch(error) {
            if(error.message === "no_main_input"){
                setError('Please enter a name, frenh name, description, and french description.');
            } else if (error.message === "no_file"){
                setError('Please enter an image.');
            } else if (error.message === "no_file"){
                setError('Only these formats are allowed (png, jpeg, jpg, webp).');
            } else {
                setError('Creation of the new project failed. Please check the infos you entered and try again.');
            }
          }
    
      };

    const content = (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        <div className='d-flex flex-column md-12'>
                            <form className="user col-lg-12">
                                
                                <div className="form-group row">
                                    <div className="col-sm-3 mb-3 mb-sm-0">
                                        <input type="text" className="form-control"
                                            placeholder="Name" id="name" onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="col-sm-3">
                                        <input type="text" className="form-control"
                                            placeholder="Name in french" id="french_name" onChange={(e) => setFrench_name(e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-3 mb-3 mb-sm-0">
                                        <input type="text" className="form-control"
                                            placeholder="Description" id="description" onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                    <div className="col-sm-3">
                                        <input type="text" className="form-control"
                                            placeholder="Description in french" id="french_description" onChange={(e) => setFrench_description(e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control col-lg-6"
                                        placeholder="Link of the github repository (facultative)" id="github_link" onChange={(e) => setGithub_link(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control col-lg-6"
                                        placeholder="Link of the project (facultative)" id="project_link" onChange={(e) => setProject_link(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="image">
                                        Image
                                    </label>
                                    <input type="file" className="form-control col-lg-6"
                                        placeholder="Image" id="image" />
                                </div>
                                <a href='#' onClick={handleSubmit} className="btn btn-primary btn-user btn-block col-lg-6">
                                    Create Project
                                </a>
                            </form>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return baseAdmin(content, setToken={setToken}, setIsAdmin={setIsAdmin})

}

export default CreateProject;