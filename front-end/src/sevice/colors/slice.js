import {
    createSlice
} from '@reduxjs/toolkit'

export const colorsSlice = createSlice({
    name: "colors",
    initialState: null,
    reducers: {
        updateColors: (state, action) => {
            const newColors=action.payload;
            console.log("UPDATE COLORS", newColors);
            if(Array.isArray(newColors)) return newColors;
            return [];
        }
    }
})
const { actions } = colorsSlice
export const { updateColors } = actions
// export default reducers
export default colorsSlice.reducer;