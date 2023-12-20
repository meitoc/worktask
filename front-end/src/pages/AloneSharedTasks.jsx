import { AuthenCheck } from '../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import {useDispatch, useSelector} from 'react-redux'
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';
import ATask from '../components/task/ATask';
import { Box } from '@mui/material';
import { addToMemberTasks,removeMemberTask } from '../sevice/root_tasks/member_tasks/slice';

export default function AloneSharedTasks() {
  const ownerTasks = useSelector(state => state.owner_tasks);
  const memberTasks = useSelector(state => state.member_tasks);
  const spaces = useSelector(state => state.spaces);
  const filteredMemberTask = memberTasks?.filter(task=>!spaces?.some(space=>space?.tasks?.includes(task._id)))
  const userInfo = useSelector(state => state.user_info)
  const dispatch = useDispatch();
  return (
    <AuthenCheck>
      <FetchSpacesTasks>
        {userInfo && Array.isArray(ownerTasks) && Array.isArray(memberTasks)?
        <>

            <Typography variant="h4" gutterBottom>
              Alone Shared Tasks
            </Typography>
            {filteredMemberTask.length>0?
            <Box backgroundColor="rgba(125,125,125,0.1)" padding={4} borderRadius={5} width='100%' margin={2}>
              <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                {filteredMemberTask.map((e)=> e.active!==false?(<ATask onType="space" fnUpdate={(input)=>dispatch(addToMemberTasks(input))} fnDelete={(input)=>dispatch(removeMemberTask(input))} task={e} key={e._id} />):null)}
              </Stack>
            </Box>
            :
            <Typography variant="h5" gutterBottom>
              No alone task
            </Typography>
            }
        </>
      :<CircularProgress />
      }
      </FetchSpacesTasks>
    </AuthenCheck>
  )
}