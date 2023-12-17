import { useState } from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ChangeAccountInfo from "../info-change/ChangeAccountInfo";
import {  useSelector } from "react-redux";
import { putUpdateUser } from "../../sevice/api";

const styleShow={display: 'flex', flexDirection: 'column', alignItems: 'center'};
const styleHide={display: 'none'};

export default function AccountInformation() {
    const userInfo = useSelector(state=>state.user_info)
    const email = userInfo.email;
    const [showEmail, setShowEmail] = useState(email);
    const [doneSubmitEmail, setDoneSubmitEmail] = useState(undefined);
    const [openModalEmail, setOpenModalEmail] = useState(false);
    const [emailError, setEmailError] = useState(false);
    
    const handleSubmit = async () => {
        if(email!==showEmail){
            setDoneSubmitEmail(false);
            const result = await putUpdateUser({showEmail});
                if (result?.status === true) {
                    setDoneSubmitEmail(true);
                } else {
                    setDoneSubmitEmail(undefined);
                }
        } else setEmailError(true)
    };
    const handleChangeEmail = (event)=>{
        setShowEmail(event.target.value)
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.target.value) && email!=showEmail) setEmailError(false)
        else setEmailError(true)
    }
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
                note={doneSubmitEmail===true?"":`We will send you a URL via new email. Please access the URL to confirm.`}
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
                        onChange={handleChangeEmail}
                        error={emailError}
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
                <div style={doneSubmitEmail===true?styleShow:styleHide}>
                    <Typography variant="caption" gutterBottom>
                        An email have been send to your new email address!
                    </Typography>
                </div>
            </ChangeAccountInfo>
        </>
    );
}