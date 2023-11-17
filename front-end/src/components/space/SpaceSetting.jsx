import { Box, Button, FormControl, InputLabel, NativeSelect, Typography } from "@mui/material";
import ModalConfirm from "../modal/ModalConfirm";
import { deleteSpace, putSpaceColor } from "../../sevice/api";
import { useDispatch, useSelector } from "react-redux";
import { updateASpace } from "../../sevice/a_space/slice";
import { createBrowserHistory } from "history";

export default function SpaceSetting(prop) {
    const dispatch = useDispatch();
    const colors = useSelector(state=>state.colors)
    const space = useSelector(state=>state.a_space)
    const history = createBrowserHistory()
    const handleDeleteSpace = async () => {
        const response = await deleteSpace(space._id)
        console.log(response)
        if(response?.success===true){
          console.log("Deleted space")
          history.push("/");
          window.location.reload();
        }
      }
      const handleChangeColor = async (event)=>{
        const colorName=event.target.value
        const newColor = colors.find(element => element.name === colorName);
        const prevColor = space.color;
        if(newColor?.name!==space?.color?.name) {
            dispatch(updateASpace({color:newColor}))
            const response = await putSpaceColor(space._id,{name:newColor.name})
            if(response?.success!==true) dispatch(updateASpace({color:prevColor}));
        }
      }
    return(
        <Box padding={3} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"space-between"}}>
            <Typography variant="h6" margin={1}gutterBottom >
                Change space color
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120, margin: 1 }} size="small" >
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Color
                </InputLabel>
                <NativeSelect
                    defaultValue={space?.color?.name}
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
                Delete this space
            </Typography>
            <Box margin={1}>
                <ModalConfirm confirm={handleDeleteSpace}
                    title="Confirm to delete this space"
                    text="All tasks on the space will be moved to Alone Tasks."
                    >
                    <Button variant="contained">Delete space</Button>
                </ModalConfirm>
            </Box>
        </Box>
    )
}