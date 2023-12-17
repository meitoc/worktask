// import { AuthenCheck } from '../../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import FetchSpace from '../features/fetch-data/FetchSpace';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, TextField } from '@mui/material';
import SpaceFloatMenu from '../components/space/SpaceFloatMenu';
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';
import { AuthenCheck } from '../features/authentication/AuthenCheck';
import { useEffect, useState } from 'react';
import { putSpace } from '../sevice/api';
import { updateASpace } from '../sevice/a_space/slice';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function DetailSpace() {
  const dispatch = useDispatch()
  const space = useSelector(state=>state.a_space)
  const [editName, setEditName] = useState(false);
  const [showName, setShowName] = useState(space?.name??"")
  const [showEditName, setShowEditName] = useState(space?.name??"")
  const {spaceId} = useParams()

  useEffect(()=>{
    if(space?.name) {
      setShowName(space.name)
      setShowEditName(space.name)
    }
  },[space?.name])
  const handleChangeName =(event)=>{
    setShowEditName(event.target.value)
  }
  const handleSubmitName = async ()=>{
    const newName = showEditName.trim()
    if(newName==="") handleCancelEditName();
    else{
      dispatch(updateASpace({name:newName}))
      const oldName = showName;
      setShowName(newName)
      setEditName(false)
      const  response = await putSpace(space._id,{name:newName})
      if(response?.success!==true)  dispatch(updateASpace({name:oldName}))
    }
  }
  const handleCancelEditName = ()=>{
    setShowEditName(showName);
    setEditName(false)
  }
  return(
    <AuthenCheck>
      <FetchSpacesTasks>
        <FetchSpace id={spaceId} >
          {space!==null?
          <>
            <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
              <Typography color="text.primary"  variant="h4" >🌌</Typography>
              <Typography style={{display:editName?"none":"block"}} color="text.primary"  variant="h4" >{showName}</Typography>
              <TextField
                style={{display:editName?"block":"none"}}
                id="outlined-basic"
                label="Task name"
                variant="outlined"
                required
                size="small"
                value={showEditName}
                onChange={handleChangeName}
                onKeyUp={(event) =>{
                  if (event.key === "Enter" || event.key === "Done") handleSubmitName()
                }}
              />
              <EditIcon style={{cursor:"pointer",display:editName?"none":"block"}} onClick={()=>{setEditName(true)}} />
              <CheckCircleIcon color="success" style={{cursor:"pointer",display:editName?"block":"none"}} onClick={handleSubmitName} />
              <CancelIcon color="warning" style={{cursor:"pointer",display:editName?"block":"none"}} onClick={handleCancelEditName} />
            </div>
            <Box backgroundColor={space?.color?.background} padding={4} borderRadius={5} width='100%' margin={2} style={{display:"flex", flexDirrection:"column"}} >
              <SpaceFloatMenu></SpaceFloatMenu>
            </Box>  
          </>
          :<CircularProgress></CircularProgress>
        }
        </FetchSpace>
      </FetchSpacesTasks>
    </AuthenCheck>
  );
}