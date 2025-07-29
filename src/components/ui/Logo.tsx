import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  variant?: 'default' | 'white'
}

export default function Logo({ className = '', size = 'md', showText = true, variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  const textColor = variant === 'white' ? 'text-white' : 'text-gray-900'

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* TAM Logo */}
      <div className={`${sizeClasses[size]} flex-shrink-0 relative bg-white rounded-lg shadow-lg p-2 border border-gray-200`}>
        <Image
          src="/tam-logo.png"
          alt="TAM Logo"
          width={48}
          height={48}
          className="w-full h-full object-contain drop-shadow-sm"
          style={{
            filter: 'invert(1) brightness(0)',
          }}
          priority
        />
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-wider ${textColor} ${textSizes[size]} drop-shadow-sm`}>
            T A M
          </span>
        </div>
      )}
    </div>
  )
} 