import restaurantService from '@/services/restaurants';
import { useTheme } from '@/store/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import
	{
		ActivityIndicator,
		FlatList,
		Image,
		Keyboard,
		Text,
		TextInput,
		TouchableOpacity,
		TouchableWithoutFeedback,
		View,
	} from 'react-native';
import { getImageUrl } from '../../utils/imageUtils';
import { homeStyles } from './styles';
import React from 'react';

interface Restaurant {
	id: string;
	name: string;
	city: string;
	categories: string;
	category?: string;
	tags: string[];
	coverImage?: string;
	coverImageKey?: string;
}

export default function Index() {
	const { colors, isDarkMode, toggleTheme } = useTheme();
	const styles = homeStyles(colors);

	const [loading, setLoading] = useState(false);
	const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
	const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filters, setFilters] = useState({ city: '', category: '' });
	const [isFiltering, setIsFiltering] = useState(false);

	const fetchRestaurants = async () => {
		setLoading(true);
		try {
			const response = await restaurantService.fetchAllRestaurants();
			setAllRestaurants(response.data);
			setRestaurants(response.data);
		} catch (error) {
			console.error('Error fetching restaurants:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRestaurants();
	}, []);

	// Real-time search effect
	useEffect(() => {
		if (allRestaurants.length === 0) return;

		let filtered = allRestaurants;

		// Apply search filter
		if (searchTerm.trim() !== '') {
			filtered = filtered.filter((r) =>
				r.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Apply location and category filters
		if (filters.city || filters.category) {
			filtered = filtered.filter(
				(r) =>
					(!filters.city ||
						r.city.toLowerCase().includes(filters.city.toLowerCase())) &&
					(!filters.category ||
						(r.category &&
							r.category
								.toLowerCase()
								.includes(filters.category.toLowerCase())) ||
						r.categories.toLowerCase().includes(filters.category.toLowerCase()))
			);
		}

		setRestaurants(filtered);
	}, [searchTerm, filters, allRestaurants]);

	const onSearch = () => {
		Keyboard.dismiss();
		if (searchTerm.trim() === '') {
			// If search is empty, show all restaurants
			setRestaurants(allRestaurants);
		} else {
			// Filter from the original list
			const filtered = allRestaurants.filter((r) =>
				r.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setRestaurants(filtered);
		}
	};

	const clearSearch = () => {
		Keyboard.dismiss();
		setSearchTerm('');
		// Reset to show all restaurants
		setRestaurants(allRestaurants);
	};

	const onFilter = () => {
		Keyboard.dismiss();
		setIsFiltering(true);
		setTimeout(() => {
			let filtered = allRestaurants;

			// Apply search filter if there's a search term
			if (searchTerm.trim() !== '') {
				filtered = filtered.filter((r) =>
					r.name.toLowerCase().includes(searchTerm.toLowerCase())
				);
			}

			// Apply location and category filters
			filtered = filtered.filter(
				(r) =>
					(!filters.city ||
						r.city.toLowerCase().includes(filters.city.toLowerCase())) &&
					(!filters.category ||
						(r.category &&
							r.category
								.toLowerCase()
								.includes(filters.category.toLowerCase())) ||
						r.categories.toLowerCase().includes(filters.category.toLowerCase()))
			);

			setRestaurants(filtered);
			setIsFiltering(false);
		}, 300);
	};

	const clearFilters = () => {
		Keyboard.dismiss();
		setFilters({ city: '', category: '' });
		// If there's a search term, apply only search filter, otherwise show all
		if (searchTerm.trim() !== '') {
			const filtered = allRestaurants.filter((r) =>
				r.name.toLowerCase().includes(searchTerm.toLowerCase())
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
					{item.tags.map((tag: string, index: number) => (
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
						style={styles.detailsButton}
					>
						<Text style={styles.detailsText}>View Details ➜</Text>
					</TouchableOpacity>
				</Link>
			</View>
		</View>
	);

	return (
		<View style={styles.container}>
			{loading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator
						size='large'
						color={colors.primary} // Use theme color
					/>
				</View>
			)}

				{/* 💡 THEME TOGGLE SECTION 💡 */}
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

			{/* Search Section */}
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.searchContainer}>
					<View style={styles.searchBox}>
						<Ionicons
							name='search-outline'
							size={20}
							color={colors.textTertiary} // Use theme color
						/>
						<TextInput
							style={[styles.searchInput, { color: colors.primaryText }]} // Apply text color
							placeholder='Search restaurants by name...'
							placeholderTextColor={colors.textTertiary} // Use theme color
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
									color={colors.textTertiary} // Use theme color
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

			{/* Enhanced Filters Section */}
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.filtersCard}>
					<View style={styles.filtersHeader}>
						<View style={styles.filterIconContainer}>
							<Ionicons
								name='options'
								size={20}
								color={colors.primary} // Use theme color
							/>
						</View>
						<Text style={styles.filtersTitle}>
							Find Your Perfect Restaurant
						</Text>
					</View>

					<View style={styles.filtersContent}>
						{/* Location Filter */}
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
								placeholderTextColor={colors.placeholderText} // Use theme color
								style={[styles.modernInput, { color: colors.primaryText }]} // Apply text color
								value={filters.city}
								onChangeText={(text) => setFilters({ ...filters, city: text })}
								returnKeyType='next'
								blurOnSubmit={false}
								onSubmitEditing={() => {
									// Focus next input or dismiss keyboard
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

						{/* Category Filter */}
						<View style={styles.inputContainer}>
							<View style={styles.inputIconContainer}>
								<Ionicons
									name='restaurant-outline'
									size={18}
									color={colors.primary} // Use theme color
								/>
							</View>
							<TextInput
								placeholder='What cuisine are you craving?'
								placeholderTextColor={colors.placeholderText} // Use theme color
								style={[styles.modernInput, { color: colors.primaryText }]} // Apply text color
								value={filters.category}
								onChangeText={(text) =>
									setFilters({ ...filters, category: text })
								}
								returnKeyType='search'
								blurOnSubmit={true}
								onSubmitEditing={onFilter}
							/>
							{filters.category.length > 0 && (
								<TouchableOpacity
									onPress={() => {
										Keyboard.dismiss();
										setFilters({ ...filters, category: '' });
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

						{/* Action Buttons */}
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

			{/* Results Header */}
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

			{/* Restaurant List */}
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
	);
}
