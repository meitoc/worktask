import { useSelector } from "react-redux";
import AUser from "../small-component/AUser";

export default function TeamAndRoleCopy() {
  const user_info  = useSelector(state=>state.user_info)
  return(
    
    <AUser user={user_info}></AUser>
  )
}
