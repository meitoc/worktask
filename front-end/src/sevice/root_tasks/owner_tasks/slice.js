import {
    createSlice
} from '@reduxjs/toolkit'

export const rootOwnerTasksSlice = createSlice({
    name: "owner_tasks",
    initialState: [ 
        ],
    reducers: {
        addToOwnerTasks: (state, action) => {
            const newOwnerTasks = action.payload;
            const index = state.findIndex((rootOwnerTasks) => rootOwnerTasks.id === newOwnerTasks.id);
            console.log("ADDING ROOT TASK", newOwnerTasks);
            if(index!==-1) return state;
            return [...state,newOwnerTasks];
        },
        updateOwnerTasks: (state, action) => {
            const newOwnerTasks=action.payload;
            console.log("UPDATE ROOT TASKS", newOwnerTasks);
            if(Array.isArray(newOwnerTasks)) return newOwnerTasks;
            return [];
        },
        removeOwnerTask: (state, action) => {
            const removedOwnerTask = action.payload;
            console.log("DELETE ROOT TASK", removedOwnerTask);
            return state.filter((rootOwnerTasks) => rootOwnerTasks._id !== removedOwnerTask._id);
        }
    }
})
const { actions } = rootOwnerTasksSlice
export const { addToOwnerTasks, removeOwnerTask, updateOwnerTasks } = actions
// export default reducers
export default rootOwnerTasksSlice.reducer;