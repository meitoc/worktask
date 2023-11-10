import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from 'react-redux';
import { addToOwnerTasks } from '../../sevice/root_tasks/owner_tasks/slice';
import { postTask } from '../../sevice/api';

// import LostTask from './image/LostTask';
export default function AddAloneTask() {

  const colors = useSelector(state => state.colors)
  const [activeTask, setActiveTask] = useState(null);
  const [spaceName, setTaskName] = useState("");
  const [spaceColor, setTaskColor] = useState({name:"default",frame:"rgb(100,100,150)",background:"rgb(200,200,255)",text:"rgb(10,10,0)"});
    
  const dispatch = useDispatch();

  const shandleAddTask = async () => {
    setActiveTask(true);
  }
  const handleCanel = () => {
    setTaskName("");
    setActiveTask(null)
  }
  const handleSubmitTask = async () => {
      setActiveTask(false);
      const data={
        name:spaceName,
        color:spaceColor.name
      };
      const response = await postTask(data)
      if(response?.success===true){
          console.log("Created task")
          setTaskName("");
          setTaskColor(null);
          setActiveTask(null)
          dispatch(addToOwnerTasks(response.data))
      }
      else {
        setTaskName("");
        setActiveTask(true);
      }
  }
  const handleChangeColor = (event)=>{
    const colorName=event.target.value
    setTaskColor(colors.find(element => element.name === colorName))
  }
    if(activeTask===true) return (
      <Card sx={{ width:300, minHeight:250, display:"flex", flexDirection:"column", justifyContent:"space-between", color:spaceColor?.text, backgroundColor:spaceColor?.background}}>
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
      
      <CardContent>
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
      </CardContent>
      <CardActions sx={{display:"flex", justifyContent:"space-between"}}>
        <Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} onClick = {handleSubmitTask}>SUBMIT NEW SPACE</Button>
        <Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} onClick = {handleCanel}>CANCEL</Button>
      </CardActions>
    </Card>);
  else if(activeTask===null) return (
  <Card sx={{ width:300, minHeight:250, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
    <ButtonBase onClick={shandleAddTask} >
      <img style={{width:"200px"}} src='http://localhost:5173/add-alone-task.svg'></img>
    </ButtonBase>
  </Card>
  );
  else return (
  <Card sx={{ width:300, minHeight:350, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{width:"200px"}} src='http://localhost:5173/lost-task.svg'></img>
  </Card>
  );
}