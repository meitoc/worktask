import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import TextField from '@mui/material/TextField';
import { deleteTask, putTask } from '../../sevice/api';
import { useDispatch,useSelector } from 'react-redux';
import ModalConfirm from '../modal/ModalConfirm';
import MoveToSpace from '../modal/MoveToSpace';
import { removeTaskFromASpace } from '../../sevice/a_space/slice';
import { removeTaskFromSpaces } from '../../sevice/spaces/slice';
import { removeTaskFromATask } from '../../sevice/a_task/slice';


export default function ATask(prop) {
  const dispatch = useDispatch();
  const task = prop.task
  const colors = useSelector(state => state.colors)
  const userInfo = useSelector(state => state.user_info)
  const [activeTask, setActiveTask] = useState(true);
  const [editTask, setEditTask] = useState(false);
  const [taskName, setTaskName] = useState(task?.name);
  const [taskColor, setTaskColor] = useState(task?.color);
  const [showTaskName, setShowTaskName] = useState(task?.name??"");


  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);
  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMore = () => {
    setAnchorEl(null);
  };
  const handleEditTask = async () => {
    handleCloseMore();
    setEditTask(true);
  }
  const handleCancel = () => {
    setTaskColor(task.color)
    setEditTask(false);
  }
  const handleSubmitTask = async () => {
    setEditTask(false);
    handleCloseMore();
    setActiveTask(false);
    const data={};
    if(showTaskName!==taskName)data.name=taskName;
    if(taskColor.name!==task.color.name)data.color=taskColor.name;
    const response = await putTask(task._id,data)
    if(response?.success===true){
      setShowTaskName(response.data.name)
      setActiveTask(true)
      if(typeof prop.fnUpdate === "function") prop.fnUpdate(response.data)
      console.log("Updated task")
    }
    else{
      setTaskColor(task.color)
      setActiveTask(true)
    }
  }
  const handleDeleteTask = async () => {
    handleCloseMore();
    setActiveTask(false);
    const response = await deleteTask(task._id)
    console.log(response)
    if(response?.success===true){
      console.log("Deleted task")
      setActiveTask(null)
      dispatch(removeTaskFromASpace(task._id))
      dispatch(removeTaskFromSpaces(task._id))
      dispatch(removeTaskFromATask(task._id))
      if(typeof prop.fnDelete ==="function") prop.fnDelete(task._id)
      }
      else setActiveTask(true)
  }
  const handleChangeColor = (event)=>{
    const colorName=event.target.value
    setTaskColor(colors.find(element => element.name === colorName))
  }
  
  if(activeTask===null) return null;
  else if(activeTask===true) return (
    <Card sx={{ width:300, minHeight:150, display:"flex", flexDirection:"column", justifyContent:"space-between", color:taskColor?.text, backgroundColor:taskColor?.background}}>
        <CardHeader
          color={taskColor?.text}
          action={
            <>
              <IconButton 
              sx={{color:taskColor?.text}}
              aria-label="settings"
              onClick={handleClickMore}
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
                <MenuItem onClick={handleEditTask}>Edit</MenuItem>
                <ModalConfirm confirm={handleDeleteTask} cancel={handleCloseMore}
                  title="Confirm to delete this task"
                  text="Impotant: All child tasks on the task will be deleted!"
                >
                  <MenuItem >Delete task</MenuItem>
                </ModalConfirm>
                <MoveToSpace cancel={handleCloseMore} id={task._id} confirm={handleCloseMore}
                >
                  <MenuItem >Move to a space</MenuItem>
                </MoveToSpace>
              </Menu>
            </>
            
          }
          title={
            editTask?
            <TextField
              id="name-input"
              fullWidth={true}
              placeholder="Task name"
              defaultValue={taskName}
              onChange={(event)=>setTaskName(event.target.value)}
            />
            :`${task?.users?.owners.some(e=>e.name===userInfo.name)?"🤠 ":"✊ "}${showTaskName}`
            }
          />
        
          
          {
            editTask?
            <>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Color
                </InputLabel>
                <NativeSelect
                  defaultValue={"default"}
                  inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                  }}
                  onChange={handleChangeColor}
                >
                  {colors.map(e => 
                    <option style={{backgroundColor:e.background, color:e.text}} value={e.name} key={e.name}>{e.name}</option>
                  )}
                </NativeSelect>
              </FormControl>
              
            </>
            : null
          }
        <CardActions sx={{display:"flex", justifyContent:"task-between"}}>
          {editTask?
            <>
            <Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} onClick = {handleSubmitTask}>SUBMIT CHANGE</Button>
            <Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} onClick = {handleCancel}>CANCEL</Button>
            </>
            :<Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} href={`http://localhost:5173/task/${task?._id}`}>EXPLORE</Button>
          }
        </CardActions>
  </Card>
  );
  else return (
    <Card sx={{width:300, minHeight:100, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{maxHeight:150}} src='http://localhost:5173/lost-task.svg'></img>
      </Card>
  );
  
}