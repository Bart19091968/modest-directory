import Link from 'next/link'

interface BannerProps {
  sponsor: {
    name: string
    bannerUrl: string
    linkUrl: string
  }
}

export default function Banner({ sponsor }: BannerProps) {
  return (
    <a
      href={sponsor.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
    >
      <img
        src={sponsor.bannerUrl}
        alt={`Sponsor: ${sponsor.name}`}
        className="w-full h-auto"
      />
    </a>
  )
}
