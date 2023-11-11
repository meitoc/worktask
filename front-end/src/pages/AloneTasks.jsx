import { AuthenCheck } from '../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import {useDispatch, useSelector} from 'react-redux'
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';
import ATask from '../components/task/ATask';
import AddAloneTask from '../components/task/AddAloneTask';
import { addToOwnerTasks, removeOwnerTask } from '../sevice/root_tasks/owner_tasks/slice';
import { addToMemberTasks, removeMemberTask } from '../sevice/root_tasks/member_tasks/slice';
import { Box } from '@mui/material';

export default function AloneTasks() {
  const owner_tasks = useSelector(state => state.owner_tasks)
  const member_tasks = useSelector(state => state.member_tasks)
  // const member_tasks = useSelector(state => state.member_tasks)
  const userInfo = useSelector(state => state.user_info)
  const dispatch = useDispatch();
  return (
  <FetchSpacesTasks>
    <AuthenCheck>
    {userInfo && Array.isArray(owner_tasks) && Array.isArray(member_tasks)?
    <>

        <Typography variant="h4" gutterBottom>
          Alone Tasks
        </Typography>
    <Box backgroundColor="rgba(125,125,125,0.5)" padding={2} borderRadius={5}>
        <Typography variant="h5" gutterBottom>
          You own:
        </Typography>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {owner_tasks.map((e,i)=> e.active!==false?(<ATask fnUpdate={(input)=>dispatch(addToOwnerTasks(input))} fnDelete={(input)=>dispatch(removeOwnerTask(input))} task={e} key={i} />):null)}
          <AddAloneTask />
        </Stack>
    </Box>
        {member_tasks.length>0?
        <Box backgroundColor="rgba(125,125,125,0.5)" padding={2} borderRadius={5}>
          <Typography variant="h5" gutterBottom>
            Shared to you:
          </Typography>
          <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
            {member_tasks.map((e,i)=> e.active!==false?(<ATask fnUpdate={(input)=>dispatch(addToMemberTasks(input))} fnDelete={(input)=>dispatch(removeMemberTask(input))} task={e} key={i} />):null)}
          </Stack>
        </Box>
        :null
        }
    </>
  :<CircularProgress />
  }
  </AuthenCheck>
  </FetchSpacesTasks>
  )
}