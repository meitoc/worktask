import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getFiles } from "../../sevice/api"
import { updateFiles } from "../../sevice/files/slice";

export default function FetchFiles(prop) {
  const taskId = useSelector(state=>state.a_task?._id)
  const dispatch = useDispatch();
  useEffect(()=>{
    const sendRequest = async (taskId) => {
      console.log("FETCHING FILE LIST");
      const response = await getFiles(taskId);
      if(response?.success===true) {
        dispatch(updateFiles(response.data?.files));
      }
    }
    if(taskId) sendRequest(taskId); 
  },[taskId,dispatch]);
  return <>{prop.children}</>;
}