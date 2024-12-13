import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../../config.json';

import { baseAdmin } from '../../utils';

import { useTranslation } from 'react-i18next';

function CreateProject({token, setError500, setFlashMessage, setToken, setUserRoles, userRoles}){

    const [name, setName] = useState('');
    const [french_name, setFrench_name] = useState('');
    const [description, setDescription] = useState('');
    const [french_description, setFrench_description] = useState('');
    const [github_link, setGithub_link] = useState('');
    const [project_link, setProject_link] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { t } = useTranslation();

    const submitAfterVerifications = async (selectedFile) => {
        try{
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

            if(response.status === 401 || response.status === 403){ // That's an error comming from the user
                throw new Error("user error");
            } else if (!response.ok){ // That's an error from either the back-end or front-end, but it ain't comming from the user
                setError500(true);
            }

            setFlashMessage(t('projects.create.flashMessage'));
            navigate('/projects');
        } catch (error) {
            setError(t('projects.create.failed'))
        }
        
    }

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

        // Create a FileReader to read the file
        const reader = new FileReader();
        
        // Define a callback function to be executed when the file has been loaded
        reader.onload = () => {
            // Get the image dimensions
            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
                try{
                    if(img.width / img.height !== 16/9){
                        throw new Error("bad aspect ratio");
                    }
                    if(img.width < 768){
                        throw new Error("too small image");
                    }
                    // Call a function to send the data after having verified that everything is ok with the image size
                    submitAfterVerifications(selectedFile);
                
                } catch (error) {
                    if (error.message === "bad aspect ratio"){
                        setError(t('projects.create.badAspectRatio'));
                    } else if (error.message === "too small image"){
                        setError(t('projects.create.toSmall'));
                    } else {
                        setError500(true);
                    }
                };
            }
            
        };

        // Read the selected file as data URL
        reader.readAsDataURL(selectedFile);

        } catch(error) {
        if(error.message === "no_main_input"){
            setError(t('projects.create.noMainInput'));
        } else if (error.message === "no_file"){
            setError(t('projects.create.noFile'));
        } else if (error.message === "invalid_file_format"){
            setError(t('projects.create.invalidFileFormat'));
        } else {
            setError(t('projects.create.failed'));
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
                                            placeholder={t('projects.create.form.name')} id="name" onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="col-sm-3">
                                        <input type="text" className="form-control"
                                            placeholder={t('projects.create.form.frenchName')} id="french_name" onChange={(e) => setFrench_name(e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-3 mb-3 mb-sm-0">
                                        <input type="text" className="form-control"
                                            placeholder="Description" id="description" onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                    <div className="col-sm-3">
                                        <input type="text" className="form-control"
                                            placeholder={t('projects.create.form.frenchDescription')} id="french_description" onChange={(e) => setFrench_description(e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control col-lg-6"
                                        placeholder={t('projects.create.form.githubLink')} id="github_link" onChange={(e) => setGithub_link(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control col-lg-6"
                                        placeholder={t('projects.create.form.projectLink')} id="project_link" onChange={(e) => setProject_link(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="image">
                                        Image
                                    </label>
                                    <input type="file" className="form-control col-lg-6"
                                        placeholder="Image" id="image" />
                                </div>
                                <a href='#' onClick={handleSubmit} className="btn btn-primary btn-user btn-block col-lg-6">
                                    {t('projects.create.form.createButton')}
                                </a>
                            </form>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return baseAdmin(content, {setToken, setUserRoles, userRoles});

}

export default CreateProject;