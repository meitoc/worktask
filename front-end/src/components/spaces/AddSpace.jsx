import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';

import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from 'react-redux';
import { addToSpaces } from '../../sevice/spaces/slice';
import { postSpace } from '../../sevice/api';
import { Divider } from '@mui/material';
import { GithubPicker } from 'react-color';
const {VITE_FRONT_END_BASE_URL} = import.meta.env
// import LostSpace from './image/LostSpace';
export default function AddSpace() {

  const colors = useSelector(state => state.colors)
  const [activeSpace, setActiveSpace] = useState(null);
  const [spaceName, setSpaceName] = useState("");
  const [spaceDescription, setSpaceDescription] = useState("");
  const [spaceColor, setSpaceColor] = useState({name:"default",frame:"rgb(100,100,150)",background:"rgb(210,210,255)",text:"rgb(10,10,0)"});
    
  const dispatch = useDispatch();

  const shandleAddSpace = async () => {
    setActiveSpace(true);
  }
  const handleCanel = () => {
    setSpaceName("");
    setSpaceDescription("");
    setActiveSpace(null)
  }
  const handleSubmitSpace = async () => {
      setActiveSpace(false);
      const data={
        name:spaceName,
        description:spaceDescription,
        color:spaceColor.name
      };
      const response = await postSpace(data)
      if(response?.success===true){
          console.log("Created space")
          setSpaceName("");
          setSpaceDescription("");
          setSpaceColor({name:"default",frame:"rgb(100,100,150)",background:"rgb(210,210,255)",text:"rgb(10,10,0)"});
          setActiveSpace(null)
          dispatch(addToSpaces(response.data))
      }
      else {
        setSpaceName("");
        setSpaceDescription("");
        setActiveSpace(true);
      }
  }
  const handleChangeColor = (color)=>{
    const backgroundColor=`rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
    setSpaceColor(colors.find(element => element.background === backgroundColor))
  }
  if(activeSpace===true) return (
    <Card sx={{ width:"100%", maxWidth:300, minHeight:150, borderRadius:5, display:"flex", flexDirection:"column", justifyContent:"space-between", color:spaceColor?.text, backgroundColor:spaceColor?.background}}>
      <CardHeader
      title={
        <TextField
          inputProps={{
            style: { color: spaceColor.text, fontWeight:"bold" }
          }}
          id="name-input"
          fullWidth={true}
          placeholder="Space name"
          onChange={(event)=>setSpaceName(event.target.value)}
        />}
      />
    
    <CardContent>
      <GithubPicker
        colors={colors?.map(e=>e.background)}
        onChange={handleChangeColor}
        disableAlpha={true}
        className="github-color-picker"
      />
      <Divider style={{marginTop:15}} />
      <TextField
          inputProps={{
            style: { color: spaceColor.text }
          }}
          id="outlined-multiline-flexible"
          multiline
          maxRows={4}
          minRows={3}
          fullWidth={true}
          placeholder="Description"
          onChange={(event)=>setSpaceDescription(event.target.value)}
        />
    </CardContent>
    <CardActions sx={{display:"flex", justifyContent:"space-between"}}>
      <Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} onClick = {handleSubmitSpace}>SUBMIT</Button>
      <Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} onClick = {handleCanel} color="warning" >CANCEL</Button>
    </CardActions>
    </Card>);
  else {
    if(activeSpace===null) return (
    <Card sx={{ width:"100%", maxWidth:300, minHeight:150, borderRadius:5, display:"flex", flexDirection:"column", justifyContent:"space-between"}}> 
      <ButtonBase onClick={shandleAddSpace} >
        <img style={{width:"100%", maxHeight:210}} src={`${VITE_FRONT_END_BASE_URL}/add-space.svg`}></img>
      </ButtonBase>
    </Card>
    );
    else return (
    <Card sx={{ width:"100%", maxWidth:300, minHeight:150, borderRadius:5, display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
      <img style={{width:"100%", maxHeight:20}} src={`${VITE_FRONT_END_BASE_URL}/lost-space.svg`}></img>
    </Card>
    );
  }
}