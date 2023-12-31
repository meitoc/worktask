import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { postGoogleLogin, postLogin } from '../../../sevice/api';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../sevice/user_info/slice';
import { useGoogleLogin } from '@react-oauth/google';
export default function Login(prop) {
    const dispatch = useDispatch();
    const [loginUser,setLoginUser] = useState(null);
    const [loginPassword,setLoginPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [note, setNote] = useState(["Enter your username and password!"]);
    const [disableLoginInput, setDisableLoginInput] = useState(false);
    
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    //function for login
    function isEmailOrUsername(input) {
        const isEmail = /\S+@\S+\.\S+/.test(input);
        if(isEmail) return true
        const isUsername = /^[a-z][a-z0-9_]{4,}$/.test(input);
        if(isUsername) return false;
        else return null;
    }
      
    const checkLogin = async (loginName, password) => {
        setDisableLoginInput(true);
        const emailOrUsername = isEmailOrUsername(loginName)
        if(password.length<8 || password.length>64 || !(/[a-z]/.test(password)) || !(/[A-Z]/.test(password)) || !(/[0-9]/.test(password)) || !(/[!@#$%^&*(),.?":{}|<>]/.test(password))) setNote(["Wrong password or user name!"]);
        else if(emailOrUsername!==null ){
            const data = {password: `${password}`}
            if(emailOrUsername===true) data.email = `${loginName}`;
            else data.name = `${loginName}`;
            const response = await postLogin(data)
            if(response?.success===true){
                if(response.data?.session) {
                    localStorage.setItem('loginSession',response.data.session);
                    dispatch(updateUser(response.data.data));
                    console.log("Logged in")
                    prop.close()
                    setDisableLoginInput(false);
                    console.log("Server: You'r logged in.");
                }
            } else {
                setNote(response?.errors??["Unknown error!"]);
                setDisableLoginInput(false);
            }
        }
        setDisableLoginInput(false);
    }
    const login = useGoogleLogin({
        onSuccess: async(tokenResponse) => {
            setDisableLoginInput(true)
            const response =  await postGoogleLogin(tokenResponse);
            if(response?.success===true) {
                if(response.data?.session) {
                    localStorage.setItem('loginSession',response.data.session);
                    dispatch(updateUser(response.data.data));
                    console.log("Logged in")
                    prop.close()
                    setDisableLoginInput(false);
                    console.log("Server: You'r logged in.");
                }
            } else {
                setNote(["Wrong password or user name!"]);
                setDisableLoginInput(false);
            }
        }
      });
    return(
        <>
        <TextField
            sx={{margin:2, width:270}}
            id="outlined-user-input"
            label="Email or Username"
            type="user"
            autoComplete="username"
            onChange={(event)=>setLoginUser(event.target.value)}
            disabled={disableLoginInput}
        />
        <FormControl  sx={{margin:2, width:270}} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
            autoComplete="current-password"
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            onChange={(event)=>setLoginPassword(event.target.value)}
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
        </FormControl>
        {note.map((e,i)=>{
            return<p key={i}>{e}</p>
        })}
        <Button
            variant="outlined"
            sx={{margin:2, width:270}}
            disabled={disableLoginInput}
            onClick={async () =>{
            await checkLogin(loginUser, loginPassword);
            }}
        >
            Login
        </Button>
        <Button
            variant="outlined"
            sx={{margin:2, width:270}}
            disabled={disableLoginInput}
            onClick={() => login()}
        >
            Login with Google
        </Button>
        
        <Button
            variant="outlined"
            sx={{margin:2, width:270}}
            disabled={disableLoginInput}
            onClick={()=>{
            prop.goTo("create_account");
            setNote(['Eter your email'])
            }}
        >
            Create new account
        </Button>
        <Link
            underline="none"
            style={{cursor: "pointer"}}
            onClick={()=>{
                prop.goTo("forgot_password")
            }}
        >
            {'Forgot password?'}
        </Link>
        </>
    )
}
