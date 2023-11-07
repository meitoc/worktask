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

import Input from '@mui/material/Input';

// import LostSpace from './image/LostSpace';
export default function ASpace(prop) {
  const [activeSpace, setActiveSpace] = useState(true);
  const [editSpace, setEditSpace] = useState(false);
  const [spaceName, setSpaceName] = useState(prop.space.name);
  const [spaceDescription, setSpaceDescription] = useState(prop.space.description);
  const [showSpaceName, setShowSpaceName] = useState(prop.space.name);
  const [showSpaceDescription, setShowSpaceDescription] = useState(prop.space.description);
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
  const handleSubmitSpace = async () => {
    setEditSpace(false);
    handleCloseMore();
      setActiveSpace(false);
      const session = localStorage.getItem('loginSession');
      const data={};
      if(showSpaceName!==spaceName)data.name=spaceName;
      if(showSpaceDescription!==spaceDescription)data.description=spaceDescription;
      const body = JSON.stringify(data);
      console.log(body)
      const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${session}`,
          },
          body
        };
        fetch(`http://localhost:8000/api/space/id/${prop.space._id}`, options)
          .then(response => response.json())
          .then(response => {
            console.log(response)
              if(response.success){
                  setShowSpaceName(response.data.name)
                  setShowSpaceDescription(response.data.description)
                  console.log("Updated space")
                  setActiveSpace(true)
              }
              else setActiveSpace(true)
          })
          .catch(err => {
              console.log("Error when request delete space!")
              console.error(err);
          });
  }
  const handleDeleteSpace = async () => {
    console.log("Deleting a space...")
      handleCloseMore();
      setActiveSpace(false);
      const session = localStorage.getItem('loginSession');
      const options = {
          method: 'DELETE',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${session}`,
          }
        };
        fetch(`http://localhost:8000/api/space/id/${prop.space._id}`, options)
          .then(response => response.json())
          .then(response => {
              if(response.success){
                  console.log("Deleted space")
                  setActiveSpace(null)
              }
              else setActiveSpace(true)
          })
          .catch(err => {
              console.log("Error when request delete space!")
              console.error(err);
          });
  }
  if(activeSpace===null) return null;
  else if(activeSpace===true) return (
    <Card sx={{ width:300, display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
        <CardHeader
          action={
            <>
              <IconButton 
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
                <MenuItem onClick={handleDeleteSpace}>Delete space</MenuItem>
              </Menu>
            </>
            
          }
          title={
            editSpace?
            <Input
            sx={{fontWeight:"bold"}}
              id="name-input"
              placeholder="Space name"
              defaultValue={showSpaceName}
              onChange={(event)=>setSpaceName(event.target.value)}
            />
            :showSpaceName
            }
          subheader={`${prop.space.tasks.length} tasks`}
          />
        
        <CardContent>
          
          {
            editSpace?<Input
              id="description-input"
              multiline={true}
              maxRows={4}
              minRows={3}
              fullWidth={true}
              placeholder="Description"
              paragraph={true}
              defaultValue={showSpaceDescription}
              onChange={(event)=>setSpaceDescription(event.target.value)}
            />
            : showSpaceDescription.split('\n').map((e,i)=>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom key={i}>{e}</Typography>
            )
          }
          
          
        </CardContent>
        <CardActions>
          {editSpace?
            <Button onClick = {handleSubmitSpace}>SUBMIT CHANGE</Button>
            :<Button size="small" href={`http://localhost:5173/space/${prop.space._id}`}>EXPLORE</Button>
          }
        </CardActions>
  </Card>
  );
  else return (
    <Card sx={{ width:300, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{width:"200px"}} src='http://localhost:5173/lost-space.svg'></img>
      </Card>
  );
  
}