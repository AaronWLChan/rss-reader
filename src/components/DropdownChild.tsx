import React from 'react'
import { NavLink } from 'react-router-dom'
import { FeedlyProvider } from '../types'
import Image from './Image'

interface DropdownChildProps {
    provider: FeedlyProvider
    onClose: () => void
}

export default function DropdownChild({ provider, onClose }: DropdownChildProps) {

    const FallbackComponent = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current h-4 w-4 text-accent p-px rounded bg-white shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
        )
    }

    return (
        <NavLink 
            onClick={onClose}
            to={`/provider/${encodeURIComponent(provider.feedId)}`}
            activeClassName="flex items-center p-1 ml-8 mb-4 gap-4 bg-gray-200 dark:bg-gray-800 rounded-lg transition duration-200 ease-in-out" 
            className="flex items-center p-1 ml-8 my-2 gap-4 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition duration-200 ease-in-out">

                <Image
                    src={provider.iconUrl}
                    className="h-4 w-4 object-cover bg-white rounded p-px"
                    FallbackComponent={FallbackComponent}
                />
        
            <p className="primary-text font-semibold text-sm">{provider.title}</p>

        </NavLink>
    )
}
