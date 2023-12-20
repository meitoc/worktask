import {
    createSlice
} from '@reduxjs/toolkit'

export const tasksSlice = createSlice({
    name: "tasks",
    initialState: null,
    reducers: {
        updateTasks: (state, action) => {
            const newTasks = action.payload;
            console.log("UPDATE TASKS", newTasks);
            if(Array.isArray(newTasks)) return newTasks;
            return state;
        }
    }
})
const { actions } = tasksSlice
export const { updateTasks } = actions
// export default reducers
export default tasksSlice.reducer;