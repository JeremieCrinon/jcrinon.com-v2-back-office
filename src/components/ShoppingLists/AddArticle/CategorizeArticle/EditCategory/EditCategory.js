import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { requestWithBodyWithJWT } from '../../../../../utils';

import config from '../../../../../config.json';

function EditCategory({token, setError500, setFlashMessage, requestCategories, categoryToEdit, setCategoryToEdit, newCategoryName, setNewCategoryName, requestArticles}){

    const [error, setError] = useState("");

    const editCategory = async () => {
        try{

            if(newCategoryName === ""){
                throw new Error("no_main_input");
            }

            const response = await requestWithBodyWithJWT(`${config.apiUrl}/api/shopping-list/category-article/${categoryToEdit.id}/edit`, { name: newCategoryName }, token);
      
            if(response === 401 || response === 403){
                throw new Error();
            }

            if(response === 500 || response === 404){
                throw new Error();
            }

            document.querySelector('.categoryNameInput').value = "";

            setError("");
            setFlashMessage("The category has been created.");

            requestCategories();
            requestArticles();
            setCategoryToEdit(null);

        } catch(error) {
            if(error.message === "no_main_input"){
                setError('Please enter a name.');
            } else {
                setError500(true);
            }
        }
    }

    const content = (
        
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="createArticleModalLabel">Edit the category "{categoryToEdit.name}"</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                {/* User error message */}
                {error && <div className="alert alert-danger mt-3">{error}</div>}

                <form className="user col-lg-12">
                    <div className="form-group row">
                        <div className="col-lg-6 mb-3 mb-sm-0">
                            <input type="text" className="form-control categoryNameInput"
                                placeholder="Name" id="name" onChange={(e) => setNewCategoryName(e.target.value)} value={newCategoryName} />
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCategoryToEdit(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={editCategory} >Confirm</button>
            </div>
        </div>
    )

    return content;

}

export default EditCategory;