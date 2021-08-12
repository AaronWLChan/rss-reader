import React from 'react'

interface NavBarProps {
    onClick: () => void
}

export default function NavBar({ onClick }: NavBarProps) {
    return (
        <div className="sm:hidden pt-4 pl-8 w-full">

            <button onClick={onClick} className="hover:opacity-70 transition duration-300 ease-in-out">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current text-gray-400 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>

                
            </button>
        </div>
    )
}
