import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const reviewsStyles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 2,
    },

    // Summary Card
    summaryCard: {
        backgroundColor: colors.white,
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ratingOverview: {
        alignItems: "center",
    },
    overallRating: {
        fontSize: 32,
        fontWeight: "700",
        color: colors.primary,
    },
    starsContainer: {
        flexDirection: "row",
        marginVertical: 4,
    },
    reviewCount: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    writeReviewBtn: {
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    writeReviewText: {
        color: colors.white,
        fontWeight: "600",
        marginLeft: 6,
    },

    // Reviews List
    reviewsList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    // Review Card
    reviewCard: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    reviewHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    reviewerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.avatar,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontWeight: "700",
        color: colors.primary,
    },
    reviewerName: {
        fontWeight: "700",
    },
    reviewDate: {
        color: colors.textLight,
        fontSize: 12,
    },
    reviewRating: {
        alignItems: "flex-end",
    },
    ratingNumber: {
        color: colors.primary,
        fontWeight: "700",
    },
    reviewText: {
        marginTop: 8,
        color: colors.textPrimary,
        lineHeight: 20,
    },
    reviewActions: {
        flexDirection: "row",
        marginTop: 10,
    },
    replyButton: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 6,
    },

    // Reply Section
    replySection: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 10,
    },
    commentsList: {
        marginBottom: 8,
    },
    commentItem: {
        marginBottom: 8,
        backgroundColor: colors.gray50,
        padding: 8,
        borderRadius: 8,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    commentAuthor: {
        fontWeight: "700",
    },
    commentDate: {
        color: colors.textTertiary,
        fontSize: 12,
    },
    commentText: {
        color: colors.textPrimary,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 8,
        backgroundColor: colors.white,
        marginBottom: 8,
        minHeight: 60,
    },
    postReplyBtn: {
        alignSelf: "flex-end",
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    disabledBtn: {
        opacity: 0.5,
    },
    postReplyText: {
        color: colors.white,
        fontWeight: "700",
    },

    // Pagination
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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
    pageButtonText: {
        color: colors.textPrimary,
        fontWeight: "600",
    },
    pageInfo: {
        marginHorizontal: 12,
    },

    // Empty State
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 8,
    },
    emptySubtitle: {
        color: colors.textSecondary,
        marginTop: 6,
        textAlign: "center",
    },
    addReviewBtn: {
        marginTop: 16,
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addReviewText: {
        color: colors.white,
        fontWeight: "700",
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlayMedium,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    addReviewModal: {
        width: "100%",
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontWeight: "700",
        fontSize: 18,
    },
    reviewInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: colors.white,
        marginBottom: 16,
        minHeight: 100,
        textAlignVertical: "top",
    },
    ratingInput: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    ratingLabel: {
        marginRight: 12,
        fontWeight: "600",
    },
    starRating: {
        flexDirection: "row",
        gap: 4,
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
    },
    submitReviewBtn: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    submitReviewText: {
        color: colors.white,
        fontWeight: "700",
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: colors.buttonSecondary,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelText: {
        color: colors.textPrimary,
        fontWeight: "600",
    },

    // Detailed Ratings in Review Cards
    detailedRatings: {
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.buttonSecondary,
    },
    ratingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    detailRatingLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        width: 60,
    },
    ratingStars: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    ratingValue: {
        fontSize: 12,
        color: colors.textPrimary,
        marginLeft: 6,
        fontWeight: "600",
    },

    // Modal Rating Input
    ratingsContainer: {
        marginBottom: 20,
    },
    ratingsTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        color: colors.textPrimary,
    },
    modalRatingNumber: {
        marginLeft: 8,
        fontWeight: "600",
        color: colors.primary,
        minWidth: 20,
    },

    // Average Ratings Breakdown
    avgRatingsBreakdown: {
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.buttonSecondary,
    },
    avgRatingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    avgRatingLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    avgRatingValue: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.primary,
    },

    // Image Section Styles
    imageSection: {
        marginBottom: 20,
    },
    imageSectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    imageSectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    addPhotoButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    addPhotoText: {
        color: colors.primary,
        fontWeight: "600",
        marginLeft: 6,
    },
    imagePreviewContainer: {
        flexDirection: "row",
    },
    imagePreview: {
        position: "relative",
        marginRight: 12,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: colors.white,
        borderRadius: 10,
    },
});