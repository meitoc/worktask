// import { AuthenCheck } from '../../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Breadcrumbs, CircularProgress, Link, TextField } from '@mui/material';
import TaskFloatMenu from '../components/task/TaskFloatMenu';
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';
import FetchTask from '../features/fetch-data/FetchTask';
import { AuthenCheck } from '../features/authentication/AuthenCheck';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useState } from 'react';
import { updateATask } from '../sevice/a_task/slice';
import { putTask } from '../sevice/api';

export default function DetailTask() {
  const task = useSelector(state=>state.a_task)
  const [editName, setEditName] = useState(false);
  const [showName, setShowName] = useState(task?.name??"")
  const [showEditName, setShowEditName] = useState(task?.name??"")
  const {taskId} = useParams()
  const userName = useSelector(state=>state.user_info?.name)
  const userRole = task?.users?.owners?.some(e=>e?.name===userName)?"owner":task?.users?.managers?.some(e=>e?.name===userName)?"manager":"member";
  const dispatch = useDispatch();
  useEffect(()=>{
    if(task?.name) {
      setShowName(task.name)
      setShowEditName(task.name)
    }
  },[task?.name])
  const handleChangeName =(event)=>{
    setShowEditName(event.target.value)
  }
  const handleSubmitName = async ()=>{
    const newName = showEditName.trim()
    if(newName==="") handleCancelEditName();
    else{
      dispatch(updateATask({name:newName}))
      const oldName = showName;
      setShowName(newName)
      setEditName(false)
      const  response = await putTask(task._id,{name:newName})
      if(response?.success!==true)  dispatch(updateATask({name:oldName}))
    }
  }
  const handleCancelEditName = ()=>{
    setShowEditName(showName);
    setEditName(false)
  }
  return(
    <AuthenCheck>
      <FetchSpacesTasks>
        <FetchTask id={taskId} >
          {task!==null?
          <>
            
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb" >
                {Array.isArray(task.tree) && task.tree.length>0 && [...task.tree].reverse().map(e=>{return(
                  <Link
                  style={{fontSize:26}}
                    key={e._id}
                    underline="hover"
                    color="inherit"
                    href={`/task/${e._id??""}`}
                  >
                    {e.name}
                  </Link>
                )}
                )
                }
                <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                  <Typography color="text.primary"  variant="h4" >🚩</Typography>
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
                  {task.edit_locked===true && userRole!=="owner"?null:
                  <EditIcon style={{cursor:"pointer",display:editName?"none":"block"}} onClick={()=>{setEditName(true)}} />
                  }
                  <CheckCircleIcon color="success" style={{cursor:"pointer",display:editName?"block":"none"}} onClick={handleSubmitName} />
                  <CancelIcon color="warning" style={{cursor:"pointer",display:editName?"block":"none"}} onClick={handleCancelEditName} />
                </div>
                
              </Breadcrumbs>
            </div>
            <Box backgroundColor={task?.color?.background}  borderRadius={{ xs: 1, sm: 2, md: 4, lg: 6 }} width='100%' margin={{ xs: 1, sm: 2, md: 4, lg: 6 }} style={{display:"flex", flexDirrection:"column", overflowX: "hidden"}} >
              <TaskFloatMenu></TaskFloatMenu>
            </Box>  
          </>
          :<CircularProgress></CircularProgress>
        }
        </FetchTask>
      </FetchSpacesTasks>
    </AuthenCheck>
  );
}