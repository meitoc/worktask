import { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColors, getTask } from "../../sevice/api";
import { updateColors } from "../../sevice/colors/slice";
import { createATask } from "../../sevice/a_task/slice";
import GoToHomePage from "../../components/small-component/GoToHomePage";

export default function FetchTask(prop) {
  const dispatch = useDispatch();
  const userInfo = useSelector(state=>state.user_info)
  const task = useSelector(state=>state.a_task)
  const colors = useSelector(state=>state.colors)
  const [noteError,setNoteError] = useState(false)
  useEffect(()=>{
      const fetchUser = async () =>{
        const response = await getTask(`${prop.id}`);  
        if(response?.success===true) {
          dispatch(createATask(response.data));
          setNoteError(false)
        }
      else setNoteError(true)
      }
      const fetchColors = async () =>{
        const response = await getColors();  
        if(response?.success===true) {
          dispatch(updateColors(response.data));
        } 
      }
      if(userInfo && task===null  && (typeof prop.id === "string")){
          fetchUser();
        if(colors===null) fetchColors()
      }
    },[dispatch,userInfo,task,colors,prop.id,setNoteError]);
    if(noteError) return <GoToHomePage />
    else  return(<>
          {prop.children}
      </>)
}