import { Box, Button, Fab, TextField, Typography, Zoom} from "@mui/material";
import { useState } from "react";
import { putSpace } from "../../sevice/api";
import { useDispatch, useSelector } from "react-redux";
import { updateASpace } from "../../sevice/a_space/slice";
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from "@emotion/react";

export default function SpaceDescription(prop) {
    const theme = useTheme();
const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

    const space = useSelector(state=>state.a_space)
    const dispatch = useDispatch()
    const spaceDescription = space?.description??"";
    const spaceName = space?.name??"";
    const [showSpaceDescription, setShowSpaceDescription] = useState(space?.description??"")
    const [showSpaceName, setShowSpaceName] = useState(space?.name??"")
    const [editSpace, setEditSpace] = useState(false)
   const handleSetDescription = (event)=>{
    setShowSpaceDescription(event.target.value)
   }
   const handleSetName = (event)=>{
    setShowSpaceName(event.target.value)
   }
   const handleSubmit = async () => {
        setEditSpace(false);
        const data={};
        if(showSpaceName!==spaceName)data.name=showSpaceName;
        if(showSpaceDescription!==spaceDescription)data.description=showSpaceDescription;
        if(data.description || data.name){
            const response = await putSpace(space._id,data)
            if(response?.success===true){
                dispatch(updateASpace(data));
            }
            else{
                setShowSpaceDescription(spaceDescription)
            }
        }
    }
    const handleCancel = ()=>{
        setShowSpaceDescription(spaceDescription)
        setEditSpace(false)
    }
    return(
        <Box padding={5} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"space-between",alignItems:"space-between"}}>
            {editSpace===true?
                <>
                    <TextField
                        id="name-input"
                        fullWidth={true}
                        placeholder="Space name"
                        defaultValue={showSpaceName}
                        onChange={handleSetName}
                        InputProps={{
                            style: {
                              fontSize: '24px',
                            },
                          }}
                    />
                    <TextField
                        id="name-input"
                        fullWidth={true}
                        placeholder="Space descriptiom"
                        multiline={true}
                        value={showSpaceDescription}
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
                        <Button  variant="contained" onClick={handleCancel}>Cancel</Button>
                    </Box>
                    
                </>
                :
                <>
                    {showSpaceDescription?.split('\n').map((e,i)=>
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
        </Box>
    )
}