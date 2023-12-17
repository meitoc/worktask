import { Avatar, Chip, Skeleton} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { addOtherUsers } from "../../sevice/other_users/slice";
import { getOtherUserInfo } from "../../sevice/api";

export default function AUser(prop) {
  const dispatch = useDispatch()
  const user = prop.user;
  const otherUsers = useSelector(state=>state.other_users)
  const userInfo = useSelector(state=>state.user_info)
  const foundUser = (userInfo.name===user.name? userInfo : otherUsers?.find(e=>e.name===user.name))??null
  const [deleting,setDeleting] = useState(false)
  useEffect(()=>{
    const fetchOtherUserInfo = async (name)=>{
      const response = await getOtherUserInfo(name);
      if(response?.success===true)
      dispatch(addOtherUsers([response.data]))
    }
    if(foundUser===null) {
      fetchOtherUserInfo(user.name)
    }
  },[foundUser,user.name,dispatch])
  let userName =foundUser?.information?.real_name;
  if(userName==="") userName=`*user-${user.name}`;
  return (
    deleting||prop.loading?
    <Skeleton width={100} />
    :
    <Chip
      disabled={user.active===false}
      color="primary"
      avatar={<Avatar alt={userName} src={foundUser?.information?.avatar??""} />}
      label={userName}
      variant="filled"
      onDelete={prop.lockAction?null:async()=>{setDeleting(true); const result = await prop.onDelete(); if(!result) setDeleting(false)}}
      deleteIcon={prop.deleteIcon}
      style={{margin:3, padding: 5}}
      />
  );
}