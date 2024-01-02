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
import EditOffIcon from '@mui/icons-material/EditOff';
import TextField from '@mui/material/TextField';
import { deleteTask, putTask } from '../../sevice/api';
import { useDispatch,useSelector } from 'react-redux';
import ModalConfirm from '../modal/ModalConfirm';
import MoveToSpace from '../modal/MoveToSpace';
import { removeTaskFromASpace } from '../../sevice/a_space/slice';
import { removeTaskFromSpaces } from '../../sevice/spaces/slice';
import { removeTaskFromATask } from '../../sevice/a_task/slice';
import { GithubPicker } from 'react-color';
import { Divider } from '@mui/material';
const {VITE_FRONT_END_BASE_URL} = import.meta.env


export default function ATask(prop) {
  const dispatch = useDispatch();
  const task = prop.task
  const colors = useSelector(state => state.colors)
  const userInfo = useSelector(state => state.user_info)
  const [activeTask, setActiveTask] = useState(prop.task!==null);
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
  const handleChangeColor = (color)=>{
    const backgroundColor=`rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
    setTaskColor(colors.find(element => element.background === backgroundColor))
  }
  
  if(activeTask===null) return null;
  else if(activeTask===true) return (
    <Card sx={{ width:"100%", maxWidth:300, minHeight:150, borderRadius:5, display:"flex", flexDirection:"column", justifyContent:"space-between", color:taskColor?.text, backgroundColor:taskColor?.background}}>
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
                <MenuItem style={ {display: "flex",justifyContent: "center",alignItems: "center"}} onClick={handleEditTask}>Edit</MenuItem>
                {task?.users?.owners.some(e=>e.name===userInfo.name) || task?.users?.managers.some(e=>e.name===userInfo.name)?
                    <ModalConfirm style={{width:"100%", height:"100%", display:"flex"}} confirm={handleDeleteTask} cancel={handleCloseMore}
                      title="Confirm to delete this task"
                      text="Impotant: All child tasks on the task will be deleted!"
                      >
                        <MenuItem >
                          Delete task
                        </MenuItem>
                      </ModalConfirm>
                  :null
                }
                {prop.onType==="space"?
                  <MoveToSpace cancel={handleCloseMore} id={task._id} confirm={handleCloseMore}
                  >
                    <MenuItem >
                        Move to a space
                    </MenuItem>
                  </MoveToSpace>
                  :null
                }
              </Menu>
            </>
            
          }
          title={
            editTask?
            <TextField
              inputProps={{
                style: { color: taskColor.text, fontWeight:"bold" }
              }}
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
               <GithubPicker
                    colors={colors?.map(e=>e.background)}
                    onChange={handleChangeColor}
                    disableAlpha={true}
                    className="github-color-picker"
                />
                <Divider style={{marginTop:15}} />
            </>
            : null
          }
        <CardActions sx={{display:"flex", justifyContent:"space-between"}}>
          {editTask?
            <>
            <Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} onClick = {handleSubmitTask}>SUBMIT CHANGE</Button>
            <Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} onClick = {handleCancel} color="warning" >CANCEL</Button>
            </>
            :<Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} href={`${VITE_FRONT_END_BASE_URL}/task/${task?._id}`}>EXPLORE</Button>
          }
          {
            task.edit_locked?
            <EditOffIcon/>
            :null
          }
        </CardActions>
  </Card>
  );
  else return (
    <Card sx={{width:300, minHeight:100, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{maxHeight:150}} src={`${VITE_FRONT_END_BASE_URL}/lost-task.svg`}></img>
      </Card>
  );
  
}