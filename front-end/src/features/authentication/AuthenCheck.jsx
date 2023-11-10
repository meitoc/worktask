import { useContext, useEffect} from "react";
import { ContextStatus } from "../../App";
// import LoginForm from "../../components/form/LoginForm";
// import CheckUserSession from "./CheckUserSession";
import { useSelector } from "react-redux";
// import LetLogin from "../../components/movies/LetLogin";
export function AuthenCheck(prop) {
    const { setShowLoginForm} = useContext(ContextStatus);
    const userInfo = useSelector(state=>state.user_info)
    useEffect(()=>{
        if(userInfo===false) setShowLoginForm(true);
        else setShowLoginForm(false);
    },[userInfo,setShowLoginForm])
    return(
        <>
            {userInfo?
                prop.children 
                : null
            }
        </>);
}
