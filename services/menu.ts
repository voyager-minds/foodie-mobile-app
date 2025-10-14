import http from "./http";

const getlRestaurantMenuById = async (id) => {
    try {
        const response = await http.get(`/restaurants/${id}/menu`);
        return response;
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        throw error;
    }
}

const menuService = {
    getlRestaurantMenuById
}

export default menuService;