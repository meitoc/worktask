import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { useDispatch } from 'react-redux';
import { deleteUser } from '../sevice/user_info/slice';
import { getURLChangeEmail,getURLAccess } from '../sevice/api';

export default function Url() {
    const { command,accessString } = useParams();
    const dispatch = useDispatch();
    const history = createBrowserHistory();
    const [finishProcess,setFinishProcess] =React.useState(false)
    React.useEffect(()=>{
      const requestOTPuri = async (command,string) => {
        const response = command==="url-login"?
          await getURLAccess(string)
          :command==="url-change-email"?
          await getURLChangeEmail(string)
          :false;
        if(response.success===true){
          console.log(response);
          if(response.data?.session) localStorage.setItem('loginSession',response.data.session);
          dispatch(deleteUser())
          console.log("Logged in. Welcome to your first time!");
          setFinishProcess(true);
        } else setFinishProcess(true)
      }
        if(accessString) requestOTPuri(command,accessString);
        if(finishProcess) {
          history.push("/");
          window.location.reload();
        }
    }
    ,[history,dispatch,command,accessString,finishProcess])
    return(<Link to={"/"}><p>Goto Home page</p></Link>);
    
}