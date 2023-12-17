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
            const data = action.payload;
            console.log("UPDATE A TASK ", data);
            if(data) return {...state,...data};
            return state;
        },
        removeTaskFromATask: (state, action) => {
            const taskId = action.payload;
            console.log("DELETE A TASK", taskId);
            if(taskId ) return {...state,tasks:state?.tasks&&state.tasks.filter(e=>e!==taskId)};
            return state;
        },
        removeUserFromATask: (state, action) => {
            const userName = action.payload;
            console.log("REMOVE A USER", userName);
            if(userName ) return {
                ...state,
                users:{
                    owners:state.users.owners.filter(e=>e.name!==userName),
                    managers:state.users.managers.filter(e=>e.name!==userName),
                    members:state.users.members.filter(e=>e.name!==userName),
            }};
            return state;
        },
        addUserToATask: (state, action) => {
            const userName = action.payload.user;
            const userRole = action.payload.role;
            console.log("ADD A USER", userName, userRole);
            if(userRole==="owner") return {
                ...state,
                users:{
                    ...state.users,
                    owners:[...state.users.owners,{name:userName,active:true}]
                }
            };
            if(userRole==="manager") return {
                ...state,
                users:{
                    ...state.users,
                    managers:[...state.users.managers,{name:userName,active:true}]
                }
            };
            if(userRole==="member") return {
                ...state,
                users:{
                    ...state.users,
                    members:[...state.users.members,{name:userName,active:true}]
                }
            };
            return state;
        },
    }
})
const { actions } = aTaskSlice
export const { createATask,updateATask,removeTaskFromATask, removeUserFromATask, addUserToATask } = actions
// export default reducers
export default aTaskSlice.reducer;