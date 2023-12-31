import { useContext } from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LoginIcon from '@mui/icons-material/Login';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import InfoIcon from '@mui/icons-material/Info';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpIcon from '@mui/icons-material/Help';
import PolicyIcon from '@mui/icons-material/Policy';
import Divider from '@mui/material/Divider';

import { ContextStatus } from '../../App';
import { useSelector } from 'react-redux';
import { Badge } from '@mui/material';



export default function NavigationList() {
    const userInfo = useSelector(state=>state.user_info);
    const memberTasks = useSelector(state => state.member_tasks);
    const ownerTasks = useSelector(state => state.owner_tasks);
    const spaces = useSelector(state => state.spaces);
    const numberSharedTask = memberTasks?.filter(task=>!spaces?.some(space=>space?.tasks?.includes(task._id))).length??0
    const numberAloneTask = ownerTasks?.filter(task=>!spaces?.some(space=>space?.tasks?.includes(task._id))).length??0
    const {mobile, handleDrawerClose, setShowLoginForm} = useContext(ContextStatus);
    const navList = [
        // viewByLogin: true: only be shown when logged in / false: only be shown when logged out / not set: always be shown
        {text:'Home page', link: "", icon: (<WhatshotIcon />), viewByLogin: false},
        {text:'Login to use', fn: ()=>setShowLoginForm(true), icon: (<LoginIcon />), viewByLogin: false},
        {text:'Spaces', link: "/", icon: (<RocketLaunchIcon />), viewByLogin: true},
        {text:'Alone Shared Tasks', link: "/alone-shared-tasks", icon: (<Badge badgeContent={numberSharedTask} color="primary"><AssignmentIcon /></Badge>), viewByLogin: true},
        {text:'Your Alone Tasks', link: "/your-alone-tasks", icon: (<Badge badgeContent={numberAloneTask} color="primary"><AssignmentIcon /></Badge>), viewByLogin: true},
        {icon:(<Divider />)},
        {text:'Policy', link: "/policy", icon: (<PolicyIcon />)},
        {text:'Help', link: "/help", icon: (<HelpIcon />)},
        {text:'About Us', link: "/about-us", icon: (<InfoIcon />)},
    ];
    const ListItemInside = (prop)=>{
        return(
            <ListItemButton
                sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                }}
            >
                <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                }}
                >
                    {prop.icon}
                </ListItemIcon>
                <ListItemText primary={prop.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        )
    }
    return (
        <>
            <List>
                {navList.map((element,index) => (
                    (element.viewByLogin===undefined) || !(element.viewByLogin===true ^ (userInfo!==null && userInfo!==false)) ?(
                        <ListItem key={index} disablePadding sx={{ display: 'block' }} 
                        >
                            {element.text===undefined?
                            (<>{element.icon}</>)
                            :
                                <Link to={element.link}
                                style={{ textDecoration: 'none' , color: 'inherit'}}
                                onClick={()=>{
                                    if(typeof element.fn === "function") element.fn();// handleDrawerClose();
                                    if(mobile) handleDrawerClose();//use only for mobile. when you enable this, please clear the line before, and add mobile to useContext
                                }}
                                >
                                    <ListItemInside text={element.text} icon={element.icon} />
                                </Link>
                            }
                            {element.child!==undefined? element.child : ""}
                        </ListItem>
                    )
                    :
                    ""
                ))}
            </List>
        </>
    )
}