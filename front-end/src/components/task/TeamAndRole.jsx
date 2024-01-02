import  { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { Stack, Typography} from "@mui/material";
// import { useTheme } from "@emotion/react";
// import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from "react-redux";
import AUser from "../small-component/AUser";
import { removeUserFromATask, addUserToATask } from "../../sevice/a_task/slice";
import AddUser from "../small-component/AddUser";
import { deleteTaskUser, putTaskUser } from "../../sevice/api";



export default function TeamAndRole(prop) {
  // const theme = useTheme();
  // const transitionDuration = {
  //     enter: theme.transitions.duration.enteringScreen,
  //     exit: theme.transitions.duration.leavingScreen,
  //   };
  const dispatch=useDispatch();
  const userInfo = useSelector(state=>state.user_info)
  const owners = useSelector(state=>state.a_task.users.owners)
  const managers = useSelector(state=>state.a_task.users.managers)
  const members = useSelector(state=>state.a_task.users.members)
  const member_add_member = useSelector(state=>state.a_task.member_add_member)
  const taskId= useSelector(state=>state.a_task._id)

  const [errorText, setErrorText] = useState([])
  const [rows, setRows] = useState(null);
  const [userRole, setUserRole] = useState(null);
  // const [setActiveAdd] = useState(null);
  // FOR DRAP FUNCTION
  const onDragEnd = (result, rows, setRows) => {
    console.log("RESULT",result)
    console.log("ROW", rows);
    console.log("SET ROW", setRows);
    if (!result.destination) return;
    const { source, destination } = result;
    let newRow = null;
    if (source.droppableId !== destination.droppableId) {
      console.log('UUUUUUUUUUUUUUU')
      const sourceRow = rows[source.droppableId];
      const destRow = rows[destination.droppableId];
      const sourceItems = [...sourceRow.items];
      const destItems = [...destRow.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      newRow = {
        ...rows,
        [source.droppableId]: {
          ...sourceRow,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destRow,
          items: destItems
        }
      }
      setRows( newRow );
      putTaskUser(taskId,{user:result.draggableId,role:destination.droppableId});//update on server for task status
    } else {
      const row = rows[source.droppableId];
      const copiedItems = [...row.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      newRow ={
        ...rows,
        [source.droppableId]: {
          ...row,
          items: copiedItems
        }
      }
      setRows(newRow);
    }
  };
  const handleAddUser = async (data)=>{
    const response = await putTaskUser(taskId,data)
    if(response?.success===true){
      dispatch(addUserToATask(data))
      setErrorText([])
      return true;
    } else {
      setErrorText(response.errors)
      return false;
    }
  }
  const handleDeleteUser = async (userName)=>{
    const response = await deleteTaskUser(taskId,{user:userName})
    if(response?.success===true){
      dispatch(removeUserFromATask(userName))
      return true;
    } else return false;
  }
  useEffect(()=>{
    const rowsDetail = {
      owners: {
        name: "Owners",
        key: "owners",
        role: "owner",
        addRole: ["owners"],
        deleteRole: ["owners"],
        items: owners
      },
      managers: {
        name: "Managers",
        key:"managers",
        role:"manager",
        addRole: [],
        deleteRole: member_add_member?["owners","managers"]:["owners"],
        items: managers
      },
      members: {
        name: "Members",
        key:"members",
        role:"member",
        addRole: member_add_member?["owners","managers","members"]:["owners"],
        deleteRole: member_add_member?["owners","managers","members"]:["owners"],
        items: members
      }
    }
    setRows(rowsDetail)
    const newRole = rowsDetail.owners?.items?.some(e=>e.name===userInfo.name)?"owners":rowsDetail.managers?.items?.some(e=>e.name===userInfo.name)?"managers":"members";
    setUserRole(newRole)
  },[owners,managers,members,member_add_member,userInfo.name])
  return (
          rows===null?null:
          <div
            style={{ display: "flex", flexDirection:"column", justifyContent: "center", width: "100%", overflow:"auto" }}
          >
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, rows, setRows)}
            >
              <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
              {Object.entries(rows).map(([rowId, row]) => {
                return (
                  <Droppable droppableId={rowId} key={rowId}
                    isDropDisabled={!row?.addRole?.some(e=>e===userRole)}
                    renderClone={(provided, snapshot, rubric) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          borderRadius:15,
                          margin: "0 0 0 0",
                          // minHeight: "50px",
                          cursor:"grab",
                          backgroundColor: snapshot.isDragging
                            ? "rgba(10,10,10,0.5)"
                            : "rgba(200,200,200,0.1)",
                          color: "white",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <AUser user={row.items[rubric.source.index]} ></AUser>
                      </div>
                    )}
                  >
                  {(provided, snapshot) => {
                    return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        width:"100%",
                      }}
                      key={rowId}
                    >
                      <Typography variant="h7">{row.name}</Typography>
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 2,
                          minHeight: 50,
                          width:"100%",
                          overflow:"auto",
                          display:"flex",
                          flexDirection:"row",
                          alignItems:"center",
                          flexWrap:"wrap",
                          borderRadius: 20
                        }}
                      >
                        {row.items?.map((item, index) => {
                          console.log("ROW",index,item)
                          return (
                            <Draggable
                              key={item.name}
                              draggableId={item.name}
                              index={index}
                              isDragDisabled={item.name===userInfo.name || !row?.addRole?.some(e=>e===userRole)}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      margin: "0 0 0 0",
                                      // minHeight: "50px",
                                      cursor:"grab",
                                      backgroundColor: snapshot.isDragging
                                        ? "rgba(10,10,10,0.5)"
                                        : "rgba(200,200,200,0.1)",
                                      color: "white",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <AUser lockAction={item.name===userInfo.name || !row?.deleteRole?.some(e=>e===userRole)} onDelete={()=>handleDeleteUser(item.name)} user={item} ></AUser>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        {row?.addRole?.some(e=>e===userRole)?<AddUser errors={errorText} display={prop.display} exclude={[...owners,...managers,...members]} addUser={handleAddUser} role={row.role} />:null}
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
  );
}
