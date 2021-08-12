import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router'
import { Article, FeedlyProvider } from '../types'
import axios from 'axios'
import { parse2 } from '../utility/parseXML'
import ArticleCard from '../components/ArticleCard'
import ArticleTitle from '../components/ArticleTitle'
import FollowDropDownChild from '../components/FollowDropDownChild'
import Loader from '../components/Loader'
import { useAppSelector } from '../redux/hooks'
import useOnClickOutside from '../hooks/useOnClickOutside'
import { request } from '../api/feedly'
import ErrorLayout from '../components/ErrorLayout'

interface FeedProviderDetailParams {
    id: string
}

export default function FeedProviderDetails() {

    const { id } = useParams<FeedProviderDetailParams>()

    const feeds = useAppSelector((state) => state.feed.feed)
    const readingMode = useAppSelector((state) => state.feed.readingMode)
    const subscribed = feeds.some((feed) => feed.feedProviders.some((provider) => provider.feedId === decodeURIComponent(id)))

    const [feedProvider, setFeedProvider] = useState<FeedlyProvider>()

    const [articles, setArticles] = useState<Article[] | []>([])
    const [visibleArticles, setVisibleArticles] = useState<Article[] | []>([])

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    //Loading More
    const [offset, setOffset] = useState(20)
    const [count, setCount] = useState(0)

    const getFeed = useCallback(() => {

        setError(false)
        setLoading(true)

        //If feedProvider already exists and the provider refers to the current one just get the articles
        if (feedProvider && feedProvider.feedId === decodeURIComponent(id)) {
            axios.get(feedProvider.feedId.slice(5))
                .then( async (response) => {

                    const articles = await parse2([response.data], [feedProvider.title])
                    
                    setArticles(articles)
                    setCount(articles.length - 20)
                    setVisibleArticles(articles.slice(0, 20))

                    setLoading(false)

                })
                .catch((e) => {
                    setLoading(false)
                    setError(true)
                })
        }

        else {
            //Initial Call
            axios.all([request(`feeds/${id}`), axios.get(decodeURIComponent(id).slice(5))])
                .then(axios.spread( async (...responses) => {

                    const provider = responses[0] as FeedlyProvider

                    const articles = await parse2([responses[1].data], [provider.title])

                    setFeedProvider(provider)

                    setArticles(articles)
                    setCount(articles.length - 20)
                    setVisibleArticles(articles.slice(0, 20))

                    setLoading(false)

                }))
                .catch((e) => {
                    setLoading(false)
                    setError(true)
                })

        }

    }, [id, feedProvider])


    const loadMore = useCallback(() => {
        
        if (count > 0) {
            setVisibleArticles([...visibleArticles, ...articles.slice(offset, offset + 20)])
            setCount(count - 20)
            setOffset(offset + 20)
        }
    }, [count, visibleArticles, articles, offset])


    //Loading
    const loader = useRef(loadMore)

    //UseRef to retrieve newest loadMore function
    const observer = useRef(
        new IntersectionObserver((entries) => {
            
            if (entries[0].isIntersecting){
                loader.current();
            }
        }, { threshold: 1 })
    )

    const [lastElement, setLastElement] = useState<any>(null)

    useEffect(() => {
        loader.current = loadMore
    }, [loadMore])

    useEffect(() => {
        const currentElement = lastElement
        const currentObserver = observer.current

        if (currentElement) {
            currentObserver.observe(currentElement)
        }

        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement)
            }
        }


    }, [lastElement])


    useEffect(() => {
        getFeed()
    }, [id, getFeed])

    const LoadingLayout = () => (
        <div className="flex justify-center">
            <Loader/>
        </div>
    )

    const [dropdownVisible, setDropdownVisible] = useState(false)

    const container = useRef<HTMLDivElement>(null)

    useOnClickOutside(container, dropdownVisible, () => setDropdownVisible(false))

    return (
        <div>

            {feedProvider && 
            <>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">

                    <h1 className="primary-text font-bold sm:text-7xl text-4xl sm:mb-0 mb-4">{feedProvider.title}</h1>

                    <div ref={container} className="relative">
                        <button 
                            onClick={() => setDropdownVisible(true)}
                            className={( subscribed ? "following-btn sm:w-max w-full" : "follow-btn sm:w-max w-full") }>{subscribed ? "FOLLOWING" : "FOLLOW"}
                        </button>

                        { dropdownVisible && 
                            <div className="dark:bg-darksidebar absolute right-0 flex flex-col gap-2 z-2 bg-white w-48 mt-2 p-4 shadow-lg rounded-xl">
                                { feeds.map((feed, index) => <FollowDropDownChild key={index} feedId={feed.id} selectedProvider={feedProvider}/>) }
                            </div>
                        }

                    </div>

                </div>

                <p className="secondary-text mb-6 text-sm sm:text-base">{feedProvider.description}</p>

                <hr className="divider"/>
            </>
            }

            {error ? 
                
                <ErrorLayout onRetry={getFeed} errorText="Could not retrieve feed! Check URL or try again."/>

            : (loading ? 
                <LoadingLayout/>
            :
            
            (articles && articles.length > 0 ) && 
                    
                    <>
                    {visibleArticles.map((article, index) => readingMode === 'card' ? <ArticleCard key={index} article={article}/> : <ArticleTitle key={index} article={article}/>)}

                    {count > 0 && 
                        <div ref={setLastElement} className="mb-24">
                            <LoadingLayout/>
                        </div>

                    }
                   
                    </>
            )
                        
            }

        </div>
    )
}
