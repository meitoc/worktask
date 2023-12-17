import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import ModalConfirm from "../modal/ModalConfirm";
import { deleteSpace, putSpaceColor } from "../../sevice/api";
import { useDispatch, useSelector } from "react-redux";
import { updateASpace } from "../../sevice/a_space/slice";
import { createBrowserHistory } from "history";
import { GithubPicker } from "react-color";

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
      const handleChangeColor = async (color)=>{
        const backgroundColor=`rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
        const newColor = colors.find(element => element.background === backgroundColor);
        const prevColor = space.color;
        if(newColor?.name!==space?.color?.name) {
            dispatch(updateASpace({color:newColor}))
            const response = await putSpaceColor(space._id,{name:newColor.name})
            if(response?.success!==true) dispatch(updateASpace({color:prevColor}));
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
    return(
        <Box padding={3} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"space-between"}}>
            <Paper elevation={3} style={paperStyle} >
                <Typography variant="h6" margin={1}gutterBottom >
                    Change space color
                </Typography>
                <GithubPicker
                    colors={colors?.map(e=>e.background)}
                    onChange={handleChangeColor}
                    disableAlpha={true}
                    className="github-color-picker"
                />
                <Divider style={{marginTop:15}} />
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
            </Paper>
        </Box>
    )
}