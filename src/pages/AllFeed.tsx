import { useEffect, useState, useRef, useCallback } from 'react'
import { parse2 } from '../utility/parseXML'
import axios from 'axios'
import { Article, FeedlyProvider } from '../types'
import ArticleCard from '../components/ArticleCard'
import ArticleTitle from '../components/ArticleTitle'
import { useAppSelector } from '../redux/hooks'
import uniqBy from 'lodash/uniqBy'
import ReadingModeButton from '../components/ReadingModeButton'
import { Link } from 'react-router-dom'
import RefreshButton from '../components/RefreshButton'
import LoadingLayout from '../components/LoadingLayout'
import ErrorLayout from '../components/ErrorLayout'


export default function AllFeed() {
    
    const feeds = useAppSelector((state) => state.feed.feed)
    const readingMode = useAppSelector((state) => state.feed.readingMode)

    const [articles, setArticles] = useState<Article[] | []>([])
    const [visibleArticles, setVisibleArticles] = useState<Article[] | []>([])

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [offset, setOffset] = useState(20)
    const [count, setCount] = useState(0)

    const hasProviders = useCallback(() => {
        
        const len = feeds.length

        if (len === 0){
            return false
        }

        //As long as one has a provider should be g
        for (let i = 0; i < len; i++){
            if (feeds[i].feedProviders.length > 0) {
                return true
            }
        }

        return false

    }, [feeds])

    const getFeed = useCallback(() => {

        if (hasProviders()) {

            let providers: FeedlyProvider[] = []

            const len = feeds.length

            for (let i = 0; i < len; i++){
                providers.push(...feeds[i].feedProviders)
            }

            providers = uniqBy(providers, 'feedId')

            let requests = providers.map((provider) => axios.get(provider.feedId.slice(5)).catch((e) => null))

            axios.all(requests)
                .then(axios.spread((...responses) => {

                if (responses && responses !== null) {
                        //Compile response data
                        let xmlObjects: string[] = []

                        for (let i = 0; i < responses.length; i++){

                            const response = responses[i]

                            if (response && response !== null && response.data){
                            
                                xmlObjects.push(response.data)
                            }
                            

                        }

                        return parse2(xmlObjects, providers.map((provider) => provider.title))

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

    }, [feeds, hasProviders])

    const refresh = useCallback(() => {
        setError(false)
        setLoading(true)

        setTimeout(() => getFeed(), 2000)
    }, [getFeed])

    const loadMore = useCallback(() => {
        setVisibleArticles([...visibleArticles, ...articles.slice(offset, offset + 20)])
        setCount(count - 20)
        setOffset(offset + 20)
    }, [count, articles, visibleArticles, offset])

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

    }, [feeds, getFeed])

    return (
        <div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="primary-text title">Today</h1>

                <div className={hasProviders() ? "flex items-center gap-6" : "hidden"}>
                    <RefreshButton onRefresh={refresh} loading={loading}/>

                    <ReadingModeButton/>
                </div>


            </div>

            <hr className="divider"/>

            {
                !hasProviders() ? 
                    <div className="flex flex-col gap-4">
                        <p className="secondary-text text-2xl">You are not following any providers!</p>
                        <Link className="following-btn w-max" to="/discover">ADD PROVIDER</Link>
                     </div>

                :

                error ? 
                    <ErrorLayout onRetry={refresh}/>

                :

                loading ?
                    <LoadingLayout/>

                :

                (articles && articles.length > 0) ?
                    <>
                    {visibleArticles.map((article, index) => readingMode === 'card' ? <ArticleCard key={index} article={article}/> 
                        : <ArticleTitle key={index} article={article}/>)}

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
