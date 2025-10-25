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

const getCurrentDate = () => new Date().toISOString()

const addRestaurantReview = async (id: string, data: any) => {
    const payload = {
        "id": "",
        "restaurantId": id,
        "menuItemId": "",
        "text": data.text,
        "authorSub": "anonymous",
        "createdAt": getCurrentDate(),
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
        "comments": [],
        "images": data.images || null
    }

    try {
        const response = await http.post(`/reviews`, payload);
        return response;
    } catch (error) {
        console.error("Error submitting review:", error);
        throw error;
    }
}

const getPreSignedUrl = async () => {
    try {
        const response = await http.get(`/admin/uploads/presign`);
        return response;
    } catch (error) {
        console.error("Error getting presigned URL:", error);
        throw error;
    }
}


const convertImageToBuffer = async (imageUri: string): Promise<{ buffer: ArrayBuffer, contentType: string }> => {
    try {
        const response = await fetch(imageUri);
        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        return { buffer, contentType };
    } catch (error) {
        console.error("Error converting image to buffer:", error);
        throw error;
    }
}

const uploadImageToS3 = async (presignedUrl: string, imageBuffer: ArrayBuffer, contentType: string) => {
    try {
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: imageBuffer,
            headers: {
                'Content-Type': contentType,
            },
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

const uploadReviewImages = async (imageUris: string[]): Promise<string[]> => {
    if (!imageUris || imageUris.length === 0) {
        return [];
    }

    const uploadedImageKeys: string[] = [];

    for (let i = 0; i < imageUris.length; i++) {
        const imageUri = imageUris[i];

        try {
            const presignedResponse = await getPreSignedUrl();
            const { uploadUrl, key } = presignedResponse.data;

            const { buffer, contentType } = await convertImageToBuffer(imageUri);
            await uploadImageToS3(uploadUrl, buffer, contentType);

            uploadedImageKeys.push(key);
        } catch (error) {
            console.error(`Error uploading image ${imageUri}:`, error);
            throw error;
        }
    }

    return uploadedImageKeys;
}



const reviewService = {
    getlRestaurantReviewById,
    addRestaurantReview,
    getPreSignedUrl,
    uploadImageToS3,
    uploadReviewImages
}

export default reviewService;