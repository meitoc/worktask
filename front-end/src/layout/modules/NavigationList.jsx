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

import Divider from '@mui/material/Divider';

import { ContextStatus } from '../../App';



export default function NavigationList() {
    const {mobile, handleDrawerClose,loginStatus, setShowLoginForm} = useContext(ContextStatus);
    const navList = [
        // viewByLogin: true: only be shown when logged in / false: only be shown when logged out / not set: always be shown
        {text:'Home page', link: "", icon: (<WhatshotIcon />), viewByLogin: false},
        {text:'Login to use', fn: ()=>setShowLoginForm(true), icon: (<LoginIcon />), viewByLogin: false},
        {text:'Spaces', link: "/", icon: (<RocketLaunchIcon />), viewByLogin: true},
        {text:'Alone Tasks', link: "/alone-tasks", icon: (<AssignmentIcon />), viewByLogin: true},
        {icon:(<Divider />)},
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
                    (element.viewByLogin===undefined) || !(element.viewByLogin===true ^ loginStatus===true) ?(
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