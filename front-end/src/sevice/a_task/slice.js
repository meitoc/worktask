import {
    createSlice
} from '@reduxjs/toolkit'

export const aTaskSlice = createSlice({
    name: "task",
    initialState: null ,
    reducers: {
        createATask: (state, action) => {
            const newTasks=action.payload;
            console.log("CREATE A TASK", newTasks);
            if(newTasks) return newTasks;
            return null;
        },
        updateATask: (state, action) => {
            const newTasks=action.payload;
            console.log("UPDATE A TASK", newTasks);
            if(newTasks) return newTasks;
            return null;
        },
        removeTaskFromATask: (state, action) => {
            const taskId = action.payload;
            console.log("UPDATE A SPACE COLOR", taskId);
            if(taskId ) return {...state,tasks:state?.tasks&&state.tasks.filter(e=>e!==taskId)};
            return state;
        }
    }
})
const { actions } = aTaskSlice
export const { createATask,updateATask,removeTaskFromATask } = actions
// export default reducers
export default aTaskSlice.reducer;