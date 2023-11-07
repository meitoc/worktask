import {
    createSlice
} from '@reduxjs/toolkit'

export const rootTasksSlice = createSlice({
    name: "root_rootTaskss",
    initialState: [ 
        ],
    reducers: {
        addToRootTasks: (state, action) => {
            const newRootTasks = action.payload;
            const index = state.findIndex((rootTasks) => rootTasks.id === newRootTasks.id);
            console.log("ADDING ROOT TASK", newRootTasks);
            if(index!==-1) return state;
            return [...state,newRootTasks];
        },
        updateRootTasks: (state, action) => {
            const newRootTasks=action.payload;
            console.log("UPDATE ROOT TASKS", newRootTasks);
            if(Array.isArray(newRootTasks)) return newRootTasks;
            return [];
        },
        removeRootTask: (state, action) => {
            const removedTask = action.payload;
            console.log("DELETE ROOT TASK", removedTask);
            return state.filter((rootTasks) => rootTasks._id !== removedTask._id);
        }
    }
})
const { actions } = rootTasksSlice
export const { addToRootTasks, removeRootTask, updateRootTasks } = actions
// export default reducers
export default rootTasksSlice.reducer;