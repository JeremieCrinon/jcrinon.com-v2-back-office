import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { requestWithoutBodyWithJWT, baseAdmin, requestWithBodyWithJWT } from '../../utils';
import config from '../../config.json';

function CreateReadDeleteUser({token, setError500, setFlashMessage, setToken, setUserRoles, userRoles}){

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [possibleRoles, setPossibleRoles] = useState([]);
    const [choosedRoles, setChoosedRoles] = useState([]);
    const [user_email, setUser_email] = useState("");
    const [error, setError] = useState(null);
    
    async function requestUsers() {
        try{
            const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/users', token);

            if(response == 401 || response == 403 || response == 404){
                setError500(true);
            }

            if(response == 500){
                setError500(true);
            }

            const data = await response.json();
        
            setUsers([...Object.values(data)])
        } catch{
            setError500(true);
        }
        
    }

    async function requestPossibleRoles() {
        try{
            const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/users/roles', token);

            if(response == 401 || response == 403 || response == 404){
                setError500(true);
            }

            if(response == 500){
                setError500(true);
            }

            const data = await response.json();
        
            setPossibleRoles([...Object.values(data)]);
        } catch{
            setError500(true);
        }
    }

    async function handleCreateSubmit() {

        try{
            if(user_email === ""){
                throw new Error("no_email");
            }

            if(choosedRoles.length == 0){
                throw new Error("no_roles");
            }

            const response = await requestWithBodyWithJWT(config.apiUrl + '/api/users/new', { email: user_email, roles: choosedRoles }, token);

            if(response == 401 || response == 403 || response == 500){
                setError500(true);
            }

            const data = await response.json();

            setFlashMessage("The user has successfully been created!");
            setChoosedRoles([]);
            setUser_email("");
            setError(null);

            requestUsers();

            const inputsToReset = document.querySelectorAll("#create_user_form input");

            inputsToReset.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });

        } catch(error){
            if(error.message === "no_email"){
                setError("Please enter an email for the new user!")
            } else if (error.message === "no_roles"){
                setError("Please choose at least one role for the new user, you can take the role ROLE_USER that will give him no permissions.")
            } else {
                setError500(true);
            }
        }
    }

    async function deleteUser(user_id, user_email){
        if(window.confirm(`Are you sure you want to delete the user with the email ${user_email}?`)){
            try{
                const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/users/' + user_id + '/delete', token);
    
                if(response == 401 || response == 403){
                    setError500(true);
                } else if(response == 500){
                    setError500(true);
                } else {
                    setFlashMessage("The user as been deleted !");
                    requestUsers();
                }
            } catch{
                setError500(true);
            }
        }
    }

    function toggleRole(role){
        if(choosedRoles.includes(role)){
            let newRoles = choosedRoles;
            newRoles = newRoles.filter(e => e !== role)
            setChoosedRoles(newRoles);
        } else {
            let newRoles = choosedRoles;
            
            newRoles.push(role);
            setChoosedRoles(newRoles);
        }
    }

    useEffect(() => {
        requestUsers();
        requestPossibleRoles();
    }, []);
    
    const content = (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        {/* Page Heading */}
                            <h1 className="h3 mb-2 text-gray-800">Users</h1>
                            <p className="">Here, you can view, create and delete the users on the website.</p>

                            {/* DataTales Example */}
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Users</h6>
                                </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Roles</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th>Email</th>
                                                <th>Roles</th>
                                                <th>Delete</th>
                                            </tr>
                                        </tfoot>
                                        <tbody>
                                            
                                            { users && users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.email}</td>
                                                    <td>{user.roles.map((role, roleIndex) => (
                                                        <div key={roleIndex}>
                                                            {role} 
                                                            <br />
                                                        </div>
                                                        
                                                    ))}</td>
                                                    <td>
                                                        <a href="#" className="btn btn-danger btn-icon-split" onClick={() => deleteUser(user.id, user.email)} >
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
                            <div className="card mb-2">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Create a user</h6>
                                </div>
                            </div>
                            <div className="card-body">
                                <form className="user col-lg-8 mb-4" id='create_user_form'>
                                    <div className="form-group">
                                        <input type="text" className="form-control col-lg-6"
                                            placeholder="User email" id="user_email" onChange={(e) => setUser_email(e.target.value)} />
                                    </div>
                                    {possibleRoles.map((role, index) => (
                                        <div key={index} className="form-group">
                                            <div className="custom-control custom-checkbox small">
                                                <input type="checkbox" className="custom-control-input" id={role} onClick={e => toggleRole(role)} />
                                                <label className="custom-control-label" htmlFor={role}>{role}</label>
                                            </div>
                                        </div>
                                    ))}
                                    {/* <div className="form-group">
                                        <div className="custom-control custom-checkbox small">
                                            <input type="checkbox" className="custom-control-input" id="customCheck" />
                                            <label className="custom-control-label" htmlFor="customCheck">Remember
                                                Me</label>
                                        </div>
                                    </div> */}
                                    <a href='#' onClick={handleCreateSubmit} className="btn btn-primary btn-user btn-block col-lg-6">
                                        Create User
                                    </a>
                                </form>
                                {error && <div className="alert alert-danger mt-3">{error}</div>}
                            </div>                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return baseAdmin(content, {setToken, setUserRoles, userRoles});
}

export default CreateReadDeleteUser;