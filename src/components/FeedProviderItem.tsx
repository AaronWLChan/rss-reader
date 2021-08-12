import { useState } from 'react'
import { useRef } from 'react'
import { FeedlyProvider } from '../types'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'
import FollowDropDownChild from './FollowDropDownChild'
import useOnClickOutside from '../hooks/useOnClickOutside'
import Image from './Image'

interface FeedProviderItemProps {
    feedProvider: FeedlyProvider
}

// HOW TO HANDLE CREATE NEW FEED // SWAP BETWEEN VIEWS
export default function FeedProviderItem({ feedProvider }: FeedProviderItemProps) {

    const container = useRef<HTMLDivElement>(null)

    const [dropdownVisible, setDropdownVisible] = useState(false)

    const feeds = useAppSelector((state) => state.feed.feed)

    const subscribed = feeds.some((feed) => feed.feedProviders.some((provider) => provider.feedId === feedProvider.feedId))

    useOnClickOutside(container, dropdownVisible, () => setDropdownVisible(false))

    const onFollowClick = () => {
        setDropdownVisible(true)
    }

    const getRootURL = () => {

        if (feedProvider.website) {
            return new URL(feedProvider.website).hostname
        }

        return undefined

    }

    const getLink = () => {
        if (feedProvider.website) {
            const url = new URL(feedProvider.website)

            return url.protocol + "//" + url.hostname
        }

        return undefined
    }

    const FallbackComponent = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current h-8 w-8 text-accent p-px rounded bg-white shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
        )
    }

    return (
        <div className="flex justify-between mb-10 items-center gap-4">

            <div className="flex flex-row items-center gap-4 sm:gap-8">

                <Image 
                    src={feedProvider.iconUrl}
                    FallbackComponent={FallbackComponent}
                    className="h-8 w-8 object-cover bg-white rounded p-px"
                />
         
                <div className="flex flex-col">
                    <Link to={`/provider/${encodeURIComponent(feedProvider.feedId)}`} className="font-medium text-base sm:text-xl hover:underline primary-text">{feedProvider.title}</Link>
                    <a href={getLink()} target="_blank" rel="noopener noreferrer" className="secondary-text hover:underline text-xs sm:text-base">{getRootURL()}</a>
                </div>
            </div>

            <div ref={container} className="relative">
                <button 
                    onClick={onFollowClick}
                    className={"w-24 sm:w-28 " + (subscribed ? "following-btn" : "follow-btn")}>{subscribed ? "FOLLOWING" : "FOLLOW"}</button>

                { (dropdownVisible && feeds.length > 0) &&
                
                    <div className="absolute dark:bg-darksidebar right-0 flex flex-col gap-2 z-10 bg-white w-48 mt-2 p-4 shadow-lg rounded-xl">

                        { feeds.map((feed) => <FollowDropDownChild key={feed.id} feedId={feed.id} selectedProvider={feedProvider}/>) }

                    </div>
                
                }
              

            </div>
            
        </div>
    )
}
