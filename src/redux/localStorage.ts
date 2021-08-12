export const saveState = (state: {}) => {
    try{
        const serializedState = JSON.stringify(state)

        localStorage.setItem("state", serializedState)

    } catch (err){
        // console.log("Failed to save state")
    }
}

export const loadState = () => {

    try {
        const serializedState = localStorage.getItem("state")

        if (serializedState === null){
            return undefined
        }

        return JSON.parse(serializedState)

    } catch(err) {
        // console.log("Failed to get state")
        return undefined
    }

}