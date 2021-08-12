import { Switch, Route } from 'react-router-dom'
import Index from '../pages/index'
import Discover from '../pages/Discover'
import FeedProviderDetails from '../pages/FeedProviderDetails'
import Feed from '../pages/Feed'
import NotFound from '../pages/NotFound'
import AllFeed from '../pages/AllFeed'
import FeedCategory from '../pages/FeedCategory'

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Index/>
            </Route>

            <Route path="/discover/:category">
                <FeedCategory/>
            </Route>
            
            <Route path="/discover">
                <Discover/>
            </Route>
            
            <Route path="/provider/:id">
                <FeedProviderDetails/>
            </Route>
            
            <Route exact path="/feed/all">
                <AllFeed/>
            </Route>
            
            <Route path="/feed/:id">
                <Feed/>
            </Route>

            <Route component={NotFound}/>

        </Switch>
    )
}
