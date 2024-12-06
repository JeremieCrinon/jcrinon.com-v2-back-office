import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { requestWithoutBodyWithJWT, baseAdmin, requestWithBodyWithJWT } from '../../utils';
import config from '../../config.json';

import AddArticle from '../../components/ShoppingLists/AddArticle/AddArticle';

function DetailShoppingList({token, setError500, setFlashMessage, setToken, setUserRoles, userRoles}){

    const navigate = useNavigate();

    const { id: idAsString } = useParams(); // Get the shopping list id from the parameter in the url

    const [error, setError] = useState('');

    const id = parseInt(idAsString);

    const [shoppingListName, setShoppingListName] = useState('');
    const [articles, setArticles] = useState([]);

    const [permission, setPermission] = useState(true);
    
    async function requestShoppingListName() {
        try{
            const response = await requestWithoutBodyWithJWT(config.apiUrl + '/api/shopping-list/shopping-list/mine', token); // Not really efficient, I know, but users shall not have that much lists, and their should not be millions of user

            if(response === 401 || response === 403 || response === 404 || response === 500){
                throw new Error();
            }

            const data = await response.json();

            const response2 = await requestWithoutBodyWithJWT(config.apiUrl + '/api/shopping-list/shopping-list/invited', token); // Not really efficient, I know, but users shall not have that much lists, and their should not be millions of user

            if(response2 === 401 || response2 === 403 || response2 === 404 || response2 === 500){
                throw new Error("vvv");
            }

            const data2 = await response2.json();

            let hasFound = false

            data.forEach(e => {
                if (e.id === id) {
                    setShoppingListName(e.name);
                    hasFound = true;
                }
            });

            data2.forEach(e => {
                if (e.id === id) {
                    setShoppingListName(e.name);
                    setPermission(e.permission);
                    hasFound = true;
                }
            });

            if(!hasFound){
                navigate('/404');
            } else {
                requestShoppingListContent();
            }     
            
        } catch(error) {
            setError500(true);
        }
        
    }

    const requestShoppingListContent = async () => {
        try {
            const response = await requestWithoutBodyWithJWT(config.apiUrl + `/api/shopping-list/shopping-list-article/${id}/content`, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                setError500(true);
            }

            const data = await response.json();

            setArticles([...Object.values(data)])
        } catch (error) {
            setError500(true);
        }
    }

    const removeArticle = async (article_id) => {
        try {
            const response = await requestWithBodyWithJWT(config.apiUrl + `/api/shopping-list/shopping-list-article/delete`, {shopping_list_id: id, article_id: article_id}, token);

            if(response === 401 || response === 403 || response === 404 || response === 500){
                throw new Error();
            }

            requestShoppingListContent();
        } catch (error) {
            setError500(true);
        }
    }

    useEffect(() => {
        requestShoppingListName();
    }, []);

    const content = (
        <>
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        {/* Page Heading */}
                            <h1 className="h3 mb-2 text-gray-800">{shoppingListName}</h1>
                            <p className="">Here, you can view the content of the shopping list, add articles to it, remove articles, check the articles you bought and when you finished shopping, you can click the button to reset the shopping list.</p>

                           
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Articles</h6>
                                </div>
                            <div className="card-body">

                                {permission && <AddArticle token={token} setError500={setError500} setFlashMessage={setFlashMessage} shoppingListContent={articles} requestShoppingListContent={requestShoppingListContent} />}

                                {/* User error message */}
                                {error && <div className="alert alert-danger mt-3">{error}</div>}


                                {/* Button trigger modal add to shopping list */}
                                {permission && (
                                    <button type="button" className="btn btn-primary btn-icon-split mb-4" data-toggle="modal" data-target="#addArticleModal">
                                        <span className="icon text-white-50">
                                            <i className="fas fa-plus-square"></i>
                                        </span>
                                        <span className="text">Add an article to {shoppingListName}</span>
                                    </button>
                                )}
                                

                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Remove from the list</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th>Name</th>
                                                <th>Remove from the list</th>
                                            </tr>
                                        </tfoot>
                                        <tbody>
                                            
                                            { articles && articles.map((article, index) => (
                                                <tr key={index}>
                                                    <td>{article.name}</td>
                                                    <td>
                                                        <a href="#" className="btn btn-danger btn-icon-split" onClick={() => removeArticle(article.id)} >
                                                            <span className="icon text-white-50">
                                                                <i className="fas fa-trash"></i>
                                                            </span>
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
        </>
        
    )

    return baseAdmin(content, {setToken, setUserRoles, userRoles});
}

export default DetailShoppingList;