import restaurantService from '@/services/restaurants';
import reviewService from '@/services/review';
import { Ionicons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Keyboard,
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Camera from '../../components/Camera/Camera';
import { useTheme } from '../../store/useTheme';
import { reviewsStyles } from './styles';

// Utility function to calculate overall rating
const calculateOverallRating = (ratings: Ratings): number => {
	if (!ratings) return 0;
	const { food = 0, service = 0, ambience = 0, value = 0 } = ratings;
	return Math.round(((food + service + ambience + value) / 4) * 10) / 10;
};

// Utility function to format date
const formatReviewDate = (dateString: string): string => {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	} catch {
		return 'Unknown date';
	}
};

export interface Ratings {
	food: number;
	service: number;
	ambience: number;
	value: number;
}

interface Review {
	id: string;
	restaurantId: string;
	menuItemId?: string;
	authorSub: string;
	ratings: Ratings;
	text: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	comments?: Comment[];
}

interface Comment {
	id: string;
	text: string;
	authorSub: string;
	createdAt: string;
}

interface Restaurant {
	id: string;
	name: string;
	avgOverall?: number;
	avgFood?: number;
	avgService?: number;
	avgAmbience?: number;
	avgValue?: number;
	countReviews?: number;
}

export default function ReviewsScreen() {
	const { colors, isDarkMode, toggleTheme } = useTheme();
	const styles = reviewsStyles(colors);
	const router = useRouter();
	const { restaurantId, restaurantName } = useLocalSearchParams<{
		restaurantId: string;
		restaurantName: string;
	}>();
	const [cameraPermission, requestCameraPermission] = useCameraPermissions();

	const [loading, setLoading] = useState(true);
	const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loadingReviews, setLoadingReviews] = useState(false);
	const [reviewsPage, setReviewsPage] = useState(1);
	const [reviewsTotalPages, setReviewsTotalPages] = useState(1);

	const [showAddReviewModal, setShowAddReviewModal] = useState(false);
	const [newReviewText, setNewReviewText] = useState('');
	const [newReviewRatings, setNewReviewRatings] = useState<Ratings>({
		food: 5,
		service: 5,
		ambience: 5,
		value: 5,
	});
	const [showCamera, setShowCamera] = useState(false);
	const [reviewImages, setReviewImages] = useState<string[]>([]);

	// Debug: Log state changes
	useEffect(() => {
		console.log('showCamera state changed:', showCamera);
	}, [showCamera]);

	// replies text state keyed by review id
	const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
	// which review's reply section is open
	const [openReplyIds, setOpenReplyIds] = useState<Record<string, boolean>>({});

	// fetch restaurant basic info
	const fetchRestaurant = useCallback(async () => {
		if (!restaurantId) return;

		try {
			const res = await restaurantService.getlRestaurantById(restaurantId);
			setRestaurant(res.data);
		} catch (err) {
			console.error(err);
			Alert.alert('Error', 'Could not load restaurant details.');
		}
	}, [restaurantId]);

	// fetch reviews (paginated)
	const fetchReviews = useCallback(
		async (page = 1) => {
			if (!restaurantId) return;

			setLoadingReviews(true);
			try {
				const res = await restaurantService.getRestaurantReviews(
					restaurantId,
					page
				);
				console.log('Reviews fetched:', res.data);

				// Handle the API response structure: { page: 1, items: [...] }
				const reviewsData = res.data;
				const reviewItems = Array.isArray(reviewsData.items)
					? reviewsData.items
					: [];

				console.log('API Response:', reviewsData);
				console.log('Parsed review items:', reviewItems);
				console.log('Review items length:', reviewItems.length);

				// Validate each review item
				const validReviews = reviewItems.filter(
					(item: any) =>
						item &&
						typeof item === 'object' &&
						item.id &&
						item.ratings &&
						typeof item.ratings === 'object'
				);

				console.log('Valid reviews:', validReviews.length);
				setReviews(validReviews);
				setReviewsPage(reviewsData.page || page);
				setReviewsTotalPages(
					reviewsData.totalPages ||
						Math.max(1, Math.ceil(validReviews.length / 10))
				);
			} catch (err) {
				console.error('Error fetching reviews:', err);
				// Fallback to empty state
				setReviews([]);
				setReviewsPage(page);
				setReviewsTotalPages(1);
			} finally {
				setLoadingReviews(false);
			}
		},
		[restaurantId]
	);

	useEffect(() => {
		if (!restaurantId) {
			console.error('No restaurant ID provided');
			setLoading(false);
			return;
		}

		console.log('Loading reviews for restaurant:', restaurantId);
		fetchRestaurant();
		fetchReviews(1);
		setLoading(false);
	}, [fetchRestaurant, fetchReviews, restaurantId]);

	// toggle reply section
	const toggleReplySection = (reviewId: string) => {
		setOpenReplyIds((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
	};

	// post comment (reply) to review
	const addReply = async (reviewId: string) => {
		Keyboard.dismiss();
		const text = (replyTexts[reviewId] || '').trim();
		if (!text) return;
		try {
			const res = await restaurantService.postReviewComment(reviewId, { text });
			// Update local UI — append comment to that review
			setReviews((prev: Review[]) =>
				prev.map((r) =>
					r.id === reviewId
						? {
								...r,
								comments: [...(r.comments || []), res.data.comment || res.data],
						  }
						: r
				)
			);
			setReplyTexts((prev) => ({ ...prev, [reviewId]: '' }));
			Alert.alert('Success', 'Reply posted');
		} catch (err) {
			console.error(err);
			Alert.alert('Error', 'Could not post reply.');
		}
	};

	// Handle image capture from camera
	const handleImageCaptured = (imageUri: string) => {
		setReviewImages((prev) => [...prev, imageUri]);
		setShowCamera(false);
	};

	// Remove image from review
	const removeImage = (index: number) => {
		setReviewImages((prev) => prev.filter((_, i) => i !== index));
	};

	// Handle camera opening with permission check
	const openCamera = async () => {
		console.log('Opening camera...');

		try {
			if (!cameraPermission) {
				const permission = await requestCameraPermission();
				if (!permission.granted) {
					Alert.alert(
						'Permission Required',
						'Camera permission is required to take photos.'
					);
					return;
				}
			} else if (!cameraPermission.granted) {
				const permission = await requestCameraPermission();
				if (!permission.granted) {
					Alert.alert(
						'Permission Required',
						'Camera permission is required to take photos.'
					);
					return;
				}
			}

			setShowCamera(true);
		} catch (error) {
			console.error('Error in openCamera:', error);
			Alert.alert(
				'Error',
				'Failed to open camera: ' +
					(error instanceof Error ? error.message : 'Unknown error')
			);
		}
	};

	// add a review for restaurant
	const submitReview = async () => {
		Keyboard.dismiss();
		const text = newReviewText.trim();
		if (!text) {
			Alert.alert('Validation', 'Please write a review.');
			return;
		}
		if (!restaurantId) return;

		try {
			const reviewData = {
				text,
				ratings: newReviewRatings,
				images: reviewImages, // Include images in the review data
			};
			const res = await reviewService.addRestaurantReview(
				restaurantId,
				reviewData
			);
			Alert.alert('Thanks!', 'Your review has been posted.');
		} catch (err) {
			console.error(err);
			Alert.alert('Error', 'Could not submit review.');
		}
	};

	// pagination controls for reviews
	const previousPage = () => {
		if (reviewsPage <= 1) return;
		const next = reviewsPage - 1;
		fetchReviews(next);
	};

	const nextPage = () => {
		if (reviewsPage >= reviewsTotalPages) return;
		const next = reviewsPage + 1;
		fetchReviews(next);
	};

	// Render: single review item
	const renderReview = ({ item }: { item: Review }) => {
		if (!item || !item.id) {
			return null;
		}

		return (
			<View style={styles.reviewCard}>
				<View style={styles.reviewHeader}>
					<View style={styles.reviewerAvatar}>
						<Text style={styles.avatarText}>
							{(item.authorSub?.[0] || 'U').toUpperCase()}
						</Text>
					</View>
					<View style={{ flex: 1, marginLeft: 10 }}>
						<Text style={styles.reviewerName}>
							{item.authorSub || 'Anonymous'}
						</Text>
						<Text style={styles.reviewDate}>
							{formatReviewDate(item.createdAt || new Date().toISOString())}
						</Text>
					</View>
					<View style={styles.reviewRating}>
						<Text style={styles.ratingNumber}>
							{item.ratings
								? calculateOverallRating(item.ratings).toFixed(1)
								: '0.0'}
						</Text>
					</View>
				</View>

				<Text style={styles.reviewText}>{item.text || 'No review text'}</Text>

				{/* Detailed Ratings */}
				<View style={styles.detailedRatings}>
					<View style={styles.ratingRow}>
						<Text style={styles.detailRatingLabel}>Food:</Text>
						<View style={styles.ratingStars}>
							{[1, 2, 3, 4, 5].map((star) => (
								<Ionicons
									key={star}
									name='star'
									size={12}
									color={star <= (item.ratings?.food || 0) ? '#ffb74d' : '#ddd'}
								/>
							))}
							<Text style={styles.ratingValue}>{item.ratings?.food || 0}</Text>
						</View>
					</View>
					<View style={styles.ratingRow}>
						<Text style={styles.detailRatingLabel}>Service:</Text>
						<View style={styles.ratingStars}>
							{[1, 2, 3, 4, 5].map((star) => (
								<Ionicons
									key={star}
									name='star'
									size={12}
									color={
										star <= (item.ratings?.service || 0) ? '#ffb74d' : '#ddd'
									}
								/>
							))}
							<Text style={styles.ratingValue}>
								{item.ratings?.service || 0}
							</Text>
						</View>
					</View>
					<View style={styles.ratingRow}>
						<Text style={styles.detailRatingLabel}>Ambience:</Text>
						<View style={styles.ratingStars}>
							{[1, 2, 3, 4, 5].map((star) => (
								<Ionicons
									key={star}
									name='star'
									size={12}
									color={
										star <= (item.ratings?.ambience || 0) ? '#ffb74d' : '#ddd'
									}
								/>
							))}
							<Text style={styles.ratingValue}>
								{item.ratings?.ambience || 0}
							</Text>
						</View>
					</View>
					<View style={styles.ratingRow}>
						<Text style={styles.detailRatingLabel}>Value:</Text>
						<View style={styles.ratingStars}>
							{[1, 2, 3, 4, 5].map((star) => (
								<Ionicons
									key={star}
									name='star'
									size={12}
									color={
										star <= (item.ratings?.value || 0) ? '#ffb74d' : '#ddd'
									}
								/>
							))}
							<Text style={styles.ratingValue}>{item.ratings?.value || 0}</Text>
						</View>
					</View>
				</View>

				<View style={styles.reviewActions}>
					<TouchableOpacity
						onPress={() => toggleReplySection(item.id)}
						style={styles.replyButton}>
						<Text>💬 Reply ({item?.comments?.length || 0})</Text>
					</TouchableOpacity>
				</View>

				{openReplyIds[item.id] && (
					<View style={styles.replySection}>
						{item.comments && item.comments.length > 0 ? (
							<View style={styles.commentsList}>
								{item.comments.map((c: Comment) => (
									<View
										key={c.id}
										style={styles.commentItem}>
										<View style={styles.commentHeader}>
											<Text style={styles.commentAuthor}>
												{c.authorSub || 'U'}
											</Text>
											<Text style={styles.commentDate}>
												{new Date(c.createdAt).toLocaleDateString()}
											</Text>
										</View>
										<Text style={styles.commentText}>{c.text}</Text>
									</View>
								))}
							</View>
						) : (
							<Text style={{ color: '#666', marginBottom: 8 }}>
								No replies yet
							</Text>
						)}

						<TextInput
							placeholder='Write a reply...'
							value={replyTexts[item.id] || ''}
							onChangeText={(t: string) =>
								setReplyTexts((p) => ({ ...p, [item.id]: t }))
							}
							style={styles.commentInput}
							multiline
						/>
						<TouchableOpacity
							style={[
								styles.postReplyBtn,
								!(replyTexts[item.id] || '').trim() && styles.disabledBtn,
							]}
							onPress={() => addReply(item.id)}
							disabled={!replyTexts[item.id] || !replyTexts[item.id].trim()}>
							<Text style={styles.postReplyText}>Post Reply</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	};

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator
					size='large'
					color='#ff7f50'
				/>
			</View>
		);
	}

	if (!restaurantId) {
		return (
			<View style={styles.centered}>
				<Text style={{ color: '#ff7f50', fontSize: 16, textAlign: 'center' }}>
					No restaurant selected.{'\n'}Please go back and try again.
				</Text>
				<TouchableOpacity
					style={{
						marginTop: 20,
						padding: 10,
						backgroundColor: '#ff7f50',
						borderRadius: 8,
					}}
					onPress={() => router.back()}>
					<Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	try {
		return (
			<View style={styles.screen}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backButton}>
						<Ionicons
							name='arrow-back'
							size={24}
							color='#333'
						/>
					</TouchableOpacity>
					<View style={styles.headerContent}>
						<Text style={styles.headerTitle}>Reviews</Text>
						<Text style={styles.headerSubtitle}>
							{restaurantName || restaurant?.name || 'Restaurant'}
						</Text>
					</View>
				</View>

				{/* Restaurant Rating Summary */}
				{restaurant && (
					<View style={styles.summaryCard}>
						<View style={styles.ratingOverview}>
							<Text style={styles.overallRating}>
								{restaurant.avgOverall?.toFixed(1) || '0.0'}
							</Text>
							<View style={styles.starsContainer}>
								{[1, 2, 3, 4, 5].map((star) => (
									<Ionicons
										key={star}
										name='star'
										size={16}
										color={
											star <= (restaurant.avgOverall || 0) ? '#ffb74d' : '#ddd'
										}
									/>
								))}
							</View>
							<Text style={styles.reviewCount}>
								{restaurant.countReviews || 0} reviews
							</Text>

							{/* Detailed Average Ratings */}
							<View style={styles.avgRatingsBreakdown}>
								<View style={styles.avgRatingRow}>
									<Text style={styles.avgRatingLabel}>Food:</Text>
									<Text style={styles.avgRatingValue}>
										{restaurant.avgFood?.toFixed(1) || '0.0'}
									</Text>
								</View>
								<View style={styles.avgRatingRow}>
									<Text style={styles.avgRatingLabel}>Service:</Text>
									<Text style={styles.avgRatingValue}>
										{restaurant.avgService?.toFixed(1) || '0.0'}
									</Text>
								</View>
								<View style={styles.avgRatingRow}>
									<Text style={styles.avgRatingLabel}>Ambience:</Text>
									<Text style={styles.avgRatingValue}>
										{restaurant.avgAmbience?.toFixed(1) || '0.0'}
									</Text>
								</View>
								<View style={styles.avgRatingRow}>
									<Text style={styles.avgRatingLabel}>Value:</Text>
									<Text style={styles.avgRatingValue}>
										{restaurant.avgValue?.toFixed(1) || '0.0'}
									</Text>
								</View>
							</View>
						</View>
						<TouchableOpacity
							style={styles.writeReviewBtn}
							onPress={() => setShowAddReviewModal(true)}>
							<Ionicons
								name='create-outline'
								size={16}
								color='#fff'
							/>
							<Text style={styles.writeReviewText}>Write Review</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Reviews List */}
				{loadingReviews ? (
					<View style={styles.centered}>
						<ActivityIndicator
							size='small'
							color='#ff7f50'
						/>
						<Text>Loading reviews...</Text>
					</View>
				) : reviews.length === 0 ? (
					<View style={styles.emptyState}>
						<Ionicons
							name='chatbox-ellipses-outline'
							size={48}
							color='#ccc'
						/>
						<Text style={styles.emptyTitle}>No Reviews Yet</Text>
						<Text style={styles.emptySubtitle}>
							Be the first to share your experience!
						</Text>
						<TouchableOpacity
							style={styles.addReviewBtn}
							onPress={() => setShowAddReviewModal(true)}>
							<Text style={styles.addReviewText}>Write a Review</Text>
						</TouchableOpacity>
					</View>
				) : (
					<>
						<Text style={{ padding: 16, color: '#666' }}>
							Found {reviews.length} reviews
						</Text>
						<FlatList
							data={reviews}
							keyExtractor={(r: Review) =>
								r.id?.toString() || Math.random().toString()
							}
							renderItem={renderReview}
							style={styles.reviewsList}
							contentContainerStyle={{ paddingBottom: 20 }}
							showsVerticalScrollIndicator={true}
							scrollEnabled={true}
							nestedScrollEnabled={true}
							removeClippedSubviews={false}
							initialNumToRender={10}
							maxToRenderPerBatch={10}
							windowSize={10}
							ListEmptyComponent={
								<View style={styles.emptyState}>
									<Ionicons
										name='chatbox-ellipses-outline'
										size={48}
										color='#ccc'
									/>
									<Text style={styles.emptyTitle}>No Reviews Yet</Text>
									<Text style={styles.emptySubtitle}>
										Be the first to share your experience!
									</Text>
								</View>
							}
							ListFooterComponent={
								reviewsTotalPages > 1 ? (
									<View style={styles.pagination}>
										<TouchableOpacity
											style={[
												styles.pageButton,
												reviewsPage === 1 && styles.disabledBtn,
											]}
											disabled={reviewsPage === 1}
											onPress={previousPage}>
											<Text style={styles.pageButtonText}>
												&laquo; Previous
											</Text>
										</TouchableOpacity>

										<Text style={styles.pageInfo}>
											Page {reviewsPage} / {reviewsTotalPages}
										</Text>

										<TouchableOpacity
											style={[
												styles.pageButton,
												reviewsPage === reviewsTotalPages && styles.disabledBtn,
											]}
											disabled={reviewsPage === reviewsTotalPages}
											onPress={nextPage}>
											<Text style={styles.pageButtonText}>Next &raquo;</Text>
										</TouchableOpacity>
									</View>
								) : null
							}
						/>
					</>
				)}

				{/* Add Review Modal */}
				<Modal
					visible={showAddReviewModal}
					animationType='slide'
					transparent>
					<View style={styles.modalOverlay}>
						<View style={styles.addReviewModal}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Write a Review</Text>
								<TouchableOpacity
									onPress={() => {
										Keyboard.dismiss();
										setShowAddReviewModal(false);
									}}>
									<Ionicons
										name='close'
										size={24}
										color='#333'
									/>
								</TouchableOpacity>
							</View>

							<TextInput
								placeholder='Share your experience...'
								multiline
								value={newReviewText}
								onChangeText={setNewReviewText}
								style={styles.reviewInput}
								returnKeyType='done'
								blurOnSubmit={true}
								textAlignVertical='top'
							/>

							{/* Image Section */}
							<View style={styles.imageSection}>
								<View style={styles.imageSectionHeader}>
									<Text style={styles.imageSectionTitle}>Add Photos</Text>
									<TouchableOpacity
										style={styles.addPhotoButton}
										onPress={openCamera}>
										<Ionicons
											name='camera'
											size={16}
											color='#ff7f50'
										/>
										<Text style={styles.addPhotoText}>Add Photo</Text>
									</TouchableOpacity>
								</View>

								{reviewImages.length > 0 && (
									<ScrollView
										horizontal
										style={styles.imagePreviewContainer}>
										{reviewImages.map((imageUri, index) => (
											<View
												key={index}
												style={styles.imagePreview}>
												<Image
													source={{ uri: imageUri }}
													style={styles.previewImage}
												/>
												<TouchableOpacity
													style={styles.removeImageButton}
													onPress={() => removeImage(index)}>
													<Ionicons
														name='close-circle'
														size={20}
														color='#ff4444'
													/>
												</TouchableOpacity>
											</View>
										))}
									</ScrollView>
								)}
							</View>

							<View style={styles.ratingsContainer}>
								<Text style={styles.ratingsTitle}>Rate Your Experience:</Text>

								{/* Food Rating */}
								<View style={styles.ratingInput}>
									<Text style={styles.ratingLabel}>Food:</Text>
									<View style={styles.starRating}>
										{[1, 2, 3, 4, 5].map((star) => (
											<TouchableOpacity
												key={star}
												onPress={() =>
													setNewReviewRatings((prev) => ({
														...prev,
														food: star,
													}))
												}>
												<Ionicons
													name='star'
													size={20}
													color={
														star <= newReviewRatings.food ? '#ffb74d' : '#ddd'
													}
												/>
											</TouchableOpacity>
										))}
										<Text style={styles.modalRatingNumber}>
											{newReviewRatings.food}
										</Text>
									</View>
								</View>

								{/* Service Rating */}
								<View style={styles.ratingInput}>
									<Text style={styles.ratingLabel}>Service:</Text>
									<View style={styles.starRating}>
										{[1, 2, 3, 4, 5].map((star) => (
											<TouchableOpacity
												key={star}
												onPress={() =>
													setNewReviewRatings((prev) => ({
														...prev,
														service: star,
													}))
												}>
												<Ionicons
													name='star'
													size={20}
													color={
														star <= newReviewRatings.service
															? '#ffb74d'
															: '#ddd'
													}
												/>
											</TouchableOpacity>
										))}
										<Text style={styles.modalRatingNumber}>
											{newReviewRatings.service}
										</Text>
									</View>
								</View>

								{/* Ambience Rating */}
								<View style={styles.ratingInput}>
									<Text style={styles.ratingLabel}>Ambience:</Text>
									<View style={styles.starRating}>
										{[1, 2, 3, 4, 5].map((star) => (
											<TouchableOpacity
												key={star}
												onPress={() =>
													setNewReviewRatings((prev) => ({
														...prev,
														ambience: star,
													}))
												}>
												<Ionicons
													name='star'
													size={20}
													color={
														star <= newReviewRatings.ambience
															? '#ffb74d'
															: '#ddd'
													}
												/>
											</TouchableOpacity>
										))}
										<Text style={styles.modalRatingNumber}>
											{newReviewRatings.ambience}
										</Text>
									</View>
								</View>

								{/* Value Rating */}
								<View style={styles.ratingInput}>
									<Text style={styles.ratingLabel}>Value:</Text>
									<View style={styles.starRating}>
										{[1, 2, 3, 4, 5].map((star) => (
											<TouchableOpacity
												key={star}
												onPress={() =>
													setNewReviewRatings((prev) => ({
														...prev,
														value: star,
													}))
												}>
												<Ionicons
													name='star'
													size={20}
													color={
														star <= newReviewRatings.value ? '#ffb74d' : '#ddd'
													}
												/>
											</TouchableOpacity>
										))}
										<Text style={styles.modalRatingNumber}>
											{newReviewRatings.value}
										</Text>
									</View>
								</View>
							</View>

							<View style={styles.modalActions}>
								<TouchableOpacity
									style={styles.submitReviewBtn}
									onPress={submitReview}>
									<Text style={styles.submitReviewText}>Post Review</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.cancelBtn}
									onPress={() => {
										Keyboard.dismiss();
										setShowAddReviewModal(false);
									}}>
									<Text style={styles.cancelText}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				{/* Camera Modal */}
				{showCamera && (
					<View
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 9999,
						}}>
						<Camera
							onImageCaptured={handleImageCaptured}
							onClose={() => {
								console.log('Camera close button pressed');
								setShowCamera(false);
							}}
						/>
					</View>
				)}
			</View>
		);
	} catch (error) {
		console.error('Error rendering Reviews screen:', error);
	}
}
