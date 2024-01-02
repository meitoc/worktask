import { useState } from "react"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ButtonBase from "@mui/material/ButtonBase";

export default function ModalConfirm(prop) {
  const [openModal,setOpenModal] = useState(false)
  const handleOpenModal = ()=>{
    if(prop.disabled!==true)
    setOpenModal(true)
  }
  const handleCloseModal = ()=>{
    if(prop.disabled!==true){
      setOpenModal(false);
      if(prop.cancel) prop.cancel();
    }
  }
  const handleConfirm = ()=>{
    if(prop.disabled!==true) if(prop.confirm) prop.confirm();
  }
    return(
        <>
        {
          prop.children.type=== Button?
          <div style={{display:"inline-block"}} onClick={handleOpenModal}>
            <>
            {prop.children}
            </>
          </div>
          :<ButtonBase style={prop.style} variant="text" onClick={handleOpenModal}>
            {prop.children}
          </ButtonBase>
        }
        <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
              >
                <Box sx={{
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
                }}>
                  <h2 id="parent-modal-title">{prop.title??"Confirm"}</h2>
                  <p id="parent-modal-description">
                    {prop.text??""}
                  </p>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <Button variant="contained" sx={{margin:1}} onClick = {handleConfirm}>OK</Button>
                    <Button variant="contained" sx={{margin:1}} onClick = {handleCloseModal} color="warning" >CANCEL</Button>
                  </div>
                </Box>
        </Modal>
        </>
    )
}
