import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { toggleDarkMode } from '../redux/uiSlice'
import Dropdown from './Dropdown'
import Switch from './Switch'
import { showView } from '../redux/uiSlice'
import useOnClickOutside from '../hooks/useOnClickOutside'
import { useRef } from 'react'

interface SidebarProps {
    visible: boolean
    onClose: () => void
}


export default function Sidebar({ visible, onClose }: SidebarProps) {

    const feeds = useAppSelector((state) => state.feed.feed)
    const darkMode = useAppSelector((state) => state.ui.darkMode)
    
    const dispatch = useAppDispatch()

    const onToggle = () => {
        dispatch(toggleDarkMode())
    }

    const ref = useRef<HTMLDivElement>(null)

    //Handles closing the sidebar on tap outside
    useOnClickOutside(ref, visible, () => onClose())

    return (

    <div>
        {/* Overlay */}
        <div className= {(visible ? "fixed sm:hidden " : "hidden ") + " z-30 inset-0 w-full min-h-screen bg-black bg-opacity-60"}/>

        <div ref={ref} className={ (!visible && "-translate-x-64") + " transform sm:translate-x-0 z-40 transition duration-500 ease-in-out flex flex-col bg-sidebar dark:bg-darksidebar px-4 w-64 h-screen border-r dark:border-gray-900 fixed overflow-y-auto"}>
            
            <button className="sm:hidden flex justify-end pt-4" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current text-gray-400 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="flex justify-between items-center my-4">
                
                <p className="primary-text font-bold text-2xl ">RSS Feed</p>
                
                <Switch toggled={darkMode} onToggle={onToggle}/>
            </div>

            <NavLink 
                onClick={onClose}
                exact={true}
                to="/" 
                activeClassName="active-sidebar-link pl-2"
                className="inactive-sidebar-link pl-2">
                Today
            </NavLink>
            
            <NavLink 
                onClick={onClose}
                to="/discover" 
                activeClassName="active-sidebar-link pl-2"
                className="inactive-sidebar-link pl-2">
                Discover
            </NavLink>
            

            <hr className="my-4 dark:border-gray-600"/>

            <div className="flex tracking-wide items-center justify-between mb-4 p-1">

                <p className="primary-text text-sm font-bold">FEEDS</p>
                
                <button onClick={() => {onClose(); dispatch(showView({viewName: "create_feed"}))}} title="Create New Feed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current text-gray-400 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>  
                </button>

            </div>

            <NavLink
                onClick={onClose}
                to={`/feed/all`} 
                activeClassName="primary-text font-semibold pl-12 pt-1 pr-1 pb-1 mb-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
                className="primary-text font-semibold pl-12 pt-1 pr-1 pb-1 mb-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition duration-200 ease-in-out">
                    All
            </NavLink>
            
            {(feeds) && 
            
                feeds.map((feed, index) => <Dropdown key={index} feed={feed} onClose={onClose}/>)
            }


        </div>

    </div>
    )
}
