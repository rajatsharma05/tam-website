'use client'

import { ReactNode } from 'react'
import Logo from '@/components/ui/Logo'

interface AdminTabsProps {
  activeTab: 'events' | 'registrations' | 'checkins' | 'cashPayments'
  onTabChange: (tab: 'events' | 'registrations' | 'checkins' | 'cashPayments') => void
  children: ReactNode
  totalRegistrations?: number
  totalCheckins?: number
  totalEvents?: number
  totalCashPayments?: number
  selectedEventName?: string
  paymentStatusBreakdown?: {
    online: number
    cashApproved: number
    cashPending: number
    cashRejected: number
  }
  tabLoading?: boolean
}

export default function AdminTabs({ 
  activeTab, 
  onTabChange, 
  children, 
  totalRegistrations = 0, 
  totalCheckins = 0, 
  totalEvents = 0,
  totalCashPayments = 0,
  selectedEventName = '',
  paymentStatusBreakdown,
  tabLoading
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
      case 'cashPayments':
        return {
          title: 'Pending Cash Payments',
          count: totalCashPayments,
          icon: 'cashPayments',
          color: 'orange'
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
      case 'cashPayments':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
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
      case 'orange':
        return 'bg-orange-100 text-orange-600'
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
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getColorClasses(statistic.color)} mr-6`}>
                      {getIcon(statistic.icon)}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600 mb-2">{statistic.title}</p>
                      <p className="text-5xl font-bold text-gray-900">{statistic.count}</p>
                    </div>
                  </div>
                  
                  {/* Payment Status Indicators */}
                  {paymentStatusBreakdown && (activeTab === 'registrations' || activeTab === 'cashPayments') && (
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Payment Status Breakdown</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-2xl font-bold text-green-600">{paymentStatusBreakdown.online}</div>
                          </div>
                          <div className="text-xs text-green-700 font-medium">Online</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <div className="text-2xl font-bold text-blue-600">{paymentStatusBreakdown.cashApproved}</div>
                          </div>
                          <div className="text-xs text-blue-700 font-medium">Cash Approved</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-2xl font-bold text-orange-600">{paymentStatusBreakdown.cashPending}</div>
                          </div>
                          <div className="text-xs text-orange-700 font-medium">Cash Pending</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <div className="text-2xl font-bold text-red-600">{paymentStatusBreakdown.cashRejected}</div>
                          </div>
                          <div className="text-xs text-red-700 font-medium">Cash Rejected</div>
                        </div>
                      </div>
                    </div>
                  )}
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
                <button
                  onClick={() => onTabChange('cashPayments')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'cashPayments'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Cash Payments
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          {tabLoading && (
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Loading tab data...</span>
                </div>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
} 