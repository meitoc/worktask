import { AuthenCheck } from '../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import {useDispatch, useSelector} from 'react-redux'
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';
import ATask from '../components/task/ATask';
import AddAloneTask from '../components/task/AddAloneTask';
import { Box } from '@mui/material';
import { addToOwnerTasks,removeOwnerTask } from '../sevice/root_tasks/owner_tasks/slice';

export default function AloneOwnerTasks() {
  const ownerTasks = useSelector(state => state.owner_tasks);
  const memberTasks = useSelector(state => state.member_tasks);
  const spaces = useSelector(state => state.spaces);
  const filteredOwnerTask = ownerTasks?.filter(task=>!spaces?.some(space=>space?.tasks?.includes(task._id)))
  const userInfo = useSelector(state => state.user_info)
  const dispatch = useDispatch();
  return (
    <AuthenCheck>
      <FetchSpacesTasks>
        {userInfo && Array.isArray(ownerTasks) && Array.isArray(memberTasks)?
        <>

            <Typography variant="h4" gutterBottom>
              Your Alone Tasks
            </Typography>
            <Box backgroundColor="rgba(125,125,125,0.1)" padding={4} borderRadius={5} width='100%' margin={2}>
              <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                {filteredOwnerTask.length>0 && filteredOwnerTask.map((e)=> e.active!==false?(<ATask onType="space"fnUpdate={(input)=>dispatch(addToOwnerTasks(input))} fnDelete={(input)=>dispatch(removeOwnerTask(input))} task={e} key={e._id} />):null)}
                <AddAloneTask />
              </Stack>
            </Box>
        </>
      :<CircularProgress />
      }
      </FetchSpacesTasks>
    </AuthenCheck>
  )
}