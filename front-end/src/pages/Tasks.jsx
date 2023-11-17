
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ATask from '../components/tasks/ATask'
import CircularProgress from '@mui/material/CircularProgress';
import AddTask from '../components/tasks/AddTask';
import { getColors, getTasks } from '../sevice/api';

import {useDispatch, useSelector} from 'react-redux'
import { addToTasks, removeTask, updateTasks} from '../sevice/tasks/slice';
import { updateColors } from '../sevice/colors/slice';

export default function Tasks() {
  const tasks = useSelector(state => state.tasks)
  const userInfo = useSelector(state => state.user_info)
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchData = async () =>{
      const response = await getTasks();  
      if(response?.success===true) {
        dispatch(updateTasks(response.data));
      }
    }
    const fetchColors = async () =>{
      const response = await getColors();  
      if(response?.success===true) {
        dispatch(updateColors(response.data));
      }
    }
    fetchData();
    fetchColors()
  },[dispatch]);
  if(userInfo) return(
    Array.isArray(tasks)?(
      <>
        <Typography variant="h4" gutterBottom>
          Tasks
        </Typography>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {tasks.map((e,i)=> e.active!==false?(<ATask fnUpdate={(input)=>dispatch(addToTasks(input))} fnDelete={(input)=>dispatch(removeTask(input))} task={e} key={i} />):null)}
          <AddTask />
        </Stack>
      </>
    ):(
      <CircularProgress />
    )
  );
  else return (<p>Let login</p>)
}