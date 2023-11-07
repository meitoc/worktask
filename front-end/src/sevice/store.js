import { configureStore } from '@reduxjs/toolkit'

import { rootTasksSlice } from './root_tasks/slice'
import { aTaskSlice } from './a_task/slice'
import { spacesSlice } from './spaces/slice'
import { aSpaceSlice } from './a_space/slice'
// import { userInfoSlice } from './user_info/slice'


const store = configureStore({
    reducer: {
        // user_info: userInfoSlice.reducer,
        root_tasks: rootTasksSlice.reducer,
        a_task: aTaskSlice.reducer,
        spaces: spacesSlice.reducer,
        a_space: aSpaceSlice.reducer
    },
})

export default store