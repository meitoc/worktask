import {
    createSlice
} from '@reduxjs/toolkit'

export const rootMemberTaskSlice = createSlice({
    name: "member_tasks",
    initialState: [ 
        ],
    reducers: {
        addToMemberTasks: (state, action) => {
            const newMemberTasks = action.payload;
            const index = state.findIndex((rootMemberTask) => rootMemberTask.id === newMemberTasks.id);
            console.log("ADDING ROOT MEMBER TASK", newMemberTasks);
            if(index!==-1) return state;
            return [...state,newMemberTasks];
        },
        updateMemberTasks: (state, action) => {
            const newMemberTasks=action.payload;
            console.log("UPDATE ROOT MEMBER TASKS", newMemberTasks);
            if(Array.isArray(newMemberTasks)) return newMemberTasks;
            return [];
        },
        removeMemberTask: (state, action) => {
            const removedTask = action.payload;
            console.log("DELETE A ROOT MEMBER TASK", removedTask);
            return state.filter((rootMemberTask) => rootMemberTask._id !== removedTask._id);
        }
    }
})
const { actions } = rootMemberTaskSlice
export const { addToMemberTasks, removeMemberTask, updateMemberTasks } = actions
// export default reducers
export default rootMemberTaskSlice.reducer;