import { AuthenCheck } from "../features/authentication/AuthenCheck";
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import AccountInformation from "../components/account/AccountInformation";
import UserInformation from "../components/account/UserInformation";
import PasswordChange from "../components/account/PasswordChange";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useSelector } from "react-redux";
// import Avatar from '@mui/material/Avatar';
// chang this function later for security

export default function Account() {
    const userInfo = useSelector(state=>state.user_info)
    return  (
        <AuthenCheck>
        {userInfo?
            <>
                <Typography variant="h4" gutterBottom>
                You Account
                </Typography>
                <Stack spacing={{ xs: 1, sm: 2 }} direction="column" useFlexGap flexWrap="wrap">
                    <Paper sx={{width:"90vw",padding: 4}} elevation={2} >
                        <AccountInformation/>
                    </Paper>
                    <Paper sx={{width:"90vw",padding: 4}} elevation={2} >
                        <PasswordChange/>
                    </Paper>
                    <Paper sx={{width:"90vw",padding: 4}} elevation={2} >
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