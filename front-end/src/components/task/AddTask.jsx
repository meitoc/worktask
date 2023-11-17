import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from 'react-redux';
import { addToOwnerTasks } from '../../sevice/root_tasks/owner_tasks/slice';
import { postTask, putSpace } from '../../sevice/api';
import { addTaskToASpace } from '../../sevice/spaces/slice';
import { updateASpace } from '../../sevice/a_space/slice';

// import LostTask from './image/LostTask';
export default function AddTask(prop) {

  const colors = useSelector(state => state.colors)
  const space = useSelector(state => state.a_space)
  const task = useSelector(state => state.a_task)
  const [activeTask, setActiveTask] = useState(null);
  const [spaceName, setTaskName] = useState("");
  const [spaceColor, setTaskColor] = useState({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
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
          name:spaceName,
          color:spaceColor.name
        };
        const response = await postTask(data)
        if(response?.success===true){
          console.log("Created task")
          setTaskColor({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
          setTaskName("");
          dispatch(addToOwnerTasks(response.data))
          const response2 = await putSpace(space?._id,{tasks:[...space.tasks,response?.data?._id]})
          if(response2?.success===true){
            dispatch(updateASpace({tasks:[...prop.tasks, response?.data._id]}))
            setActiveTask(null)
            if(typeof prop.close ==="function") prop.close();
          }
        }
      }
      else {
        const data={
          name:spaceName,
          color:spaceColor.name,
          parent_task:task._id
        };
        const response = await postTask(space?._id,data)
        if(response?.success===true){
          console.log("Created task")
          setTaskColor({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
          setTaskName("");
          setActiveTask(null)
          dispatch(addToOwnerTasks(response.data))
          dispatch(addTaskToASpace())
          if(typeof prop.close ==="function") prop.close();
        }
      }
  }
  const handleChangeColor = (event)=>{
    const colorName=event.target.value
    setTaskColor(colors.find(element => element.name === colorName))
  }
    if(activeTask===true) return (
      <Card sx={{ width:300, minHeight:150, display:"flex", flexDirection:"column", justifyContent:"space-between", color:spaceColor?.text, backgroundColor:spaceColor?.background}}>
        <CardHeader
        title={
          <TextField
          sx={{fontWeight:"bold"}}
            id="name-input"
            fullWidth={true}
            placeholder="Task name"
            onChange={(event)=>setTaskName(event.target.value)}
          />}
        />
      
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
      <CardActions sx={{display:"flex", justifyContent:"space-between"}}>
        <Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} onClick = {handleSubmitTask}>SUBMIT NEW TASK</Button>
        <Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} onClick = {handleCancel}>CANCEL</Button>
      </CardActions>
    </Card>);
  else if(activeTask===false) return (
  <Card sx={{ width:300, minHeight:100, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{maxHeight:150}} src='http://localhost:5173/lost-task.svg'></img>
  </Card>
  );
  else return null;
}