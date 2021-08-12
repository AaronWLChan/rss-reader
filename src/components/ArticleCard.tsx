import React from 'react'
import { Article } from '../types'
import Image from './Image'

interface ArticleCardProps{
    article: Article
}

const extractText = (html: string) => {
    //This will still have HTML entities...
    let plainText = html.replace(/<[^>]+>/g, '')

    plainText = plainText.replace(/&nbsp;/g, ' ')

    //If larger than 450 chars, truncate
    if (plainText.length > 250) {
        return plainText.slice(0, 250).trimEnd() + "..."
    }

    return plainText

}

export default function ArticleCard({ article }: ArticleCardProps) {

    const FallbackItemImageComponent = () => {
        return (
            <div className="flex justify-center items-center bg-gray-100 dark:bg-darksidebar rounded-lg shadow" style={{ height: 100, minWidth:200 }}>

                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current h-16 w-16 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        )
    }


    return (
        <div className="flex sm:flex-row flex-col mb-16 gap-4 sm:gap-8 items-start">

            {article.image && 
                <Image className="object-cover rounded-lg overflow-hidden" FallbackComponent={FallbackItemImageComponent} src={article.image} style={{height: 100, minWidth: 200}}/>
            }

            <div className="w-full">

                <div>

                    <div className="flex gap-2 mb-1 items-center">

                        <p className="text-sm secondary-text font-medium">{article.authors} / {article.published}</p>
                    </div>

                </div>
                
                <a className="primary-text font-semibold sm:text-2xl hover:underline" href={article.link} target="_blank" rel="noreferrer">{article.title}</a>

                {(article.description && article.description !== "null")  && 
                    <p className="secondary-text text-sm sm:text-base">{extractText(article.description)}</p>
                }

            </div>

        </div>
    )
}
