import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';

import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from 'react-redux';
import { addToOwnerTasks } from '../../sevice/root_tasks/owner_tasks/slice';
import { postTask } from '../../sevice/api';
import { Divider } from '@mui/material';
import { GithubPicker } from 'react-color';
import { FRONT_END_BASE_URL } from '../../sevice/server';

// import LostTask from './image/LostTask';
export default function AddAloneTask() {

  const colors = useSelector(state => state.colors)
  const [activeTask, setActiveTask] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskColor, setTaskColor] = useState({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
    
  const dispatch = useDispatch();

  const handleAddTask = async () => {
    setActiveTask(true);
  }
  const handleCanel = () => {
    setTaskName("");
    setActiveTask(null)
  }
  const handleSubmitTask = async () => {
      setActiveTask(false);
      const data={
        name:taskName,
        color:taskColor.name
      };
      const response = await postTask(data)
      if(response?.success===true){
          console.log("Created task")
          setTaskColor({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
          setTaskName("");
          setActiveTask(null)
          dispatch(addToOwnerTasks(response.data))
      }
      else {
        setTaskName("");
        setActiveTask(true);
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
        <Button sx={{color:taskColor?.text, backgroundColor:taskColor?.frame}} onClick = {handleCanel} color="warning" >CANCEL</Button>
      </CardActions>
    </Card>);
  else if(activeTask===null) return (
  <Card sx={{ width:300, minHeight:50, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
    <ButtonBase onClick={handleAddTask} >
      <img style={{width:150}} src={`${FRONT_END_BASE_URL}/add-alone-task.svg`}></img>
    </ButtonBase>
  </Card>
  );
  else return (
  <Card sx={{ width:300, minHeight:100, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{maxHeight:150}} src={`${FRONT_END_BASE_URL}/lost-task.svg`}></img>
  </Card>
  );
}