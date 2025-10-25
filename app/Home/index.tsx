import ProtectedRoute from '@/components/ProtectedRoute';
import restaurantService from '@/services/restaurants';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Keyboard,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { getImageUrl } from '../../utils/imageUtils';
import { homeStyles } from './styles';

interface Restaurant {
	id: string;
	name?: string;
	city?: string;
	categories?: string;
	category?: string;
	tags?: string[];
	coverImage?: string;
	coverImageKey?: string;
}

const matchesCategory = (restaurant: Restaurant, categoryFilter: string): boolean => {
	if (!categoryFilter) return true;

	const filter = categoryFilter.toLowerCase().trim();

	// Check category field (exact match or contains)
	if (restaurant.category) {
		const category = restaurant.category.toLowerCase();
		if (category === filter || category.includes(filter)) {
			return true;
		}
	}

	// Check categories field (exact match or contains)
	if (restaurant.categories && typeof restaurant.categories === 'string') {
		const categories = restaurant.categories.toLowerCase();
		if (categories === filter || categories.includes(filter)) {
			return true;
		}
	}

	// Check tags array (exact match or contains)
	if (restaurant.tags && Array.isArray(restaurant.tags)) {
		return restaurant.tags.some(tag => {
			const tagLower = tag.toLowerCase();
			return tagLower === filter || tagLower.includes(filter);
		});
	}

	return false;
};

