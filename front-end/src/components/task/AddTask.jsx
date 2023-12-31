import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from 'react-redux';
import { addToOwnerTasks } from '../../sevice/root_tasks/owner_tasks/slice';
import { postTask, postTaskOnTask, putSpace } from '../../sevice/api';
import { updateASpace } from '../../sevice/a_space/slice';
import { updateATask } from '../../sevice/a_task/slice';
import { GithubPicker } from 'react-color';
import { Divider } from '@mui/material';
const {VITE_FRONT_END_BASE_URL} = import.meta.env

// import LostTask from './image/LostTask';
export default function AddTask(prop) {

  const colors = useSelector(state => state.colors)
  const space = useSelector(state => state.a_space)
  const task = useSelector(state => state.a_task)
  const [activeTask, setActiveTask] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskColor, setTaskColor] = useState({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
  useEffect(()=>{
    setActiveTask(prop.active)
  },[prop.active])
  const dispatch = useDispatch();

  const handleCancel = () => {
    setTaskName("");
    setActiveTask(null)
    if(typeof prop.close ==="function") prop.close();
  }
  const handleSubmitTask = async () => {
      setActiveTask(false);
      if(prop.onType==="space"){
        const data={
          name:taskName,
          color:taskColor.name
        };
        const response1 = await postTask(data)
        if(response1?.success===true){
          setTaskColor({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
          setTaskName("");
          dispatch(addToOwnerTasks(response1.data))
          const response2 = await putSpace(space?._id,{tasks:[...space.tasks,response1?.data?._id]})
          if(response2?.success===true){
            dispatch(updateASpace({tasks:[...prop.tasks, response1?.data._id]}))
            setActiveTask(null)
            if(typeof prop.close ==="function") prop.close();
          }
        }
      }
      else {//task on task
        const data={
          name:taskName,
          color:taskColor.name
        };
        const response = await postTaskOnTask(task?._id,data)
        if(response?.success===true){
          console.log("PPPPPPPPPPPPPPPP",response.data)
          dispatch(updateATask(response?.data))
          setTaskColor({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
          setTaskName("");
          setActiveTask(null)
          if(typeof prop.close ==="function") prop.close();
        } else{
          setActiveTask(true)
        }
      }
  }
  const handleChangeColor = (color)=>{
    const backgroundColor=`rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
    setTaskColor(colors.find(element => element.background === backgroundColor))
  }
    if(activeTask===true) return (
      <Card sx={{ width:300, minHeight:150, display:"flex", flexDirection:"column", justifyContent:"space-between", color:taskColor?.text, backgroundColor:taskColor?.background}}>
        <CardHeader
        title={
          <TextField
            inputProps={{
              style: { color: taskColor.text, fontWeight:"bold" }
            }}
            id="name-input"
            fullWidth={true}
            placeholder="Task name"
            onChange={(event)=>setTaskName(event.target.value)}
          />}
        />
      
      <GithubPicker
          colors={colors?.map(e=>e.background)}
          onChange={handleChangeColor}
          disableAlpha={true}
          className="github-color-picker"
      />
      <Divider style={{marginTop:15}} />
      <CardActions sx={{display:"flex", justifyContent:"space-between"}}>
        <Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} onClick = {handleSubmitTask}>SUBMIT NEW TASK</Button>
        <Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} onClick = {handleCancel} color="warning" >CANCEL</Button>
      </CardActions>
    </Card>);
  else if(activeTask===false) return (
  <Card sx={{ width:300, minHeight:100, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{maxHeight:150}} src={`${VITE_FRONT_END_BASE_URL}/lost-task.svg`}></img>
  </Card>
  );
  else return null;
}