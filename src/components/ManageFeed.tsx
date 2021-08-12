import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { SubmitHandler, useForm } from 'react-hook-form'
import FeedProviderItem from './FeedProviderItem'
import { updateFeed } from '../redux/feedSlice'
import { showView } from '../redux/uiSlice'

/*
Manage which providers are attached to feed
Able to remove feed

*/
interface ManageFeedProps {
    id: string
}

type Inputs = {
    title: string
}

type ManageFeedTabType = "details" | "following"

export default function ManageFeed({ id }: ManageFeedProps) {
    
    const dispatch = useAppDispatch()

    const feeds = useAppSelector((state) => state.feed.feed)
    const feed = feeds.find((f) => f.id === id)

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        
        //Update feed title
        dispatch(updateFeed( { id: feed!.id, newName: data.title}))

    }

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    
    const [activeTab, setActiveTab] = useState<ManageFeedTabType>("details")

    return (
        <div>
            <p className="primary-text title">Manage Feed</p>
            <p className="secondary-text font-bold text-xl mb-4">{feed?.title}</p>

            {feed && 

                <>
                    <div className="flex mb-8 gap-6 border-b text-gray-400">
                        <button onClick={() => {setActiveTab("details")}} className={activeTab === "details" ? "p-2 -m-px text-accent border-b-2 border-accent font-semibold" : "p-2"}>Details</button>
                        <button onClick={() => {setActiveTab("following")}}className={activeTab === "following" ? "p-2 -m-px text-accent border-b-2 border-accent font-semibold" : "p-2"}>Following</button>
                    </div>

                    {activeTab === "details" ? 
                    
                        <>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

                                <label className={"text-gray-400 mb-2 text-sm " + ( errors.title && "text-accent" )}>Title</label>
                                <input
                                    defaultValue={feed.title}
                                    className={"bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 w-full focus:outline-none primary-text " + ( errors.title && "border border-accent" )  }
                                    {...register("title", { required: true, validate: value => value.toLowerCase() === feed.title.toLowerCase() || !feeds.some((f) => f.title.toLowerCase() === value.toLowerCase())  })}
                                    placeholder="Title"/>

                                { errors.title && errors.title.type === "required" && <p className="text-accent mb-6">This field is required!</p> }
                                { errors.title && errors.title.type === "validate" && <p className="text-accent mb-6">This title is already in use!</p> }

                                <div className="flex gap-4">
                                    <button className="following-btn" type="submit">SAVE</button>
                                    <button className="border px-4 py-2 text-gray-500 text-xs font-semibold rounded-full dark:border-gray-600 hover:opacity-70" onClick={() => dispatch(showView({ viewName: "none" }))}>CANCEL</button>
                                </div>

                            </form>

                        </>

                        :

                        <div>
                            {feed.feedProviders && feed.feedProviders.length > 0 ? 
                            
                                feed.feedProviders.map((provider, index) => <FeedProviderItem key={index} feedProvider={provider}/>)

                                :

                                <p className="secondary-text text-2xl">You are not following any providers!</p>
                            }

                        </div>
                    }


                </>
            }
          

        </div>
    )
}
