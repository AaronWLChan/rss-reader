import React, { useEffect, useState, useCallback } from 'react'
import { FeedlyProvider } from '../types'
import { useParams } from 'react-router-dom'
import query from '../api/feedly'
import FeedProviderItem from '../components/FeedProviderItem'
import ErrorLayout from '../components/ErrorLayout'
import LoadingLayout from '../components/LoadingLayout'

interface FeedCategoryParams {
    category: string
}

export default function FeedCategory() {

    const { category } = useParams<FeedCategoryParams>()

    const [providers, setProviders] = useState<FeedlyProvider[] | []>([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    const getProviders = useCallback(() => {
        query(category, 20)
            .then((response) => {
                setProviders(response.results)
                setLoading(false)

            })
            .catch((e) => {
                setError(true)
                setLoading(false)
            })
    }, [category])

    useEffect(() => {
        getProviders()
    }, [getProviders])

    return (
        <div>
            <h1 className="title primary-text capitalize">{category}</h1>

            <hr className="divider"/>

            {error ? <ErrorLayout onRetry={getProviders} errorText="Could not retrieve providers."/> 
            
            : loading ? <LoadingLayout/>

            : providers.map((provider) => <FeedProviderItem key={provider.feedId} feedProvider={provider}/>)
            
            }

        </div>
    )
}
