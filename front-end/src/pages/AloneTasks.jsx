import { AuthenCheck } from '../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import {useDispatch, useSelector} from 'react-redux'
import { addToSpaces, removeSpace} from '../sevice/spaces/slice';
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';
import AnAloneTask from '../components/task/AnAloneTask';
import AddAloneTask from '../components/task/AddAloneTask';

export default function AloneTasks() {
  const owner_tasks = useSelector(state => state.owner_tasks)
  // const member_tasks = useSelector(state => state.member_tasks)
  const userInfo = useSelector(state => state.user_info)
  const dispatch = useDispatch();
  return (
  <FetchSpacesTasks>
    <AuthenCheck>
    {userInfo && Array.isArray(owner_tasks)?
    <>
        <Typography variant="h4" gutterBottom>
          Alone Task
        </Typography>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {owner_tasks.map((e,i)=> e.active!==false?(<AnAloneTask fnUpdate={(input)=>dispatch(addToSpaces(input))} fnDelete={(input)=>dispatch(removeSpace(input))} space={e} key={i} />):null)}
          <AddAloneTask />
        </Stack>
    </>
  :<CircularProgress />
  }
  </AuthenCheck>
  </FetchSpacesTasks>
  )
}