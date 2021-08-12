import { useState } from 'react'
import { useRef } from 'react'
import { READING_MODES } from '../data/preferences'
import { changeReadingMode } from '../redux/feedSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ReadingMode } from '../types'
import useOnClickOutside from '../hooks/useOnClickOutside'

export default function ReadingModeButton() {

    const dispatch = useAppDispatch()

    const container = useRef<HTMLDivElement>(null)

    const readingMode = useAppSelector((state) => state.feed.readingMode)

    const changeMode = (newMode: ReadingMode) => {

        if (newMode !== readingMode) {
            dispatch(changeReadingMode(newMode))
        }
    }

    const [dropdownVisible, setDropdownVisible] = useState(false)

    useOnClickOutside(container, dropdownVisible, () => setDropdownVisible(false))

    return (
        <div ref={container}  className="relative mt-2">
            
            <button onClick={() => {setDropdownVisible(!dropdownVisible)}} title="Reading Mode">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current text-gray-400 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            </button>

            { dropdownVisible &&

                <div  className="dark:bg-darksidebar absolute right-0 flex flex-col gap-2 z-10 bg-white w-48 mt-1 p-4 shadow-lg rounded-xl">
                    { Object.values(READING_MODES).map((item, index) => 
                        <button 
                            key={index} 
                            onClick={() => {changeMode(item.name as ReadingMode)}} 
                            className={"dark:text-white text-left hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded " + (readingMode === item.name && "text-accent dark:text-accent font-semibold")}>
                            {item.displayName}
                        </button>) 
                    }

                </div>
            }

        </div>
    )
}
