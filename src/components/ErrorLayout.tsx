import React from 'react'

interface ErrorLayoutProps {
    errorText?: string
    onRetry: () => void,
}

export default function ErrorLayout({ onRetry, errorText = "Could not retrieve feed!" }: ErrorLayoutProps) {
    return (
        <div>
            <p className="secondary-text font-bold text-xl mb-4">{errorText}</p>
            <button 
                onClick={onRetry}
                className="transition duration-200 ease-in-out hover:opacity-70 shadow-lg bg-accent text-white py-2 px-4 rounded-full font-bold tracking-wide">TRY AGAIN</button>
        </div>
    )
}
