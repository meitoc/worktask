import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import TextField from '@mui/material/TextField';
import { deleteSpace, putSpace } from '../../sevice/api';
import { useSelector } from 'react-redux';
import ModalConfirm from '../modal/ModalConfirm';


export default function ASpace(prop) {

  const colors = useSelector(state => state.colors)
  const [activeSpace, setActiveSpace] = useState(true);
  const [editSpace, setEditSpace] = useState(false);
  const [spaceName, setSpaceName] = useState(prop.space?.name);
  const [spaceDescription, setSpaceDescription] = useState(prop.space?.description);
  const [spaceColor, setSpaceColor] = useState(prop.space?.color);
  const [showSpaceName, setShowSpaceName] = useState(prop.space.name??"");
  const [showSpaceDescription, setShowSpaceDescription] = useState(prop.space.description??"");


  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);
  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMore = () => {
    setAnchorEl(null);
  };
  const handleEditSpace = async () => {
    handleCloseMore();
    setEditSpace(true);
  }
  const handleCancel = () => {
    setSpaceColor(prop.space.color)
    setEditSpace(false);
  }
  const handleSubmitSpace = async () => {
    setEditSpace(false);
    handleCloseMore();
    setActiveSpace(false);
    const data={};
    if(showSpaceName!==spaceName)data.name=spaceName;
    if(showSpaceDescription!==spaceDescription)data.description=spaceDescription;
    if(spaceColor.name!==prop.space.color)data.color=spaceColor.name;
    console.log(data)
    const response = await putSpace(prop.space._id,data)
    if(response?.success===true){
      setShowSpaceName(response.data.name)
      setShowSpaceDescription(response.data.description)
      setActiveSpace(true)
      prop.fnUpdate(response.data)
      console.log("Updated space")
    }
    else{
      setSpaceColor(prop.space.color)
      setActiveSpace(true)
    }
  }
  const handleDeleteSpace = async () => {
    handleCloseMore();
    setActiveSpace(false);
    const response = await deleteSpace(prop.space._id)
    console.log(response)
    if(response?.success===true){
      console.log("Deleted space")
      setActiveSpace(null)
      prop.fnDelete(prop.space._id)
      }
      else setActiveSpace(true)
  }
  const handleChangeColor = (event)=>{
    const colorName=event.target.value
    setSpaceColor(colors.find(element => element.name === colorName))
  }
  if(activeSpace===null) return null;
  else if(activeSpace===true) return (
    <Card sx={{ borderRadius:4, width:300, minHeight:350, display:"flex", flexDirection:"column", justifyContent:"space-between", color:spaceColor?.text, backgroundColor:spaceColor?.background}}>
        <CardHeader
          color={spaceColor?.text}
          action={
            <>
              <IconButton 
              sx={{color:spaceColor?.text}}
              aria-label="settings"
              onClick={handleClickMore}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                open={openMore}
                onClose={handleCloseMore}
                >
                <MenuItem onClick={handleEditSpace}>Edit</MenuItem>
                <ModalConfirm confirm={handleDeleteSpace} cancel={handleCloseMore}
                  title="Confirm to delete this space"
                  text="All tasks on the space will be moved to Alone Tasks."
                >
                  <MenuItem >Delete space</MenuItem>
                </ModalConfirm>
              </Menu>
            </>
            
          }
          title={
            editSpace?
            <TextField
              id="name-input"
              fullWidth={true}
              placeholder="Space name"
              defaultValue={spaceName}
              onChange={(event)=>setSpaceName(event.target.value)}
            />
            :showSpaceName
            }
          subheader={<p style={{color:spaceColor.text}}>{`${prop.space.tasks?.length??0} tasks`}</p>}
          />
        
        <CardContent color={spaceColor?.text}>
          
          {
            editSpace?
            <>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Color
                </InputLabel>
                <NativeSelect
                  defaultValue={"default"}
                  inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                  }}
                  onChange={handleChangeColor}
                >
                  {colors.map(e => 
                    <option style={{backgroundColor:e.background, color:e.text}} value={e.name} key={e.name}>{e.name}</option>
                  )}
                </NativeSelect>
              </FormControl>
              <TextField
                id="description-input"
                multiline={true}
                maxRows={3}
                minRows={1}
                fullWidth={true}
                placeholder="Description"
                defaultValue={showSpaceDescription}
                onChange={(event)=>setSpaceDescription(event.target.value)}
              />
            </>
            : showSpaceDescription?.split('\n').map((e,i)=>
            <Typography sx={{ fontSize: 14 }} color={spaceColor?.text} gutterBottom key={i}>{e}</Typography>
            )
          }
          
          
        </CardContent>
        <CardActions sx={{display:"flex", justifyContent:"space-between"}}>
          {editSpace?
            <>
            <Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} onClick = {handleSubmitSpace}>SUBMIT CHANGE</Button>
            <Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} onClick = {handleCancel}>CANCEL</Button>
            </>
            :<Button sx={{color:spaceColor?.text, backgroundColor:spaceColor?.frame}} href={`http://localhost:5173/space/${prop.space?._id}`}>EXPLORE</Button>
          }
        </CardActions>
  </Card>
  );
  else return (
    <Card sx={{ borderRadius:4, width:300, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{width:"200px"}} src='http://localhost:5173/lost-space.svg'></img>
      </Card>
  );
  
}