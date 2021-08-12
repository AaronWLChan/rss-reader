import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Feed, FeedlyProvider, ReadingMode, SortMode } from "../types";
import FEEDS from '../data/feeds'
import { v4 as uuidv4 } from 'uuid';

export interface FeedState {
    feed: Feed[],
    readingMode: ReadingMode
    sortMode: SortMode,
}

const INITIAL_STATE: FeedState = {
    //Collection of user created feeds
    feed: [{
        id: uuidv4(),
        title: "My Feed",
        feedProviders: [FEEDS[0]]
    }],
    readingMode: "card",

    sortMode: "desc",
}

//Should be able to subscribe to the same provider in different feeds
const feedSlice = createSlice({
    name: "feedSlice",
    initialState: INITIAL_STATE,
    reducers: {
        
        changeReadingMode(state, action: PayloadAction<ReadingMode>){
            state.readingMode = action.payload
        },

        addFeed(state, action: PayloadAction<Feed>){
            state.feed = [...state.feed, action.payload]
        },

        removeFeed(state, action: PayloadAction<string>){
            state.feed = state.feed.filter((f) => f.id !== action.payload)
        },

        updateFeed(state, action: PayloadAction<{ id: string, newName: string }>){

            const { payload } = action

            //Find and replace
            state.feed = state.feed.map((f) => {

                if (f.id === payload.id) {
                    f.title = payload.newName
                }

                return f
            })

        },

        updateFeedProviders(state, action: PayloadAction<{ feedId: string, provider: FeedlyProvider, action: "add" | "remove" }>){

            const payload = action.payload

            let feeds = state.feed

            let newFeeds: Feed[] = feeds.map((f) => {

                if (f.id === payload.feedId){

                    //Map provider
                    if (payload.action === 'add'){
                        f.feedProviders = [...f.feedProviders, payload.provider]
                    }

                    //Remove from array
                    else {
                        f.feedProviders = f.feedProviders.filter((fp) => fp.feedId !== payload.provider.feedId)
                    }

                }

                return f

            })

            state.feed = newFeeds

        },


    }
})


export const { addFeed, removeFeed, changeReadingMode, updateFeed, updateFeedProviders } = feedSlice.actions

export default feedSlice.reducer