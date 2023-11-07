import { AuthenCheck } from "../features/authentication/AuthenCheck";
import { useContext } from "react";
import { ContextStatus } from "../App";
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
import AccountInformation from "../components/account/AccountInformation";
import UserInformation from "../components/account/UserInformation";
import PasswordChange from "../components/account/PasswordChange";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
// chang this function later for security

export default function Account() {
    const {userData} = useContext(ContextStatus);
    console.log('userDataAAA');
    console.log(userData);
    return  (
        
        <AuthenCheck>
        {
            (userData)?
            <
            >
                <Typography variant="h4" gutterBottom>
                You Account
                </Typography>
                <Typography variant="h4" gutterBottom>
                Spaces
              </Typography>
              <Stack spacing={{ xs: 1, sm: 2 }} direction="column" useFlexGap flexWrap="wrap">
              
                    <Paper sx={{width:"90vw"}} elevation={2}>
                        <AccountInformation/>
                    </Paper>
                    <Paper elevation={2}>
                        <PasswordChange/>
                    </Paper>
                    <Paper elevation={2} >
                        <UserInformation/>
                    </Paper>
                    </Stack>
                </>
                :
                <CircularProgress />
            }
        </AuthenCheck>
    );
}