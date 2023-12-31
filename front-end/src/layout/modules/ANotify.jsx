import { Avatar, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import convertTimezone from "../../features/convert/convertTimezone";
// import { addOtherUsers } from "../../sevice/other_users/slice";
// import { getOtherUserInfo } from "../../sevice/api";
import { createBrowserHistory } from "history";
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function ANotify(prop) {
  const taskId = useSelector(state=>state.a_task?._id)??null
  // const dispatch = useDispatch()
  const notify = prop.notify;
  const otherUsers = useSelector(state=>state.other_users)
  const userInfo = useSelector(state=>state.user_info)
  const foundUser = (userInfo.name===notify.user?.name)? userInfo : otherUsers?.filter(e=>e.name===notify?.user?.name)[0]??null
  const showScr = foundUser?.information?.avatar??""
  const showName = foundUser?.information?.real_name??`user-${notify?.user?.name??""}`
  const history = createBrowserHistory();
  const gotoNewTask = ()=>{
    if(taskId!==notify.task._id){
      history.push(`/task/${notify.task._id}`)
      window.location.reload();
    } else prop.close();
  }

  return (
      <>
        <ListItem style={{width:300,cursor:"pointer"}} onClick={gotoNewTask}
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
            <BookmarkIcon />
          </IconButton>
          }
        >
          <ListItemAvatar>
              <Avatar alt={notify.user?.name} src={showScr} > {notify.user?.name.substring(0, 3)} </Avatar>
          </ListItemAvatar>
          <ListItemText
              primary={`${showName} ${notify.action}${notify.action.endsWith("e")?"d":"ed"} ${notify.item} ${taskId===notify.task._id?"of this task.":`of task ${notify.task.name}`}`}
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