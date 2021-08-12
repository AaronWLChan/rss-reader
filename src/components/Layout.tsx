import Sidebar from './Sidebar'
import Routes from '../navigation/routes'
import SideContainer from './SideContainer'
import NavBar from './NavBar'
import { useState, useEffect } from 'react'
import { useAppSelector } from '../redux/hooks'

export default function Layout() {

    const [visible, setVisible] = useState(false)

    const onClose = () => {
        setVisible(false)
    }

    const onOpen = () => {
        setVisible(true)
    }

    //Disable scroll whenever the sidebar is visible
    useEffect(() => {

        if (visible) {
            document.body.style.overflow = 'hidden'
        }


        return () => {
            document.body.style.overflow = 'unset'
        }

    }, [visible])

    const sideContainerVisible = useAppSelector((state) => state.ui.sideViewType.viewName !== "none") 

    return (
        <div className="flex sm:flex-row flex-col gap-6 bg-gray-50 dark:bg-darkbackground min-h-screen">
            
            <Sidebar visible={visible} onClose={onClose}/>

            <NavBar onClick={onOpen}/>

            <div className="sm:mt-16 px-8 sm:px-16 sm:ml-72 w-full mb-8 flex flex-col">
                <Routes/>
            </div>

            {
                sideContainerVisible &&
                <div className= { "z-40 fixed inset-0 w-full min-h-screen bg-black bg-opacity-60"}/>
            }

            <SideContainer/>
            
        </div>
    )
}
