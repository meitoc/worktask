import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getComments } from "../../sevice/api"
import { updateComments } from "../../sevice/comments/slice";

export default function FetchComments(prop) {
  const taskId = useSelector(state=>state.a_task?._id)
  const dispatch = useDispatch();
  useEffect(()=>{
    const sendRequest = async (taskId) => {
      console.log("FETCHING COMMENT");
      const response = await getComments(taskId);
      if(response?.success===true) {
        dispatch(updateComments(response.data?.comments));
      }
    }
    if(taskId) sendRequest(taskId); 
  },[taskId,dispatch]);
  return <>{prop.children}</>;
}