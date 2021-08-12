import BusinessImage from '../assets/images/business.jpg'
import HealthImage from '../assets/images/health.jpg'
import NewsImage from '../assets/images/news.jpg'
import ScienceImage from '../assets/images/science.jpg'
import SportImage from '../assets/images/sport.jpg'
import TechImage from '../assets/images/tech.jpg'

const FEED_CATEGORIES = {

    SPORT: {
        name: "sport",
        colour: "rgba(254, 87, 56, 0.75)",
        imageURL: SportImage
    },

    NEWS: {
        name: "news",
        colour: "rgba(52, 199, 89, 0.75)",
        imageURL: NewsImage

    },

    HEALTH: {
        name: "health",
        colour: "rgba(0, 122, 255, 0.75)",
        imageURL: HealthImage

    },

    TECH: {
        name: "technology",
        colour: "rgba(255, 179, 64, 0.75)",
        imageURL: TechImage

    },

    BUSINESS: {
        name: "business",
        colour: "rgba(255, 212, 38, 0.75)",
        imageURL: BusinessImage

    },

    
    SCIENCE: {
        name: "science",
        colour: "rgba(125, 122, 255, 0.75)",
        imageURL: ScienceImage

    },


}

export const FEED_CATEGORY_ARRAY = [
    FEED_CATEGORIES.SPORT,
    FEED_CATEGORIES.HEALTH,
    FEED_CATEGORIES.NEWS,
    FEED_CATEGORIES.TECH,
    FEED_CATEGORIES.BUSINESS,
    FEED_CATEGORIES.SCIENCE
]

export default FEED_CATEGORIES