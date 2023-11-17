// import { AuthenCheck } from '../../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import FetchSpace from '../features/fetch-data/FetchSpace';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import SpaceFloatMenu from '../components/space/SpaceFloatMenu';
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';

export default function DetailSpace() {
  
  const space = useSelector(state=>state.a_space)
  console.log(space)
  const {spaceId} = useParams()
  
  return(
    <FetchSpacesTasks>
      <FetchSpace id={spaceId} >
        {space!==null?
        <>
          <Typography variant="h4" gutterBottom>
            Space: {space.name}
          </Typography>
          <Box backgroundColor={space?.color?.background} padding={4} borderRadius={5} width='100vw' margin={2} style={{display:"flex", flexDirrection:"column"}} >
            <SpaceFloatMenu></SpaceFloatMenu>
          </Box>  
        </>
        :<CircularProgress></CircularProgress>
      }
      </FetchSpace>
    </FetchSpacesTasks>
  );
}