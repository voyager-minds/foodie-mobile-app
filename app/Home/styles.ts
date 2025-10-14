import { ColorsType } from '@/constants/colours';
import { StyleSheet } from 'react-native';

export const homeStyles = (colors: ColorsType) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			paddingTop: 50,
		},
		loadingOverlay: {
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.whiteOverlay,
			zIndex: 10,
		},

		themeToggleButton: {
			position: 'absolute',
			top: 50, // Adjust based on your header layout
			right: 15,
			zIndex: 10,
			padding: 8,
			backgroundColor: colors.background, // Subtle background
			borderRadius: 20,
			borderWidth: 1,
			borderColor: colors.border,
		},

		// 🔍 Search Section
		searchContainer: {
			marginBottom: 15,
			paddingHorizontal: 15,
		},
		searchBox: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.white,
			borderRadius: 30,
			paddingHorizontal: 15,
			paddingVertical: 8,
			elevation: 2,
		},
		searchInput: {
			flex: 1,
			marginHorizontal: 10,
		},
		searchButton: {
			backgroundColor: colors.primary,
			borderRadius: 25,
			paddingHorizontal: 15,
			paddingVertical: 8,
		},
		searchButtonText: {
			color: colors.white,
			fontWeight: '600',
		},

		// 🧾 Enhanced Filters
		filtersCard: {
			backgroundColor: colors.white,
			marginHorizontal: 15,
			marginBottom: 20,
			borderRadius: 16,
			elevation: 4,
			shadowColor: colors.shadow,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 8,
		},
		filtersHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 20,
			paddingTop: 20,
			paddingBottom: 15,
			borderBottomWidth: 1,
			borderBottomColor: colors.borderDark,
		},
		filterIconContainer: {
			width: 36,
			height: 36,
			borderRadius: 18,
			backgroundColor: colors.primaryLight,
			alignItems: 'center',
			justifyContent: 'center',
			marginRight: 12,
		},
		filtersTitle: {
			fontSize: 18,
			fontWeight: '700',
			color: colors.textPrimary,
			flex: 1,
		},
		filtersContent: {
			padding: 20,
		},
		inputContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.gray100,
			borderRadius: 12,
			marginBottom: 16,
			paddingHorizontal: 16,
			paddingVertical: 4,
			borderWidth: 1,
			borderColor: colors.borderMedium,
		},
		inputIconContainer: {
			marginRight: 12,
		},
		modernInput: {
			flex: 1,
			paddingVertical: 12,
			fontSize: 16,
			color: colors.textPrimary,
		},
		clearInputButton: {
			padding: 4,
		},
		quickFiltersContainer: {
			marginBottom: 20,
		},
		quickFiltersLabel: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.textSecondary,
			marginBottom: 10,
		},
		quickFiltersRow: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 8,
		},
		quickFilterTag: {
			backgroundColor: colors.gray100,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 20,
			borderWidth: 1,
			borderColor: colors.borderMedium,
		},
		quickFilterTagActive: {
			backgroundColor: colors.primaryLight,
			borderColor: colors.primary,
		},
		quickFilterText: {
			fontSize: 12,
			fontWeight: '500',
			color: colors.textSecondary,
		},
		quickFilterTextActive: {
			color: colors.primary,
			fontWeight: '600',
		},
		filterButtons: {
			flexDirection: 'row',
			gap: 12,
		},
		applyButton: {
			backgroundColor: colors.buttonDisabled,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			paddingVertical: 14,
			paddingHorizontal: 20,
			borderRadius: 12,
			flex: 1,
			gap: 8,
		},
		applyButtonActive: {
			backgroundColor: colors.primary,
		},
		clearButton: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			paddingVertical: 14,
			paddingHorizontal: 16,
			borderRadius: 12,
			backgroundColor: colors.primaryLight,
			borderWidth: 1,
			borderColor: colors.primary,
			gap: 6,
		},
		applyText: {
			color: colors.white,
			fontWeight: '600',
			fontSize: 16,
		},
		clearText: {
			color: colors.primary,
			fontWeight: '600',
			fontSize: 14,
		},

		// Results Header
		resultsHeader: {
			paddingHorizontal: 15,
			paddingVertical: 10,
			backgroundColor: colors.gray100,
			marginBottom: 10,
		},
		resultsText: {
			fontSize: 14,
			fontWeight: '600',
			color: colors.textPrimary,
			marginBottom: 8,
		},
		activeFilters: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 8,
		},
		activeFilterTag: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.primaryLight,
			paddingHorizontal: 8,
			paddingVertical: 4,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: colors.primary,
			gap: 4,
		},
		activeFilterText: {
			fontSize: 12,
			color: colors.primary,
			fontWeight: '500',
		},

		// 🍽 Restaurant Cards
		flatListContainer: {
			flex: 1,
		},
		list: {
			paddingBottom: 100,
			paddingHorizontal: 0,
		},
		card: {
			backgroundColor: colors.white,
			borderRadius: 12,
			marginBottom: 15,
			marginHorizontal: 15,
			overflow: 'hidden',
			elevation: 2,
		},
		image: {
			height: 180,
			width: '100%',
		},
		cardBody: {
			padding: 12,
		},
		name: {
			fontSize: 18,
			fontWeight: '700',
			marginBottom: 4,
		},
		city: {
			fontSize: 14,
			color: colors.textTertiary,
		},
		category: {
			fontSize: 14,
			color: colors.textTertiary,
			marginBottom: 8,
		},
		ratingContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: 8,
		},
		ratingText: {
			fontWeight: 'bold',
			color: colors.primary,
		},
		reviewCount: {
			marginLeft: 6,
			color: colors.textTertiary,
		},
		tagsContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			marginBottom: 8,
		},
		tag: {
			backgroundColor: colors.primaryLight,
			color: colors.primary,
			borderRadius: 15,
			paddingVertical: 4,
			paddingHorizontal: 10,
			fontSize: 12,
			marginRight: 6,
			marginBottom: 6,
		},
		detailsButton: {
			alignSelf: 'flex-start',
			backgroundColor: colors.primary,
			borderRadius: 6,
			paddingVertical: 6,
			paddingHorizontal: 10,
		},
		detailsText: {
			color: colors.white,
			fontWeight: '600',
		},

		// 🚫 Empty State
		emptyState: {
			alignItems: 'center',
			marginTop: 50,
			paddingHorizontal: 15,
		},
		emptyTitle: {
			fontSize: 20,
			fontWeight: '700',
			color: colors.textPrimary,
		},
		emptySubtitle: {
			fontSize: 14,
			color: colors.textTertiary,
			marginTop: 5,
		},
	});
