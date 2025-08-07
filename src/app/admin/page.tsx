'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, query, orderBy, limit, startAfter, where, QueryDocumentSnapshot, DocumentData, writeBatch } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Event, Registration, Checkin } from '@/types'
import { convertFirestoreTimestamp } from '@/lib/utils'
import * as XLSX from 'xlsx'
import AdminTabs from '@/components/admin/AdminTabs'
import EventsTab from '@/components/admin/EventsTab'
import RegistrationsTab from '@/components/admin/RegistrationsTab'
import CheckinsTab from '@/components/admin/CheckinsTab'
import CashPaymentsTab from '@/components/admin/CashPaymentsTab'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]) // Unfiltered registrations for cash payments
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'checkins' | 'cashPayments'>('events')
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [exporting, setExporting] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [registrationPage, setRegistrationPage] = useState(1)
  const [registrationsLoading, setRegistrationsLoading] = useState(false)
  const [registrationsLastDoc, setRegistrationsLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [registrationsHasNext, setRegistrationsHasNext] = useState(false)
  const REGISTRATIONS_PAGE_SIZE = 20
  const [checkinPage, setCheckinPage] = useState(1)
  const [checkinsLoading, setCheckinsLoading] = useState(false)
  const [checkinsLastDoc, setCheckinsLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [checkinsHasNext, setCheckinsHasNext] = useState(false)
  const CHECKINS_PAGE_SIZE = 20
  const [processingPayment, setProcessingPayment] = useState(false)

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
    if (user?.email !== 'admin@tam.com') {
      router.push('/')
      return
    }
    fetchData()
    fetchCheckins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router])

  const fetchData = async () => {
    try {
      // Fetch events
      const eventsSnapshot = await getDocs(collection(db, 'events'))
      const eventsData: Event[] = []
      eventsSnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as Event)
      })
      setEvents(eventsData)
      if (eventsData.length > 0 && !selectedEventId) {
        setSelectedEventId(eventsData[0].id)
      }

      // Fetch registrations
      const registrationsSnapshot = await getDocs(collection(db, 'registrations'))
      const registrationsData: Registration[] = []
      registrationsSnapshot.forEach((doc) => {
        registrationsData.push({ id: doc.id, ...doc.data() } as Registration)
      })
      setRegistrations(registrationsData)
    } catch {
      console.error('Error fetching data:')
      // setError('Failed to fetch data. Please try again.') // Original code had this line commented out
    } finally {
      setLoading(false)
    }
  }

  const fetchCheckins = async () => {
    try {
      const checkinsSnapshot = await getDocs(collection(db, 'checkins'))
      const checkinsData: Checkin[] = []
      checkinsSnapshot.forEach((doc) => {
        checkinsData.push({ id: doc.id, ...doc.data() } as Checkin)
      })
      setCheckins(checkinsData)
    } catch {
      console.error('Error fetching checkins:')
      // setError('Failed to fetch check-ins. Please try again.') // Original code had this line commented out
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
      // setError('') // Original code had this line commented out
      
      // Filter out undefined values to prevent Firestore errors
      const cleanEventData = Object.fromEntries(
        Object.entries(eventData).filter(([, value]) => value !== undefined)
      )
      
      const eventDoc = {
        ...cleanEventData,
        registeredCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await addDoc(collection(db, 'events'), eventDoc)
      await fetchData()
    } catch (error) {
      console.error('Error adding event:', error)
      alert(`Failed to add event: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // setError('Failed to add event. Please try again.') // Original code had this line commented out
    }
  }

  const handleToggleEvent = async (eventId: string, isActive: boolean) => {
    try {
      // setError('') // Original code had this line commented out
      await updateDoc(doc(db, 'events', eventId), {
        isActive: !isActive,
        updatedAt: new Date()
      })
      await fetchData()
    } catch {
      console.error('Error updating event:')
      // setError('Failed to update event. Please try again.') // Original code had this line commented out
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This will also delete all registrations and check-ins for this event.')) {
      try {
        // setError('') // Original code had this line commented out
        // 1. Delete all registrations for this event
        const registrationsQuery = query(collection(db, 'registrations'), where('eventId', '==', eventId))
        const registrationsSnapshot = await getDocs(registrationsQuery)
        const batch = writeBatch(db)
        registrationsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        // 2. Delete all check-ins for this event
        const checkinsQuery = query(collection(db, 'checkins'), where('eventId', '==', eventId))
        const checkinsSnapshot = await getDocs(checkinsQuery)
        checkinsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        // 3. Delete the event itself
        batch.delete(doc(db, 'events', eventId))
        await batch.commit()
        await fetchData()
        await fetchCheckins()
      } catch {
        console.error('Error deleting event and related data:')
        // setError('Failed to delete event and related data. Please try again.') // Original code had this line commented out
      }
    }
  }

  // Fix all 'any' type errors in export logic
  const exportCheckinsToExcel = () => {
    setExporting(true)
    try {
      const filtered = checkins.filter((c: Checkin) => c.eventId === selectedEventId)
      
      const data = filtered.map((c: Checkin) => {
        // Handle different name field structures
        const registrantName = c.memberName || c.registrantName || (c as unknown as { name?: string }).name || 'Unknown'
        
        return {
          'Event Name': c.eventName,
          'Registrant Name': registrantName,
          'Roll Number': c.rollNumber,
          'Department & Section': c.departmentSection,
          'Email': c.email || c.teamLeaderEmail || '',
          'Phone': c.phone,
          'Check-in Time': c.checkInTime ? convertFirestoreTimestamp(c.checkInTime).toLocaleString() : '',
          'QR Code': c.qrCode,
          'Referral Code': c.referralCode || 'N/A',
          'Team Name': c.teamName || '',
          'Team Leader Email': c.teamLeaderEmail || '',
          'Payment Method': c.paymentMethod || (c.paymentStatus ? 'Unknown' : 'N/A'),
          'Payment Status': c.paymentStatus || 'N/A',
          'Payment Amount': c.paymentAmount ? `₹${c.paymentAmount}` : 'N/A'
        }
      })
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Check-ins')
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `checkins-${events.find(e => e.id === selectedEventId)?.title || 'event'}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      console.error('Error exporting checkins:')
      // setError('Failed to export check-ins. Please try again.') // Original code had this line commented out
    } finally {
      setExporting(false)
    }
  }

  const exportRegistrationsToExcel = () => {
    setExporting(true)
    try {
      const event = events.find(e => e.id === selectedEventId)
      // Only include approved registrations (not pending cash payments)
      const filtered = registrations.filter((r: Registration) => 
        r.eventId === selectedEventId && !(r.paymentStatus === 'pending' && r.paymentMethod === 'cash')
      )
      
      console.log('Exporting registrations:', {
        totalRegistrations: registrations.length,
        filteredRegistrations: filtered.length,
        selectedEventId,
        sampleRegistration: filtered[0]
      })
      
      let data: object[] = []
      if (event && event.teamType === 'team') {
        // Group by teamName, flatten members
        filtered.forEach((r: Registration) => {
          if (r.teamName && Array.isArray(r.teamMembers)) {
            r.teamMembers.forEach((member: { name: string; rollNumber: string; departmentSection: string; phone: string }, idx: number) => {
              data.push({
                'Team Name': r.teamName,
                'Member #': idx + 1,
                'Member Name': member.name,
                'Roll Number': member.rollNumber,
                'Department & Section': member.departmentSection,
                'Phone': member.phone,
                'Registration Time': r.createdAt ? convertFirestoreTimestamp(r.createdAt).toLocaleString() : '',
                'QR Code': r.qrCode || '',
                'Referral Code': r.referralCode || 'N/A',
                'Payment Method': r.paymentMethod || (r.paymentStatus ? 'Unknown' : 'N/A'),
                'Payment Status': r.paymentStatus || 'N/A',
                'Payment Amount': r.paymentAmount ? `₹${r.paymentAmount}` : 'N/A'
              })
            })
          }
        })
      } else {
        data = filtered.map((r: Registration) => {
          const registrantName = r.registrantName || (r as unknown as { name?: string }).name || 'Unknown'
          
          return {
            'Event Name': r.eventName,
            'Registrant Name': registrantName,
            'Roll Number': r.rollNumber,
            'Department & Section': r.departmentSection,
            'Email': r.email,
            'Phone': r.phone,
            'Registration Time': r.createdAt
              ? convertFirestoreTimestamp(r.createdAt).toLocaleString()
              : '',
            'QR Code': r.qrCode,
            'Referral Code': r.referralCode || 'N/A',
            'Payment Method': r.paymentMethod || (r.paymentStatus ? 'Unknown' : 'N/A'),
            'Payment Status': r.paymentStatus || 'N/A',
            'Payment Amount': r.paymentAmount ? `₹${r.paymentAmount}` : 'N/A'
          }
        })
      }
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations')
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `registrations-${event?.title || 'event'}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      console.error('Error exporting registrations:')
      // setError('Failed to export registrations. Please try again.') // Original code had this line commented out
    } finally {
      setExporting(false)
    }
  }

  const handleApprovePayment = async (registrationId: string) => {
    setProcessingPayment(true)
    try {
      const registrationRef = doc(db, 'registrations', registrationId)
      const registrationDoc = await getDoc(registrationRef)
      
      if (!registrationDoc.exists()) {
        throw new Error('Registration not found')
      }
      
      const registration = registrationDoc.data() as Registration
      
      // Update payment status to approved
      await updateDoc(registrationRef, {
        paymentStatus: 'approved',
        paymentApprovedAt: new Date(),
        paymentApprovedBy: user?.email || 'admin'
      })
      
      // Update event capacity for approved cash payments
      const eventRef = doc(db, 'events', registration.eventId)
      const increment = 1 // For team events, count as 1 team registration, not individual members
      await updateDoc(eventRef, {
        registeredCount: (events.find(e => e.id === registration.eventId)?.registeredCount || 0) + increment
      })
      
      // Send confirmation email
      try {
        const emailData = {
          email: registration.email,
          eventName: registration.eventName,
          qrCode: registration.qrCode,
          ...(registration.teamName 
            ? { teamName: registration.teamName }
            : { registrantName: registration.registrantName }
          )
        }

        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        })

        if (!emailResponse.ok) {
          console.warn('Email sending failed, but payment was approved')
        } else {
          console.log('Confirmation email sent successfully')
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError)
        // Don't fail the approval if email fails
      }
      
      // Refresh data
      await fetchData()
      // Refresh registrations for the current event
      if (selectedEventId) {
        await fetchPaginatedRegistrations('next', true)
      }
    } catch (error) {
      console.error('Error approving payment:', error)
      alert('Failed to approve payment. Please try again.')
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleRejectPayment = async (registrationId: string) => {
    setProcessingPayment(true)
    try {
      const registrationRef = doc(db, 'registrations', registrationId)
      const registrationDoc = await getDoc(registrationRef)
      
      if (!registrationDoc.exists()) {
        throw new Error('Registration not found')
      }
      
      // Update payment status to rejected
      await updateDoc(registrationRef, {
        paymentStatus: 'rejected',
        paymentApprovedAt: new Date(),
        paymentApprovedBy: user?.email || 'admin'
      })
      
      // Note: We don't update event capacity for rejected payments since they were never counted
      // in the first place (pending cash payments don't affect capacity)
      
      // Refresh data
      await fetchData()
      // Refresh registrations for the current event
      if (selectedEventId) {
        await fetchPaginatedRegistrations('next', true)
      }
    } catch (error) {
      console.error('Error rejecting payment:', error)
      alert('Failed to reject payment. Please try again.')
    } finally {
      setProcessingPayment(false)
    }
  }

  // Fetch paginated registrations for selected event
  const fetchPaginatedRegistrations = async (direction: 'next' | 'prev' = 'next', reset = false) => {
    setRegistrationsLoading(true)
    try {
      let q
      if (reset || !registrationsLastDoc) {
        q = query(
          collection(db, 'registrations'),
          where('eventId', '==', selectedEventId),
          orderBy('createdAt', 'desc'),
          limit(REGISTRATIONS_PAGE_SIZE)
        )
      } else {
        q = query(
          collection(db, 'registrations'),
          where('eventId', '==', selectedEventId),
          orderBy('createdAt', 'desc'),
          startAfter(registrationsLastDoc),
          limit(REGISTRATIONS_PAGE_SIZE)
        )
      }
      const snapshot = await getDocs(q)
      const data: Registration[] = []
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Registration)
      })
      
      // Store all registrations (unfiltered) for cash payments tab
      setAllRegistrations(data)
      
      // Filter out pending cash payments - only show approved registrations
      const approvedData = data.filter((r) => !(r.paymentStatus === 'pending' && r.paymentMethod === 'cash'))
      
      console.log('Registration filtering:', {
        totalFetched: data.length,
        approvedCount: approvedData.length,
        sampleData: data.slice(0, 2).map(r => ({
          id: r.id,
          paymentMethod: r.paymentMethod,
          paymentStatus: r.paymentStatus,
          isPendingCash: r.paymentStatus === 'pending' && r.paymentMethod === 'cash'
        }))
      })
      
      setRegistrations(approvedData)
      setRegistrationsLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setRegistrationsHasNext(snapshot.size === REGISTRATIONS_PAGE_SIZE)
      setRegistrationPage(reset ? 1 : (direction === 'next' ? registrationPage + 1 : registrationPage - 1))
    } catch {
      // setError('Failed to fetch registrations. Please try again.') // Original code had this line commented out
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
      let q
      if (reset || !checkinsLastDoc) {
        q = query(
          collection(db, 'checkins'),
          where('eventId', '==', selectedEventId),
          orderBy('checkInTime', 'desc'),
          limit(CHECKINS_PAGE_SIZE)
        )
      } else {
        q = query(
          collection(db, 'checkins'),
          where('eventId', '==', selectedEventId),
          orderBy('checkInTime', 'desc'),
          startAfter(checkinsLastDoc),
          limit(CHECKINS_PAGE_SIZE)
        )
      }
      const snapshot = await getDocs(q)
      const data: Checkin[] = []
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Checkin)
      })
      setCheckins(data)
      setCheckinsLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setCheckinsHasNext(snapshot.size === CHECKINS_PAGE_SIZE)
      setCheckinPage(reset ? 1 : (direction === 'next' ? checkinPage + 1 : checkinPage - 1))
    } catch {
      // setError('Failed to fetch check-ins. Please try again.') // Original code had this line commented out
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </div>
    )
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
          onTabChange={setActiveTab}
          totalEvents={events.length}
          totalRegistrations={registrations.filter(r => r.eventId === selectedEventId && !(r.paymentStatus === 'pending' && r.paymentMethod === 'cash')).length}
          totalCheckins={checkins.filter(c => c.eventId === selectedEventId).length}
          totalCashPayments={allRegistrations.filter(r => r.eventId === selectedEventId && r.paymentMethod === 'cash' && r.paymentStatus === 'pending').length}
          selectedEventName={events.find(e => e.id === selectedEventId)?.title || ''}
          paymentStatusBreakdown={getPaymentStatusBreakdown()}
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