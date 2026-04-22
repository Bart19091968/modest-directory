import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ModestDirectory - Islamitische Kledingwinkels Nederland & België'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a5c38 0%, #2d8a5e 60%, #1a5c38 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 100px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            marginBottom: 24,
            letterSpacing: '-1px',
          }}
        >
          <span style={{ color: 'white' }}>Modest</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Directory</span>
        </div>
        <div
          style={{
            fontSize: 34,
            color: 'rgba(255,255,255,0.88)',
            textAlign: 'center',
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          Islamitische Kledingwinkels in Nederland & België
        </div>
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 48,
          }}
        >
          {['Hijab Shops', 'Abaya Winkels', 'Modest Fashion'].map(label => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 40,
                padding: '10px 28px',
                color: 'white',
                fontSize: 22,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
