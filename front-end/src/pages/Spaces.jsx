// import { AuthenCheck } from '../../features/authentication/AuthenCheck';
// import FetchFavorite from '../features/fetch-data/FetchFavorite';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ASpace from '../components/spaces/ASpace'
import CircularProgress from '@mui/material/CircularProgress';
import AddSpace from '../components/spaces/AddSpace';
import { getSpaces } from '../sevice/api';
export default function Spaces() {
  const [spaces, setSpaces] = useState(null);
  const [changeList, setChangeList] = useState(false);
  useEffect(()=>{
    const fetchData = async () =>{
      const data = await getSpaces();  
      if(data) setSpaces(data); else setSpaces([]);
    }
    console.log("AAAAAAAA")
    fetchData();
  },[changeList]);
  return(
    Array.isArray(spaces)?(
      <>
        <Typography variant="h4" gutterBottom>
          Spaces
        </Typography>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {spaces.map((e,i)=> (<ASpace space={e} key={i} />))}
          <AddSpace fn={()=>{setChangeList(!changeList)}}  />
        </Stack>
      </>
    ):spaces===null?(
      <CircularProgress />
    ):<p>Let login</p>
  );
}