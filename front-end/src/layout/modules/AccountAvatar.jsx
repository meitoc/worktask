import { Link } from 'react-router-dom';
import { useContext,useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import Badge from '@mui/material/Badge';
// import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { ContextStatus } from '../../App';
import { useSelector } from 'react-redux';

export default function AccountAvatar() {
    const { setShowLoginForm} = useContext(ContextStatus);
    const userInfo = useSelector(state=>state.user_info)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        {userInfo?
        <>
          <Button  onClick={handleClick} >
            <Avatar 
              sx={{ width: 27, height: 27}}
              alt={userInfo.name}
              src=""//Change this later to view
            
            /> 
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Link to="/account" style={{ textDecoration: 'none', color: "inherit" }} >
              <MenuItem onClick={handleClose}>
                Profile
              </MenuItem>
            </Link>
            <Link to="/setting" style={{ textDecoration: 'none', color: "inherit" }} >
              <MenuItem onClick={handleClose}>
                Setting
              </MenuItem>
            </Link>
            <Link to="/logout" style={{ textDecoration: 'none', color: "inherit" }} >
              <MenuItem onClick={handleClose}>
                Logout
              </MenuItem>
            </Link>
          </Menu>
        </>
        :
          <p onClick={()=>setShowLoginForm(true)} style={{cursor: 'pointer'}}>Login</p>}
      
      </>
    );
}