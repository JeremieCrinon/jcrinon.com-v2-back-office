import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { requestWithBodyWithJWT, requestWithoutBodyWithJWT } from '../../../../utils';

import config from '../../../../config.json';

import CreateCategory from './CreateCategory/CreateCategory';

function CategorizeArticle({token, setError500, setFlashMessage, articleToCategorizeId, setArticleToCategorizeId, requestArticles}){

    const [error, setError] = useState("");

    const [categories, setCategories] = useState([]);

    const [articleToCategorize, setArticleToCategorize] = useState(null);

    const [createCategory, setCreateCategory] = useState(false);

    const requestCategories = async () => {
        try {
            const response = await requestWithoutBodyWithJWT(config.apiUrl + `/api/shopping-list/category-article/mine`, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                throw new Error();
            }

            const data = await response.json();

            setCategories([...Object.values(data)]);
        } catch (error) {
            setError500(true);
        }
    }

    const requestArticleToCategorize = async () => {
        try {
            const response = await requestWithoutBodyWithJWT(config.apiUrl + `/api/shopping-list/article/mine`, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                throw new Error();
            }

            const data = await response.json();

            let foundArticle = false;

            data.forEach(article => {
                if(article.id === articleToCategorizeId) {
                    setArticleToCategorize(article);
                    foundArticle = true;
                }
            });

            if (!foundArticle) {
                throw new Error();
            }
        } catch (error) {
            setError500(true);
        }
    }

    const categorizeArticle = async (category_id) => {
        try {
            const response = await requestWithBodyWithJWT(`${config.apiUrl}/api/shopping-list/article/${articleToCategorize.id}/categorize`, {category_id}, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                throw new Error();
            }

            requestArticles();
            requestArticleToCategorize();
        } catch (error) {
            setError500(true);
        }
    }

    const decategorizeArticle = async (category_id) => {
        try {
            const response = await requestWithBodyWithJWT(`${config.apiUrl}/api/shopping-list/article/${articleToCategorize.id}/category/delete`, {category_id}, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                throw new Error();
            }

            requestArticles();
            requestArticleToCategorize();
        } catch (error) {
            setError500(true);
        }
    }

    useEffect(() => {
        requestCategories();
        requestArticleToCategorize();
    }, []);

    const content = (
        <>
        {createCategory && (
            <CreateCategory token={token} setError500={setError500} setFlashMessage={setFlashMessage} requestCategories={requestCategories} setCreateCategory={setCreateCategory} />
        )} 
        {!createCategory && (
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="createArticleModalLabel">Categorize the article "{articleToCategorize && articleToCategorize.name}"</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {/* User error message */}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                    {/* Button to change modal to create a category */}
                    <button type="button" className="btn btn-primary btn-icon-split mb-4" onClick={() => setCreateCategory(true)}>
                        <span className="icon text-white-50">
                            <i className="fas fa-plus-square"></i>
                        </span>
                        <span className="text">Create a new category</span>
                    </button>

                    {/* Table with the user's categories */}
                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Categorize / Decategorize the article</th>
                                    <th>Name of the category</th>
                                    <th>Edit the category</th>
                                    <th>Delete the category</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>Categorize / Decategorize the article</th>
                                    <th>Name of the category</th>
                                    <th>Edit the category</th>
                                    <th>Delete the category</th>
                                </tr>
                            </tfoot>
                            <tbody>
                                { categories && categories.map((category, index) => (
                                    <tr key={index}>
                                        { articleToCategorize && articleToCategorize.categories.find(({ id }) => id === category.id) ? (
                                            <td>
                                                <a href="#" className="btn btn-danger btn-icon-split" onClick={() => decategorizeArticle(category.id)} >
                                                    <span className="icon text-white-50">
                                                        <i className="fas fa-trash"></i>
                                                    </span>
                                                </a> 
                                            </td>
                                        ) : (
                                            <td>
                                                <a href="#" className="btn btn-primary" onClick={() => categorizeArticle(category.id)} >
                                                    <span className="text">+</span>
                                                </a> 
                                            </td>
                                        )}
                                        <td>{category.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setArticleToCategorizeId(null)}>Close</button>
                </div>
            </div>
        )}
        </>
    )

    return content;

}

export default CategorizeArticle;