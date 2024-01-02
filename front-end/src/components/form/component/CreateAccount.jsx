import { useState } from "react";
import { postCreateUser } from "../../../sevice/api";
import TextField from "@mui/material/TextField";
import { Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Link from '@mui/material/Link';

export default function CreateAccount(prop) {
    const [createEmail,setCreateEmail] = useState("");
    const [createEmailText,setCreateEmailText] = useState("");
    const [createEmailError,setCreateEmailError] = useState(false);
    
    const [createUser,setCreateUser] = useState("");
    const [createUserText,setCreateUserText] = useState("");
    const [createUserError,setCreateUserError] = useState(false);

    const [createPassword,setCreatePassword] = useState("");
    const [createPasswordText,setCreatePasswordText] = useState([]);
    const [createPasswordError,setCreatePasswordError] = useState(false);

    const [showPassword,setShowPassword] = useState(true);
    const [disableLoginInput,setDisableLoginInput] = useState(false);

     //function for create new account
  const createAccount = async () => {
    if(createEmail && createUser && createPassword && !(createEmailError||createUserError||createPasswordError)){
        setDisableLoginInput(true);
        const data = {email:`${createEmail}`.toLowerCase(), user: `${createUser}`.toLowerCase(), password: `${createPassword}`};
        const response = await postCreateUser(data)
            if(response?.success===true){
                prop.goTo('waiting');
                setDisableLoginInput(false);
            } else{
                setDisableLoginInput(false);
            }
    }
    }
    const handleChangeEmail = (event) =>{
        const value = event.target.value;
        setCreateEmail(value);
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
                setCreateEmailError(false)
                setCreateEmailText("")
        }else{
            setCreateEmailError(true)
            setCreateEmailText("Please check your email!")
        }
    }
    const handleChangeUser = (event) =>{
        const value = event.target.value;
        setCreateUser(value);
        if(/^[a-z][a-z0-9_]{4,}$/.test(value)) {
            setCreateUserError(false)
            setCreateUserText("")
        }else{
            setCreateUserError(true)
            setCreateUserText("Name must start with a letter and contain only lowercase letters, numbers, and underscores!")
        }
    }
    const handleChangPassword = (event)=>{
        const value = event.target.value;
        setCreatePassword(value);
        let errorString = [];
        if(value.length<8 || value.length>64) errorString.push(`Length between 8 and 64 characters!`);
        if(!(/[a-z]/.test(value))) errorString.push("Contain at least one lowercase letter!");
        if(!(/[A-Z]/.test(value))) errorString.push( "Contain at least one upprtcase letter!");
        if(!(/[0-9]/.test(value))) errorString.push( "Contain at least one degit!");
        if(!(/[!@#$%^&*(),.?":{}|<>]/.test(value))) errorString.push("Contain at least one special character!");
        if(errorString.length===0){
            setCreatePasswordError(false)
            setCreatePasswordText([])
        } else{
            setCreatePasswordError(true)
            setCreatePasswordText(errorString)
        }
    }
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    return(
        <>
        <TextField
            sx={{margin:2, width:270}}
            error={createEmailError}
            id="outlined-email-input"
            label="Email"
            type="email"
            autoComplete="none"
            onChange={handleChangeEmail}
            value= {createEmail}
            disabled={disableLoginInput}
            helperText={createEmailText}
        />
        <TextField
            sx={{margin:2, width:270}}
            error={createUserError}
            id="outlined-username-input"
            label="Username"
            type="username"
            autoComplete="none"
            onChange={handleChangeUser}
            value= {createUser}
            disabled={disableLoginInput}
            helperText={createUserText}
        />
        <FormControl  sx={{margin:2, width:270}} variant="outlined">
            <InputLabel htmlFor="outlined-create-password">Password</InputLabel>
            <OutlinedInput
            error={createPasswordError}
            autoComplete="new-password"
            id="outlined-create-password"
            type={showPassword ? 'text' : 'password'}
            onChange={handleChangPassword}
            disabled={disableLoginInput}
            endAdornment={
                <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                </InputAdornment>
            }
            label="Password"
            />
            {
                createPasswordText.map((e,i)=>(
                    <FormHelperText error={createPasswordError} key={i} >{e}</FormHelperText>
                ))
            }
        </FormControl>
            <Button
            disabled={disableLoginInput}
            variant="outlined"
            sx={{margin:2, width:270}}
            onClick={createAccount}
            >
            Submit new account
            </Button>
            <Link onClick={()=>{
                prop.goTo("login");
            }}
            underline="none"
            style={{cursor: "pointer"}}
            >
                Go back
            </Link>
            </>
    )
}
