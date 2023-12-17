// export default function Login() {
//     return null    

import { Button, TextField } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom";
import { postForgotPassword } from "../../../sevice/api";


export default function ForgotPassword(prop) {
    const [disableInput, setDisableInput] = useState(false)
    const [forgotUser, setForgotUser] = useState("")
    const forgotPassword = async ()=>{
        setDisableInput(true)
        console.log(forgotUser)
        const response = await postForgotPassword({email:forgotUser});
        if(response?.success===true){
            console.log(response)
            setDisableInput(false)
            prop.close()
        } else setDisableInput(false)
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
// export default function ForgotPassword(prop) {
//     const [forgotUser,setForgotUser] = React.useState(null);
//     //function for submit forgot password
//   const forgotPassword = async (username) => {
//     const options = {
//       method: 'POST',
//       headers: {
//         accept: 'application/json',
//         'content-type': 'application/json',
//       },
//       body: JSON.stringify({username: `${username}`})
//     };
//     if(isEmailOrUsername(username)) {
//       fetch(`http://localhost:8000/redirect/9La81A3m223aawsQ/3/authentication/token/forgot-password`, options)
//       .then(response => response.json())
//       .then(response => {
//         console.log(response);
//         if(response.status===true){
//           setSessionOTP(response.waiting_key);
//           setOpenPart('otp');
//         } else {
//           if(response.comment==="login_locked"){
//             setNote( "The account is locked!");
//             console.log( "Server: The account is locked!");
//           } else{
//             setNote( "User name is invalid!");
//             console.log( "Server: User name is invalid!");
//           }
//         }
//         setDisableLoginInput(false);
//       })
//       .catch(error => {
//         console.log(error)
//         setNote("Check your internet connection!");
//         console.log("Server: Check your internet connection!");
//         setDisableLoginInput(false);
//       })
//     }
//   }
 
//     return(
//         <>
//         <TextField
//                    sx={{margin:2, width:270}}
//                   id="outlined-forgot-password-input"
//                   label="Email or Phone"
//                   type="user"
//                   autoComplete="username"
//                   onChange={(event)=>setForgotUser(event.target.value)}
//                   disabled={disableLoginInput}
//                 />
//                 <p>{note}</p>
//                   <Button
//                     variant="outlined"
//                     sx={{margin:2, width:270}}
//                     onClick={async () =>{
//                       forgotPassword(forgotUser);
//                     }}
//                   >
//                     Submit
//                   </Button>
//                   <Link onClick={()=>{
//                       setOpenPart("login");
//                       setNote('Enter your username and password!')
//                     }}
//                     underline="none"
//                     style={{cursor: "pointer"}}
//                   >
//                     {'Go back'}
//                   </Link>
                  
//                 <SubmitOTP show={openPart==='otp'} session={sessionOTP} fn={()=>{
//                     // setDoneSubmit(undefined);
//                     setShowLoginForm(false);
//                 }} />
//                   </>
//     )
// };
