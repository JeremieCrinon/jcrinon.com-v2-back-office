import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { requestWithBodyWithJWT, requestWithoutBodyWithJWT } from '../../../utils';

import config from '../../../config.json';

function InviteUsers({token, setError500, setFlashMessage}){

    const { id: idAsString } = useParams();

    const id = parseInt(idAsString);

    const [invitedUsers, setInvitedUsers] = useState([]);

    const [inviteUser, setInviteUser] = useState(false);
    const [inviteUserEmail, setInviteUserEmail] = useState("");

    const [error, setError] = useState("");

    const getInvitedUsers = async () => {
        try {
            const response = await requestWithoutBodyWithJWT(`${config.apiUrl}/api/shopping-list/shopping-list/${id}/invited`, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                setError500(true);
            }

            const data = await response.json();

            setInvitedUsers([...Object.values(data)]);
        } catch (error) {
            setError500(true)
        }
    }

    const changeUserPermission = async (user_email, can_modify) => {
        try {
            const response = await requestWithBodyWithJWT(`${config.apiUrl}/api/shopping-list/shopping-list/${id}/invite/edit`, {user_email: user_email, can_modify: can_modify}, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                throw new Error();
            }
        } catch (error) {
            setError500(true);
        }
    }

    const handlePermissionChange = async (user_email, index) => {
        const button = document.querySelector(`#switchPermission${index}`);

        const value = button.checked;

        changeUserPermission(user_email, value);
    }

    const inviteNewUser = async () => {
        try {
            const newUserPermission = document.getElementById("newUserPermission");

            invitedUsers.forEach(user => {
                if (user.user_email === inviteUserEmail) {
                    throw new Error("already_invited");
                }
            });

            const response = await requestWithBodyWithJWT(`${config.apiUrl}/api/shopping-list/shopping-list/${id}/invite`, {can_modify: newUserPermission.checked, user_email: inviteUserEmail}, token);

            if(response === 401 || response === 403 || response === 500){
                throw new Error();
            }

            if(response === 404) {
                throw new Error("no_user");
            }

            getInvitedUsers();
            setError("");
            setInviteUser(false);
        } catch (error) {
            if (error.message === "already_invited"){
                setError("The user is already invited to the list.")
            } else if (error.message === "no_user") {
                setError("No user found with the given email.")
            } else {
                setError500(true);
            }
        }
    }

    const removeUser = async (user_email) => {
        try {
            const response = await requestWithBodyWithJWT(`${config.apiUrl}/api/shopping-list/shopping-list/${id}/invite/delete`, {user_email: user_email}, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                throw new Error();
            }

            getInvitedUsers();
        } catch (error) {
            setError500(true);
        }
    }

    useEffect(() => {
        getInvitedUsers();
    }, []);

    const content = (
        <>
        <div className="modal fade" id="inviteUsersModal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="inviteUsersModalLabel">Users in the list</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    {inviteUser && (
                        <>
                        <div className="modal-body">
                            {/* User error message */}
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
    
                            <form className="user col-lg-12">
                                <div className="form-group row">
                                    <div className="col-lg-6 mb-3 mb-sm-0">
                                        <input type="text" className="form-control userEmailInput"
                                            placeholder="User's email" id="new_user_email" onChange={(e) => setInviteUserEmail(e.target.value)} />
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" id='newUserPermission' className="custom-control-input" />
                                            <label className="custom-control-label" htmlFor={`newUserPermission`}>Has permission to edit</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setInviteUser(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => inviteNewUser()} >Confirm</button>
                        </div>
                        </>
                    )}
                    {!inviteUser && (
                        <div className="modal-body">
                        
                            {/* Button to go on the invite user page */}
                            <button type="button" className="btn btn-primary btn-icon-split mb-4" onClick={() => setInviteUser(true)}>
                                <span className="icon text-white-50">
                                    <i className="fas fa-plus-square"></i>
                                </span>
                                <span className="text">Invite a new user</span>
                            </button>
    
                            {/* Table with the invited users */}
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>User's email</th>
                                            <th>Permission</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <th>User's email</th>
                                            <th>Permission</th>
                                            <th>Remove</th>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                        { invitedUsers && invitedUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.user_email}</td>
                                                <td>
                                                    <div className="custom-control custom-switch">
                                                        <input type="checkbox" className="custom-control-input" id={`switchPermission${index}`} defaultChecked={user.permission} onChange={() => handlePermissionChange(user.user_email, index)} />
                                                        <label className="custom-control-label" htmlFor={`switchPermission${index}`}></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button href="#" className="btn btn-danger btn-icon-split" onClick={() => removeUser(user.user_email)} >
                                                        <span className="icon text-white-50">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
        
    )

    return content;

}

export default InviteUsers;