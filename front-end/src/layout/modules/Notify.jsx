import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { Button, List, Menu } from '@mui/material';
import { useEffect, useState } from 'react';
import { getNotify } from '../../sevice/api';
import { useSelector } from 'react-redux';
import ANotify from './ANotify';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Notify() {
    const userInfo = useSelector(state=>state.user_info)
    const [notifies, setNotifies] = useState([])
    const unreadNotify = notifies.filter(e=>e.readBy?.some(u=>u.name!==userInfo.name))
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    useEffect(() => {
        const fetchData = async ()=>{
            const response = await getNotify()
            if(response?.success===true) {
                const listNotify = response.data
                setNotifies(listNotify)
                console.log("IIIIIIII",listNotify)
            }
            setTimeout( fetchData, 15000);
        }
         fetchData()
    }, []);
    return (
        <>
            {userInfo?
            <>
                <Button onClick={handleClick}  >
                    <Badge badgeContent={unreadNotify?.length??0} color="primary"  sx={{ width: 27, height: 27}} max={9}>
                        <MailIcon color="action" />
                    </Badge>
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
                    <List style={{display:"flex",flexDirection:"column"}}>
                    {
                        notifies.map(notify=>{
                            return (<ANotify notify={notify} key={notify._id} close={handleClose} />)
                        })
                    }
                    </List>
                </Menu>
                </>
            :null}
        </>
    );
}