import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { useDispatch } from 'react-redux';
import { deleteUser } from '../sevice/user_info/slice';
import { getFirstAccess } from '../sevice/api';

export default function FirstAccess() {
    const { accessString } = useParams();
    const dispatch = useDispatch();
    const history = createBrowserHistory();
    const [finishProcess,setFinishProcess] =React.useState(false)
    React.useEffect(()=>{
      const requestFirstAccess = async (string) => {
        const response = await getFirstAccess(string);
        if(response.success===true){
          console.log("DDDDDD")
          console.log(response);
          if(response.data?.session) localStorage.setItem('loginSession',response.data.session);
          dispatch(deleteUser())
          console.log("Logged in. Welcome to your first time!");
          setFinishProcess(true);
        }
      }
        if(accessString) requestFirstAccess(accessString);
        if(finishProcess) {
          history.push("/");
          window.location.reload();
        }
    }
    ,[history,dispatch,accessString,finishProcess])
    return(<Link to={"/"}><p>Goto Home page</p></Link>);
    
}