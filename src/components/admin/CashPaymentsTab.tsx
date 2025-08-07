'use client'

import { useState } from 'react'
import { Registration, Event } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CashPaymentsTabProps {
  registrations: Registration[]
  events: Event[]
  selectedEventId: string
  onEventSelect: (eventId: string) => void
  onApprovePayment: (registrationId: string) => Promise<void>
  onRejectPayment: (registrationId: string) => Promise<void>
  loading: boolean
}

export default function CashPaymentsTab({
  registrations,
  events,
  selectedEventId,
  onEventSelect,
  onApprovePayment,
  onRejectPayment,
  loading
}: CashPaymentsTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)
  
  // Filter registrations for cash payments that are pending
  const pendingCashRegistrations = registrations.filter((r) => 
    r.eventId === selectedEventId && 
    r.paymentMethod === 'cash' && 
    r.paymentStatus === 'pending'
  )
  
  console.log('CashPaymentsTab filtering:', {
    totalRegistrations: registrations.length,
    selectedEventId,
    pendingCashCount: pendingCashRegistrations.length,
    sampleRegistrations: registrations.slice(0, 3).map(r => ({
      id: r.id,
      eventId: r.eventId,
      paymentMethod: r.paymentMethod,
      paymentStatus: r.paymentStatus,
      isPendingCash: r.eventId === selectedEventId && r.paymentMethod === 'cash' && r.paymentStatus === 'pending'
    }))
  })
  
  const filteredRegistrations = pendingCashRegistrations.filter((r) =>
    (r.registrantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.teamLeaderEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(r.teamMembers) && r.teamMembers.some(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.departmentSection?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )))
  )

  const handleApprovePayment = async (registrationId: string) => {
    setProcessingPayment(registrationId)
    try {
      await onApprovePayment(registrationId)
    } finally {
      setProcessingPayment(null)
    }
  }

  const handleRejectPayment = async (registrationId: string) => {
    setProcessingPayment(registrationId)
    try {
      await onRejectPayment(registrationId)
    } finally {
      setProcessingPayment(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Pending Cash Payments</h2>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <select
              value={selectedEventId}
              onChange={(e) => onEventSelect(e.target.value)}
              className="pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl bg-white appearance-none cursor-pointer min-w-[250px]"
            >
              <option value="">All Events</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search registrants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pending payments...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending cash payments</h3>
            <p className="text-gray-600">All cash payments have been processed or there are no cash registrations for this event.</p>
          </div>
        ) : (
          filteredRegistrations.map((registration) => (
            <Card key={registration.id} className="card-hover border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {registration.teamName || registration.registrantName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {registration.teamName ? 'Team Event' : 'Individual Event'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <p className="text-gray-600">{registration.email}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span>
                            <p className="text-gray-600">{registration.phone}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Roll Number:</span>
                            <p className="text-gray-600">{registration.rollNumber}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Department:</span>
                            <p className="text-gray-600">{registration.departmentSection}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Payment Amount:</span>
                            <p className="text-gray-600">₹{registration.paymentAmount}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Payment Status:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Cash (Pending)
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Registration Date:</span>
                            <p className="text-gray-600">
                              {registration.createdAt instanceof Date 
                                ? registration.createdAt.toLocaleDateString()
                                : typeof registration.createdAt === 'string'
                                ? new Date(registration.createdAt).toLocaleDateString()
                                : 'Unknown'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {registration.teamName && registration.teamMembers && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-700 mb-2">Team Members:</h4>
                            <div className="space-y-2">
                              {registration.teamMembers.map((member, idx) => (
                                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                    <div><span className="font-medium">Name:</span> {member.name}</div>
                                    <div><span className="font-medium">Roll:</span> {member.rollNumber}</div>
                                    <div><span className="font-medium">Dept:</span> {member.departmentSection}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                    <Button
                      onClick={() => handleApprovePayment(registration.id)}
                      disabled={processingPayment === registration.id}
                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {processingPayment === registration.id ? (
                        <>
                          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve Payment
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleRejectPayment(registration.id)}
                      disabled={processingPayment === registration.id}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {processingPayment === registration.id ? (
                        <>
                          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 