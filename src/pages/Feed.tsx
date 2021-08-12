import { useEffect, useState, useRef, useCallback } from 'react'
import { parse2 } from '../utility/parseXML'
import axios from 'axios'
import { Article, } from '../types'
import ArticleCard from '../components/ArticleCard'
import ArticleTitle from '../components/ArticleTitle'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { useParams } from 'react-router-dom'
import ReadingModeButton from '../components/ReadingModeButton'
import useOnClickOutside from '../hooks/useOnClickOutside'
import { showView } from '../redux/uiSlice'
import RefreshButton from '../components/RefreshButton'
import ErrorLayout from '../components/ErrorLayout'
import LoadingLayout from '../components/LoadingLayout'

interface FeedParams {
    id: string
}

export default function Feed() {
    
    const { id } = useParams<FeedParams>()

    const dispatch = useAppDispatch()

    const feed = useAppSelector((state) => state.feed.feed.find((f) => f.id === id))

    const readingMode = useAppSelector((state) => state.feed.readingMode)

    const [articles, setArticles] = useState<Article[] | []>([])
    const [visibleArticles, setVisibleArticles] = useState<Article[] | []>([])

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [offset, setOffset] = useState(20)
    const [count, setCount] = useState(0)

    const hasProviders = useCallback(() => {

        if (feed) {
            return feed.feedProviders.length > 0
        }
     
        return false

    }, [feed])

    const getFeed = useCallback(() => {

        if (hasProviders()) {

            let requests = feed!.feedProviders.map((provider) => axios.get(provider.feedId.slice(5)).catch((e) => null))

            axios.all(requests)
                .then(axios.spread((...responses) => {

                    if (responses && responses !== null) {

                        //Compile response data
                        let xmlObjects: string[] = []

                        for (let i = 0; i < responses.length; i++){

                            const response = responses[i]

                            if (response && response !== null && response.data) {
                                xmlObjects.push(response.data)
                            }
                            
                        
                        }

                        return parse2(xmlObjects, feed!.feedProviders.map((provider) => provider.title))

                    }

                    else {
                        throw new Error("Failed to retrieve any response from providers.")
                    }

                }))
                .then((result) => {
                
                    //Master and visible list
                    setCount(result.length - 20)

                    setArticles(result);
                    setVisibleArticles(result.slice(0, 20)) 
                    
                    setLoading(false)
                
                })
                .catch((error) => {
                    setLoading(false)
                    setError(true)
                })

        }

    }, [feed, hasProviders])

    const loadMore = useCallback(() => {
        
        if (count > 0) {
            setVisibleArticles([...visibleArticles, ...articles.slice(offset, offset + 20)])
            setCount(count - 20)
            setOffset(offset + 20)
        }
    }, [count, articles, visibleArticles, offset])

    const refresh = useCallback(() => {
        setError(false)
        setLoading(true)

        setTimeout(() => getFeed(), 2000)
    }, [getFeed])


    const container = useRef<HTMLDivElement>(null)
    const [dropdownVisible, setDropdownVisible] = useState(false)

    useOnClickOutside(container, dropdownVisible, () => setDropdownVisible(false))

    const showManageFeed = () => {

        if (feed) {
            dispatch(showView({ viewName: "manage_feed", params: { id: feed.id } }))
        }
       
    }

    const showDeleteFeed = () => {

        if (feed) {
            dispatch(showView({ viewName: "delete_feed", params: { id: feed.id } } ))
        }
    }

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
    }, [feed, getFeed])

    if (!feed) {
        return (
            <p className="secondary-text text-2xl" >No Feed!</p>
        )
    }

    return (
        <div className="flex flex-col">

            <div className="flex justify-between items-center mb-6">
                <h1 className="primary-text font-bold sm:text-7xl text-4xl">{feed.title}</h1>

                <div className={feed.feedProviders.length > 0 ? "flex items-center gap-6" : "hidden"}>

                    <RefreshButton onRefresh={refresh} loading={loading}/>

                    <ReadingModeButton/>

                    <div ref={container}  className="relative mt-2">
                    
                        <button onClick={() => setDropdownVisible(!dropdownVisible)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current text-gray-400 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                        </button>

                        { dropdownVisible &&

                            <div className="dark:bg-darksidebar absolute right-0 flex flex-col gap-2 z-10 bg-white w-48 mt-1 p-4 shadow-lg rounded-xl">

                                <button 
                                    onClick={showManageFeed}
                                    className="primary-text text-left dark:hover:bg-gray-800 hover:bg-gray-200 p-1 rounded">Manage Feed</button>

                                <button 
                                    onClick={showDeleteFeed}
                                    className="text-accent text-left dark:hover:bg-gray-800 hover:bg-gray-200 p-1 rounded">Delete Feed</button>

                            </div>
                        }

                    </div>

                </div>
            </div>

            <hr className="divider"/>

            {
                !hasProviders() ? 
                    <p className="secondary-text text-2xl">You haven't subscribed to any feeds!</p>

                :

                error ? 
                     <ErrorLayout onRetry={refresh}/>

                :

                loading ? 
                    <LoadingLayout/>

                :

                (articles && articles.length > 0) ? 

                <>
                    {visibleArticles.map((article, index) => readingMode === 'card' ? <ArticleCard key={index} article={article}/> : <ArticleTitle key={index} article={article}/>)}

                    {count > 0 && 
                        <div ref={setLastElement} className="mb-24">
                            <LoadingLayout/>
                        </div>

                    }
            
                </>

                :

                <p className="secondary-text font-bold text-xl">No articles today!</p>
                
            }

        </div>
    )
}
