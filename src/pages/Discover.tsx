import React, { useState } from 'react'
import { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import useOnClickOutside from '../hooks/useOnClickOutside'
import { useRef } from 'react'
import { FeedlyProvider } from '../types'
import debounce from 'lodash/debounce'
import query from '../api/feedly'
import { FEED_CATEGORY_ARRAY } from '../data/feedCategories'

export default function Discover() {

    const [feedProviders, setFeedProviders] = useState<FeedlyProvider[] | []>([])
    const [dropdownVisible, setDropdownVisible] = useState(false)

    const onQuery = (value: string) => {
        
        if (value) {

            query(value, 10)
                .then((response) => {
                    
                    setFeedProviders(response.results)
                    setDropdownVisible(true)
                })
                .catch((e) => {
                    setFeedProviders([])
                    setDropdownVisible(false)
                })
        }

        else {
            setDropdownVisible(false)
            setFeedProviders([])
        }
    }

    const debounceRef = useRef(debounce(onQuery, 350))

    const search = (e: ChangeEvent<HTMLInputElement>) => {
        debounceRef.current(e.target.value)
    }
    
    const container = useRef<HTMLDivElement>(null)

    useOnClickOutside(container, dropdownVisible, () => setDropdownVisible(false))

    const onFocus = () => {
        if (feedProviders.length > 0) {
            setDropdownVisible(true)
        }
    }
    
    return (
        <div>

            <h1 className="title primary-text">Discover</h1>

            <div ref={container} className="relative mb-6 w-full">
                <input
                    className="primary-text bg-gray-100 dark:bg-gray-800 rounded-full p-4 w-full sm:w-1/2 focus:outline-none"
                    onChange={search}
                    onFocus={onFocus}
                    placeholder="Search..."/>

                {dropdownVisible && 
                    <div className="absolute dark:bg-darksidebar left-0 flex flex-col gap-2 z-10 w-full sm:w-1/2 bg-white p-4 shadow-lg rounded-xl">

                    {feedProviders.length > 0 ? 
                        feedProviders.map((provider) =>
                        
                        <div key={provider.feedId} className="flex gap-2">

                            {provider.iconUrl && 
                                <img
                                alt={provider.title}
                                src={provider.iconUrl}
                                className="h-8 w-8 object-cover bg-white rounded p-px "
                                />
                            }

                            <Link 
                                className="primary-text dark:hover:bg-gray-800 hover:bg-gray-200 p-2 rounded-xl transition duration-200 ease-in-out w-full" 
                                to={`/provider/${encodeURIComponent(provider.feedId)}`}>
                                {provider.title}
                            </Link>
                        </div>)

                    :

                    <p className="primary-text">Couldn't find anything! Try another query.</p>
                    }

                     
                    </div>
                }
               

            </div>

            <hr className="divider"/>

            <div className="grid grid-cols-2 gap-4">

                {FEED_CATEGORY_ARRAY.map((category) => {
                    return (
                        <Link
                            key={category.name} 
                            to={`/discover/${category.name}`}
                            className="h-36 rounded-xl flex justify-center items-center hover:opacity-70 transition duration-300 ease-in-out shadow-lg" 
                            style={{ backgroundImage: `linear-gradient(${category.colour}, ${category.colour}) , url(${category.imageURL})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
                            <p className="font-extrabold text-white tracking-wide text-xl sm:text-2xl capitalize">{category.name}</p>
                        </Link>
                    )
                })}

            </div>

        </div>
    )
}
