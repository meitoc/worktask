import { Box, Button, Divider, FormControlLabel, Paper, Radio, RadioGroup, Switch, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import ModalConfirm from "../modal/ModalConfirm";
import { deleteTask, putTask, putTaskColor } from "../../sevice/api";
import { useDispatch, useSelector } from "react-redux";
import { updateATask } from "../../sevice/a_task/slice";
import { createBrowserHistory } from "history";
import { GithubPicker } from 'react-color';

// import TeamAndRole from "./TeamAndRole";
// import TeamAndRole from "./TeamAndRole";
import TeamAndRole from "./TeamAndRole";

export default function TaskSetting(prop) {
    const dispatch = useDispatch();
    const colors = useSelector(state=>state.colors)
    const task = useSelector(state=>state.a_task)
    const userName = useSelector(state=>state.user_info.name)
    const userRole = task.users?.owners?.some(e=>e.name===userName)?"owner":task.users?.managers?.some(e=>e.name===userName)?"manager":"member";
    const history = createBrowserHistory()
    const handleDeleteTask = async () => {
        const response = await deleteTask(task._id)
        console.log(response)
        if(response?.success===true){
          console.log("Deleted task")
          history.push("/");
          window.location.reload();
        }
      }
      const handleChangeColor = async (color)=>{
        const backgroundColor=`rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
        const newColor = colors.find(element => element.background === backgroundColor);
        const prevColor = task.color;
        if(newColor?.name!==task?.color?.name) {
            dispatch(updateATask({color:newColor}))
            const response = await putTaskColor(task._id,{name:newColor.name})
            if(response?.success!==true) dispatch(updateATask({color:prevColor}));
        }
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

    const handleMemberAddMember = async (event)=>{
        const response = await putTask(task._id, {member_add_member:event.target.checked})
        if(response?.success===true){
            dispatch(updateATask({member_add_member:event.target.checked}))
        }
    }
    const handleChangeLock = async (event)=>{
        const access_locked = event.target.value==="access_locked";
        const edit_locked = event.target.value==="edit_locked";
        const response = userRole==="owner"? await putTask(task._id, {edit_locked,access_locked})
            :userRole==="manager"? await putTask(task._id, {edit_locked})
            : null;
        if(response?.success===true){
            dispatch(updateATask({edit_locked,access_locked}))
        }
    }
    return(
        <Box padding={{ xs: 1, sm: 2, md: 3, lg: 3 }} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"space-between",alignItems:"space-between",width:"100%" }}>
        <Grid container columns={24} spacing={2} width="100%" >
            <Grid xs={24} sm={24} md={12} lg={8} >
                <Paper elevation={3} style={paperStyle} >
                    <div style={{display:userRole==="member"?"none":"flex", flexDirection:"column"}}>
                        <Typography variant="h6" margin={1}gutterBottom >
                            Change task color
                        </Typography>
                        <GithubPicker
                            colors={userRole==="member"?[]:colors?.map(e=>e.background)}
                            onChange={handleChangeColor}
                            disableAlpha={true}
                            className="github-color-picker"
                        />
                        <Divider style={{marginTop:15}} />
                    </div>
                    <Typography variant="h6" margin={1}gutterBottom >
                        Allow member add member
                    </Typography>
                    <Switch disabled={userRole==="member"} defaultChecked={task.member_add_member===true} onChange={handleMemberAddMember}/>
                    <Divider style={{marginTop:15}} />
                    <Typography variant="h6" margin={1}gutterBottom >
                        Lock task
                    </Typography>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue={task.access_locked===true?"access_locked":task.edit_locked===true?"edit_locked":"none"}
                        onChange={handleChangeLock}
                    >
                        <FormControlLabel disabled={userRole==="member"} value="none" control={<Radio />} label="none" />
                        <FormControlLabel disabled={userRole==="member"} value="edit_locked" control={<Radio />} label="lock edit" />
                        <FormControlLabel disabled={userRole!=="owner"} value="access_locked" control={<Radio />} label="lock access" />
                    </RadioGroup>
                    <Divider style={{marginTop:15}} />
                    <Typography  variant="h6" margin={1} gutterBottom >
                        Delete this task
                    </Typography>
                    <Box margin={1} >
                        <ModalConfirm disabled={userRole==="member"}  confirm={handleDeleteTask}
                            title="Confirm to delete this task"
                            text="All tasks on the task will be moved to Alone Tasks."
                        >
                            <Button disabled={userRole==="member"}  variant="contained" color="warning">Delete task</Button>
                        </ModalConfirm>
                    </Box>
                </Paper>
            </Grid>
            <Grid xs={24} sm={24} md={12} lg={16} >
                <Paper elevation={3} style={paperStyle} >
                    <Typography variant="h6" margin={1}gutterBottom >
                        Role
                    </Typography>
                    <TeamAndRole display={prop.display}></TeamAndRole>
                </Paper>
            </Grid>
        </Grid>
        </Box>
    )
}