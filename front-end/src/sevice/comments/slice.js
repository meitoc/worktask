import {
    createSlice
} from '@reduxjs/toolkit'

export const commentsSlice = createSlice({
    name: "task",
    initialState: null ,
    reducers: {
        updateComments: (state, action) => {
            const newComments=action.payload;
            console.log("UPDATE ALL COMMENT", newComments);
            if(newComments) return newComments;
            return [];
        },
        addAComment: (state, action) => {
            const data = action.payload;
            console.log("ADD A COMMENT ", data);
            if(data) return [data,...state];
            return state;
        },
        removeAComment: (state, action) => {
            const commentId = action.payload;
            console.log("DELETE A COMMENT", commentId);
            if(commentId ) return state.filter(e=>e._id!==commentId);
            return state;
        }
    }
})
const { actions } = commentsSlice
export const { addAComment,updateComments,removeAComment } = actions
// export default reducers
export default commentsSlice.reducer;