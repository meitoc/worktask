import * as React from 'react';
// import { Outlet } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Logo } from '../components/small-component/Logo';
import Footer from '../components/small-component/Footer';
import Drawer from '@mui/material/Drawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import NavigationList from './modules/NavigationList';
import AccountAvatar from './modules/AccountAvatar';

// import { checkSession } from '../features/authentication/checkSession';
import { ContextStatus } from '../App';
import { Outlet } from 'react-router-dom';
// import CheckUserSession from '../features/authentication/CheckUserSession';
import FetchUserData from '../features/fetch-data/FetchUserData';
import LoginForm from '../components/form/LoginForm';
import Notify from './modules/Notify';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

let drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    // width: window.innerWidth,
    paddingTop: 10,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        // width: (window.innerWidth-drawerWidth),
        transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Layout() {
  const userInfo = useSelector(state=>state.user_info)
  const { setShowLoginForm} = React.useContext(ContextStatus);
    const { darkMode,mobile, setMobile, showLoginForm}= React.useContext(ContextStatus);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    //============
    React.useEffect(()=>{
        const handleResize = ()=>{
          setMobile((parseInt(screen.width))<500);
      }
      window.addEventListener('resize', handleResize);
      window.addEventListener('onload', handleResize);
    },[setMobile])
    if(mobile) drawerWidth=parseInt(screen.width);
    else drawerWidth=240;
    //============
    const darkTheme = createTheme({
        palette: {
            mode: darkMode?'dark':'light',
        },
      });
    //============
    const handleDrawerClose = () => {
        setOpen(false);
    };
    
    return (
        <ThemeProvider theme={darkTheme}>
            <FetchUserData>
              <Box display= 'flex' justifyContent='center' style={{overflowX: "hidden", width:"100%"}}>
                  <CssBaseline />
                  <AppBar position="fixed" open={open}>
                      <Toolbar sx={{ display: 'flex', flexWrap: "noWrap" , justifyContent: 'space-between', }}>
                      <IconButton
                          color="red"
                          aria-label="open drawer"
                          onClick={handleDrawerOpen}
                          edge="start"
                          sx={{ mr: 2, ...(open && { visibility: 'hidden' }) }}
                      >
                          <MenuIcon />
                      </IconButton>
                      <Logo />
                      <Box
                          sx={{display: "flex", alignItems:"center", flexWrap: "nowrap"}}
                      >
                        {userInfo?
                          <>
                            <Notify />
                            <AccountAvatar />
                          </>
                          : <Button variant='primary' onClick={()=>setShowLoginForm(true)} style={{cursor: 'pointer'}}>Login</Button>
                        }
                      </Box>
                      </Toolbar>
                  </AppBar>
                  <Drawer
                      sx={{
                      width: drawerWidth,
                      flexShrink: 0,
                      '& .MuiDrawer-paper': {
                          width: drawerWidth,
                          boxSizing: 'border-box',
                      },
                      }}
                      variant="persistent"
                      anchor="left"
                      open={open}
                  >
                      <DrawerHeader>
                          <IconButton onClick={handleDrawerClose}>
                              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                          </IconButton>
                      </DrawerHeader>
                      <Divider />
                      <NavigationList />
                  </Drawer>
                  <Main open={open} style={{display: "flex", flexDirection:"column", alignItems:"center", width: mobile?drawerWidth:'100%' }} >
                      <DrawerHeader />
                      <Container
                        maxWidth="100%"
                        style={{
                          display: 'flex',
                          flexDirection:'column',
                          alignItems: 'center',
                          padding:0,
                          margin:0
                      }}
                      >
                        <Outlet />
                      </Container>
                      {showLoginForm?(<LoginForm goBack={false}/>):null}
                      <Footer />
                  </Main>
              </Box>
            </FetchUserData>
      </ThemeProvider>
    );
}
  