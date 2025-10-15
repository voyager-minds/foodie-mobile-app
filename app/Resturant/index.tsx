import restaurantService from '@/services/restaurants';
import reviewService from '@/services/review';
import { useTheme } from '@/store/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Modal,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { getImageUrl } from '../../utils/imageUtils';
import { restaurantStyles } from './styles';
import React from 'react';

// Utility function to calculate overall rating
const calculateOverallRating = (ratings: Ratings): number => {
	const { food, service, ambience, value } = ratings;
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

interface Restaurant {
	id: string;
	name: string;
	city: string;
	tags: string[];
	coverImage?: string;
	coverImageUrl?: string;
	coverImageKey?: string;
	avgOverall?: number;
	avgFood?: number;
	avgService?: number;
	avgAmbience?: number;
	avgValue?: number;
	countReviews?: number;
}

interface MenuItem {
	id: string;
	restaurantId: string;
	name: string;
	description: string;
	priceCents: number;
	currency: string;
	images: string[];
	isAvailable: boolean;
	createdAt: string;
	updatedAt: string;
}

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

export default function Index() {
	const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();

	const { colors, isDarkMode, toggleTheme } = useTheme();
	const styles = restaurantStyles(colors);

	const [loading, setLoading] = useState(true);
	const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

	const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
	const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);

	const [reviews, setReviews] = useState<Review[]>([]);
	const [loadingReviews, setLoadingReviews] = useState(false);
	const [reviewsPage, setReviewsPage] = useState(1);
	const [reviewsTotalPages, setReviewsTotalPages] = useState(1);

	const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
		null
	);
	const [showMenuModal, setShowMenuModal] = useState(false);

	const [showAddReviewModal, setShowAddReviewModal] = useState(false);
	const [newReviewText, setNewReviewText] = useState('');
	const [newReviewStars, setNewReviewStars] = useState('5');

	// replies text state keyed by review id
	const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

	// which review's reply section is open
	const [openReplyIds, setOpenReplyIds] = useState<Record<string, boolean>>({});

	// fetch restaurant details
	const fetchRestaurant = useCallback(async () => {
		setLoading(true);
		try {
			const res = await restaurantService.getlRestaurantById(restaurantId);

			setRestaurant(res.data);
		} catch (err) {
			console.error(err);
			Alert.alert('Error', 'Could not load restaurant details.');
		} finally {
			setLoading(false);
		}
	}, [restaurantId]);

	// fetch menu items
	const fetchMenuItems = useCallback(async () => {
		if (!restaurantId) return;

		setIsLoadingMenuItems(true);
		try {
			const res = await restaurantService.getlRestaurantMenuById(restaurantId);
			console.log('Menu items fetched:', res.data);
			setMenuItems(res.data || []);
		} catch (err) {
			console.error(err);
			Alert.alert('Error', 'Could not load menu items.');
		} finally {
			setIsLoadingMenuItems(false);
		}
	}, [restaurantId]);

	// fetch reviews (paginated)
	const fetchReviews = useCallback(
		async (page = 1) => {
			if (!restaurantId) return;

			setLoadingReviews(true);
			try {
				const res = await reviewService.getlRestaurantReviewById(restaurantId);
				console.log('Restaurant reviews fetched:', res.data);

				// Handle the API response structure: { page: 1, items: [...] }
				const reviewsData = res.data;
				const reviewItems = reviewsData.items || [];

				console.log('Restaurant reviews parsed:', reviewItems);
				setReviews(reviewItems);
				setReviewsPage(reviewsData.page || page);
				setReviewsTotalPages(
					reviewsData.totalPages ||
						Math.max(1, Math.ceil(reviewItems.length / 10))
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
		// load everything on mount
		fetchRestaurant();
		fetchMenuItems();
		fetchReviews(1);
	}, [fetchRestaurant, fetchMenuItems, fetchReviews]);

	// Utility: format price from cents (or fallback)
	const formatMenuPrice = (priceCents: number, currency = 'USD') => {
		if (priceCents == null) return '-';
		try {
			const value = priceCents / 100;
			// Basic Intl formatting — if unsupported on Android older versions fallback simple
			if (Platform.OS === 'android' && !Intl?.NumberFormat) {
				return `${currency} ${value.toFixed(2)}`;
			}
			return new Intl.NumberFormat(undefined, {
				style: 'currency',
				currency,
				maximumFractionDigits: 2,
			}).format(value);
		} catch {
			return `${currency} ${(priceCents / 100).toFixed(2)}`;
		}
	};

	// open menu item modal
	const viewMenuItemDetails = (item: MenuItem) => {
		setSelectedMenuItem(item);
		setShowMenuModal(true);
	};

	const closeMenuItemModal = () => {
		setSelectedMenuItem(null);
		setShowMenuModal(false);
	};

	// toggle reply section
	const toggleReplySection = (reviewId: string) => {
		setOpenReplyIds((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
	};

	// post comment (reply) to review
	const addReply = async (reviewId: string) => {
		const text = (replyTexts[reviewId] || '').trim();
		if (!text) return;
		try {
			// Mock implementation for now
			Alert.alert('Success', 'Reply posted');
			setReplyTexts((prev) => ({ ...prev, [reviewId]: '' }));
		} catch (err) {
			console.error(err);
			Alert.alert('Error', 'Could not post reply.');
		}
	};

	// add a review for restaurant
	const submitReview = async () => {
		const text = newReviewText.trim();
		if (!text) {
			Alert.alert('Validation', 'Please write a review.');
			return;
		}
		try {
			// Mock implementation for now
			setShowAddReviewModal(false);
			setNewReviewText('');
			setNewReviewStars('5');
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

	// Render: menu item card
	const renderMenuCard = ({ item }: { item: MenuItem }) => {
		return (
			<TouchableOpacity
				style={[
					styles.menuCard,
					!item.isAvailable && styles.menuCardUnavailable,
				]}>
				<View style={styles.menuImageWrap}>
					<Image
						source={{
							uri: getImageUrl(
								item.images && item.images.length > 0
									? item.images[0]
									: undefined
							),
						}}
						style={styles.menuImage}
						resizeMode='cover'
					/>
					{!item.isAvailable && (
						<View style={styles.availabilityBadge}>
							<Ionicons
								name='close-circle'
								size={14}
								color='#fff'
							/>
							<Text style={styles.availabilityText}>Unavailable</Text>
						</View>
					)}
				</View>

				<View style={styles.menuContent}>
					<Text style={styles.menuName}>{item.name}</Text>
					{item.description ? (
						<Text
							style={styles.menuDesc}
							numberOfLines={2}>
							{item.description}
						</Text>
					) : null}
					{/* <View style={styles.menuFooter}>
            <Text style={styles.menuPrice}>
              {formatMenuPrice(item.priceCents, item.currency)}
            </Text>
            <TouchableOpacity
              style={restaurantStyles.viewDetailsBtn}
              onPress={() => viewMenuItemDetails(item)}
            >
              <Text style={restaurantStyles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View> */}
				</View>
			</TouchableOpacity>
		);
	};

	// Render: single review item
	const renderReview = ({ item }: { item: Review }) => {
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
							{formatReviewDate(item.createdAt)}
						</Text>
					</View>
					<View style={styles.reviewRating}>
						<Text style={styles.ratingNumber}>
							{calculateOverallRating(item.ratings).toFixed(1)}
						</Text>
					</View>
				</View>

				<Text style={styles.reviewText}>{item.text}</Text>

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

	if (!restaurant) {
		return (
			<View style={styles.centered}>
				<Text>Restaurant not found.</Text>
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			{/* Header Image */}
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={{ paddingBottom: 40 }}>
				<View style={styles.headerImageWrap}>
					<Image
						source={{
							uri: getImageUrl(
								restaurant.coverImage ||
									restaurant.coverImageKey ||
									restaurant.coverImageUrl
							),
						}}
						style={styles.headerImage}
						resizeMode='cover'
					/>
				</View>

				{/* Restaurant Card */}
				<View style={styles.card}>
					<Text style={styles.restaurantName}>
						{restaurant.name || 'Unknown Restaurant'}
					</Text>

					<View style={styles.metaRow}>
						{restaurant.avgOverall ? (
							<View style={styles.ratingWrap}>
								<Ionicons
									name='star'
									size={16}
									color='#ffb74d'
								/>
								<Text style={styles.ratingText}>
									{restaurant.avgOverall.toFixed(1)} (
									{restaurant.countReviews || 0})
								</Text>
							</View>
						) : null}

						{restaurant.city ? (
							<View style={styles.cityBadge}>
								<Ionicons
									name='location-outline'
									size={14}
									color='#777'
								/>
								<Text style={styles.cityText}>{restaurant.city}</Text>
							</View>
						) : null}
					</View>

					{restaurant.tags?.length ? (
						<View style={styles.tagRow}>
							{restaurant.tags.map((t: string, i: number) => (
								<View
									key={i}
									style={styles.tag}>
									<Text style={styles.tagText}>{t}</Text>
								</View>
							))}
						</View>
					) : null}
				</View>

				{/* Menu Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Menu Items</Text>
						<Text style={styles.sectionCount}>
							{menuItems.length} {menuItems.length === 1 ? 'item' : 'items'}
						</Text>
					</View>

					{isLoadingMenuItems ? (
						<View style={styles.centered}>
							<ActivityIndicator
								size='small'
								color='#ff7f50'
							/>
							<Text style={{ marginTop: 8 }}>Loading menu items...</Text>
						</View>
					) : menuItems.length > 0 ? (
						<FlatList
							data={menuItems}
							keyExtractor={(it: MenuItem) => it.id.toString()}
							renderItem={renderMenuCard}
							horizontal={false}
							contentContainerStyle={{ paddingVertical: 8 }}
						/>
					) : (
						<View style={styles.emptyState}>
							<Ionicons
								name='restaurant-outline'
								size={48}
								color='#ccc'
							/>
							<Text style={styles.emptyTitle}>No Menu Items</Text>
							<Text style={styles.emptySubtitle}>
								This restaurant hasn't added any menu items yet.
							</Text>
						</View>
					)}
				</View>

				{/* Reviews Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Restaurant Reviews</Text>
						<TouchableOpacity
							style={styles.viewAllBtn}
							onPress={() => {
								console.log('View All Reviews pressed', restaurantId);
								router.push({
									pathname: '/Reviews',
									params: {
										restaurantId: restaurantId,
										restaurantName: restaurant?.name || 'Restaurant',
									},
								});
							}}>
							<Text style={styles.viewAllText}>View All</Text>
							<Ionicons
								name='chevron-forward'
								size={16}
								color='#ff7f50'
							/>
						</TouchableOpacity>
					</View>

					{loadingReviews ? (
						<View style={styles.centered}>
							<ActivityIndicator
								size='small'
								color='#ff7f50'
							/>
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
								onPress={() => {
									console.log('Write a Review pressed', restaurantId);
									router.push({
										pathname: '/Reviews',
										params: {
											restaurantId: restaurantId,
											restaurantName: restaurant?.name || 'Restaurant',
										},
									});
								}}>
								<Text style={styles.addReviewText}>Write a Review</Text>
							</TouchableOpacity>
						</View>
					) : (
						<FlatList
							data={reviews}
							keyExtractor={(r: Review) => r.id.toString()}
							renderItem={renderReview}
							contentContainerStyle={{ paddingBottom: 10 }}
						/>
					)}

					{/* Pagination controls */}
					{reviewsTotalPages > 1 && (
						<View style={styles.pagination}>
							<TouchableOpacity
								style={[
									styles.pageButton,
									reviewsPage === 1 && styles.disabledBtn,
								]}
								disabled={reviewsPage === 1}
								onPress={previousPage}>
								<Text style={styles.pageButtonText}>&laquo; Previous</Text>
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
					)}
				</View>
			</ScrollView>

			{/* Floating Add Review Button */}
			{/* <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddReviewModal(true)}
      >
        <Ionicons name="add" size={22} color="#fff" />
      </TouchableOpacity> */}

			{/* Menu Item Modal */}
			<Modal
				visible={showMenuModal}
				animationType='slide'
				transparent>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<TouchableOpacity
							style={styles.modalClose}
							onPress={closeMenuItemModal}>
							<Ionicons
								name='close'
								size={22}
							/>
						</TouchableOpacity>

						{selectedMenuItem ? (
							<ScrollView>
								<Image
									source={{ uri: getImageUrl(selectedMenuItem.images?.[0]) }}
									style={styles.modalImage}
								/>
								<View style={{ padding: 12 }}>
									<View style={styles.modalHeader}>
										<Text style={styles.modalTitle}>
											{selectedMenuItem.name}
										</Text>
										<Text style={styles.modalPrice}>
											{formatMenuPrice(
												selectedMenuItem.priceCents,
												selectedMenuItem.currency
											)}
										</Text>
									</View>

									<Text style={styles.modalStatus}>
										{selectedMenuItem.isAvailable ? 'Available' : 'Unavailable'}
									</Text>

									{selectedMenuItem.description ? (
										<Text style={styles.modalDesc}>
											{selectedMenuItem.description}
										</Text>
									) : null}

									<TouchableOpacity
										style={styles.modalActionBtn}
										onPress={() => {
											setShowAddReviewModal(true);
											closeMenuItemModal();
										}}>
										<Text style={styles.modalActionText}>Write a Review</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						) : null}
					</View>
				</View>
			</Modal>

			{/* Add Review Modal */}
			<Modal
				visible={showAddReviewModal}
				animationType='slide'
				transparent>
				<View style={styles.modalOverlay}>
					<View style={styles.addReviewModal}>
						<Text style={styles.modalTitle}>Write a Review</Text>
						<TextInput
							placeholder='Your review...'
							multiline
							value={newReviewText}
							onChangeText={setNewReviewText}
							style={[styles.commentInput, { height: 100 }]}
						/>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 12,
							}}>
							<Text style={{ marginRight: 8 }}>Stars:</Text>
							<TextInput
								value={newReviewStars}
								onChangeText={setNewReviewStars}
								style={styles.starInput}
								keyboardType='numeric'
								maxLength={1}
							/>
						</View>

						<View style={{ flexDirection: 'row', gap: 8 }}>
							<TouchableOpacity
								style={styles.submitReviewBtn}
								onPress={submitReview}>
								<Text style={styles.submitReviewText}>Post Review</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.submitReviewBtn, { backgroundColor: '#ddd' }]}
								onPress={() => setShowAddReviewModal(false)}>
								<Text>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

