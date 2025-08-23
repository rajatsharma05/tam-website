'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { Event, Registration, Checkin } from '@/types'
import AdminTabs from '@/components/admin/AdminTabs'
import EventsTab from '@/components/admin/EventsTab'
import RegistrationsTab from '@/components/admin/RegistrationsTab'
import CheckinsTab from '@/components/admin/CheckinsTab'
import CashPaymentsTab from '@/components/admin/CashPaymentsTab'

export default function AdminPage() {
  const { user, isAdmin, adminLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'checkins' | 'cashPayments'>('events')
  const [events, setEvents] = useState<Event[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]) // Unfiltered registrations for cash payments
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [exporting, setExporting] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [registrationPage, setRegistrationPage] = useState(1)
  const [registrationsLoading, setRegistrationsLoading] = useState(false)
  const [registrationsLastDoc, setRegistrationsLastDoc] = useState<{id: string} | null>(null)
  const [registrationsHasNext, setRegistrationsHasNext] = useState(false)
  const REGISTRATIONS_PAGE_SIZE = 20
  const [checkinPage, setCheckinPage] = useState(1)
  const [checkinsLoading, setCheckinsLoading] = useState(false)
  const [checkinsLastDoc, setCheckinsLastDoc] = useState<{id: string} | null>(null)
  const [checkinsHasNext, setCheckinsHasNext] = useState(false)
  const CHECKINS_PAGE_SIZE = 20
  const [processingPayment, setProcessingPayment] = useState(false)
  const [tabLoading, setTabLoading] = useState(false)

  // Calculate payment status breakdown for the selected event
  const getPaymentStatusBreakdown = () => {
    if (!selectedEventId) return undefined
    
    const eventRegistrations = allRegistrations.filter(r => r.eventId === selectedEventId)
    
    return {
      online: eventRegistrations.filter(r => r.paymentMethod === 'online' && r.paymentStatus === 'approved').length,
      cashApproved: eventRegistrations.filter(r => r.paymentMethod === 'cash' && r.paymentStatus === 'approved').length,
      cashPending: eventRegistrations.filter(r => r.paymentMethod === 'cash' && r.paymentStatus === 'pending').length,
      cashRejected: eventRegistrations.filter(r => r.paymentMethod === 'cash' && r.paymentStatus === 'rejected').length
    }
  }

  useEffect(() => {
    // Check if user is authenticated and has admin privileges
    if (!user || !isAdmin) {
      if (user && !isAdmin) {
        // User is logged in but not admin
        router.push('/')
        return
      }
      // User is not logged in, wait for auth to complete
      return
    }
    
    // Load essential data first (events only)
    fetchEventsOnly()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin, router])

  const fetchEventsOnly = async () => {
    try {
      setLoading(true)
      const eventsResponse = await fetch('/api/admin/events')
      const eventsResult = await eventsResponse.json()
      
      if (eventsResult.success) {
        setEvents(eventsResult.events)
        if (eventsResult.events.length > 0 && !selectedEventId) {
          setSelectedEventId(eventsResult.events[0].id)
        }
      } else {
        console.error('Error fetching events:', eventsResult.error)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      // Use Promise.all for parallel API calls
      const [eventsResponse, registrationsResponse] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/registrations')
      ])
      
      const [eventsResult, registrationsResult] = await Promise.all([
        eventsResponse.json(),
        registrationsResponse.json()
      ])
      
      if (eventsResult.success) {
        setEvents(eventsResult.events)
        if (eventsResult.events.length > 0 && !selectedEventId) {
          setSelectedEventId(eventsResult.events[0].id)
        }
      } else {
        console.error('Error fetching events:', eventsResult.error)
      }

      if (registrationsResult.success) {
        setAllRegistrations(registrationsResult.registrations)
      } else {
        console.error('Error fetching registrations:', registrationsResult.error)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchCheckins = async () => {
    try {
      const checkinsResponse = await fetch('/api/admin/checkins')
      const checkinsResult = await checkinsResponse.json()
      
      if (checkinsResult.success) {
        setCheckins(checkinsResult.checkins)
      } else {
        console.error('Error fetching checkins:', checkinsResult.error)
      }
    } catch (error) {
      console.error('Error fetching checkins:', error)
    }
  }

  // Load additional data only when switching to specific tabs
  const loadTabData = async (tab: 'events' | 'registrations' | 'checkins' | 'cashPayments') => {
    setTabLoading(true)
    try {
      if (tab === 'registrations' && allRegistrations.length === 0) {
        await fetchData()
      } else if (tab === 'checkins' && checkins.length === 0) {
        await fetchCheckins()
      }
    } catch (error) {
      console.error('Error loading tab data:', error)
    } finally {
      setTabLoading(false)
    }
  }

  const handleAddEvent = async (eventData: {
    title: string
    description: string
    date: string
    time: string
    location: string
    capacity: number
    price?: number
    posterUrl?: string
    teamType?: 'individual' | 'team'
    minTeamSize?: number
    maxTeamSize?: number
  }) => {
    try {
      // Filter out undefined values to prevent API errors
      const cleanEventData = Object.fromEntries(
        Object.entries(eventData).filter(([, value]) => value !== undefined)
      )
      
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanEventData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchData()
      } else {
        console.error('Error adding event:', result.error)
        alert(`Failed to add event: ${result.error}`)
      }
    } catch (error) {
      console.error('Error adding event:', error)
      alert(`Failed to add event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleToggleEvent = async (eventId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          isActive: !isActive
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchData()
      } else {
        console.error('Error updating event:', result.error)
        alert(`Failed to update event: ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This will also delete all registrations and check-ins for this event.')) {
      try {
        const response = await fetch(`/api/admin/events?eventId=${eventId}`, {
          method: 'DELETE',
        })
        
        const result = await response.json()
        
        if (result.success) {
          await fetchData()
          await fetchCheckins()
        } else {
          console.error('Error deleting event:', result.error)
          alert(`Failed to delete event: ${result.error}`)
        }
      } catch (error) {
        console.error('Error deleting event and related data:', error)
        alert(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const exportCheckinsToExcel = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/admin/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: selectedEventId }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        const blob = new Blob([Buffer.from(result.excelData, 'base64')], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `checkins-${events.find(e => e.id === selectedEventId)?.title || 'event'}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      } else {
        console.error('Error exporting checkins:', result.error)
        alert(`Failed to export check-ins: ${result.error}`)
      }
    } catch (error) {
      console.error('Error exporting checkins:', error)
      alert(`Failed to export check-ins: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setExporting(false)
    }
  }

  const exportRegistrationsToExcel = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId: selectedEventId }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        const blob = new Blob([Buffer.from(result.excelData, 'base64')], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
        a.download = `registrations-${events.find(e => e.id === selectedEventId)?.title || 'event'}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      } else {
        console.error('Error exporting registrations:', result.error)
        alert(`Failed to export registrations: ${result.error}`)
      }
    } catch (error) {
      console.error('Error exporting registrations:', error)
      alert(`Failed to export registrations: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setExporting(false)
    }
  }

  const handleApprovePayment = async (registrationId: string) => {
    setProcessingPayment(true)
    try {
      const response = await fetch('/api/approve-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ registrationId }),
      })
      
      const result = await response.json()
      
      if (result.success) {
      // Refresh data
      await fetchData()
      // Refresh registrations for the current event
      if (selectedEventId) {
        await fetchPaginatedRegistrations('next', true)
        }
      } else {
        console.error('Error approving payment:', result.error)
        alert(`Failed to approve payment: ${result.error}`)
      }
    } catch (error) {
      console.error('Error approving payment:', error)
      alert(`Failed to approve payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleRejectPayment = async (registrationId: string) => {
    setProcessingPayment(true)
    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
        paymentStatus: 'rejected',
        paymentApprovedAt: new Date(),
        paymentApprovedBy: user?.email || 'admin'
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
      // Refresh data
      await fetchData()
      // Refresh registrations for the current event
      if (selectedEventId) {
        await fetchPaginatedRegistrations('next', true)
        }
      } else {
        console.error('Error rejecting payment:', result.error)
        alert(`Failed to reject payment: ${result.error}`)
      }
    } catch (error) {
      console.error('Error rejecting payment:', error)
      alert(`Failed to reject payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setProcessingPayment(false)
    }
  }

  // Fetch paginated registrations for selected event
  const fetchPaginatedRegistrations = async (direction: 'next' | 'prev' = 'next', reset = false) => {
    setRegistrationsLoading(true)
    try {
      const lastDocId = reset ? null : registrationsLastDoc?.id
      
      const response = await fetch(`/api/admin/registrations?eventId=${selectedEventId}&page=${registrationPage}&pageSize=${REGISTRATIONS_PAGE_SIZE}&lastDocId=${lastDocId || 'null'}`)
      const result = await response.json()
      
      if (result.success) {
      // Store all registrations (unfiltered) for cash payments tab
        setAllRegistrations(result.registrations)
      
      // Filter out pending cash payments - only show approved registrations
        const approvedData = result.registrations.filter((r: Registration) => !(r.paymentStatus === 'pending' && r.paymentMethod === 'cash'))
      
      setRegistrations(approvedData)
        setRegistrationsLastDoc(result.lastDocId ? { id: result.lastDocId } : null)
        setRegistrationsHasNext(result.hasNext)
      setRegistrationPage(reset ? 1 : (direction === 'next' ? registrationPage + 1 : registrationPage - 1))
      } else {
        console.error('Error fetching registrations:', result.error)
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setRegistrationsLoading(false)
    }
  }

  // Fetch registrations when event changes or on mount
  useEffect(() => {
    if (selectedEventId) {
      fetchPaginatedRegistrations('next', true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId])

  // Fetch paginated checkins for selected event
  const fetchPaginatedCheckins = async (direction: 'next' | 'prev' = 'next', reset = false) => {
    setCheckinsLoading(true)
    try {
      const lastDocId = reset ? null : checkinsLastDoc?.id
      
      const response = await fetch(`/api/admin/checkins?eventId=${selectedEventId}&page=${checkinPage}&pageSize=${CHECKINS_PAGE_SIZE}&lastDocId=${lastDocId || 'null'}`)
      const result = await response.json()
      
      if (result.success) {
        setCheckins(result.checkins)
        setCheckinsLastDoc(result.lastDocId ? { id: result.lastDocId } : null)
        setCheckinsHasNext(result.hasNext)
        setCheckinPage(reset ? 1 : (direction === 'next' ? checkinPage + 1 : checkinPage - 1))
      } else {
        console.error('Error fetching checkins:', result.error)
      }
    } catch (error) {
      console.error('Error fetching checkins:', error)
    } finally {
      setCheckinsLoading(false)
    }
  }

  // Fetch checkins when event changes or on mount
  useEffect(() => {
    if (selectedEventId) {
      fetchPaginatedCheckins('next', true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId])

  const handleTabChange = (tab: 'events' | 'registrations' | 'checkins' | 'cashPayments') => {
    setActiveTab(tab)
    // Load data only when switching to specific tabs
    loadTabData(tab)
  }

  // Show loading state while checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking admin privileges...</p>
        </div>
      </div>
    )
  }

  // Show loading state while fetching initial data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 animate-pulse">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
              <div className="h-10 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <div className="flex space-x-2">
                {['Events', 'Registrations', 'Check-ins', 'Cash Payments'].map((tab) => (
                  <div key={tab} className="px-6 py-3 rounded-lg bg-gray-200 w-24"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect non-admin users
  if (!user || !isAdmin) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* {error && ( // Original code had this line commented out */}
        {/*   <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4"> // Original code had this line commented out */}
        {/*     <p className="text-sm text-red-600">{error}</p> // Original code had this line commented out */}
        {/*     <button  // Original code had this line commented out */}
        {/*       onClick={() => setError('')} // Original code had this line commented out */}
        {/*       className="mt-2 text-xs text-red-500 hover:text-red-700 underline" // Original code had this line commented out */}
        {/*     > // Original code had this line commented out */}
        {/*       Dismiss // Original code had this line commented out */}
        {/*     </button> // Original code had this line commented out */}
        {/*   </div> // Original code had this line commented out */}
        {/* )} // Original code had this line commented out */}
        
        <AdminTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          totalEvents={events.length}
          totalRegistrations={registrations.filter(r => r.eventId === selectedEventId && !(r.paymentStatus === 'pending' && r.paymentMethod === 'cash')).length}
          totalCheckins={checkins.filter(c => c.eventId === selectedEventId).length}
          totalCashPayments={allRegistrations.filter(r => r.paymentStatus === 'pending' && r.paymentMethod === 'cash').length}
          selectedEventName={events.find(e => e.id === selectedEventId)?.title}
          paymentStatusBreakdown={getPaymentStatusBreakdown()}
          tabLoading={tabLoading}
        >
          {activeTab === 'events' && (
            <EventsTab
              events={events}
              onAddEvent={handleAddEvent}
              onToggleEvent={handleToggleEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
          
          {activeTab === 'registrations' && (
            <RegistrationsTab
              registrations={registrations}
              events={events}
              selectedEventId={selectedEventId}
              onEventSelect={setSelectedEventId}
              onExportRegistrations={exportRegistrationsToExcel}
              exporting={exporting}
              page={registrationPage}
              loading={registrationsLoading}
              hasNext={registrationsHasNext}
              onNextPage={() => fetchPaginatedRegistrations('next')}
              onPrevPage={() => setRegistrationPage((p) => Math.max(1, p - 1))}
            />
          )}
          
          {activeTab === 'checkins' && (
            <CheckinsTab
              checkins={checkins}
              events={events}
              selectedEventId={selectedEventId}
              onEventSelect={setSelectedEventId}
              onExportCheckins={exportCheckinsToExcel}
              exporting={exporting}
              page={checkinPage}
              loading={checkinsLoading}
              hasNext={checkinsHasNext}
              onNextPage={() => fetchPaginatedCheckins('next')}
              onPrevPage={() => setCheckinPage((p) => Math.max(1, p - 1))}
            />
          )}
          
          {activeTab === 'cashPayments' && (
            <CashPaymentsTab
              registrations={allRegistrations}
              events={events}
              selectedEventId={selectedEventId}
              onEventSelect={setSelectedEventId}
              onApprovePayment={handleApprovePayment}
              onRejectPayment={handleRejectPayment}
              loading={processingPayment}
            />
          )}
        </AdminTabs>
      </div>
    </div>
  )
} 