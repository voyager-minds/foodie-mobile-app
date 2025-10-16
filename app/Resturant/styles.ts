import { ColorsType } from '@/constants/colours';
import { StyleSheet } from 'react-native';

export const restaurantStyles = (colors: ColorsType) =>
	StyleSheet.create({
		screen: { flex: 1, backgroundColor: colors.background },
		scroll: { flex: 1 },
		centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

		headerImageWrap: { height: 200, backgroundColor: colors.border },
		headerImage: { width: '100%', height: '100%' },

		card: {
			backgroundColor: colors.white,
			marginHorizontal: 12,
			marginTop: -40,
			padding: 16,
			borderRadius: 12,
			elevation: 3,
		},
		restaurantName: { fontSize: 20, fontWeight: '700', marginBottom: 8, color: colors.textPrimary },
		metaRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		ratingWrap: { flexDirection: 'row', alignItems: 'center' },
		ratingText: { marginLeft: 6, fontWeight: '600', color: colors.primary },
		cityBadge: { flexDirection: 'row', alignItems: 'center' },
		cityText: { marginLeft: 6, color: colors.textSecondary },

		tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
		tag: {
			backgroundColor: colors.primaryLight,
			paddingVertical: 4,
			paddingHorizontal: 8,
			borderRadius: 16,
			marginRight: 6,
			marginBottom: 6,
		},
		tagText: { color: colors.tagPrimary, fontSize: 12 },

		section: { marginTop: 12, paddingHorizontal: 12 },
		sectionHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 8,
		},
		sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
		sectionCount: { color: colors.textTertiary },
		viewAllBtn: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 8,
			paddingVertical: 4,
		},
		viewAllText: { color: colors.primary, fontWeight: '600', marginRight: 4 },

		// Menu card
		menuCard: {
			flexDirection: 'row',
			backgroundColor: colors.white,
			borderRadius: 10,
			marginBottom: 12,
			overflow: 'hidden',
			elevation: 2,
		},
		menuCardUnavailable: { opacity: 0.6 },
		menuImageWrap: { width: 120, height: 100 },
		menuImage: { width: '100%', height: '100%' },
		availabilityBadge: {
			position: 'absolute',
			bottom: 6,
			left: 6,
			backgroundColor: colors.overlayDark,
			paddingHorizontal: 6,
			paddingVertical: 3,
			borderRadius: 6,
			flexDirection: 'row',
			alignItems: 'center',
		},
		availabilityText: { color: colors.white, marginLeft: 6, fontSize: 12 },

		menuContent: { flex: 1, padding: 10, justifyContent: 'space-between' },
		menuName: { fontWeight: '700', fontSize: 16, color: colors.textPrimary },
		menuDesc: { color: colors.textSecondary, marginTop: 4 },
		menuFooter: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: 8,
		},
		menuPrice: { fontWeight: '700', color: colors.textPrimary },
		viewDetailsBtn: {
			backgroundColor: colors.primary,
			paddingHorizontal: 10,
			paddingVertical: 6,
			borderRadius: 6,
		},
		viewDetailsText: { color: colors.white, fontWeight: '600' },

		// Empty
		emptyState: { alignItems: 'center', paddingVertical: 20 },
		emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, color: colors.textPrimary },
		emptySubtitle: { color: colors.textSecondary, marginTop: 6 },

		// Reviews
		reviewCard: {
			backgroundColor: colors.white,
			borderRadius: 10,
			padding: 12,
			marginBottom: 10,
			elevation: 1,
		},
		reviewHeader: { flexDirection: 'row', alignItems: 'center' },
		reviewerAvatar: {
			width: 44,
			height: 44,
			borderRadius: 22,
			backgroundColor: colors.avatar,
			justifyContent: 'center',
			alignItems: 'center',
		},
		avatarText: { fontWeight: '700', color: colors.primary },
		reviewerName: { fontWeight: '700', color: colors.textPrimary },
		reviewDate: { color: colors.textLight, fontSize: 12 },
		reviewRating: { alignItems: 'flex-end' },
		ratingNumber: { color: colors.primary, fontWeight: '700' },

		reviewText: { marginTop: 8, color: colors.textPrimary },

		reviewActions: { flexDirection: 'row', marginTop: 10 },
		replyButton: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },

		replySection: {
			marginTop: 10,
			borderTopWidth: 1,
			borderTopColor: colors.border,
			paddingTop: 10,
		},
		commentsList: { marginBottom: 8 },
		commentItem: {
			marginBottom: 8,
			backgroundColor: colors.gray50,
			padding: 8,
			borderRadius: 8,
		},
		commentHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 6,
		},
		commentAuthor: { fontWeight: '700' },
		commentDate: { color: colors.textTertiary, fontSize: 12 },
		commentText: { color: colors.textPrimary },

		commentInput: {
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8,
			padding: 8,
			backgroundColor: colors.white,
			marginBottom: 8,
		},

		postReplyBtn: {
			alignSelf: 'flex-end',
			backgroundColor: colors.primary,
			paddingHorizontal: 12,
			paddingVertical: 8,
			borderRadius: 8,
		},
		disabledBtn: { opacity: 0.5 },
		postReplyText: { color: colors.white, fontWeight: '700' },

		// pagination
		pagination: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 10,
			marginTop: 10,
		},
		pageButton: {
			paddingHorizontal: 12,
			paddingVertical: 8,
			borderRadius: 6,
			backgroundColor: colors.white,
			borderWidth: 1,
			borderColor: colors.borderLight,
		},
		pageButtonText: { color: colors.textPrimary, fontWeight: '600' },
		pageInfo: { marginHorizontal: 12 },

		// FAB
		fab: {
			position: 'absolute',
			right: 18,
			bottom: 24,
			width: 52,
			height: 52,
			borderRadius: 26,
			backgroundColor: colors.primary,
			justifyContent: 'center',
			alignItems: 'center',
			elevation: 6,
		},

		// Modal
		modalOverlay: {
			flex: 1,
			backgroundColor: colors.overlay,
			justifyContent: 'center',
			alignItems: 'center',
			padding: 16,
		},
		modalContainer: {
			width: '100%',
			maxHeight: '85%',
			backgroundColor: colors.white,
			borderRadius: 12,
			overflow: 'hidden',
		},
		modalClose: {
			position: 'absolute',
			top: 12,
			right: 12,
			zIndex: 10,
			padding: 6,
		},
		modalImage: { width: '100%', height: 220 },
		modalHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: 8,
		},
		modalTitle: { fontWeight: '700', fontSize: 18 },
		modalPrice: { fontWeight: '700', fontSize: 16, color: colors.textPrimary },
		modalStatus: { marginTop: 6, color: colors.textSecondary },
		modalDesc: { marginTop: 10, color: colors.textDark, lineHeight: 20 },
		modalActionBtn: {
			marginTop: 14,
			backgroundColor: colors.primary,
			padding: 12,
			borderRadius: 8,
			alignItems: 'center',
		},
		modalActionText: { color: colors.white, fontWeight: '700' },

		addReviewModal: {
			width: '100%',
			backgroundColor: colors.white,
			padding: 16,
			borderRadius: 12,
		},
		submitReviewBtn: {
			backgroundColor: colors.primary,
			padding: 12,
			borderRadius: 8,
			marginRight: 8,
		},
		submitReviewText: { color: colors.white, fontWeight: '700' },

		addReviewBtn: {
			marginTop: 10,
			backgroundColor: colors.primary,
			paddingHorizontal: 12,
			paddingVertical: 8,
			borderRadius: 8,
		},
		addReviewText: { color: colors.white, fontWeight: '700' },

		starInput: {
			width: 36,
			height: 36,
			borderWidth: 1,
			borderColor: colors.borderLight,
			borderRadius: 6,
			paddingHorizontal: 8,
		},
	});
