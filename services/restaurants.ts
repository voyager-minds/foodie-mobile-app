import http from "./http";

const fetchAllRestaurants = async () => {
    try {
        const response = await http.get('/restaurants');
        return response;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
    }
}

const getlRestaurantById = async (id: string) => {
    try {
        const response = await http.get(`/restaurants/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
    }
}

const getlRestaurantMenuById = async (id: string) => {
    try {
        const response = await http.get(`/restaurants/${id}/menu`);
        return response;
    } catch (error) {
        console.error("Error fetching restaurant menu:", error);
        throw error;
    }
}

const getRestaurantReviews = async (id: string, page: number = 1) => {
    try {
        const response = await http.get(`/reviews?restaurantId=${id}&page=${page}`);
        return response;
    } catch (error) {
        console.error("Error fetching restaurant reviews:", error);
        throw error;
    }
}

export interface Ratings {
    food: number;
    service: number;
    ambience: number;
    value: number;
}

const postRestaurantReview = async (id: string, reviewData: { text: string; ratings: Ratings; images?: string[] }) => {
    try {
        const response = await http.post(`/restaurants/${id}/reviews`, reviewData);
        return response;
    } catch (error) {
        console.error("Error posting restaurant review:", error);
        throw error;
    }
}

const postReviewComment = async (reviewId: string, commentData: { text: string }) => {
    try {
        const response = await http.post(`/reviews/${reviewId}/comments`, commentData);
        return response;
    } catch (error) {
        console.error("Error posting review comment:", error);
        throw error;
    }
}

const restaurantService = {
    fetchAllRestaurants,
    getlRestaurantById,
    getlRestaurantMenuById,
    getRestaurantReviews,
    postRestaurantReview,
    postReviewComment
}

export default restaurantService;