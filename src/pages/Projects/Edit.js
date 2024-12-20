import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { requestWithoutBodyWithoutJWT, baseAdmin } from '../../utils';

import config from '../../config.json';

import { useTranslation } from 'react-i18next';

function EditProject({token, setError500, setFlashMessage, setToken, setUserRoles, userRoles}){

    const [name, setName] = useState('');
    const [french_name, setFrench_name] = useState('');
    const [description, setDescription] = useState('');
    const [french_description, setFrench_description] = useState('');
    const [github_link, setGithub_link] = useState('');
    const [project_link, setProject_link] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    const { t } = useTranslation();

    const getProject = async () => {
        const response = await requestWithoutBodyWithoutJWT(config.apiUrl + '/api/projects/' + id);

        if(response === 401 || response === 403 || response === 404){
            setError500(true);
        }

        if(response === 500){
            setError500(true);
        }

        const data = await response.json();

        setName(data.name);
        setFrench_name(data.french_name);
        setDescription(data.description);
        setFrench_description(data.french_description);
        setGithub_link(data.github_link);
        setProject_link(data.project_link);
        
    }

    useEffect(() => {
        getProject();
    }, []);

    const submitAfterVerifications = async (formData) => {
        try {
            const response = await fetch(config.apiUrl + '/api/projects/' + id + '/edit', {
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
    
            setFlashMessage(t('projects.edit.flashMessage'));
            navigate('/projects');
        } catch (error) {
            setError(t('projects.edit.failed'));
        }
        
    }

    const handleSubmit = async () => {
          try{

            if(name === "" || french_name === "" || description === "" || french_description === ""){
                throw new Error("no_main_input");
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

            const image = document.getElementById('image');
            const selectedFile = image.files[0];

            if (selectedFile) {
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
                            // Append the selected image file to the form data
                            formData.append('image', selectedFile);
                            // Call a function to send the data after having verified that everything is ok with the image size
                            submitAfterVerifications(formData);
                        
                        } catch (error) {
                            if (error.message === "bad aspect ratio"){
                                setError(t('projects.edit.badAspectRatio'));
                            } else if (error.message === "too small image"){
                                setError(t('projects.edit.toSmall'));
                            } else {
                                setError500(true);
                            }
                        };
                    }
                    
                };

                // Read the selected file as data URL
                reader.readAsDataURL(selectedFile);
            } else {
                submitAfterVerifications(formData);
            }   
    
          } catch(error) {
            if(error.message === "no_main_input"){
                setError(t('projects.edit.noMainInput'));
            } else if (error.message === "invalid_file_format"){
                setError(t('projects.edit.invalidFileFormat'));
            } else {
                setError(t('projects.edit.failed'));
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
                                {/* {name && french_name &&  */}
                                    <div className="form-group row">
                                        <div className="col-sm-3 mb-3 mb-sm-0">
                                            <input type="text" className="form-control"
                                                placeholder={t('projects.edit.form.name')} id="name" value={name ? name : ''} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control"
                                                placeholder={t('projects.edit.form.frenchName')} id="french_name" value={french_name ? french_name : ''} onChange={(e) => setFrench_name(e.target.value)} />
                                        </div>
                                    </div>
                                {/* } */}
                                {/* {description && french_description &&  */}
                                    <div className="form-group row">
                                        <div className="col-sm-3 mb-3 mb-sm-0">
                                            <input type="text" className="form-control"
                                                placeholder="Description" id="description" value={description ? description : ''} onChange={(e) => setDescription(e.target.value)} />
                                        </div>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control"
                                                placeholder={t('projects.edit.form.frenchDescription')} id="french_description" value={french_description ? french_description : ''} onChange={(e) => setFrench_description(e.target.value)} />
                                        </div>
                                    </div>
                                {/* } */}
                                <div className="form-group">
                                    <input type="text" className="form-control col-lg-6"
                                        placeholder={t('projects.edit.form.githubLink')} id="github_link" value={github_link ? github_link : ''} onChange={(e) => setGithub_link(e.target.value)} />
                                </div>
                                
                                
                                <div className="form-group">
                                    <input type="text" className="form-control col-lg-6"
                                        placeholder={t('projects.edit.form.projectLink')} id="project_link" value={project_link ? project_link : ''} onChange={(e) => setProject_link(e.target.value)} />
                                </div>
                                
                                
                                <div className="form-group">
                                    <label htmlFor="image">
                                        {t('projects.edit.form.newImage')}
                                    </label>
                                    <input type="file" className="form-control col-lg-6"
                                        placeholder="Image" id="image" />
                                </div>
                                <a href='#' onClick={handleSubmit} className="btn btn-primary btn-user btn-block col-lg-6">
                                    {t('projects.edit.form.createButton')}
                                </a>
                            </form>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return baseAdmin(content, {setToken, setUserRoles, userRoles});

}

export default EditProject;