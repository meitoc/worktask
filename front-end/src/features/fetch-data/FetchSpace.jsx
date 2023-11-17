import { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColors, getSpace } from "../../sevice/api";
import { updateColors } from "../../sevice/colors/slice";
import { createASpace } from "../../sevice/a_space/slice";
import GoToHomePage from "../../components/small-component/GoToHomePage";

export default function FetchSpace(prop) {
  const dispatch = useDispatch();
  const userInfo = useSelector(state=>state.user_info)
  const space = useSelector(state=>state.a_space)
  const colors = useSelector(state=>state.colors)
  const [noteError,setNoteError] = useState(false)
  useEffect(()=>{
      const fetchUser = async () =>{
        const response = await getSpace(`${prop.id}`);  
        if(response?.success===true) {
          console.log("HHHHHHHHHHH",response)
          dispatch(createASpace(response.data));
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
      if(userInfo && space===null  && (typeof prop.id === "string")){
          fetchUser();
        if(colors===null) fetchColors()
      }
    },[dispatch,userInfo,space,colors,prop.id,setNoteError]);
    if(noteError) return <GoToHomePage />
    else  return(<>
          {prop.children}
      </>)
}