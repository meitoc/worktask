import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../../sevice/api";
import { updateUser } from "../../sevice/user_info/slice";

export default function FetchUserData(prop) {
    const dispatch = useDispatch();
    const userInfo = useSelector(state=>state.user_info)
    useEffect(()=>{
        async function fetchData() {
            console.log("Fetching user data...")
            const response = await getUserInfo();
            if(response?.success===true) dispatch(updateUser(response.data))
            else dispatch(updateUser(false))
        }
        if(userInfo===null) fetchData();
    },[dispatch,userInfo]);
        return(<>
            {prop.children}
        </>)
}