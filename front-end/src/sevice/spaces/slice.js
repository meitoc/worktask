import {
    createSlice
} from '@reduxjs/toolkit'

export const spacesSlice = createSlice({
    name: "spaces",
    initialState: null,
    reducers: {
        addToSpaces: (state, action) => {
            const newSpace = action.payload;
            const index = state?.findIndex((space) => space._id === newSpace._id);
            console.log("ADDING SPACES", newSpace);
            if(index!==-1) return state?.map((e,i)=>{return i===index?newSpace:e});
            return [...state,newSpace];
        },
        addTaskToASpace: (state, action) => {
            const newTaskId = action.payload.task;
            const targetSpaceId = action.payload.space;
            const index = state?.findIndex((space) => space._id === targetSpaceId);
            console.log("ADDING TASK TO A SPACE", newTaskId,targetSpaceId);
            if(index!==-1) return state?.map((e,i)=>{return i===index?{...e, tasks:[...(e.tasks),newTaskId]}:{...e, tasks:e.tasks?.filter(a=>a!==newTaskId)}});
            return state;
        },
        removeTaskFromSpace: (state, action) => {
            const taskId = action.payload.task;
            const targetSpaceId = action.payload.space;
            const index = state?.findIndex((space) => space._id === targetSpaceId);
            console.log("REMOVING TASK FROM A SPACE", taskId,targetSpaceId);
            if(index!==-1) return state?.map((e,i)=>{return i===index?{...e, tasks:e.tasks?.filter(a=>a!==taskId)}:e});
            return state;
        },
        removeTaskFromSpaces: (state, action) => {
            const taskId = action.payload;
            console.log("REMOVING TASK FROM A SPACE", taskId);
            if(taskId) return state?.map((e)=>{return {...e, tasks:e.tasks?.filter(a=>a!==taskId)}});
            return state;
        },
        deleteSpaces:()=>{
            return null
        },
        updateSpaces: (state, action) => {
            const newSpaces = action.payload;
            console.log("UPDATE SPACES", newSpaces);
            if(Array.isArray(newSpaces)) return newSpaces;
            return [];
        },
        removeSpace: (state, action) => {
            const spaceId = action.payload;
            console.log("DELETE SPACES", spaceId);
            return state.map((space) => {return space._id !==spaceId? space:{_id:spaceId,active:false}});
        }
    }
})
const { actions } = spacesSlice
export const { addToSpaces, removeSpace, updateSpaces,addTaskToASpace,removeTaskFromSpace,removeTaskFromSpaces } = actions
// export default reducers
export default spacesSlice.reducer;