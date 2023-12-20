import { Box, Button, Divider, Fab, Paper, TextareaAutosize, ToggleButton, ToggleButtonGroup, Typography, Zoom} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from "react";
import { putTask } from "../../sevice/api";
import { useDispatch, useSelector } from "react-redux";
import { updateATask } from "../../sevice/a_task/slice";
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from "@emotion/react";
import Comment from "./Comment";
import FetchComments from "../../features/fetch-data/FetchComments";
import FileList from "./FileList";
import Chart from "./Chart";
import FetchFiles from "../../features/fetch-data/FetchFiles";
import AddIcon from '@mui/icons-material/Add';

export default function TaskDetail(prop) {
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
    const task = useSelector(state=>state.a_task)
    const dispatch = useDispatch()
    const taskDescription = task?.description??"";
    const [showTaskDescription, setShowTaskDescription] = useState(task?.description??"")
    const [editTask, setEditTask] = useState(false)
   const handleSetDescription = (event)=>{
    setShowTaskDescription(event.target.value)
   }
   const handleSubmit = async () => {
        setEditTask(false);
        const data={};
        if(showTaskDescription!==taskDescription)data.description=showTaskDescription;
        if(typeof data.description === 'string'){
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
        setShowTaskDescription(task?.description??"")
        setEditTask(false)
    }
    const paperStyle = {
        padding: 10,
        display: 'flex',
        flexDirection:"column",
        flexWrap: 'wrap',
        borderRadius: 10,
        width:"100%",
        // minWidth:350,
        // maxWidth:450,
        flexGrow: 1
    }

    const [taskStatus, setTaskStatus] = useState(task?.status??"todo");

    const handleChangeStatus = async (event, newTaskStatus) => {
        const oldTaskStatus = taskStatus;
        setTaskStatus(newTaskStatus);
        const response = await putTask(task._id,{status:newTaskStatus});
        if(response?.success!==true ) setTaskStatus(oldTaskStatus);
    };
    return(
        <Box padding={{ xs: 1, sm: 2, md: 3, lg: 3 }} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"space-between",alignItems:"center",width:"100%" }}>
            <Grid container columns={24} spacing={2} width="100%">
                <Grid  xs={24} sm={24} md={12} lg={8} > 
                    <Paper elevation={3} style={{...paperStyle,flexShrink:0}} >
                        <Typography variant="h5">Status</Typography>
                        <Divider sx={{marginBottom:2}}/>
                        <ToggleButtonGroup
                            color="primary"
                            value={taskStatus}
                            exclusive
                            onChange={handleChangeStatus}
                            aria-label="Platform"
                            fullWidth={true}
                            >
                            <ToggleButton value="todo" style={taskStatus=="todo" ? {color:task?.color?.text, backgroundColor:task?.color?.background}:null}>Todo</ToggleButton>
                            <ToggleButton value="processing" style={taskStatus=="processing" ? {color:task?.color?.text, backgroundColor:task?.color?.background}:null}>Processing</ToggleButton>
                            <ToggleButton value="done" style={taskStatus=="done" ? {color:task?.color?.text, backgroundColor:task?.color?.background}:null}>Done</ToggleButton>
                        </ToggleButtonGroup>
                    </Paper>
                    <Paper elevation={3} style={{...paperStyle,flexGrow:10,marginTop:10}} >
                        <Typography variant="h5">Description</Typography>
                        {editTask===true?
                            <>
                                <TextareaAutosize
                                    id="name-input"
                                    placeholder="Task descriptiom"
                                    value={showTaskDescription}
                                    onChange={handleSetDescription}
                                    minRows={2}
                                />
                                <Box sx={{display:"flex", alignItems:"task-between"}}>
                                    <Button sx={{margin:1}} variant="contained" onClick={handleSubmit}>Save</Button>
                                    <Button sx={{margin:1}} variant="contained" onClick={handleCancel} color="warning" >Cancel</Button>
                                </Box>
                                
                            </>
                            :
                            <>
                            <Divider sx={{marginBottom:2}}/>
                                {showTaskDescription?.split('\n').map((e,i)=>
                                <Typography variant="body1" sx={{ fontSize: 16 }} gutterBottom key={i}>{e}</Typography>
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
                                        {showTaskDescription===""?
                                            <AddIcon />
                                            :<EditIcon />
                                        }
                                    </Fab>
                                </Zoom>
                            </>
                        }
                    </Paper>
                    <Paper elevation={3} style={{...paperStyle,flexGrow:10,marginTop:10}} >
                        <Typography variant="h5">Chart</Typography>
                        <Divider sx={{marginBottom:2}}/>
                        <Chart />
                    </Paper>
                </Grid>
                <Grid  xs={24} sm={24} md={12} lg={8}>
                <Paper elevation={3} style={paperStyle} >
                    <Typography variant="h5">Files</Typography>
                    <Divider sx={{marginBottom:2}}/>
                    <FetchFiles>
                        <FileList/>
                    </FetchFiles>
                </Paper>
                </Grid>
                <Grid  xs={24} sm={24} md={12} lg={8}> 
                <Paper elevation={3} style={paperStyle} >
                    <Typography variant="h5">Comment</Typography>
                    <Divider sx={{marginBottom:2}}/>
                    <FetchComments>
                        <Comment/>
                    </FetchComments>
                </Paper>
                </Grid>
            </Grid>
            
        </Box>
    )
}