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
import { useSelector } from 'react-redux';
import ModalConfirm from '../small-component/ModalConfirm';


export default function AnAloneTask(prop) {

  const colors = useSelector(state => state.colors)
  const userInfo = useSelector(state => state.user_info)
  const [activeTask, setActiveTask] = useState(true);
  const [editTask, setEditTask] = useState(false);
  const [taskName, setTaskName] = useState(prop.task?.name);
  const [taskColor, setTaskColor] = useState(prop.task?.color);
  const [showTaskName, setShowTaskName] = useState(prop.task.name??"");


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
    setTaskColor(prop.task.color)
    setEditTask(false);
  }
  const handleSubmitTask = async () => {
    setEditTask(false);
    handleCloseMore();
    setActiveTask(false);
    const data={};
    if(showTaskName!==taskName)data.name=taskName;
    if(taskColor.name!==prop.task.color.name)data.color=taskColor.name;
    const response = await putTask(prop.task._id,data)
    if(response?.success===true){
      setShowTaskName(response.data.name)
      setActiveTask(true)
      prop.fnUpdate(response.data)
      console.log("Updated task")
    }
    else{
      setTaskColor(prop.task.color)
      setActiveTask(true)
    }
  }
  const handleDeleteTask = async () => {
    handleCloseMore();
    setActiveTask(false);
    const response = await deleteTask(prop.task._id)
    console.log(response)
    if(response?.success===true){
      console.log("Deleted task")
      setActiveTask(null)
      prop.fnDelete(prop.task._id)
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
                >
                <MenuItem onClick={handleEditTask}>Edit</MenuItem>
                <ModalConfirm confirm={handleDeleteTask} cancel={handleCloseMore}
                  title="Confirm to delete this task"
                  text="Impotant: All child tasks on the task will be deleted!"
                >
                  <MenuItem >Delete task</MenuItem>
                </ModalConfirm>
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
            :`${prop.task?.users?.owners.some(e=>e.name===userInfo.name)?"🤠 ":"✊ "}${showTaskName}`
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
            :<Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} href={`http://localhost:5173/task/${prop.task?._id}`}>EXPLORE</Button>
          }
        </CardActions>
  </Card>
  );
  else return (
    <Card sx={{ width:300, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{width:"200px"}} src='http://localhost:5173/lost-task.svg'></img>
      </Card>
  );
  
}