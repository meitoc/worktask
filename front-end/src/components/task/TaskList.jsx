import  {  useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { Box, Fab, Stack, Zoom} from "@mui/material";
import ATask from "./ATask";
import { getTaskList, putSpace, putTask } from "../../sevice/api";
import { useTheme } from "@emotion/react";
import AddIcon from '@mui/icons-material/Add';
import AddTask from "./AddTask";



export default function TaskList(prop) {
  const theme = useTheme();
  const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };
  const [tasks,setTasks] = useState(null);
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
              items: tasks?.filter(e=>e.status!=="processing" && e.status!=="done")
            },
            processing: {
              name: "Processing",
              items: tasks?.filter(e=>e.status==="processing")
            },
            done: {
              name: "Done",
              items: tasks?.filter(e=>e.status==="done")
            }
          };
          setTasks(tasks);
          setColumns(taskStatus)
        } else {
          setTasks([]);
        }
    }
    if(Array.isArray(prop.tasks)) fetchTasks();
  }, [prop.tasks]);

  // 
  const updateTask = async (id,data)=>{
    console.log(id ,data)
    const response = await putTask(id,data);
    if(response?.success===true) console.log(response)
    else console.log("Failed to change data!")
  }
  const updateSpace = async (id,data)=>{
    console.log(id ,data)
    const response = await putSpace(id,data);
    if(response?.success===true) console.log(response)
    else console.log("Failed to change data!")
  }
  // FOR DRAP FUNCTION
  const onDragEnd = (result, columns, setColumns) => {
    console.log("RESULT",result)
    console.log("COLUMN", columns);
    console.log("SET COLUM", setColumns);
    if (!result.destination) return;
    const { source, destination } = result;
    let newColumn = null;
    if (source.droppableId !== destination.droppableId) {
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
      updateTask(result.draggableId,{status:destination.droppableId});//update on server for task status
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
    const newTaskOder = [...todos,...processings,...dones]
    if(prop.onType==="space"){
      console.log("newOder Space",newTaskOder)
      updateSpace(prop.parentId,{tasks:newTaskOder})
      
    } else{
      console.log("newOder",newTaskOder)
    }
  };


  if(tasks===null) return null;
  return (
    <Box padding={3} style={{ display: prop.display===true?"flex":"none", flexDirection:"column", justifyContent:"space-between",alignItems:"space-between"}}>
      <div
        style={{ display: prop.display===true?"flex":"none", flexWrap:"wrap", justifyContent: "center", height: "100%", overflow:"auto" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
          {Object.entries(columns).map(([columnId, column]) => {
            return (
              <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height:"100%",
                  position:"re"
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
                              : "lightgrey",
                            padding: 4,
                            minWidth: 350,
                            minHeight: 300,
                            // maxHeight: "80vh",
                            height:"100%",
                            overflow:"auto",
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"center"
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
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        cursor:"grab",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style
                                      }}
                                    >
                                      <ATask task={item} />
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {columnId==="todo"?
                            <AddTask onType="space" tasks={tasks} active={activeAdd} close={()=>setActiveAdd(null)} />
                            :null}
                          {provided.placeholder}
                        </div>
              </div>
              );
            }}
          </Droppable>
            );
          })}
          </Stack>
        </DragDropContext>
      </div>
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
          <Fab sx={{position: 'static', bottom: 16, left: 16}} aria-label="Edit" color='secondary' >
              <AddIcon />
          </Fab>
      </Zoom>
      
    </Box>
  );
}