export default function Index() {
	const { colors, isDarkMode, toggleTheme } = useTheme();
	const { user, signOut } = useAuth();
	const router = useRouter();
	const styles = homeStyles(colors);

	const [loading, setLoading] = useState(false);
	const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
	const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filters, setFilters] = useState({ city: '', category: '' });
	const [isFiltering, setIsFiltering] = useState(false);
	const [availableCategories, setAvailableCategories] = useState<string[]>([]);
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

	const extractCategories = (restaurants: Restaurant[]): string[] => {
		const categories = new Set<string>();

		restaurants.forEach(restaurant => {
			if (restaurant.category) {
				categories.add(restaurant.category);
			}

			if (restaurant.categories && typeof restaurant.categories === 'string') {
				categories.add(restaurant.categories);
			}

			if (restaurant.tags && Array.isArray(restaurant.tags)) {
				restaurant.tags.forEach(tag => categories.add(tag));
			}
		});

		return Array.from(categories).sort();
	};

	const fetchRestaurants = async () => {
		setLoading(true);
		try {
			const response = await restaurantService.fetchAllRestaurants();
			setAllRestaurants(response.data);
			setRestaurants(response.data);

			const categories = extractCategories(response.data);
			setAvailableCategories(categories);
		} catch (error) {
			console.error('Error fetching restaurants:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRestaurants();
	}, []);

	useEffect(() => {
		if (allRestaurants.length === 0) return;

		let filtered = allRestaurants;

		if (searchTerm.trim() !== '') {
			filtered = filtered.filter((r) =>
				r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (filters.city || filters.category) {
			filtered = filtered.filter(
				(r) => {
					const cityMatch = !filters.city || (r.city && r.city.toLowerCase().includes(filters.city.toLowerCase()));
					const categoryMatch = matchesCategory(r, filters.category);
					return cityMatch && categoryMatch;
				}
			);
		}

		setRestaurants(filtered);
	}, [searchTerm, filters, allRestaurants]);

	const onSearch = () => {
		Keyboard.dismiss();
		if (searchTerm.trim() === '') {
			setRestaurants(allRestaurants);
		} else {
			const filtered = allRestaurants.filter((r) =>
				r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setRestaurants(filtered);
		}
	};

	const clearSearch = () => {
		Keyboard.dismiss();
		setSearchTerm('');
		setRestaurants(allRestaurants);
	};

	const onFilter = () => {
		Keyboard.dismiss();
		setShowCategoryDropdown(false);
		setIsFiltering(true);
		setTimeout(() => {
			let filtered = allRestaurants;

			if (searchTerm.trim() !== '') {
				filtered = filtered.filter((r) =>
					r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())
				);
			}

			filtered = filtered.filter(
				(r) => {
					const cityMatch = !filters.city || (r.city && r.city.toLowerCase().includes(filters.city.toLowerCase()));
					const categoryMatch = matchesCategory(r, filters.category);

					return cityMatch && categoryMatch;
				}
			);

			setRestaurants(filtered);
			setIsFiltering(false);
		}, 300);
	};

	const clearFilters = () => {
		Keyboard.dismiss();
		setShowCategoryDropdown(false);
		setFilters({ city: '', category: '' });
		if (searchTerm.trim() !== '') {
			const filtered = allRestaurants.filter((r) =>
				r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setRestaurants(filtered);
		} else {
			setRestaurants(allRestaurants);
		}
		setIsFiltering(false);
	};

	const renderRestaurant = ({ item }: { item: Restaurant }) => (
		<View style={styles.card}>
			<Image
				source={{ uri: getImageUrl(item.coverImageKey) }}
				style={styles.image}
			/>
			<View style={styles.cardBody}>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.city}>{item.city}</Text>
				<Text style={styles.category}>{item.categories}</Text>
				<View style={styles.tagsContainer}>
					{item.tags && item.tags.map((tag: string, index: number) => (
						<Text
							key={index}
							style={styles.tag}>
							{tag}
						</Text>
					))}
				</View>

				<Link
					href={{
						pathname: '/Resturant',
						params: { restaurantId: item.id },
					}}
					asChild>
					<TouchableOpacity
						style={styles.detailsButton}>
						<Text style={styles.detailsText}>View Details ➜</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);

	const handleLogout = () => {
		Alert.alert(
			'Sign Out',
			'Are you sure you want to sign out?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Sign Out',
					style: 'destructive',
					onPress: async () => {
						await signOut();
						router.replace('/');
					}
				}
			]
		);
	};

	return (
		<ProtectedRoute>
			<View style={styles.container}>
				{loading && (
					<View style={styles.loadingOverlay}>
						<ActivityIndicator
							size='large'
							color={colors.primary}
						/>
					</View>
				)}


				<View style={styles.headerContainer}>
					<View style={styles.userInfo}>
						<Text style={styles.welcomeText}>Welcome back,</Text>
						<Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
							{user?.email || 'Foodie'}
						</Text>
					</View>
					<View style={styles.headerControls}>

						<TouchableOpacity
							onPress={toggleTheme}
							style={styles.themeToggleButton}
							accessibilityLabel={
								isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
							}>
							<Ionicons
								name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
								size={24}
								color={colors.primary}
							/>
						</TouchableOpacity>


						<TouchableOpacity
							onPress={handleLogout}
							style={styles.logoutButton}
							accessibilityLabel="Sign Out">
							<Ionicons
								name="log-out-outline"
								size={24}
								color={colors.primary}
							/>
						</TouchableOpacity>
					</View>
				</View>


				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.searchContainer}>
						<View style={styles.searchBox}>
							<Ionicons
								name='search-outline'
								size={20}
								color={colors.textTertiary}
							/>
							<TextInput
								style={[styles.searchInput, { color: colors.primaryText }]}
								placeholder='Search restaurants by name...'
								placeholderTextColor={colors.textTertiary}
								value={searchTerm}
								onChangeText={setSearchTerm}
								onSubmitEditing={onSearch}
								returnKeyType='search'
								blurOnSubmit={true}
							/>
							{searchTerm.length > 0 && (
								<TouchableOpacity onPress={clearSearch}>
									<Ionicons
										name='close'
										size={20}
										color={colors.textTertiary}
									/>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={styles.searchButton}
								onPress={onSearch}>
								<Text style={styles.searchButtonText}>Search</Text>
							</TouchableOpacity>
						</View>
					</View>
				</TouchableWithoutFeedback>


				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={styles.filtersCard}>
						<View style={styles.filtersHeader}>
							<View style={styles.filterIconContainer}>
								<Ionicons
									name='options'
									size={20}
									color={colors.primary}
								/>
							</View>
							<Text style={styles.filtersTitle}>
								Find Your Perfect Restaurant
							</Text>
						</View>

						<View style={styles.filtersContent}>

							<View style={styles.inputContainer}>
								<View style={styles.inputIconContainer}>
									<Ionicons
										name='location-outline'
										size={18}
										color={colors.primary} // Use theme color
									/>
								</View>
								<TextInput
									placeholder='Where are you dining?'
									placeholderTextColor={colors.placeholderText}
									style={[styles.modernInput, { color: colors.primaryText }]}
									value={filters.city}
									onChangeText={(text) => setFilters({ ...filters, city: text })}
									returnKeyType='next'
									blurOnSubmit={false}
									onSubmitEditing={() => {
										Keyboard.dismiss();
									}}
								/>
								{filters.city.length > 0 && (
									<TouchableOpacity
										onPress={() => {
											Keyboard.dismiss();
											setFilters({ ...filters, city: '' });
										}}
										style={styles.clearInputButton}>
										<Ionicons
											name='close-circle'
											size={18}
											color={colors.textTertiary} // Use theme color
										/>
									</TouchableOpacity>
								)}
							</View>


							<View style={styles.inputContainer}>
								<View style={styles.inputIconContainer}>
									<Ionicons
										name='restaurant-outline'
										size={18}
										color={colors.primary} // Use theme color
									/>
								</View>
								<TouchableOpacity
									style={styles.modernInput}
									onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}>
									<Text style={[
										{ color: filters.category ? colors.primaryText : colors.placeholderText },
										{ flex: 1 }
									]}>
										{filters.category || 'What cuisine are you craving?'}
									</Text>
									<Ionicons
										name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
										size={18}
										color={colors.textTertiary}
									/>
								</TouchableOpacity>
								{filters.category.length > 0 && (
									<TouchableOpacity
										onPress={() => {
											setFilters({ ...filters, category: '' });
											setShowCategoryDropdown(false);
										}}
										style={styles.clearInputButton}>
										<Ionicons
											name='close-circle'
											size={18}
											color={colors.textTertiary}
										/>
									</TouchableOpacity>
								)}
							</View>


							{showCategoryDropdown && availableCategories.length > 0 && (
								<View style={styles.categoryDropdown}>
									<ScrollView style={styles.categoryList} nestedScrollEnabled={true}>
										{availableCategories.map((category, index) => (
											<TouchableOpacity
												key={index}
												style={[
													styles.categoryItem,
													filters.category === category && styles.selectedCategoryItem
												]}
												onPress={() => {
													setFilters({ ...filters, category });
													setShowCategoryDropdown(false);
												}}>
												<Text style={[
													styles.categoryItemText,
													filters.category === category && styles.selectedCategoryItemText
												]}>
													{category}
												</Text>
											</TouchableOpacity>
										))}
									</ScrollView>
								</View>
							)}


							<View style={styles.filterButtons}>
								<TouchableOpacity
									style={[
										styles.applyButton,
										(filters.city || filters.category) &&
										styles.applyButtonActive,
									]}
									onPress={onFilter}
									disabled={isFiltering}>
									{isFiltering ? (
										<ActivityIndicator
											size='small'
											color={colors.whiteText}
										/>
									) : (
										<Ionicons
											name='search'
											size={16}
											color={colors.whiteText}
										/>
									)}
									<Text style={styles.applyText}>
										{isFiltering ? 'Searching...' : 'Find Restaurants'}
									</Text>
								</TouchableOpacity>

								{(filters.city || filters.category) && (
									<TouchableOpacity
										style={styles.clearButton}
										onPress={clearFilters}>
										<Ionicons
											name='refresh'
											size={14}
											color={colors.primary} // Use theme color
										/>
										<Text style={styles.clearText}>Clear All</Text>
									</TouchableOpacity>
								)}
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>


				{(filters.city || filters.category || searchTerm.trim() !== '') && (
					<View style={styles.resultsHeader}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}>
							<Text style={styles.resultsText}>
								{restaurants.length} restaurant
								{restaurants.length !== 1 ? 's' : ''} found
							</Text>
							<TouchableOpacity
								onPress={() => {
									setSearchTerm('');
									setFilters({ city: '', category: '' });
									setRestaurants(allRestaurants);
								}}
								style={{
									backgroundColor: colors.primary, // Use theme color
									paddingHorizontal: 12,
									paddingVertical: 6,
									borderRadius: 16,
									flexDirection: 'row',
									alignItems: 'center',
								}}>
								<Ionicons
									name='refresh'
									size={14}
									color={colors.whiteText} // Use theme color
								/>
								<Text
									style={{
										color: colors.whiteText, // Use theme color
										marginLeft: 4,
										fontSize: 12,
										fontWeight: '600',
									}}>
									Show All
								</Text>
							</TouchableOpacity>
						</View>
						{(filters.city || filters.category || searchTerm.trim() !== '') && (
							<View style={styles.activeFilters}>
								{searchTerm.trim() !== '' && (
									<View style={styles.activeFilterTag}>
										<Ionicons
											name='search'
											size={12}
											color={colors.primary} // Use theme color
										/>
										<Text style={styles.activeFilterText}>"{searchTerm}"</Text>
									</View>
								)}
								{filters.city && (
									<View style={styles.activeFilterTag}>
										<Ionicons
											name='location'
											size={12}
											color={colors.primary} // Use theme color
										/>
										<Text style={styles.activeFilterText}>{filters.city}</Text>
									</View>
								)}
								{filters.category && (
									<View style={styles.activeFilterTag}>
										<Ionicons
											name='restaurant'
											size={12}
											color={colors.primary} // Use theme color
										/>
										<Text style={styles.activeFilterText}>
											{filters.category}
										</Text>
									</View>
								)}
							</View>
						)}
					</View>
				)}


				{restaurants.length > 0 ? (
					<FlatList
						data={restaurants}
						keyExtractor={(item) => item.id.toString()}
						renderItem={renderRestaurant}
						contentContainerStyle={styles.list}
						keyboardShouldPersistTaps='handled'
						onScrollBeginDrag={Keyboard.dismiss}
						showsVerticalScrollIndicator={true}
						bounces={true}
						style={styles.flatListContainer}
					/>
				) : (
					!loading && (
						<View style={styles.emptyState}>
							<Text style={styles.emptyTitle}>No restaurants found</Text>
							<Text style={styles.emptySubtitle}>
								Try adjusting your filters or search
							</Text>
						</View>
					)
				)}
			</View>
		</ProtectedRoute>
	);
}
