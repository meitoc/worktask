// import { AuthenCheck } from '../../features/authentication/AuthenCheck';
import FetchFavorite from '../features/fetch-data/FetchFavorite';
import Typography from '@mui/material/Typography';

export default function DetailTask() {
  return(
      <FetchFavorite>
        <Typography variant="h4" gutterBottom>
          Now Playing
        </Typography>
      </FetchFavorite>
  );
}