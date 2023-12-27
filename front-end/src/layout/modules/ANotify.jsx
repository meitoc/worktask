import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import convertTimezone from "../../features/convert/convertTimezone";
import { addOtherUsers } from "../../sevice/other_users/slice";
import { getOtherUserInfo } from "../../sevice/api";
import { createBrowserHistory } from "history";


export default function ANotify(prop) {
  const taskId = useSelector(state=>state.a_task?._id)??null
  const dispatch = useDispatch()
  const notify = prop.notify;
  const otherUsers = useSelector(state=>state.other_users)
  const userInfo = useSelector(state=>state.user_info)
  const foundUser = userInfo.name===notify.user?.name? userInfo : otherUsers?.find(e=>e.name===notify.name)?.[0]
  const [showScr,setShowScr] = useState(foundUser?.information?.avatar??"")
  const [showName,setShowName] = useState(foundUser?.information?.real_name??`user-${notify?.user?.name??""}`)
  const history = createBrowserHistory();
  const gotoNewTask = ()=>{
    if(taskId!==notify.task){
      history.push(`/task/${notify.task}`)
      window.location.reload();
    } else prop.close();
  }
  useEffect(()=>{
    const fetchOtherUserInfo = async (name)=>{
      const response = await getOtherUserInfo(name);
      if(response?.success===true)
      setShowScr(response.data.information?.avatar??"")
    const foundName = response.data.information?.real_name
      setShowName(foundName && foundName!="" ? foundName:`user-${notify?.user?.name??""}`)
      dispatch(addOtherUsers([response.data]))
    }
    if(notify.user?.name && !foundUser) {
      fetchOtherUserInfo(notify.user?.name)
    }
  },[foundUser,notify.user?.name,dispatch])
  return (
      <>
        <ListItem style={{width:300,cursor:"pointer"}} onClick={gotoNewTask}>
          <ListItemAvatar>
              <Avatar alt={notify.user?.name} src={showScr} > {notify.user?.name.substring(0, 3)} </Avatar>
          </ListItemAvatar>
          <ListItemText
              primary={`${showName} ${notify.action} ${notify.item} ${taskId===notify.task?"of this task.":"of other task"}`}
              secondary={
                <Fragment>
                  <Typography variant="caption" display="block" gutterBottom>
                      {convertTimezone(7,notify.createdAt)}
                  </Typography>
                </Fragment>
              }
          />
      </ListItem>
      </>
  );
}