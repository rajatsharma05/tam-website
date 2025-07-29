'use client'

import { ReactNode } from 'react'
import Logo from '@/components/ui/Logo'

interface AdminTabsProps {
  activeTab: 'events' | 'registrations' | 'checkins'
  onTabChange: (tab: 'events' | 'registrations' | 'checkins') => void
  children: ReactNode
  totalRegistrations?: number
  totalCheckins?: number
  totalEvents?: number
  selectedEventName?: string
}

export default function AdminTabs({ 
  activeTab, 
  onTabChange, 
  children, 
  totalRegistrations = 0, 
  totalCheckins = 0, 
  totalEvents = 0,
  selectedEventName = ''
}: AdminTabsProps) {
  // Get the relevant statistic based on active tab
  const getStatistic = () => {
    switch (activeTab) {
      case 'events':
        return {
          title: 'Total Events',
          count: totalEvents,
          icon: 'events',
          color: 'blue'
        }
      case 'registrations':
        return {
          title: selectedEventName ? `${selectedEventName} Registrations` : 'Event Registrations',
          count: totalRegistrations,
          icon: 'registrations',
          color: 'green'
        }
      case 'checkins':
        return {
          title: selectedEventName ? `${selectedEventName} Check-ins` : 'Event Check-ins',
          count: totalCheckins,
          icon: 'checkins',
          color: 'purple'
        }
      default:
        return null
    }
  }

  const statistic = getStatistic()

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'events':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'registrations':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        )
      case 'checkins':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600'
      case 'green':
        return 'bg-green-100 text-green-600'
      case 'purple':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Logo size="md" showText={false} className="mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          
          {/* Single Statistic Display */}
          {statistic && (
            <div className="mb-8">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getColorClasses(statistic.color)} mr-6`}>
                      {getIcon(statistic.icon)}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 mb-2">{statistic.title}</p>
                      <p className="text-5xl font-bold text-gray-900">{statistic.count}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <div className="flex space-x-2">
                <button
                  onClick={() => onTabChange('events')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'events'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Events
                  </div>
                </button>
                <button
                  onClick={() => onTabChange('registrations')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'registrations'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Registrations
                  </div>
                </button>
                <button
                  onClick={() => onTabChange('checkins')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'checkins'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Check-ins
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          {children}
        </div>
      </div>
    </div>
  )
} 