import * as React from 'react';

import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import Zoom from '@mui/material/Zoom';
// import Fab from '@mui/material/Fab';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import UpIcon from '@mui/icons-material/KeyboardArrowUp';
// import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import SpaceSetting from './SpaceSetting';
import { useSelector } from 'react-redux';
import TaskList from '../task/TaskList';
import SpaceDetail from './SpaceDetail';
// import TabPanel from './TabPanel';



function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

// const fabStyle = {
//   position: 'absolute',
//   bottom: 16,
//   right: 16,
// };

// const fabGreenStyle = {
//   color: 'common.white',
//   bgcolor: green[500],
//   '&:hover': {
//     bgcolor: green[600],
//   },
// };

export default function SpaceFloatMenu() {
  const space = useSelector(state=>state.a_space)
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  // const [descriptionEdit, setDescriptionEdit] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box
      sx={{
        // bgcolor: 'background.paper',
        width: "100%",
        position: 'relative',
        minHeight: 200,
        maxHeigt:"100%"
      }}
    >
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab label="Tasks" {...a11yProps(0)} />
          <Tab label="Detail" {...a11yProps(1)} />
          <Tab label="Setting" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TaskList onType="space" onId={space._id} tasks={space.tasks??[]} display={value===0} ></TaskList>
        <SpaceDetail display={value===1} />
        <SpaceSetting display={value===2} />
      </SwipeableViews>
    </Box>
  );
}