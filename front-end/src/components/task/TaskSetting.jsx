import { Box, Button, FormControl, InputLabel, NativeSelect, Typography } from "@mui/material";
import ModalConfirm from "../modal/ModalConfirm";
import { deleteTask, putTaskColor } from "../../sevice/api";
import { useDispatch, useSelector } from "react-redux";
import { updateATask } from "../../sevice/a_task/slice";
import { createBrowserHistory } from "history";

export default function TaskSetting(prop) {
    const dispatch = useDispatch();
    const colors = useSelector(state=>state.colors)
    const task = useSelector(state=>state.a_task)
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
      const handleChangeColor = async (event)=>{
        const colorName=event.target.value
        const newColor = colors.find(element => element.name === colorName);
        const prevColor = task.color;
        if(newColor?.name!==task?.color?.name) {
            dispatch(updateATask({color:newColor}))
            const response = await putTaskColor(task._id,{name:newColor.name})
            if(response?.success!==true) dispatch(updateATask({color:prevColor}));
        }
      }
    return(
        <Box padding={3} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"task-between"}}>
            <Typography variant="h6" margin={1}gutterBottom >
                Change task color
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120, margin: 1 }} size="small" >
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Color
                </InputLabel>
                <NativeSelect
                    defaultValue={task?.color?.name}
                    inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                    }}
                    onChange={handleChangeColor}
                >
                    {colors?.map(e => 
                        <option style={{backgroundColor:e.background, color:e.text}} value={e.name} key={e.name}>{e.name}</option>
                    )}
                </NativeSelect>
            </FormControl>
            <Typography variant="h6" margin={1}gutterBottom >
                Delete this task
            </Typography>
            <Box margin={1}>
                <ModalConfirm confirm={handleDeleteTask}
                    title="Confirm to delete this task"
                    text="All tasks on the task will be moved to Alone Tasks."
                    >
                    <Button variant="contained">Delete task</Button>
                </ModalConfirm>
            </Box>
        </Box>
    )
}