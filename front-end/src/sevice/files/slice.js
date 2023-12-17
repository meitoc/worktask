import {
    createSlice
} from '@reduxjs/toolkit'

export const filesSlice = createSlice({
    name: "files",
    initialState: null ,
    reducers: {
        updateFiles: (state, action) => {
            const newFiless = action.payload;
            console.log("UPDATE FILE", newFiless);
            if(newFiless) return newFiless;
            return null;
        },
        addToFiles: (state, action) => {
            const data = action.payload;
            console.log("ADD A SPACE", data);
            if(data) return [...data,...state];
            return state;
        },
        removeFromFiles: (state, action) => {
            const files = action.payload;
            console.log("REMOVE A FILE FROM FILES", files);
            if(Array.isArray(files) && state!=null) return state.filter(e=>!files.some(u=>u._id === e._id));
            return state;
        }
    }
})
const { actions } = filesSlice
export const { updateFiles, addToFiles, removeFromFiles } = actions
// export default reducers
export default filesSlice.reducer;