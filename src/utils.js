import Header from "./components/Header/Header";
import Topbar from "./components/Topbar/Topbar";

export async function requestWithoutBodyWithoutJWT(url){
    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
        if(response.status == 401 || response.status == 403 || response.status == 404){ // That's an error comming from the user
            return response.status;
        } else if (!response.ok){ // That's an error from either the back-end or front-end, but it ain't comming from the user
            console.error("The server returned an error " + response.status + ".");
            return 500;
        } else {
            return response;
        }
    } catch(error){
        console.error("Error while making a request : " + error)
        return 500;
    }
}

export async function requestWithBodyWithoutJWT(url, body){
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
    
        if(response.status == 401 || response.status == 403){ // That's an error comming from the user
            return response.status;
        } else if (!response.ok){ // That's an error from either the back-end or front-end, but it ain't comming from the user
            console.error("The server returned an error " + response.status + ".");
            return 500;
        } else {
            return response;
        }
    } catch(error){
        console.error("Error while making a request : " + error)
        return 500;
    }
}

export async function requestWithoutBodyWithJWT(url, jwt){
    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt
            }
          });
    
        if(response.status == 401 || response.status == 403){ // That's an error comming from the user
            return response.status;
        } else if (!response.ok){ // That's an error from either the back-end or front-end, but it ain't comming from the user
            console.error("The server returned an error " + response.status + ".")
            return 500;
        } else {
            return response;
        }
    } catch(error){
        console.error("Error while making a request : " + error)
        return 500;
    }
}

export async function requestWithBodyWithJWT(url, body, jwt){
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt
            },
            body: JSON.stringify(body)
          });
    
        if(response.status == 401 || response.status == 403){ // That's an error comming from the user
            return response.status;
        } else if (!response.ok){ // That's an error from either the back-end or front-end, but it ain't comming from the user
            console.error("The server returned an error " + response.status + ".")
            return 500;
        } else {
            return response;
        }
    } catch(error){
        console.error("Error while making a request : " + error)
        return 500;
    }
}

export function baseAdmin(content, {setToken, setIsAdmin}){
    return (
        <div id="wrapper">
            <Header />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Topbar setToken={setToken} setIsAdmin={setIsAdmin} />
                    <div className="container-fluid">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    )
}