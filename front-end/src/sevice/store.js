import { configureStore } from '@reduxjs/toolkit'

import { aTaskSlice } from './a_task/slice'
import { spacesSlice } from './spaces/slice'
import { aSpaceSlice } from './a_space/slice'
import { colorsSlice } from './colors/slice'
import { userInfoSlice } from './user_info/slice'
import { rootMemberTaskSlice } from './root_tasks/member_tasks/slice'
import { rootOwnerTasksSlice } from './root_tasks/owner_tasks/slice'


const store = configureStore({
    reducer: {
        user_info: userInfoSlice.reducer,
        member_tasks: rootMemberTaskSlice.reducer,
        owner_tasks: rootOwnerTasksSlice.reducer,
        a_task: aTaskSlice.reducer,
        spaces: spacesSlice.reducer,
        a_space: aSpaceSlice.reducer,
        colors: colorsSlice.reducer
    },
})

export default store