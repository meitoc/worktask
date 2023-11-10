import {
    createSlice
} from '@reduxjs/toolkit'

export const spacesSlice = createSlice({
    name: "spaces",
    initialState: null,
    reducers: {
        addToSpaces: (state, action) => {
            const newSpace = action.payload;
            const index = state.findIndex((space) => space._id === newSpace._id);
            console.log("ADDING SPACES", newSpace);
            if(index!==-1) return state.map((e,i)=>{return i===index?newSpace:e});
            return [...state,newSpace];
        },
        deleteSpaces:()=>{
            return null
        },
        updateSpaces: (state, action) => {
            const newSpaces = action.payload;
            console.log("UPDATE SPACES", newSpaces);
            if(Array.isArray(newSpaces)) return newSpaces;
            return [];
        },
        removeSpace: (state, action) => {
            const spaceId = action.payload;
            console.log("DELETE SPACES", spaceId);
            return state.map((space) => {return space._id !==spaceId? space:{_id:spaceId,active:false}});
        }
    }
})
const { actions } = spacesSlice
export const { addToSpaces, removeSpace, updateSpaces } = actions
// export default reducers
export default spacesSlice.reducer;