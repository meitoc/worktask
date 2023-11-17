import * as React from 'react';
import { createBrowserHistory } from "history";
import { useDispatch } from 'react-redux';
import { deleteUser } from '../sevice/user_info/slice';
import { getLogout } from '../sevice/api';
import GoToHomePage from '../components/small-component/GoToHomePage';

export default function Logout() {
    const dispatch = useDispatch();
    const history = createBrowserHistory();
    React.useEffect(()=>{
      const requestLogout = async () => {
        const response = await getLogout();
        if(response?.success===true){
            localStorage.setItem('loginSession',response.data?.session??"");
            console.log("Logged out.");
        }
      }
        requestLogout();
        dispatch(deleteUser())
        localStorage.setItem('loginSession',"");
        history.push("/");
        window.location.reload();
    }
    ,[history,dispatch])
    
    return(<GoToHomePage/>);
    
}