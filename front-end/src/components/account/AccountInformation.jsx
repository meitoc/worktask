import { useContext, useState } from "react";
import { ContextStatus } from "../../App";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';
// import Box from '@mui/material/Box';
import ChangeAccountInfo from "../info-change/ChangeAccountInfo";
// import Avatar from '@mui/material/Avatar';
// chang this function later for security
import addUserData from "../../features/fetch-data/addUserData";
import SubmitOTP from "./SubmitOTP";
import { useDispatch, useSelector } from "react-redux";
import { updateUserEmail } from "../../sevice/user_info/slice";

const styleShow={display: 'flex', flexDirection: 'column', alignItems: 'center'};
const styleHide={display: 'none'};

export default function AccountInformation() {
    const {setUserData} = useContext(ContextStatus); 
    const dispatch = useDispatch();
    const userInfo = useSelector(state=>state.user_info)

    // const [username, setUsername] = useState(userInfo.username);
    // const [showUsername, setShowUsername] = useState(username);
    // const [doneSubmitUsername, setDoneSubmitUsername] = useState(undefined);
    // const [openModalUsername, setOpenModalUsername] = useState(false);
    
    const [email, setEmail] = useState(userInfo.email);
    const [showEmail, setShowEmail] = useState(email);
    const [doneSubmitEmail, setDoneSubmitEmail] = useState(undefined);
    const [openModalEmail, setOpenModalEmail] = useState(false);
    
    
    
    const [sessionOTP, setSessionOTP] = useState("");

    const handleSubmit = (setOpenModal,setDoneSubmit,dataName,dataValue) => {
        setOpenModal(true);
        setDoneSubmit("");
        async function checkResults() {
            try {
                const result = await addUserData(dataName, dataValue);
                if (result.status !== true) {
                    setDoneSubmit(false);
                } else {
                    setSessionOTP(result.waiting_key)
                    setDoneSubmit(true);
                }
            } catch (error) {
              console.error(error);
              setDoneSubmit(false);
            }
          }
            checkResults();
      
    };
    return  (
        <>
            <Typography variant="h5" gutterBottom>
                Account informations
            </Typography>
            <Typography variant="h6" gutterBottom>
                - Username: {userInfo.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
                - Email: {email}
            </Typography>
            <ChangeAccountInfo
                buttonName={email===undefined?"Add":"Change"} title="Account information"
                note={doneSubmitEmail===true?"":`After click submit, we will send you an OTP code via ${userInfo.email==undefined || userInfo.phone==undefined?"email.":"phone."}`}
                open={openModalEmail}
            >
                <div style={doneSubmitEmail!==true?styleShow:styleHide}>
                    <TextField
                        disabled={doneSubmitEmail===""}
                        sx={{margin:2, width:270}}
                        required
                        id="outlined-required"
                        label="Email"
                        value={showEmail}
                        onChange={(event)=>setShowEmail(event.target.value)}
                    />
                    <Typography sx={{display:(doneSubmitEmail===false?"block":"none"),margin:2, width:270}} variant="caption" gutterBottom>
                        Sorry! Something went be wrong. Try again or wait a minute.
                    </Typography>
                    <Button
                        disabled={doneSubmitEmail===""}
                        sx={{margin:2, width:270}}
                        variant="outlined"
                        onClick={()=>handleSubmit(setOpenModalEmail,setDoneSubmitEmail,'email',showEmail)}
                    >
                        Submit
                    </Button>
                </div>
                <SubmitOTP show={doneSubmitEmail===true} session={sessionOTP} fn={()=>{
                    setDoneSubmitEmail(undefined);
                    setUserData({...userInfo,email:showEmail});
                    setEmail(showEmail);
                    setOpenModalEmail(false);
                    dispatch(updateUserEmail())
                }} />
            </ChangeAccountInfo>
            
            
        </>
    );
}