import { useRef, useEffect } from 'react'
import useOnClickOutside from '../hooks/useOnClickOutside'
import CreateNewFeed from './CreateNewFeed'
import ManageFeed from './ManageFeed'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { showView } from '../redux/uiSlice'
import DeleteFeed from './DeleteFeed'

export default function SideContainer() {
    
    const viewType = useAppSelector((state) => state.ui.sideViewType)
    const dispatch = useAppDispatch()

    const ContentView = (): JSX.Element | null => {

        switch (viewType.viewName){

            case "create_feed":
                 return <CreateNewFeed/>

            case "manage_feed":
                return <ManageFeed id={viewType.params!.id}/>

            case "delete_feed":
                return <DeleteFeed id={viewType.params!.id}/>

            default:
                break
        }

        return null

    }

    //Disable body scrolling when side container is pressed
    useEffect(() => {

        if (viewType.viewName !== "none") {
            document.body.style.overflow = 'hidden'
        }


        return () => {
            document.body.style.overflow = 'unset'
        }

    }, [viewType])



    const container = useRef<HTMLDivElement>(null)

    useOnClickOutside(container, undefined, () => dispatch(showView({ viewName: "none"})))

    return (
           
        <div ref={container} 
            className={(viewType.viewName === "none" && "translate-x-full") + " fixed right-0 modal-container overflow-y-auto"}>
        
            <ContentView/>

        </div>

    )
}
