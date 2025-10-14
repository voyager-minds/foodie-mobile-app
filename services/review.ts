import http from "./http";

const getlRestaurantReviewById = async (id: string) => {
    try {
        const response = await http.get(`/reviews?restaurantId=${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
    }
}

const date = new Date()

const addRestaurantReview = async (id, data: any) => {
    const payload = {
        "id": "",
        "restaurantId": id,
        "menuItemId": "",
        "text": data.ratings.text,
        "authorSub": "anonymous",
        "createdAt": date,
        "localHelpful": false,
        "localHelpfulCount": 0,
        "showReplies": false,
        "ratings": {
            "food": data.ratings.food,
            "service": data.ratings.service,
            "ambience": data.ratings.ambience,
            "value": data.ratings.value,
            "overall": data.ratings.food
        },
        "status": "PENDING",
        "comments": []
    }

    try {
        const response = await http.post(`/reviews`, payload);
        return response;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
    }
}

const getPreSignedUrl = async () => {
    try {
        const response = await http.get(`/admin/uploads/presign`);
        return response;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
    }
}


const uploadImg = async (url) => {
    try {
        const response = await http.get(url);
        return response;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
    }
}



const reviewService = {
    getlRestaurantReviewById,
    addRestaurantReview,
    getPreSignedUrl,
    uploadImg
}

export default reviewService;