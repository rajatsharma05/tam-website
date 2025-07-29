'use client'

import { useState } from 'react'
import { Registration, Event } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RegistrationsTabProps {
  registrations: Registration[]
  events: Event[]
  selectedEventId: string
  onEventSelect: (eventId: string) => void
  onExportRegistrations: () => void
  exporting: boolean
  page: number
  loading: boolean
  hasNext: boolean
  onNextPage: () => void
  onPrevPage: () => void
}

export default function RegistrationsTab({
  registrations,
  events,
  selectedEventId,
  onEventSelect,
  onExportRegistrations,
  exporting,
  page,
  loading,
  hasNext,
  onNextPage,
  onPrevPage
}: RegistrationsTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredRegistrations = registrations.filter((r) =>
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

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Registrations</h2>
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
        <div className="flex gap-2 items-center">
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
          <Button onClick={onExportRegistrations} disabled={exporting} className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            {exporting ? (
              <>
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to Excel
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
            <p className="text-gray-600">Try searching by name, email, roll number, or phone.</p>
          </div>
        ) : (
          filteredRegistrations.map((registration) => (
            <Card key={registration.id}>
              <CardHeader>
                <CardTitle>{registration.eventName}</CardTitle>
                <p className="text-sm text-gray-600">
                  {(() => {
                    let date: Date | null = null;
                    if (registration.createdAt) {
                      const createdAt: Date | { seconds: number } | string = registration.createdAt;
                      if (typeof createdAt === 'object' && (createdAt as { seconds: number }).seconds) {
                        date = new Date((createdAt as { seconds: number }).seconds * 1000);
                      } else if (typeof createdAt === 'string' || typeof createdAt === 'number') {
                        date = new Date(createdAt);
                      }
                    }
                    return date && !isNaN(date.getTime()) ? date.toLocaleDateString() : 'Date Unavailable';
                  })()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {registration.teamName && Array.isArray(registration.teamMembers) ? (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Team Name</p>
                        <p className="text-gray-900">{registration.teamName}</p>
                        <p className="text-sm text-gray-600">Leader: {registration.teamLeaderEmail}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Team Members:</p>
                          <ul className="text-sm text-gray-800 space-y-1">
                            {registration.teamMembers.map((member, idx) => (
                              <li key={idx} className="border-b last:border-b-0 pb-1">
                                <span className="font-semibold">{member.name}</span> ({member.rollNumber}, {member.departmentSection}, {member.phone})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-700">Registrant</p>
                        <p className="text-gray-900">{registration.registrantName}</p>
                        <p className="text-sm text-gray-600">{registration.email}</p>
                        <p className="text-sm text-gray-600">{registration.phone}</p>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">QR Code</p>
                    <p className="text-xs font-mono text-gray-600 break-all">
                      {registration.qrCode}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Status: {registration.isCheckedIn ? 'Checked In' : 'Not Checked In'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button onClick={onPrevPage} disabled={page === 1 || loading} variant="outline">
          Previous
        </Button>
        <span className="text-gray-700">Page {page}</span>
        <Button onClick={onNextPage} disabled={!hasNext || loading} variant="outline">
          Next
        </Button>
      </div>
    </div>
  )
} 