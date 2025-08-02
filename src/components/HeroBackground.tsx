'use client'
import Image from 'next/image'

const backgrounds = [
  {
    id: 1,
    gradient: 'from-purple-500/20 via-pink-500/10 to-indigo-500/20',
    image: '/hero-backgrounds/bg-1.webp'
  },
  {
    id: 2,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    image: '/hero-backgrounds/bg-3.webp'
  },
  {
    id: 3,
    gradient: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
    image: '/hero-backgrounds/bg-6.webp'
  },
  {
    id: 4,
    gradient: 'from-orange-500/20 via-red-500/10 to-pink-500/20',
    image: '/hero-backgrounds/bg-8.webp'
  },
]

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background 1 */}
      <div className="absolute inset-0 animate-bg-1">
        <Image
          src={backgrounds[0].image}
          alt="Background"
          fill
          className="object-cover animate-ken-burns-1"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[0].gradient}`} />
      </div>
      
      {/* Background 2 */}
      <div className="absolute inset-0 animate-bg-2">
        <Image
          src={backgrounds[1].image}
          alt="Background"
          fill
          className="object-cover animate-ken-burns-2"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[1].gradient}`} />
      </div>
      
      {/* Background 3 */}
      <div className="absolute inset-0 animate-bg-3">
        <Image
          src={backgrounds[2].image}
          alt="Background"
          fill
          className="object-cover animate-ken-burns-3"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[2].gradient}`} />
      </div>
      
      {/* Background 4 */}
      <div className="absolute inset-0 animate-bg-4">
        <Image
          src={backgrounds[3].image}
          alt="Background"
          fill
          className="object-cover animate-ken-burns-4"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[3].gradient}`} />
      </div>
      
      {/* Darkened filter for better readability */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
} 