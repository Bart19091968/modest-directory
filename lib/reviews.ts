export type ReviewSource = 'google' | 'modestdirectory'

export type VisibleReviewData = {
  source: ReviewSource
  averageRating: number
  reviewCount: number
}

export function getVisibleReviewData(entry: {
  googlePlaceId?: string | null
  googleRating?: number | null
  googleReviewCount?: number | null
  modestDirectoryAverageRating?: number | null
  modestDirectoryReviewCount?: number | null
}): VisibleReviewData {
  const hasGoogleData =
    !!entry.googlePlaceId &&
    typeof entry.googleRating === 'number' &&
    typeof entry.googleReviewCount === 'number'

  if (hasGoogleData) {
    return {
      source: 'google',
      averageRating: entry.googleRating ?? 0,
      reviewCount: entry.googleReviewCount ?? 0,
    }
  }

  return {
    source: 'modestdirectory',
    averageRating: entry.modestDirectoryAverageRating ?? 0,
    reviewCount: entry.modestDirectoryReviewCount ?? 0,
  }
}
