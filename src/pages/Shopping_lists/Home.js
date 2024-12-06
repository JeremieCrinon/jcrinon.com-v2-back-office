import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import { requestWithoutBodyWithJWT, baseAdmin, requestWithBodyWithJWT } from '../../utils';
import config from '../../config.json';

function HomeShoppingList({token, setError500, setFlashMessage, setToken, setUserRoles, userRoles}){

    const [error, setError] = useState('');

    const [shoppingLists, setShoppingLists] = useState([]);
    const [invitedLists, setInvitedLists] = useState([]);

    const [newListName, setNewListName] = useState('');
    

    const [deleteShoppingListId, setDeleteShoppingListId] = useState(0);

    const [editShoppingListId, setEditShoppingListId] = useState(0);
    const [editShoppingListName, setEditShoppingListName] = useState('');
    
    async function requestShoppingLists() {
        try{
            const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/shopping-list/shopping-list/mine', token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                setError500(true);
            }

            const data = await response.json();
        
            setShoppingLists([...Object.values(data)])
        } catch{
            setError500(true);
        }
        
    }

    async function requestInvitedLists() {
        try{
            const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/shopping-list/shopping-list/invited', token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                setError500(true);
            }

            const data = await response.json();
        
            setInvitedLists([...Object.values(data)])
        } catch{
            setError500(true);
        }
        
    }

    const submitNewShoppingList = async () => {
        try{

            if(newListName === ""){
                throw new Error("no_main_input");
            }

            const response = await requestWithBodyWithJWT(config.apiUrl + '/api/shopping-list/shopping-list/new', { name: newListName }, token);
      
            if(response === 401 || response === 403){
                throw new Error();
            }

            if(response === 500 || response === 404){
                throw new Error();
            }

            document.querySelector('.newListNameInput').value = "";

            setError("");
            setNewListName("");
            setFlashMessage("The shopping list has been created.");
            requestShoppingLists();
            requestInvitedLists();
        } catch(error) {
            if(error.message === "no_main_input"){
                setError('Please enter a name.');
            } else {
                setError500(true);
            }
        }
    
    };

    const deleteShoppingList = async() => {
        try {
            if(deleteShoppingListId === 0) {
                throw new Error();
            }

            const response = await requestWithoutBodyWithJWT(config.apiUrl + `/api/shopping-list/shopping-list/${deleteShoppingListId}/delete`, token);

            if(response === 500 || response === 401 || response === 403 || response === 404){
                throw new Error();
            }

            setFlashMessage("The shopping list has been deleted.");
            requestShoppingLists();
        } catch (error) {
            setError500(true);
        }
    }

    const editShoppingList = async() => {
        try {
            if(editShoppingListId === 0) {
                throw new Error();
            }

            if (editShoppingListName === '') {
                throw new Error("no_name");
            }

            const response = await requestWithBodyWithJWT(config.apiUrl + `/api/shopping-list/shopping-list/${editShoppingListId}/edit`, { name: editShoppingListName }, token);
      
            if(response === 401 || response === 403){
                throw new Error();
            }

            if(response === 500 || response === 404){
                throw new Error();
            }

            // document.querySelector('.newListNameInput').value = "";

            setError("");
            setEditShoppingListName("");
            setFlashMessage("The shopping list has been modified.");
            requestShoppingLists();
            requestInvitedLists();

        } catch (error) {
            if(error.message === "no_name") {
                setError("Please enter the new name for the shopping list.");
            } else {
                setError500(true);
            }
        }
    }

    useEffect(() => {
        requestShoppingLists();
        requestInvitedLists();
    }, []);

    const content = (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        {/* Page Heading */}
                            <h1 className="h3 mb-2 text-gray-800">Shopping lists</h1>
                            <p className="">Here, you can view your shopping lists, add articles to them, make some articles recurring....</p>

                            {/* DataTales Example */}
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Shopping lists</h6>
                                </div>
                            <div className="card-body">

                                {/* User error message */}
                                {error && <div className="alert alert-danger mt-3">{error}</div>}

                                {/* Modal create shopping list */}
                                <div className="modal fade" id="createShoppingListModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Create a new shopping list</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form className="user col-lg-12">
                                    
                                            <div className="form-group row">
                                                <div className="col-sm-3 mb-3 mb-sm-0">
                                                    <input type="text" className="form-control newListNameInput"
                                                        placeholder="Name" id="name" onChange={(e) => setNewListName(e.target.value)} />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={submitNewShoppingList}>Create shopping list</button>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                {/* Modal edit shopping list */}
                                <div className="modal fade" id="editShoppingListModal" tabIndex="-1" role="dialog" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editShoppingListModalLabel">Edit the shopping list</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form className="user col-lg-12">
                                    
                                            <div className="form-group row">
                                                <div className="col-sm-3 mb-3 mb-sm-0">
                                                    <input type="text" className="form-control newListNameInput"
                                                        value={editShoppingListName} placeholder="Name" id="name" onChange={(e) => setEditShoppingListName(e.target.value)} />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={editShoppingList}>Edit shopping list</button>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                {/* Modal delete shopping list */}
                                <div className="modal fade" id="deleteShoppingListModal" tabIndex="-1" role="dialog" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="deleteShoppingListModalLabel">Confirm shopping list deletion</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={deleteShoppingList}>Confirm</button>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                {/* Button trigger modal create shopping list */}
                                <button type="button" className="btn btn-primary btn-icon-split mb-4" data-toggle="modal" data-target="#createShoppingListModal">
                                    <span className="icon text-white-50">
                                        <i className="fas fa-plus-square"></i>
                                    </span>
                                    <span className="text">Create a new shopping list</span>
                                </button>

                                {/* Table for user's lists */}
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>View shopping list</th>
                                                <th>Edit the name</th>
                                                <th>Delete the shopping list</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th>Name</th>
                                                <th>View shopping list</th>
                                                <th>Edit the name</th>
                                                <th>Delete the shopping list</th>
                                            </tr>
                                        </tfoot>
                                        <tbody>
                                            
                                            { shoppingLists && shoppingLists.map((shoppingList, index) => (
                                                <tr key={index}>
                                                    <td>{shoppingList.name}</td>
                                                    <td>
                                                        <Link to={`/shopping-lists/${shoppingList.id}`} className="btn btn-primary btn-icon-split">
                                                            <span className="icon text-white-50">
                                                                <i className="fas fa-arrow-right"></i>
                                                            </span>
                                                            <span className="text">View the list</span>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <a href="#" className="btn btn-secondary btn-icon-split" data-toggle="modal" data-target="#editShoppingListModal" onClick={() => {setEditShoppingListId(shoppingList.id); setEditShoppingListName(shoppingList.name)}} >
                                                            <span className="icon text-white-50">
                                                                <i className="fas fa-arrow-right"></i>
                                                            </span>
                                                            <span className="text">Edit the name</span>
                                                        </a> 
                                                    </td>
                                                    <td>
                                                        <a href="#" className="btn btn-danger btn-icon-split" data-toggle="modal" data-target="#deleteShoppingListModal" onClick={() => setDeleteShoppingListId(shoppingList.id)} >
                                                            <span className="icon text-white-50">
                                                                <i className="fas fa-trash"></i>
                                                            </span>
                                                            <span className="text">Delete the shopping list</span>
                                                        </a> 
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <h1 className="h3 mb-2 text-gray-800">Invited lists</h1>
                                <p className="">The lists you have been invited by another user to see, and maybe edit. If the buttons to edit are grayed, it means that you only see it.</p>

                                {/* Table for invited lists */}
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>View shopping list</th>
                                                <th>Edit the name</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th>Name</th>
                                                <th>View shopping list</th>
                                                <th>Edit the name</th>
                                            </tr>
                                        </tfoot>
                                        <tbody>
                                            
                                            { invitedLists && invitedLists.map((shoppingList, index) => (
                                                <tr key={index}>
                                                    <td>{shoppingList.name}</td>
                                                    <td>
                                                        <Link to={`/shopping-lists/${shoppingList.id}`} className="btn btn-primary btn-icon-split">
                                                            <span className="icon text-white-50">
                                                                <i className="fas fa-arrow-right"></i>
                                                            </span>
                                                            <span className="text">View the list</span>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        {shoppingList.permission && (
                                                            <a href="#" className="btn btn-secondary btn-icon-split" data-toggle="modal" data-target="#editShoppingListModal" onClick={() => {setEditShoppingListId(shoppingList.id); setEditShoppingListName(shoppingList.name)}} >
                                                                <span className="icon text-white-50">
                                                                    <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                <span className="text">Edit the name</span>
                                                            </a> 
                                                        )}
                                                        {!shoppingList.permission && (
                                                            <a href="#" className="btn btn-light btn-icon-split">
                                                                <span className="icon text-white-50">
                                                                    <i className="fas fa-lock"></i>
                                                                </span>
                                                                <span className="text">Edit the name</span>
                                                            </a> 
                                                        )}
                                                        
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

export default HomeShoppingList;