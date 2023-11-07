import {
    createSlice
} from '@reduxjs/toolkit'

export const aSpaceSlice = createSlice({
    name: "space",
    initialState: null ,
    reducers: {
        updateASpace: (state, action) => {
            const newSpaces=action.payload;
            console.log("UPDATE A SPACE", newSpaces);
            if(newSpaces) return newSpaces;
            return null;
        }
    }
})
const { actions } = aSpaceSlice
export const { updateASpace } = actions
// export default reducers
export default aSpaceSlice.reducer;