import { useState } from 'react'
import { Feed } from '../types'
import { NavLink } from 'react-router-dom'
import DropdownChild from './DropdownChild'

interface DropdownProps {
    feed: Feed
    onClose: () => void,
}

export default function Dropdown({ feed, onClose }: DropdownProps) {
    
    const [childrenVisible, setChildrenVisible] = useState(false)

    return (
        <div className="flex flex-col">

                <div className="relative flex flex-row">
                    <NavLink 
                        onClick={onClose}
                        to={`/feed/${feed.id}`}
                        activeClassName="gap-4 active-sidebar-link w-full pl-12"
                        className="gap-4 inactive-sidebar-link w-full pl-12">
                        {feed.title}
                    </NavLink>

                    <button className="absolute z-10 p-1 bottom-3 left-2" onClick={() => {setChildrenVisible(!childrenVisible)}} disabled={feed.feedProviders.length <= 0 } title={childrenVisible ? "Collapse" : "Expand"}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={"transition duration-300 stroke-current dark:text-gray-500 text-gray-400 h-4 w-4 " + (!childrenVisible && "transform rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                    </button>
                    
                </div>

                { (feed.feedProviders.length > 0 && childrenVisible) && 
                
                    feed.feedProviders.map((provider, index) => <DropdownChild key={index} provider={provider} onClose={onClose}/>)
                
                }

        </div>
    )
}
