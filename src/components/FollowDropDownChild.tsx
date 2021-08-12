import { FeedlyProvider } from '../types'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { updateFeedProviders } from '../redux/feedSlice'


interface FollowDropDownChildProps {
    feedId: string
    selectedProvider: FeedlyProvider
}

export default function FollowDropDownChild({ feedId, selectedProvider }: FollowDropDownChildProps) {

    const dispatch = useAppDispatch()

    const feed = useAppSelector((state) => state.feed.feed.find((f) => f.id === feedId)!
)

    const following = feed.feedProviders.some((provider) => provider.feedId === selectedProvider.feedId)


    const onFollow = () => {
        //Get feed position in feeds, update its array
        dispatch(updateFeedProviders({ feedId: feed.id, provider: selectedProvider, action: following ? "remove" : "add"  }))
    }

    return (
        <div className=" flex items-center p-1 justify-between">
            <p className="primary-text font-medium">{feed.title}</p>

            <button 
                onClick={onFollow} 
                className={"text-xs border p-1 rounded hover:text-white transition duration-300 ease-in-out " + (following ? "border-accent text-accent hover:bg-accent" : "border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-accent hover:border-accent") }>
                { following ? "Unfollow" : "Follow" }
            </button>

        </div>
    )
}
