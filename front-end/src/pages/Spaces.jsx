import { AuthenCheck } from '../features/authentication/AuthenCheck';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ASpace from '../components/spaces/ASpace'
import CircularProgress from '@mui/material/CircularProgress';
import AddSpace from '../components/spaces/AddSpace';

import {useDispatch, useSelector} from 'react-redux'
import { addToSpaces, removeSpace, updateSpaces} from '../sevice/spaces/slice';
import LetLogin from '../components/spaces/LetLogin';
import FetchSpacesTasks from '../features/fetch-data/FetchSpacesTasks';
import Box from '@mui/material/Box';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { putSpaces } from '../sevice/api';
// import { useState } from 'react';

export default function Spaces() {
  const spaces = useSelector(state => state.spaces)
  const userInfo = useSelector(state => state.user_info)
  const dispatch = useDispatch();

  // const [spaces,setShowSpaces] = useState(null)
  
  const onDragEnd = async (result) => {
    console.log("RESULT",result);
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === "0" && Array.isArray(spaces)) {
      console.log(source, destination)
      const index1 = source.index;
      const index2 = destination.index;
      let newSpaces = [...spaces];
      const takenSpace = spaces[index1];
      newSpaces.splice(index1,1)
      newSpaces.splice(index2,0,takenSpace)
      dispatch(updateSpaces(newSpaces))
      console.log({spaces:newSpaces.map(e=>e._id)})
      const response = await putSpaces({spaces:newSpaces.map(e=>e._id)});
      if(response?.success!==true)  dispatch(updateSpaces(spaces))
    }
  }
  // useEffect(()=>{
  //   if(Array.isArray(spaces)) setShowSpaces(spaces)
  // },[spaces])
  return (
  <FetchSpacesTasks>
    {userInfo && Array.isArray(spaces)?
    <AuthenCheck>
        <Typography variant="h4" gutterBottom>
          Spaces
        </Typography>
        <Box backgroundColor="rgba(125,125,125,0.2)" padding={4} borderRadius={5} width='100%' margin={2}>
          
          <DragDropContext
          onDragEnd={(result) => onDragEnd(result)}
          >
            <Droppable droppableId="0" direction="horizontal"
              renderClone={(provided, snapshot, rubric) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: "none",
                      padding: 5,
                      margin: "0 0 8px 0",
                      height:"100%",
                      width:"100%",
                      cursor:"grab",
                      backgroundColor: snapshot.isDragging
                        ? "rgba(10,10,10,0.5)"
                        : "rgba(200,200,200,0.1)",
                      color: "white",
                      ...provided.draggableProps.style
                    }}
                  >
                    <ASpace fnUpdate={(input)=>dispatch(addToSpaces(input))} fnDelete={(input)=>dispatch(removeSpace(input))} space={spaces.find(item=>item._id===rubric.draggableId)} />
                  </div>
              ) }>
                {(provided, snapshot) => {return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.1)",
                      padding: 4,
                      width: "100%",
                      height: "100%",
                      overflow:"auto",
                      display:"flex",
                      flexDirection: "row",
                      alignItems:"center"
                    }}
                  >
                    <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                    {spaces.map((e,i)=> e.active!==false?(
                      <Draggable
                      key={e._id}
                      draggableId={e._id}
                      index={i}
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
                                  margin: "0 0 8px 0",
                                  minHeight: "50px",
                                  cursor:"grab",
                                  backgroundColor: snapshot.isDragging
                                    ? "rgba(10,10,10,0.5)"
                                    : "rgba(200,200,200,0.1)",
                                  color: "white",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <ASpace fnUpdate={(input)=>dispatch(addToSpaces(input))} fnDelete={(input)=>dispatch(removeSpace(input))} space={e} />
                            </div>
                          )
                        }}
                      </Draggable>
                    ):null)}
                    {provided.placeholder}
                    <AddSpace />
                    </Stack>
                  </div>
                )}}
            </Droppable>
          </DragDropContext>
        </Box>
    </AuthenCheck>
    : userInfo===false? <LetLogin />
    :<CircularProgress />
    }
  </FetchSpacesTasks>
  )
}