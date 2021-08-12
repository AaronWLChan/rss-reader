import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SideContainerViewType = "none" | "create_feed" | "create_provider" | "manage_feed" | "delete_feed"

//Pass whatever params inside
interface SideContainerViewProp {
    viewName: SideContainerViewType
    params?: { id: string }
}

interface InitialReduxState{
    darkMode: boolean,
    sideViewType: SideContainerViewProp
}

const INITIAL_STATE: InitialReduxState = {
    darkMode: false,
    sideViewType: { viewName: "none" }
}

const uiSlice = createSlice({
    name:"uiSlice",
    initialState: INITIAL_STATE,
    reducers: {
        toggleDarkMode(state){
            state.darkMode = !state.darkMode
        },

        showView(state, action: PayloadAction<SideContainerViewProp>){
            state.sideViewType = action.payload

        }
    }  
})


export const { toggleDarkMode, showView } = uiSlice.actions


export default uiSlice.reducer