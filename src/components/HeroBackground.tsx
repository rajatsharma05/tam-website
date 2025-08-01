'use client'
import Image from 'next/image'

/*
Minimalistic Hero Background
- Uses CSS-only animations for efficiency
- Runs in a continuous loop without interruptions
- Minimal resource usage with subtle effects
*/

const backgrounds = [
  {
    id: 1,
    gradient: 'from-purple-500/30 via-pink-500/20 to-indigo-500/30',
    image: '/hero-backgrounds/bg-2.webp'
  },
  {
    id: 2,
    gradient: 'from-emerald-500/30 via-teal-500/20 to-cyan-500/30',
    image: '/hero-backgrounds/bg-3.webp'
  },
  {
    id: 3,
    gradient: 'from-blue-500/30 via-indigo-500/20 to-purple-500/30',
    image: '/hero-backgrounds/bg-6.webp'
  },
]

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary background with subtle animation */}
      <div className="absolute inset-0">
        <Image
          src={backgrounds[0].image}
          alt="Background"
          fill
          className="object-cover animate-hero-ken-burns-subtle"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[0].gradient} animate-hero-fade-subtle`} />
      </div>
      
      {/* Secondary background with crossfade animation */}
      <div className="absolute inset-0 animate-hero-crossfade">
        <Image
          src={backgrounds[1].image}
          alt="Background"
          fill
          className="object-cover animate-hero-ken-burns-subtle-delayed"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[1].gradient} animate-hero-fade-subtle-delayed`} />
      </div>
      
      {/* Tertiary background with crossfade animation */}
      <div className="absolute inset-0 animate-hero-crossfade-delayed">
        <Image
          src={backgrounds[2].image}
          alt="Background"
          fill
          className="object-cover animate-hero-ken-burns-subtle-delayed-2"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[2].gradient} animate-hero-fade-subtle-delayed-2`} />
      </div>
      
      {/* Minimal overlay for text readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
} 