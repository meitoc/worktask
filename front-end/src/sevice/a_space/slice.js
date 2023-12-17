import {
    createSlice
} from '@reduxjs/toolkit'

export const aSpaceSlice = createSlice({
    name: "space",
    initialState: null ,
    reducers: {
        createASpace: (state, action) => {
            const newSpaces = action.payload;
            console.log("CREATE A SPACE", newSpaces);
            if(newSpaces) return newSpaces;
            return null;
        },
        updateASpace: (state, action) => {
            const data = action.payload;
            console.log("UPDATE A SPACE", data);
            if(data) return {...state,...data};
            return state;
        },
        removeTaskFromASpace: (state, action) => {
            const taskId = action.payload;
            console.log("REMOVE A TASK FROM A SPACE", taskId);
            if(taskId && state!=null) return {...state,tasks:state?.tasks?.filter(e=>e!==taskId)};
            return state;
        }
    }
})
const { actions } = aSpaceSlice
export const { createASpace,updateASpace, updateASpaceColor ,removeTaskFromASpace} = actions
// export default reducers
export default aSpaceSlice.reducer;