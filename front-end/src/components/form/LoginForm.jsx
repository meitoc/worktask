import * as React from 'react';
import { createBrowserHistory } from "history";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';



import { ContextStatus } from '../../App';
import CreateAccount from './component/CreateAccount';
import Login from './component/Login';
import ForgotPassword from './component/ForgotPassword';
import Waiting from './component/Waiting';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const styleShow={display: 'flex', flexDirection: 'column', alignItems: 'center'};
const styleHide={display: 'none'};

export default function LoginForm(prop) {
  //common hook
  const history = createBrowserHistory();
  const goBack = prop.goBack!==false;
  const { showLoginForm,setShowLoginForm} = React.useContext(ContextStatus);
  const [openPart,setOpenPart] = React.useState("login");

  return (
    <div>
      <Modal 
        open={showLoginForm}
        onClose={()=> {
          setShowLoginForm(false);
          goBack && history.back();
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{ ...style, width: "100vw", height: "100vh" , backgroundColor: "rgba(0,0,0,0.2)"}}
      >
        <Box sx={{ ...style, maxWidth: '350px' }}>
          <h2 id="parent-modal-title">{openPart=='login'?'Login':openPart=='otp'?'Submit OTP':openPart=='create_account'?'Create New Account':openPart=='create_account'?'Forgot Password':"Waiting"}</h2>
            <Box >
              <div style={openPart==="login"?styleShow:styleHide} >
                <Login goTo={setOpenPart} close={()=>setShowLoginForm(false)} open={()=>setShowLoginForm(true)} >

                </Login>
              </div>
              <div style={openPart==="create_account"?styleShow:styleHide}>
                <CreateAccount goTo={setOpenPart}close={()=>setShowLoginForm(false)} open={()=>setShowLoginForm(true)} >

                </CreateAccount>
              </div>
              <div style={openPart==="forgot_password"?styleShow:styleHide}>
                <ForgotPassword goTo={setOpenPart} close={()=>setShowLoginForm(false)} open={()=>setShowLoginForm(true)} >

                </ForgotPassword>
              </div>
              <div style={openPart==="waiting"?styleShow:styleHide}>
                <Waiting goTo={setOpenPart} close={()=>setShowLoginForm(false)} open={()=>setShowLoginForm(true)} >

                </Waiting>
              </div>
            </Box>
        </Box>
      </Modal>
    </div>
  );
}