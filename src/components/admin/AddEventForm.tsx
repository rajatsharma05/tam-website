'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AddEventFormProps {
  onSubmit: (eventData: {
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
  }) => void
  onCancel: () => void
}

export default function AddEventForm({ onSubmit, onCancel }: AddEventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    price: 0,
    posterUrl: '',
    teamType: 'individual' as 'individual' | 'team',
    minTeamSize: 2,
    maxTeamSize: 4,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter an event title')
      return
    }
    if (!formData.description.trim()) {
      alert('Please enter an event description')
      return
    }
    if (!formData.date) {
      alert('Please select an event date')
      return
    }
    if (!formData.time) {
      alert('Please select an event time')
      return
    }
    if (!formData.location.trim()) {
      alert('Please enter an event location')
      return
    }
    if (formData.capacity <= 0) {
      alert('Please enter a valid capacity (greater than 0)')
      return
    }
    
    // Validate team settings if it's a team event
    if (formData.teamType === 'team') {
      if (formData.minTeamSize < 2) {
        alert('Minimum team size must be at least 2')
        return
      }
      if (formData.maxTeamSize < formData.minTeamSize) {
        alert('Maximum team size must be greater than or equal to minimum team size')
        return
      }
    }
    
    // Prepare the data, only including team fields for team events
    const submitData: {
      title: string
      description: string
      date: string
      time: string
      location: string
      capacity: number
      teamType: 'individual' | 'team'
      price?: number
      posterUrl?: string
      minTeamSize?: number
      maxTeamSize?: number
    } = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      capacity: formData.capacity,
      teamType: formData.teamType,
    }
    
    // Only add price if it's greater than 0
    if (formData.price > 0) {
      submitData.price = formData.price
    }
    
    // Only add posterUrl if it's not empty
    if (formData.posterUrl.trim()) {
      submitData.posterUrl = formData.posterUrl
    }
    
    // Only add team size fields for team events
    if (formData.teamType === 'team') {
      submitData.minTeamSize = formData.minTeamSize
      submitData.maxTeamSize = formData.maxTeamSize
    }
    
    onSubmit(submitData)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.teamType}
              onChange={e => setFormData({ ...formData, teamType: e.target.value as 'individual' | 'team' })}
            >
              <option value="individual">Individual</option>
              <option value="team">Team</option>
            </select>
          </div>
          {/* Team Size Fields (only if team) */}
          {formData.teamType === 'team' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minTeamSize" className="block text-sm font-medium text-gray-700 mb-1">Min Team Size</label>
                <input
                  type="number"
                  id="minTeamSize"
                  min={2}
                  max={formData.maxTeamSize}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.minTeamSize}
                  onChange={e => setFormData({ ...formData, minTeamSize: Math.max(2, Math.min(Number(e.target.value), formData.maxTeamSize)) })}
                />
              </div>
              <div>
                <label htmlFor="maxTeamSize" className="block text-sm font-medium text-gray-700 mb-1">Max Team Size</label>
                <input
                  type="number"
                  id="maxTeamSize"
                  min={formData.minTeamSize}
                  max={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.maxTeamSize}
                  onChange={e => setFormData({ ...formData, maxTeamSize: Math.max(formData.minTeamSize, Math.min(Number(e.target.value), 10)) })}
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Registration Fee (₹)
              </label>
              <input
                type="number"
                id="price"
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                placeholder="0 for free events"
              />
              <p className="text-xs text-gray-500 mt-1">Enter 0 for free events</p>
            </div>
            <div>
              <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Poster Image URL (optional)
              </label>
              <input
                type="url"
                id="posterUrl"
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.posterUrl}
                onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Paste a direct image URL (e.g., from Imgur, Dropbox, etc.)</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button type="submit">Add Event</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 