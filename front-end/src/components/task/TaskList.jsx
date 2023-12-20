import  {  useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { Box, Fab, Paper, Skeleton, Zoom} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import ATask from "./ATask";
import { getTaskList, putSpace, putTask } from "../../sevice/api";
import { useTheme } from "@emotion/react";
import AddIcon from '@mui/icons-material/Add';
import AddTask from "./AddTask";
import { useDispatch, useSelector } from "react-redux";
import { updateTasks } from "../../sevice/tasks/slice";



export default function TaskList(prop) {
  const dispatch = useDispatch()
  const theme = useTheme();
  const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };
  // const [tasks,setTasks] = useState(null);
  const tasks = useSelector(state=>state.tasks)
  const [columns, setColumns] = useState(null);
  const [activeAdd, setActiveAdd] = useState(null);

  useEffect(() => {
    const fetchTasks = async()=>{
        const response = await getTaskList(prop.tasks);
        if(response?.success===true){
          const tasks = response.data
          const taskStatus = {
            todo: {
              name: "Todo",
              items: tasks?.filter(e=>e.status!=="processing" && e.status!=="done")??[]
            },
            processing: {
              name: "Processing",
              items: tasks?.filter(e=>e.status==="processing")??[]
            },
            done: {
              name: "Done",
              items: tasks?.filter(e=>e.status==="done")??[]
            }
          };
          // setTasks(tasks);
          dispatch(updateTasks(tasks))
          setColumns(taskStatus)
        } else {
          dispatch(updateTasks([]))
          // setTasks([]);
        }
    }
    if(Array.isArray(prop.tasks)) fetchTasks();
  }, [prop.tasks,dispatch]);

  // 
  const updateTask = async (id,data)=>{
    console.log(id ,data)
    const response = await putTask(id,data);
    if(response?.success===true) {
      return true;
    }
    else {
      return false;
    }
  }
  const updateSpace = async (id,data)=>{
    console.log(id ,data)
    const response = await putSpace(id,data);
    if(response?.success===true) {
      console.log(response);
      return true;
    }
    else {
      return false;
    }
  }
  // FOR DRAP FUNCTION
  const onDragEnd = async (result, columns, setColumns) => {
    console.log("RESULT",result)
    console.log("COLUMN", columns);
    console.log("SET COLUM", setColumns);
    if (!result.destination) return;
    const { source, destination } = result;
    let newColumn = null;
    const oldColumn  = columns;
    if (source.droppableId !== destination.droppableId) {
      if(columns[result.source.droppableId].items[result.source.index].edit_locked === true) return;
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      newColumn = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      }
      setColumns( newColumn );
      if( (await updateTask(result.draggableId,{status:destination.droppableId})) === false) setColumns(oldColumn)
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      newColumn ={
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      }
      setColumns(newColumn);
    }
    //update order of task
    const todos=newColumn?.todo?.items?.map(e=>e._id);
    const processings=newColumn?.processing?.items?.map(e=>e._id);
    const dones=newColumn?.done?.items?.map(e=>e._id);
    if (source.droppableId !== destination.droppableId) {//do this only when changed a task status
      const newTasksDetail = [...newColumn.todo.items.map(e=>{return {...e,status:"todo"}}),...newColumn.processing.items.map(e=>{return {...e,status:"processing"}}),...newColumn.done.items.map(e=>{return {...e,status:"done"}})];
      dispatch(updateTasks(newTasksDetail))
    }
    const newTaskOder = [...todos,...processings,...dones]
    if(prop.onType==="space"){
      console.log("newOder Space",newColumn)
      if( (await updateSpace(prop.onId,{tasks:newTaskOder})) === false ) setColumns(oldColumn)
      
    } else{
      console.log("newOder Task",newColumn)
      if( (await updateTask(prop.onId,{tasks:newTaskOder})) === false ) setColumns(oldColumn)
    }
  };

  const paperStyle = {
    padding: 10,
    display: 'flex',
    flexDirection:"column",
    flexWrap: 'wrap',
    borderRadius: 10,
    width:"100%",
    flexGrow: 1
}

  return (
    <Box padding={{ xs: 0, sm: 1, md: 2, lg: 3 }} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"space-between",alignItems:"center"}}>
      <Grid container columns={24} width="100%" >
        <Grid xs={24} sm={24} md={24} lg={24} >
          <Paper elevation={3} style={paperStyle} >
          {
            columns===null?
            <>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </>
            :
            <>
            <Zoom
                key='secondary'
                in={true}
                timeout={transitionDuration}
                style={{
                    transitionDelay: `${transitionDuration.exit}ms`,
                }}
                unmountOnExit
                onClick={()=>{setActiveAdd(true)}}
              >
                <Fab sx={{position: 'static', top: 16, left: 16}} aria-label="Edit" color='secondary' >
                    <AddIcon />
                </Fab>
              </Zoom>
                <DragDropContext
                  onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                >
                  {/* <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap" width="100%"> */}
                  <Grid container columns={24} spacing={2} width="100%" >
                  {Object.entries(columns).map(([columnId, column]) => {
                    return (
                      <Grid xs={24} sm={24} md={8} lg={8} key={columnId} >
                      <Droppable droppableId={columnId} key={columnId}
                        renderClone={(provided, snapshot, rubric) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: "none",
                              padding: 5,
                              margin: 0,
                              minHeight: "50px",
                              cursor:"grab",
                              width:"100%",
                              display:"flex",
                              flexDirection:"column",
                              alignItems:"center",
                              borderRadius:20,
                              backgroundColor: snapshot.isDragging
                                ? "rgba(10,10,10,0.5)"
                                : "rgba(220,220,220,0.01)",
                              color: "white",
                              ...provided.draggableProps.style
                            }}
                          >
                            <ATask task={column.items[rubric.source.index]} />
                          </div>
                        )}
                      >
                      {(provided, snapshot) => {
                        return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height:"100%",
                          }}
                          key={columnId}
                        >
                          <h2>{column.name}</h2>
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "rgba(100,100,100,0.1)",
                              padding: 2,
                              width:"100%",
                              minHeight: 300,
                              overflow:"auto",
                              display:"flex",
                              flexDirection:"column",
                              alignItems:"center",
                              borderRadius:20
                            }}
                          >
                            {column.items?.map((item, index) => {
                              return (
                                <Draggable
                                  key={item._id}
                                  draggableId={item._id}
                                  index={index}
                                  >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          padding: 5,
                                          margin: 0,
                                          minHeight: "50px",
                                          cursor:"grab",
                                          width:"100%",
                                          display:"flex",
                                          flexDirection:"column",
                                          alignItems:"center",
                                          borderRadius:20,
                                          backgroundColor: snapshot.isDragging
                                            ? "rgba(10,10,10,0.5)"
                                            : "rgba(220,220,220,0.01)",
                                          color: "white",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <ATask onType={prop.onType==="space"?"space":"task"} task={item} />
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                            {columnId==="todo"?
                              <AddTask onType={prop.onType==="space"?"space":"task"} onId={prop.onId} tasks={tasks} active={activeAdd} close={()=>setActiveAdd(null)} />
                              :null}
                          </div>
                        </div>
                        );
                      }}
                      </Droppable>
                      </Grid>
                    );
                  })}
                  </Grid>
                  {/* </Stack> */}
                </DragDropContext>
            </>
          }
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
