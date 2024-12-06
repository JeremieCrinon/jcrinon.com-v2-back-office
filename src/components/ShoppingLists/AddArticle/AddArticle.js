import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { requestWithBodyWithJWT, requestWithoutBodyWithJWT } from '../../../utils';

import config from '../../../config.json';

import CreateArticle from './CreateArticle/CreateArticle';

function AddArticle({token, setError500, setFlashMessage, shoppingListContent, requestShoppingListContent}){

    const { id: idAsString } = useParams();

    const id = parseInt(idAsString);

    const [createArticle, setCreateArticle] = useState(false);

    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);

    const requestArticles = async () => {
        try {
            const response = await requestWithoutBodyWithJWT(config.apiUrl + `/api/shopping-list/article/mine`, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                setError500(true);
            }

            const data = await response.json();

            setArticles([...Object.values(data)])
        } catch (error) {
            setError500(true);
        }
    }

    const addArticle = async (articleId) => {
        try {
            const response = await requestWithBodyWithJWT(config.apiUrl + `/api/shopping-list/shopping-list-article/new`, {shopping_list_id: id, article_id: articleId}, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                setError500(true);
            }         
            
            requestShoppingListContent();
        } catch (error) {
            setError500(true);
        }
    }

    const filterArticles = () => {
        setFilteredArticles(articles.filter((article) => !shoppingListContent.some((item) => item.id === article.id)));
    }

    useEffect(() => {
        requestArticles();
    }, []);

    useEffect(() => {
        requestArticles();
    }, [createArticle]);

    useEffect(() => {
        filterArticles();
    }, [shoppingListContent, articles]);

    const content = (
        <div className="modal fade" id="addArticleModal" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">

                {createArticle && (
                    <CreateArticle token={token} setError500={setError500} setFlashMessage={setFlashMessage} setCreateArticle={setCreateArticle} requestShoppingListContent={requestShoppingListContent} />
                )}
                {!createArticle && (
                    
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addArticleModalLabel">Add an article</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Button to go on the create an article page */}
                            <button type="button" className="btn btn-primary btn-icon-split mb-4" onClick={() => setCreateArticle(true)}>
                                <span className="icon text-white-50">
                                    <i className="fas fa-plus-square"></i>
                                </span>
                                <span className="text">Create an article</span>
                            </button>

                            {/* Table with the user's articles */}
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>Add to the list</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <th>Add to the list</th>
                                            <th>Name</th>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                        
                                        { filteredArticles && filteredArticles.map((article, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <a href="#" className="btn btn-primary" onClick={() => addArticle(article.id)} >
                                                        <span className="text">+</span>
                                                    </a> 
                                                </td>
                                                <td>{article.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" >Confirm</button>
                        </div> */}
                    </div>
                        
                )}
            </div>
        </div>
    )

    return content;

}

export default AddArticle;