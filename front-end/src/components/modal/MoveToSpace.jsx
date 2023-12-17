import { useState } from "react"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ButtonBase from "@mui/material/ButtonBase";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/material";
import BasicASpace from "../spaces/BasicASpace";
import { addTaskToASpace } from "../../sevice/spaces/slice";
import { putTaskToSpace } from "../../sevice/api";
import { removeTaskFromASpace } from "../../sevice/a_space/slice";
import { createBrowserHistory } from "history";

export default function MoveToSpace(prop) {
  const history = createBrowserHistory();
  const dispatch = useDispatch();
  const spaces = useSelector(state=>state.spaces);
  const [openModal,setOpenModal] = useState(false);
  const [takeSpace,setTakeSpace] = useState(null);
  const handleOpenModal = ()=>{
    setOpenModal(true)
  }
  const handleCloseModal = ()=>{
    setOpenModal(false);
    prop.cancel();
  }
  const handleConfirm = async (gotoSpace)=>{
    if(takeSpace!==null){
      const data={task:prop.id};
      const response = await putTaskToSpace(data,takeSpace._id);
      if(response?.success===true){
        setOpenModal(false);
        prop.confirm();
        dispatch(addTaskToASpace({task:prop.id,space:takeSpace._id}));
        dispatch(removeTaskFromASpace(prop.id))
        if(gotoSpace===true) {
          history.push(`/space/${takeSpace._id}`);
          window.location.reload();
        }
      }
    }
  }
    return(
        <>
        <ButtonBase variant="text" onClick={handleOpenModal}>
          {prop.children}
        </ButtonBase>
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
                    width: "70vw",
                    minWidth: "300px",
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    pt: 2,
                    px: 4,
                    pb: 3,
                }}>
                  <h2 id="parent-modal-title">Move to space</h2>
                  <div id="parent-modal-description">
                    <Box maxHeight={"80vh"} maxWidth={"100%"} overflow="auto" >
                    <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                      {spaces?.map((e)=> e.active!==false && !e.tasks?.includes(prop.id) ?(<BasicASpace display={e?._id===takeSpace?._id} space={e} key={e._id} onClick={()=>{setTakeSpace(e)}} />):null)}
                    </Stack>
                    </Box>
                  </div>
                  <div style={{display:"flex",justifyContent:"start"}}>
                    <Button variant="contained" sx={{margin:1}} onClick = {handleConfirm}>OK</Button>
                    <Button variant="contained" sx={{margin:1}} onClick = {()=>handleConfirm(true)}>OK THEN GO TO SPACE</Button>
                    <Button variant="contained" sx={{margin:1}} onClick = {handleCloseModal} color="warning" >CANCEL</Button>
                  </div>
                </Box>
        </Modal>
        </>
    )
}
