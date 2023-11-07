import {
    createSlice
} from '@reduxjs/toolkit'

export const spacesSlice = createSlice({
    name: "spaces",
    initialState: [ 
        ],
    reducers: {
        addToSpaces: (state, action) => {
            const newSpaces = action.payload;
            const index = state.findIndex((space) => space.id === newSpaces.id);
            console.log("ADDING SPACES", newSpaces);
            if(index!==-1) return state;
            return [...state,newSpaces];
        },
        updateSpaces: (state, action) => {
            const newSpaces=action.payload;
            console.log("UPDATE SPACES", newSpaces);
            if(Array.isArray(newSpaces)) return newSpaces;
            return [];
        },
        removeSpace: (state, action) => {
            const removedSpace = action.payload;
            console.log("DELETE SPACES", removedSpace);
            return state.filter((space) => space._id !== removedSpace._id);
        }
    }
})
const { actions } = spacesSlice
export const { addToSpaces, removeSpace, updateSpaces } = actions
// export default reducers
export default spacesSlice.reducer;