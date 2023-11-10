import { AuthenCheck } from '../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ASpace from '../components/spaces/ASpace'
import CircularProgress from '@mui/material/CircularProgress';
import AddSpace from '../components/spaces/AddSpace';

import {useDispatch, useSelector} from 'react-redux'
import { addToSpaces, removeSpace} from '../sevice/spaces/slice';
import LetLogin from '../components/spaces/LetLogin';
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';

export default function Spaces() {
  const spaces = useSelector(state => state.spaces)
  const userInfo = useSelector(state => state.user_info)
  const dispatch = useDispatch();
  return (
  <FetchSpacesTasks>
    {userInfo && Array.isArray(spaces)?
    <AuthenCheck>
        <Typography variant="h4" gutterBottom>
          Spaces
        </Typography>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {spaces.map((e,i)=> e.active!==false?(<ASpace fnUpdate={(input)=>dispatch(addToSpaces(input))} fnDelete={(input)=>dispatch(removeSpace(input))} space={e} key={i} />):null)}
          <AddSpace />
        </Stack>
    </AuthenCheck>
    : userInfo===false? <LetLogin />
    :<CircularProgress />
    }
  </FetchSpacesTasks>
  )
}