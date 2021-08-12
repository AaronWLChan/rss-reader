import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { addFeed } from '../redux/feedSlice'
import { SubmitHandler, useForm } from 'react-hook-form'
import { showView } from '../redux/uiSlice'
import { v4 as uuidv4 } from 'uuid';

type Inputs = {
    title: string
}

export default function CreateNewFeed() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const dispatch = useAppDispatch()
    const feeds = useAppSelector((state) => state.feed.feed)

    const onSubmit: SubmitHandler<Inputs> = (data) => {

        dispatch(addFeed({
            id: uuidv4(),
            title: data.title,
            feedProviders: []
        }))

    }

    return (
        <div className="flex flex-col">
            <p className="primary-text title">Create New Feed</p>

            <p className="secondary-text mb-6 text-lg">Create a collection of sources you want to read.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    className={"bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 w-full focus:outline-none primary-text " + ( errors.title && "border border-accent" )  }
                    {...register("title", { required: true, validate: value => !feeds.some((f) => f.title.toLowerCase() === value.toLowerCase()) })}
                    placeholder="Title"/>

                { errors.title && errors.title.type === "required" && <p className="text-accent mb-6">This field is required!</p> }
                { errors.title && errors.title.type === "validate" && <p className="text-accent mb-6">This feed title is in use!</p> }


                <div className="flex gap-4">
                    <button className="following-btn" type="submit">SAVE</button>
                    <button 
                        type="button" 
                        className="border px-4 py-2 text-gray-500 text-xs font-semibold rounded-full dark:border-gray-600 hover:opacity-70" 
                        onClick={() => {dispatch(showView({ viewName: "none" }))}}>CANCEL</button>
                </div>

            </form>

        </div>
    )
}
