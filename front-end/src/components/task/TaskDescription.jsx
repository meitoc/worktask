import { Box, Button, Fab, TextField, Typography, Zoom} from "@mui/material";
import { useState } from "react";
import { putTask } from "../../sevice/api";
import { useDispatch, useSelector } from "react-redux";
import { updateATask } from "../../sevice/a_task/slice";
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from "@emotion/react";

export default function TaskDescription(prop) {
    const theme = useTheme();
const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

    const task = useSelector(state=>state.a_task)
    const dispatch = useDispatch()
    const taskDescription = task?.description??"";
    const taskName = task?.name??"";
    const [showTaskDescription, setShowTaskDescription] = useState(task?.description??"")
    const [showTaskName, setShowTaskName] = useState(task?.name??"")
    const [editTask, setEditTask] = useState(false)
   const handleSetDescription = (event)=>{
    setShowTaskDescription(event.target.value)
   }
   const handleSetName = (event)=>{
    setShowTaskName(event.target.value)
   }
   const handleSubmit = async () => {
        setEditTask(false);
        const data={};
        if(showTaskName!==taskName)data.name=showTaskName;
        if(showTaskDescription!==taskDescription)data.description=showTaskDescription;
        if(data.description || data.name){
            const response = await putTask(task._id,data)
            if(response?.success===true){
                dispatch(updateATask(data));
            }
            else{
                setShowTaskDescription(taskDescription)
            }
        }
    }
    const handleCancel = ()=>{
        setShowTaskDescription(taskDescription)
        setEditTask(false)
    }
    return(
        <Box padding={5} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"task-between",alignItems:"task-between"}}>
            {editTask===true?
                <>
                    <TextField
                        id="name-input"
                        fullWidth={true}
                        placeholder="Task name"
                        defaultValue={showTaskName}
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
                        placeholder="Task descriptiom"
                        multiline={true}
                        value={showTaskDescription}
                        onChange={handleSetDescription}
                        minRows={5}
                        InputProps={{
                            style: {
                              fontSize: '20px',
                            },
                          }}
                    />
                    <Box sx={{display:"flex", alignItems:"task-between"}}>
                        <Button  variant="contained" onClick={handleSubmit}>Submit</Button>
                        <Button  variant="contained" onClick={handleCancel}>Cancel</Button>
                    </Box>
                    
                </>
                :
                <>
                    {showTaskDescription?.split('\n').map((e,i)=>
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
                        onClick={()=>{setEditTask(true)}}
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