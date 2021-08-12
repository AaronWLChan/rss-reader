import React from 'react'
import { Article } from '../types'

interface ArticleCardProps{
    article: Article
}


export default function ArticleTitle({ article }: ArticleCardProps) {
    return (
        <a className="flex mb-4 gap-8" href={article.link} target="_blank" rel="noreferrer">

            <div className="w-full flex flex-row justify-between gap-4 items-center dark:hover:bg-gray-800 hover:bg-gray-100 rounded-xl p-2 transition ease-in-out duration-300">

                <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">

                    <p className="text-xs sm:text-sm secondary-text font-semibold">{article.authors} / {article.published}</p>

                    <p className="primary-text font-bold text-sm">{article.title}</p>

                </div>


            </div>

        </a>
    )
}
