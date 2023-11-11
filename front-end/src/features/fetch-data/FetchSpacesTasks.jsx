import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColors, getSpaces, getOwnerTasks, getMemberTasks } from "../../sevice/api";
import { updateSpaces } from "../../sevice/spaces/slice";
import { updateColors } from "../../sevice/colors/slice";
import { updateOwnerTasks } from "../../sevice/root_tasks/owner_tasks/slice";
import { updateMemberTasks } from "../../sevice/root_tasks/member_tasks/slice";

export default function FetchSpacesTasks(prop) {
    const dispatch = useDispatch();
    const userInfo = useSelector(state=>state.user_info)
    const spaces = useSelector(state=>state.spaces)
    const colors = useSelector(state=>state.colors)
    useEffect(()=>{
        const fetchUser = async () =>{
          const response = await getSpaces();  
          if(response?.success===true) {
            dispatch(updateSpaces(response.data));
          }
        }
        const fetchOwnerTasks = async () =>{
          const response = await getOwnerTasks();  
          if(response?.success===true) {
            dispatch(updateOwnerTasks(response.data));
          }
        }
        const fetchMemberTasks = async () =>{
          const response = await getMemberTasks();  
          if(response?.success===true) {
            dispatch(updateMemberTasks(response.data));
          }
        }
        const fetchColors = async () =>{
          const response = await getColors();  
          console.log(response)
          if(response?.success===true) {
            dispatch(updateColors(response.data));
          }
        }
        if(userInfo && spaces===null ){
            fetchUser();
          if(colors===null) fetchColors()
          fetchOwnerTasks();
          fetchMemberTasks();
        }
      },[dispatch,userInfo,spaces,colors]);
        return(<>
            {prop.children}
        </>)
}