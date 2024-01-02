import { Chip, Divider, FormControlLabel, IconButton, Paper, Popper, Radio, RadioGroup, Skeleton, TextField, Typography } from "@mui/material";
import AUser from "./AUser";
// import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DoneIcon from '@mui/icons-material/Done';
import { useEffect, useState } from "react";
import { getUser } from "../../sevice/api";
import LensIcon from '@mui/icons-material/Lens';

export default function AddUser(prop) {
  const [textValue,setTextValue] = useState("")
  const [searchtype,setSearchType] = useState("name")
  const [foundUser,setFoundUser] = useState([])
  const [fetchingUser,setFetchingUser] = useState(false)
  const [loading,setLoading] = useState(false)
  //For popper
  const [anchorEl, setAnchorEl] = useState(null);
  const handleChangeText = (event) => {
    setTextValue(event.target.value)
    if(event.target.value==="")setAnchorEl(null);
    else setAnchorEl(event.currentTarget)
  };
  const openPopper = Boolean(anchorEl);
  const id = openPopper ? 'simple-popper' : undefined;
  const handleClosePoper = ()=>{
    setAnchorEl(null)
    setTextValue("")
    setFoundUser([])
  }
  const choseUser = async (user)=>{
    setLoading(true)
    const result = await prop.addUser({user,role:prop.role})
    // setAnchorEl(null)
    if(!result) setLoading(false)
    else {
      setLoading(false)
      handleClosePoper();
    }
  }
  const handleSearch= async()=>{
    setFetchingUser(true)
    const response = await getUser(searchtype,textValue)
    if(response?.success===true){
      setFetchingUser(false)
      const newUsers = response.data?.users?.filter(e=>!prop.exclude.some(u=>u.name===e.name))
      setFoundUser(newUsers??[])
    } else setFetchingUser(false)
  }
  useEffect(()=>{
    console.log(prop.display)
    if(!prop.display) handleClosePoper()
  },[prop.display]) 
  return (
    prop.disabled?null:
    <>
    <div style={{width:150}}>
        <Chip
          disabled={prop.disabled}
          color="primary"
          deleteIcon={anchorEl===null?<LensIcon/>:null}
          label={
            <>
              <TextField
                color="primary" variant="standard"
                onChange={handleChangeText}
                value={textValue}
                aria-describedby={id}
                onKeyDown={(event)=>{if(event.key==="Enter") handleSearch()}}
                placeholder="Add"
              />
              <Popper id={id} open={openPopper} anchorEl={anchorEl}>
              <Paper elevation={5} sx={{p:2, bgcolor:'secondary'}} >
                  <Typography >{prop.errors?.map((e)=>(
                            e
                        ))
                    }</Typography>
                <div style={{display:"flex", flexDirection:"row"}}>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={searchtype}
                    onChange={(event)=>setSearchType(event.target.value)}
                  >
                    <FormControlLabel value="name" control={<Radio />} label="Username" />
                    <FormControlLabel value="real_name" control={<Radio />} label="Name" />
                  </RadioGroup>
                  <IconButton aria-label="delete" size="large" onClick={handleSearch} >
                    <SearchIcon fontSize="inherit" />
                  </IconButton>
                </div>
                <Divider style={{marginBottom:5}}/>
                {
                fetchingUser?
                <>
                  <Skeleton />
                  <Skeleton width="60%" />
                </>
                :
                <div style={{maxWidth:350}}>
                  {foundUser.map(user=><AUser key={user.name} user={user} deleteIcon={<DoneIcon />} onDelete={()=>choseUser(user.name)} loading={loading} />)}
                </div>
                }
              </Paper>
              </Popper>
            </>
          }
          variant="filled"
          onDelete={handleClosePoper}
        />
    </div>
    </>
  );
}