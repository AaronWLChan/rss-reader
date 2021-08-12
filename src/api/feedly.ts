import axios from 'axios'
import { FeedlyQueryResponse } from '../types'

const BASE_URL = "http://cloud.feedly.com/v3/"


function queryString(obj: Object){
    return Object.entries(obj)
        .map(([index, val]) => `${index}=${val}`)
        .join('&')
}


export async function request(url: string, content: Object = {}){
    
    let query = `${BASE_URL}${url}?${queryString(content)}`

    return await axios.get(query)
                .then((r) => r.data)
                .catch((error) => {

                    if (error.response){
                        // console.log(error.response.data)
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                    }

                    else if (error.request){
                        //Request made but no response
                        // console.log(error.request)
                    }

                    else {
                        //Non API-related error
                        // console.log(error.message)
                    }

                })
}


export default async function query(queryString: string, count: number = 5): Promise<FeedlyQueryResponse>{

    const query = `${BASE_URL}search/feeds?query=${queryString}&count=${count}`
    
    return await axios.get(query)
                .then((r) => r.data)
                .catch((error) => {

                    if (error.response){
                        // console.log(error.response.data)
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                    }

                    else if (error.request){
                        //Request made but no response
                        // console.log(error.request)
                    }

                    else {
                        //Non API-related error
                        // console.log(error.message)
                    }

                })
}