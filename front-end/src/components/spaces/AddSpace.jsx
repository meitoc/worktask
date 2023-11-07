import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';

import Input from '@mui/material/Input';

// import LostSpace from './image/LostSpace';
export default function AddSpace(prop) {
  const {fn} =prop;
  const [activeSpace, setActiveSpace] = useState(null);
  const [spaceName, setSpaceName] = useState("");
  const [spaceDescription, setSpaceDescription] = useState("");
  const shandleAddSpace = async () => {
    setActiveSpace(true);
  }
  const handleSubmitSpace = async () => {
      setActiveSpace(false);
      const session = localStorage.getItem('loginSession');
      const data={
        name:spaceName,
        description:spaceDescription
      };
      const body = JSON.stringify(data);
      console.log(body)
      const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${session}`,
          },
          body
        };
        fetch(`http://localhost:8000/api/space`, options)
          .then(response => response.json())
          .then(response => {
            console.log(response)
            if(response.success){
              
                console.log("Created space")
                setActiveSpace(null)
            }
            else setActiveSpace(true)
            fn();
          })
          .catch(err => {
              console.log("Error when request add space!")
              console.error(err);
          });
  }
 
    if(activeSpace===true) return (
      <Card sx={{ width:300, display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
        <CardHeader
        title={
          <Input
          sx={{fontWeight:"bold"}}
            id="name-input"
            placeholder="Space name"
            onChange={(event)=>setSpaceName(event.target.value)}
          />}
        />
      
      <CardContent>
        <Input
            id="description-input"
            multiline={true}
            maxRows={4}
            minRows={3}
            fullWidth={true}
            placeholder="Description"
            paragraph={true}
            onChange={(event)=>setSpaceDescription(event.target.value)}
          />
      </CardContent>
      <CardActions>
        <Button onClick = {handleSubmitSpace}>SUBMIT NEW SPACE</Button>
      </CardActions>
    </Card>);
  else if(activeSpace===null) return (
  <Card sx={{ width:300, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
    <ButtonBase onClick={shandleAddSpace} >
      <img style={{width:"200px"}} src='http://localhost:5173/add-space.svg'></img>
    </ButtonBase>
  </Card>
  );
  else return (
  <Card sx={{ width:300, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
      <img style={{width:"200px"}} src='http://localhost:5173/lost-space.svg'></img>
  </Card>
  );
}