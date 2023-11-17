// import { AuthenCheck } from '../../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import TaskFloatMenu from '../components/task/TaskFloatMenu';
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';
import FetchTask from '../features/fetch-data/FetchTask';

export default function DetailTask() {
  
  const task = useSelector(state=>state.a_task)
  console.log(task)
  const {taskId} = useParams()
  
  return(
    <FetchSpacesTasks>
      <FetchTask id={taskId} >
        {task!==null?
        <>
          <Typography variant="h4" gutterBottom>
            Task: {task?.name}
          </Typography>
          <Box backgroundColor={task?.color?.background} padding={4} borderRadius={5} width='100vw' margin={2} style={{display:"flex", flexDirrection:"column"}} >
            <TaskFloatMenu></TaskFloatMenu>
          </Box>  
        </>
        :<CircularProgress></CircularProgress>
      }
      </FetchTask>
    </FetchSpacesTasks>
  );
}