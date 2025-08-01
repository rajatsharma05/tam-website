'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Event } from '@/types'

interface RegistrationFormProps {
  event: Event
  userEmail: string
  onSubmit: (
    formData:
      | { name: string; rollNumber: string; departmentSection: string; phone: string }
      | { teamName: string; teamMembers: Array<{ name: string; rollNumber: string; departmentSection: string; phone: string }>; teamLeaderEmail: string }
  ) => void
  loading: boolean
}

export default function RegistrationForm({ event, userEmail, onSubmit, loading }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    departmentSection: '',
    phone: ''
  })

  // Team registration state
  const isTeamEvent = event.teamType === 'team'
  const minTeamSize = event.minTeamSize || 2
  const maxTeamSize = event.maxTeamSize || 4
  const [teamName, setTeamName] = useState('')
  const [teamMembers, setTeamMembers] = useState([
    { name: '', rollNumber: '', departmentSection: '', phone: '' },
    { name: '', rollNumber: '', departmentSection: '', phone: '' },
  ])
  const [teamLeaderEmail, setTeamLeaderEmail] = useState('')

  // Form validation state
  const [formError, setFormError] = useState('')

  const handleTeamMemberChange = (idx: number, field: string, value: string) => {
    setTeamMembers(members => members.map((m, i) => i === idx ? { ...m, [field]: value } : m))
  }
  const addTeamMember = () => {
    if (teamMembers.length < maxTeamSize) {
      setTeamMembers([...teamMembers, { name: '', rollNumber: '', departmentSection: '', phone: '' }])
    }
  }
  const removeTeamMember = (idx: number) => {
    if (teamMembers.length > minTeamSize) {
      setTeamMembers(members => members.filter((_, i) => i !== idx))
    }
  }

  const validateForm = () => {
    if (isTeamEvent) {
      // Validate team size and required fields
      if (teamMembers.length < minTeamSize || teamMembers.length > maxTeamSize) {
        setFormError(`Team size must be between ${minTeamSize} and ${maxTeamSize}`)
        return false
      }
      if (!teamName.trim()) {
        setFormError('Team name is required')
        return false
      }
      if (!teamLeaderEmail.trim()) {
        setFormError('Team leader email is required')
        return false
      }
      for (const member of teamMembers) {
        if (!member.name || !member.rollNumber || !member.departmentSection || !member.phone) {
          setFormError('All team member fields are required')
          return false
        }
      }
    } else {
      if (!formData.name || !formData.rollNumber || !formData.departmentSection || !formData.phone) {
        setFormError('All fields are required')
        return false
      }
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    
    if (!validateForm()) return

    if (isTeamEvent) {
      onSubmit({
        teamName,
        teamMembers,
        teamLeaderEmail
      })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Register for <span className="text-gradient">{event.title}</span>
          </h1>
          <p className="text-lg text-gray-600">
            Complete your registration to secure your spot
          </p>
        </div>

        <Card className="card-hover border-0 shadow-xl animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Registration Form</CardTitle>
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <span className="font-medium text-gray-700">Date:</span>
                  <p className="text-gray-600">{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Time:</span>
                  <p className="text-gray-600">{(() => {
                    const date = new Date(`1970-01-01T${event.time}`);
                    if (!isNaN(date.getTime())) {
                      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    }
                    return event.time;
                  })()}</p>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Location:</span>
                  <p className="text-gray-600">{event.location}</p>
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-700">Available Spots:</span>
                  <p className="text-gray-600">{event.capacity - event.registeredCount} remaining</p>
                </div>
                {event.price && (
                  <div className="text-left md:col-span-2">
                    <span className="font-medium text-gray-700">Registration Fee:</span>
                    <p className="text-gray-600">
                      ₹{event.price} {isTeamEvent ? `per team member (${teamMembers.length} members = ₹${event.price * teamMembers.length})` : 'per person'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isTeamEvent ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Team Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 input-focus"
                      placeholder="Enter your team name"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Team Leader Email *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 input-focus"
                      placeholder="Enter team leader's email"
                      value={teamLeaderEmail}
                      onChange={e => setTeamLeaderEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Team Members ({teamMembers.length} of {maxTeamSize})</label>
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-lg relative">
                        <div>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Full Name"
                            value={member.name}
                            onChange={e => handleTeamMemberChange(idx, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Roll Number"
                            value={member.rollNumber}
                            onChange={e => handleTeamMemberChange(idx, 'rollNumber', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Department & Section"
                            value={member.departmentSection}
                            onChange={e => handleTeamMemberChange(idx, 'departmentSection', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Phone Number"
                            value={member.phone}
                            onChange={e => handleTeamMemberChange(idx, 'phone', e.target.value)}
                            required
                          />
                        </div>
                        {teamMembers.length > minTeamSize && (
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                            onClick={() => removeTeamMember(idx)}
                            tabIndex={-1}
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow disabled:opacity-50"
                        onClick={addTeamMember}
                        disabled={teamMembers.length >= maxTeamSize}
                      >
                        + Add Member
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 input-focus"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="rollNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        id="rollNumber"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 input-focus"
                        placeholder="Enter your roll number"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="departmentSection" className="block text-sm font-semibold text-gray-700 mb-2">
                        Department & Section *
                      </label>
                      <input
                        type="text"
                        id="departmentSection"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 input-focus"
                        placeholder="e.g., Computer Science - A"
                        value={formData.departmentSection}
                        onChange={(e) => setFormData({ ...formData, departmentSection: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:border-primary-500 transition-all duration-200 input-focus"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address (from Google Sign-In)
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      value={userEmail}
                      readOnly
                      tabIndex={-1}
                    />
                    <p className="text-xs text-gray-500 mt-1">This email is automatically filled from your Google account</p>
                  </div>
                </>
              )}

              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{formError}</p>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full btn-primary py-4 text-lg font-semibold" 
                  disabled={loading}
                >
                  <div className="flex items-center">
                    {event.price ? (
                      <>
                        <span className="text-white font-bold text-lg mr-2">₹</span>
                        {isTeamEvent ? `Pay ₹${event.price * teamMembers.length} & Register` : `Pay ₹${event.price} & Register`}
                      </>
                    ) : (
                      'Confirm Registration'
                    )}
                  </div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 