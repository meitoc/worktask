import { Box, Button, Fab, Paper, TextField, Typography, Zoom} from "@mui/material";
import { useState } from "react";
import { putSpace } from "../../sevice/api";
import { useDispatch, useSelector } from "react-redux";
import { updateASpace } from "../../sevice/a_space/slice";
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from "@emotion/react";

export default function SpaceDetail(prop) {
    const theme = useTheme();
const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

    const space = useSelector(state=>state.a_space)
    const dispatch = useDispatch()
    const spaceDescription = space?.description??"";
    const [showSpaceDetail, setShowSpaceDetail] = useState(space?.description??"")
    const [editSpace, setEditSpace] = useState(false)
   const handleSetDescription = (event)=>{
    setShowSpaceDetail(event.target.value)
   }
   const handleSubmit = async () => {
        setEditSpace(false);
        const data={};
        if(showSpaceDetail!==spaceDescription)data.description=showSpaceDetail;
        if(data.description || data.name){
            const response = await putSpace(space._id,data)
            if(response?.success===true){
                dispatch(updateASpace(data));
            }
            else{
                setShowSpaceDetail(spaceDescription)
            }
        }
    }
    const handleCancel = ()=>{
        setShowSpaceDetail(spaceDescription)
        setEditSpace(false)
    }
    const paperStyle = {
        padding: 10,
        display: 'flex',
        flexDirection:"column",
        flexWrap: 'wrap',
        borderRadius: 10,
        width:"100%",
        flexGrow: 1
    }
    return(
        <Box padding={5} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"space-between",alignItems:"space-between"}}>
            <Paper elevation={3} style={paperStyle} >
                {editSpace===true?
                    <>
                        <TextField
                            id="name-input"
                            fullWidth={true}
                            placeholder="Space descriptiom"
                            multiline={true}
                            value={showSpaceDetail}
                            onChange={handleSetDescription}
                            minRows={5}
                            InputProps={{
                                style: {
                                fontSize: '20px',
                                },
                            }}
                        />
                        <Box sx={{display:"flex", alignItems:"space-between"}}>
                            <Button  variant="contained" onClick={handleSubmit}>Submit</Button>
                            <Button  variant="contained" onClick={handleCancel} color="warning" >Cancel</Button>
                        </Box>
                        
                    </>
                    :
                    <>
                        {showSpaceDetail?.split('\n').map((e,i)=>
                        <Typography variant="body1" sx={{ fontSize: 20 }} gutterBottom key={i}>{e}</Typography>
                        )}
                        <Zoom
                            key='secondary'
                            in={true}
                            timeout={transitionDuration}
                            style={{
                                transitionDelay: `${transitionDuration.exit}ms`,
                            }}
                            unmountOnExit
                            onClick={()=>{setEditSpace(true)}}
                        >
                            <Fab sx={{position: 'static', bottom: 16, left: 16,}} aria-label="Edit" color='secondary' >
                                <EditIcon />
                            </Fab>
                        </Zoom>
                    </>
                }
            </Paper>
        </Box>
    )
}