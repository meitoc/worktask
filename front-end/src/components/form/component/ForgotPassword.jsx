// export default function Login() {
//     return null    

import { Button, TextField } from "@mui/material"
import { useState } from "react"
import Link from '@mui/material/Link';
import { postForgotPassword } from "../../../sevice/api";


export default function ForgotPassword(prop) {
    const [disableInput, setDisableInput] = useState(false)
    const [forgotUser, setForgotUser] = useState("")
    const [errorText, setErrorText] = useState([])
    const forgotPassword = async ()=>{
        setDisableInput(true)
        console.log(forgotUser)
        const response = await postForgotPassword({email:forgotUser});
        if(response?.success===true){
            console.log(response)
            setDisableInput(false)
            prop.goTo('waiting');
        } else {
            console.log("OOOOO",response)
            setErrorText(response.errors)
            setDisableInput(false)
        }
    }
    return(
            <>
                <TextField
                    sx={{margin:2, width:270}}
                    id="outlined-forgot-password-input"
                    label="Enter Your Email"
                    type="user"
                    autoComplete="username"
                    onChange={(event)=>setForgotUser(event.target.value)}
                    disabled={disableInput}
                    helperText=
                    {errorText.map((e)=>(
                            e
                        ))
                    }
                />
                <Button
                    variant="outlined"
                    sx={{margin:2, width:270}}
                    onClick={ forgotPassword }
                    disabled={disableInput}
                >
                    Submit
                </Button>
                <Link onClick={()=>{
                    prop.goTo("login");
                    // setNote('Enter your username and password!')
                    }}
                    underline="none"
                    style={{cursor: "pointer"}}
                >
                    {'Go back'}
                </Link>
            </>
        )
}