import {
    createSlice
} from '@reduxjs/toolkit'

export const otherUsersSlice = createSlice({
    name: "other_users",
    initialState: [] ,
    reducers: {
        addOtherUsers: (state, action) => {
            const newOtherUser=action.payload;
            if(Array.isArray(newOtherUser)){
                const filteredOtherUser = newOtherUser.filter((element, index, self) =>
                    index === self.findIndex(e => e.name === element.name)
                );
                console.log("UPDATE OTHER USER", filteredOtherUser);
                return [
                    ...(state.map(e=>{const i=filteredOtherUser.findIndex(u=>(u.name===e.name)); if(i===-1) return e; else return filteredOtherUser[i]})) ,
                    ...(filteredOtherUser.filter(u=> u.name && !state.some(e=>e.name===u.name)))
                    ]
            }
            return state;
        }
    }
})
const { actions } = otherUsersSlice
export const { addOtherUsers } = actions
// export default reducers
export default otherUsersSlice.reducer;