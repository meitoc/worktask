import {
    createSlice
} from '@reduxjs/toolkit'

export const aTaskSlice = createSlice({
    name: "task",
    initialState: null ,
    reducers: {
        updateATask: (state, action) => {
            const newTasks=action.payload;
            console.log("UPDATE A TASK", newTasks);
            if(newTasks) return newTasks;
            return null;
        }
    }
})
const { actions } = aTaskSlice
export const { updateATask } = actions
// export default reducers
export default aTaskSlice.reducer;