import {
    createSlice
} from '@reduxjs/toolkit'

export const userInfoSlice = createSlice({
    name: "user_info",
    initialState: null ,
    reducers: {
        updateAUserInfo: (state, action) => {
            const newUserInfo=action.payload;
            console.log("UPDATE USER INFO", newUserInfo);
            if(newUserInfo) return newUserInfo;
            return null;
        }
    }
})
const { actions } = userInfoSlice
export const { updateAUserInfo } = actions
// export default reducers
export default userInfoSlice.reducer;