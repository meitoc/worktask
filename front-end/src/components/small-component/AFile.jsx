import { Avatar, Chip, IconButton,  Menu,  MenuItem,  Stack, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import convertTimezone from "../../features/convert/convertTimezone";
import { addOtherUsers } from "../../sevice/other_users/slice";
import { deleteFile, getOtherUserInfo, postTakeDownloadUrl } from "../../sevice/api";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModalConfirm from "../modal/ModalConfirm";
import FileSkeleton from "./FileSkeleton";
import { removeFromFiles } from "../../sevice/files/slice";

export default function AFile(prop) {
  const dispatch = useDispatch()
  const file = prop.file;
  const otherUsers = useSelector(state=>state.other_users)
  const userInfo = useSelector(state=>state.user_info)
  const taskId = useSelector(state=>state.a_task._id)
  const foundUser = userInfo.name===file.user?.name? userInfo : otherUsers?.find(e=>e.name===file.name)?.[0]
  const [showScr,setShowScr] = useState(foundUser?.information?.avatar??"")
  const [showName,setShowName] = useState(foundUser?.information?.real_name??`user-${file?.user?.name??""}`)
  const [openTip,setOpenTip] = useState(false)
  const [deleting,setDeleting] = useState(false)

  const handleDownload = async () => {
    const response = await postTakeDownloadUrl(taskId,{_id: file._id, name: file.name})
    if(response?.success===true){
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = response.data.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMore = () => {
    setAnchorEl(null);
  };
  const handleDeleteFile = async ()=>{
    setDeleting(true);
    handleCloseMore();
    const response = await deleteFile(taskId,{_id: file._id, name: file.name})
    if(response?.success===true){
      setDeleting(false);
      if(Array.isArray(response.data)) dispatch(removeFromFiles(response.data));
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
    if(file.user?.name && !foundUser) {
      fetchOtherUserInfo(file.user?.name)
    }
  },[foundUser,file.user?.name,dispatch])
  return (
    deleting!==true?
      <>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt={file.user?.name} src={showScr} > {file.user?.name.substring(0, 3)} </Avatar>
          </ListItemAvatar>
          <ListItemText
              primary={showName}
              secondary={
                <Fragment>
                  <Typography variant="caption" display="block" gutterBottom>
                    {convertTimezone(7,file.createdAt)}
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
            <ModalConfirm confirm={handleDeleteFile} cancel={handleCloseMore}
              title="Confirm to delete this file"
              text="Impotant: You can not restore the file after delete it!"
            >
              <MenuItem >Delete task</MenuItem>
            </ModalConfirm>
          </Menu>
        </ListItem>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          marginBottom={2}
        >

          <Tooltip open={openTip} onClose={()=>{setOpenTip(false)}} onOpen={()=>{setOpenTip(true)}} title="Click to download">
            <Chip label={file.name} onClick={handleDownload} sx={{
              height: 'auto',
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
                maxWidth: 250
              },
              }} />
          </Tooltip>
          <Typography variant="body2" width={60} align="right">
              {file.size>=1073741824?`${(file.size/1048576).toFixed(2)}GB`:file.size>=1048576?`${(file.size/1048576).toFixed(2)}MB`:file.size>=1024?`${(file.size/1024).toFixed(2)}kB`:`${file.size}B`}
          </Typography>
        </Stack>
      </>
    : <FileSkeleton />
  );
}