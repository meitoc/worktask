import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { Button, List, Menu } from '@mui/material';
import { useEffect, useState } from 'react';
import { getNotify, getOtherUserInfo } from '../../sevice/api';
import { useDispatch, useSelector } from 'react-redux';
import ANotify from './ANotify';
import { addOtherUsers } from '../../sevice/other_users/slice';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Notify() {
    const otherUsers = useSelector(state=>state.other_users)
    const dispatch = useDispatch();
    const userInfo = useSelector(state=>state.user_info)
    const [notifies, setNotifies] = useState([])
    const [unreadNotify,setUnreadNotify] = useState(notifies.filter(e=>!e.readBy?.some(u=>u.name==userInfo.name))?.length)
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
                const listNotify = response.data.filter(e=>e.task!==null)
                setNotifies(listNotify)
            }
            setTimeout( fetchData, 10000);
        }
         fetchData()
    }, []);
    useEffect(()=>{
        const userList = Array.from(new Set(notifies.map(e=>e.user?.name).filter(e=>e!==userInfo?.name)))
        userList.forEach(async (name)=>{
            if(!otherUsers.some(e=>e.name===name)){
                const response = await getOtherUserInfo(name);
                if(response?.success===true)
                dispatch(addOtherUsers([response.data]))
            }
        })
    },[notifies,dispatch,otherUsers,userInfo.name])
    return (
        <>
            {userInfo?
            <>
                <Button onClick={handleClick}  >
                    <Badge badgeContent={unreadNotify??0} color="primary"  sx={{ width: 27, height: 27}} max={9}>
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
                    {notifies?.length===0?
                        <p>Empty notify box.</p>
                        :<List style={{display:"flex",flexDirection:"column"}}>
                            {
                                notifies.map(notify=>{
                                    return (
                                    <ANotify
                                        notify={notify}
                                        key={notify._id}
                                        close={handleClose}
                                        add={()=>setUnreadNotify(unreadNotify+1)}
                                        remove={()=>setUnreadNotify(unreadNotify-1)} 
                                    />
                                    )
                                })
                            }
                        </List>
                    }
                </Menu>
                </>
            :null}
        </>
    );
}