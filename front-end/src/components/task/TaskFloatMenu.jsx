import * as React from 'react';

import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TaskSetting from './TaskSetting';
import { useSelector } from 'react-redux';
import TaskList from '../task/TaskList';
import TaskDetail from './TaskDetail';


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

export default function TaskFloatMenu() {
  const task = useSelector(state=>state.a_task)
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
          <Tab label="Detail" {...a11yProps(0)} />
          <Tab label="Child Tasks" {...a11yProps(1)} />
          <Tab label="Setting" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TaskDetail display={value===0} />
        <TaskList onType="task" onId={task._id} tasks={task.tasks??[]} display={value===1} ></TaskList>
        <TaskSetting display={value===2} />
      </SwipeableViews>
    </Box>
  );
}