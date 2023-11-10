import {
    createSlice
} from '@reduxjs/toolkit'

export const userInfoSlice = createSlice({
    name: "user_info",
    initialState: null ,
    reducers: {
        updateUser: (state, action) => {
            const newUserInfo=action.payload;
            console.log("UPDATE USER", newUserInfo);
            if(newUserInfo) return newUserInfo;
            if(newUserInfo===false) return false;
            return null;
        },
        deleteUser: () => {
            console.log("DELETE USER");
            return null;
        },
        updateUserEmail: (state, action) => {
            const newUserInfo=action.payload;
            console.log("UPDATE USER EMAIL", newUserInfo);
            if(newUserInfo && state) return {...state,email:newUserInfo};
            return state;
        },
        updateUserInformation: (state, action) => {
            const newUserInfo=action.payload;
            console.log("UPDATE USER EMAIL", newUserInfo);
            if(newUserInfo && state) return {...state,information:newUserInfo};
            return state;
        },
    }
})
const { actions } = userInfoSlice
export const { updateUser, deleteUser, updateUserEmail, updateUserInformation } = actions
// export default reducers
export default userInfoSlice.reducer;