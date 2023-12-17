import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import convertTimezone from "../../features/convert/convertTimezone";
import { addOtherUsers } from "../../sevice/other_users/slice";
import { deleteComment, getOtherUserInfo } from "../../sevice/api";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileSkeleton from "./FileSkeleton";
import { removeAComment } from "../../sevice/comments/slice";

export default function AComment(prop) {
  const dispatch = useDispatch()
  const comment = prop.comment;
  const taskId = useSelector(state=>state.a_task._id)
  const otherUsers = useSelector(state=>state.other_users)
  const userInfo = useSelector(state=>state.user_info)
  const foundUser = userInfo.name===comment.user.name? userInfo : otherUsers?.find(e=>e.name===comment.name)
  const [showScr,setShowScr] = useState(foundUser?.information?.avatar??"")
  const [showName,setShowName] = (useState(foundUser?.information?.real_name??`user-${comment.user.name}`))??null
  const [deleting,setDeleting] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMore = () => {
    setAnchorEl(null);
  };
  const handleDeleteComment = async ()=>{
    setDeleting(true);
    handleCloseMore();
    const response = await deleteComment( comment._id,taskId)
    if(response?.success===true){
      setDeleting(false);
      dispatch(removeAComment(comment._id));
    }
  }

  useEffect(()=>{
    const fetchOtherUserInfo = async (name)=>{
      const response = await getOtherUserInfo(name);
      if(response?.success===true)
      setShowScr(response.data.information?.avatar??"")
      setShowName(response.data.information?.real_name??"")
      dispatch(addOtherUsers([response.data]))
    }
    if(comment.user.name && !foundUser) {
      fetchOtherUserInfo(comment.user.name)
    }
  },[foundUser,comment.user.name,setShowName,dispatch])
  return (
    deleting!==true?
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={comment.user.name} src={showScr} > {comment.user.name.substring(0, 3)} </Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={showName}
            secondary={
                <Fragment>
                    <Typography variant="caption" display="block" gutterBottom>
                        {convertTimezone(7,comment.createdAt)}
                    </Typography>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        {comment.comment?.split("\n").map((e,i)=>{
                            return (<Fragment key={i}>{e}<br /></Fragment>)
                        })}
                    </Typography>
                </Fragment>
            }
        />
        <IconButton 
            onClick={handleClick}
            aria-label="settings"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              open={openMore}
              onClose={handleCloseMore}
              style={{display:"flex",flexDirection:"column"}}
              >
                <MenuItem onClick={handleDeleteComment}>Delete comment</MenuItem>
            </Menu>
      </ListItem>
    : <FileSkeleton />
  );
}