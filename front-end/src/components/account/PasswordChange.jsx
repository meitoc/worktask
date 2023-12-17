import { useState} from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createBrowserHistory } from "history";

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import ChangeAccountInfo from "../info-change/ChangeAccountInfo";

import { putUpdateUser } from "../../sevice/api";
import { FormHelperText } from "@mui/material";

const styleShow={display: 'flex', flexDirection: 'column', alignItems: 'center'};
const styleHide={display: 'none'};

export default function PasswordChange() {
    const history = createBrowserHistory();
    // const [oldPassword,setOldPassword]=useState("");
    const [newPassword,setNewPassword]=useState("");
    const [repeatPassword,setRepeatPassword]=useState("");
    // const [showOldPassword,setShowOldPassword]=useState(false);
    const [showNewPassword,setShowNewPassword]=useState(false);
    const [showRepeatPassword,setShowRepeatPassword]=useState(false);

    const [doneSubmit, setDoneSubmit] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [passwordError, setPasswordError] = useState([]);
    // const [showError, setShowError] = useState(false);

    const handleSubmit = async () => {
        setOpenModal(true);
        const password=newPassword;
          if( newPassword===repeatPassword){
            const response = await putUpdateUser({password})
            if(response?.success===true){
                console.log(response)
                history.push("/logout");
                window.location.reload();
            }
            else console.log(response)
            setOpenModal(false)
          }else{
            setDoneSubmit(false);
            // setShowError(true)
            setPasswordError(["Sorry! Something went be wrong. Try again or wait a minute."])
          }
      
    };
    const handleChangPassword = (event)=>{
        const value = event.target.value;
        setNewPassword(value);
        let errorString = [];
        if(value.length<8 || value.length>64) errorString.push(`Length between 8 and 64 characters!`);
        if(!(/[a-z]/.test(value))) errorString.push("Contain at least one lowercase letter!");
        if(!(/[A-Z]/.test(value))) errorString.push( "Contain at least one upprtcase letter!");
        if(!(/[0-9]/.test(value))) errorString.push( "Contain at least one degit!");
        if(!(/[!@#$%^&*(),.?":{}|<>]/.test(value))) errorString.push("Contain at least one special character!");
        if(errorString.length===0){
            // setShowError(false)
            setPasswordError([])
        } else{
            // setShowError(true)
            setPasswordError(errorString)
        }
    }
    const handleRepeatePassword = (event)=>{
        setRepeatPassword(event.target.value)
    }
    return  (
        <>
            <Typography variant="h5" gutterBottom>
                Password
            </Typography>
            <ChangeAccountInfo 
                buttonName="Change"
                title="Change password"
                note={doneSubmit===true?"":"After change password, you must log in again."} 
                open = {openModal===true} 
            >
                <div style={doneSubmit!==true?styleShow:styleHide}>
                    <FormControl sx={{margin:2, width:270}} variant="outlined" disabled={doneSubmit===""} error={passwordError?.length>0}>
                        <InputLabel htmlFor="outlined-new-password">New Password</InputLabel>
                        <OutlinedInput
                            id="outlined-new-password"
                            type={showNewPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={handleChangPassword}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={()=>setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="New-Password"
                        />
                    </FormControl>
                    <FormControl sx={{margin:2, width:270}} variant="outlined" disabled={doneSubmit===""} error={newPassword!==repeatPassword} >
                        <InputLabel htmlFor="outlined-repeat-password">Repeat New Password</InputLabel>
                        <OutlinedInput
                            id="outlined-repeat-password"
                            type={showRepeatPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={repeatPassword}
                            onChange={handleRepeatePassword}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={()=>setShowRepeatPassword(!showRepeatPassword)}
                                    edge="end"
                                >
                                {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Repeat-New-Password"
                        />
                    </FormControl>
                    {passwordError.map((e,i)=>(
                        <FormHelperText error={true} key={i} >{e}</FormHelperText>
                    ))}
                    <Button
                        disabled={doneSubmit===""}
                        sx={{margin:2, width:270}}
                        variant="outlined"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </ChangeAccountInfo>
        </>
    );
}