'use client'

type StarRatingProps = {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRate?: (rating: number) => void
}

export default function StarRating({ 
  rating, 
  size = 'md', 
  interactive = false,
  onRate 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  const stars = []
  for (let i = 1; i <= 5; i++) {
    const filled = i <= rating
    const halfFilled = !filled && i - 0.5 <= rating
    
    stars.push(
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRate?.(i)}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
      >
        {filled ? (
          <span className="text-yellow-400">★</span>
        ) : halfFilled ? (
          <span className="text-yellow-400">★</span>
        ) : (
          <span className="text-gray-300">★</span>
        )}
      </button>
    )
  }

  return (
    <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
      {stars}
    </div>
  )
}
