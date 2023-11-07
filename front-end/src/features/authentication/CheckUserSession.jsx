import { useEffect,useContext} from "react";
import { ContextStatus } from "../../App";

export default function CheckUserSession (prop) {
    const { setLoginStatus} = useContext(ContextStatus);
    useEffect(()=>{
    const checkLoginSession = async () => {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session}`,
                accept: 'application/json',
                'content-type': 'application/json',
            },
        };
        console.log("Session check")
        fetch(`http://localhost:8000/api/access/check`, options)
        .then(response => response.json())
        .then(response => {
        if(response.success===true){
            console.log("Session checked");
            setLoginStatus(true);
        } else{
            setLoginStatus(false);
        }
        })
        .catch(error => {
            console.log(error)
            console.log("Movie.meitoc.net: Check your internet connection!");
            })
        }    
        let session = localStorage.getItem('loginSession');
        console.log(session);
        if (session !==null && session!==undefined) {
            checkLoginSession();
            
        }
        else 
            setLoginStatus(false);
    },[setLoginStatus]);
    return(
        <>
        {prop.children}
        </>
    );
}